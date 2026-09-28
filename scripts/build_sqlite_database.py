#!/usr/bin/env python3
"""Build a queryable SQLite database from the 118 JSON element records in data/all/."""

from __future__ import annotations

import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "data" / "all"
OUTPUT = ROOT / "data" / "chemistry.sqlite"


def json_text(value) -> str | None:
    if value is None:
        return None
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def iter_sections(sections, atomic_number, parent_id, conn):
    for section in sections or []:
        cur = conn.execute(
            """
            INSERT INTO sections
                (atomic_number, parent_section_id, level, toc_heading, description, url)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                atomic_number,
                parent_id,
                0,
                section.get("TOCHeading"),
                section.get("Description"),
                section.get("URL"),
            ),
        )
        section_id = cur.lastrowid

        for info in section.get("Information") or []:
            conn.execute(
                """
                INSERT INTO information
                    (section_id, reference_number, name, reference_json,
                     extended_reference_json, value_json)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    section_id,
                    info.get("ReferenceNumber"),
                    info.get("Name"),
                    json_text(info.get("Reference")),
                    json_text(info.get("ExtendedReference")),
                    json_text(info.get("Value")),
                ),
            )

        # PubChem records may contain nested Section arrays. Store them too.
        iter_sections(section.get("Section"), atomic_number, section_id, conn)


def main() -> None:
    files = sorted(SOURCE_DIR.glob("ELEMENT_ATOMIC NUMBER_*.json"), key=lambda p: int(p.stem.rsplit("_", 1)[-1]))
    if len(files) != 118:
        raise SystemExit(f"Expected exactly 118 JSON files in {SOURCE_DIR}, found {len(files)}")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    if OUTPUT.exists():
        OUTPUT.unlink()

    conn = sqlite3.connect(OUTPUT)
    try:
        conn.executescript(
            """
            PRAGMA foreign_keys = ON;

            CREATE TABLE elements (
                atomic_number INTEGER PRIMARY KEY,
                record_type TEXT NOT NULL,
                record_title TEXT,
                source_file TEXT NOT NULL UNIQUE,
                raw_json TEXT NOT NULL
            );

            CREATE TABLE sections (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                atomic_number INTEGER NOT NULL,
                parent_section_id INTEGER,
                level INTEGER NOT NULL DEFAULT 0,
                toc_heading TEXT,
                description TEXT,
                url TEXT,
                FOREIGN KEY (atomic_number) REFERENCES elements(atomic_number) ON DELETE CASCADE,
                FOREIGN KEY (parent_section_id) REFERENCES sections(id) ON DELETE CASCADE
            );

            CREATE TABLE information (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                section_id INTEGER NOT NULL,
                reference_number INTEGER,
                name TEXT,
                reference_json TEXT,
                extended_reference_json TEXT,
                value_json TEXT,
                FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
            );

            CREATE INDEX idx_sections_atomic_number ON sections(atomic_number);
            CREATE INDEX idx_sections_toc_heading ON sections(toc_heading);
            CREATE INDEX idx_information_section_id ON information(section_id);
            CREATE INDEX idx_information_name ON information(name);
            """
        )

        for path in files:
            with path.open("r", encoding="utf-8") as handle:
                document = json.load(handle)
            record = document.get("Record") or {}
            atomic_number = record.get("RecordNumber")
            if not isinstance(atomic_number, int):
                raise ValueError(f"Invalid RecordNumber in {path}")

            conn.execute(
                """
                INSERT INTO elements
                    (atomic_number, record_type, record_title, source_file, raw_json)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    atomic_number,
                    record.get("RecordType"),
                    record.get("RecordTitle"),
                    path.name,
                    json_text(document),
                ),
            )
            iter_sections(record.get("Section"), atomic_number, None, conn)

        count = conn.execute("SELECT COUNT(*) FROM elements").fetchone()[0]
        if count != 118:
            raise ValueError(f"Database contains {count} elements; expected 118")

        conn.commit()
        print(f"Built {OUTPUT} with {count} elements")
    finally:
        conn.close()


if __name__ == "__main__":
    main()
