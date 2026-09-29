# Analyzed Element Data

This directory contains the normalized index produced from the 118 element JSON source files in `data/`.

## Source

- `data/ELEMENT_ATOMIC NUMBER_<n>.json` — one source file per atomic number.
- Source records use the `Record` object and nested `Section` → `Section` → `Information` structure.

## Normalized model

Each indexed element is represented by:

- `atomic_number` — atomic number and stable lookup key.
- `source_file` — original JSON file.
- `record_type` — source `RecordType`.
- `record_title` — source `RecordTitle`.
- `sections` — top-level section names discovered in the source record.
- `property_count` — count of leaf information items discovered recursively.
- `has_references` — whether references/URLs are present in the source data.
- `source_size_bytes` — source file size in the repository at indexing time.

The original JSON files are not modified. The analyzed index is a derived layer intended for fast lookup and for connecting the periodic table UI to the source data later.
