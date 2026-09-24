# Chemistry — Periodic Table

پروژه آموزشی جدول تناوبی.

## Structure

```text
.
├── README.md
└── data/
    ├── PubChemElements_all.json
    └── elements/
        └── ELEMENT_ATOMIC NUMBER_*.json
```

### `data/`
محل داده‌های پروژه.

### `data/elements/`
محل فایل اختصاصی هر یک از ۱۱۸ عنصر.

## Architecture

```text
HTML  → ساختار
CSS   → ظاهر
DATA  → اطلاعات
JS    → منطق و بارگذاری داده
```

اطلاعات عناصر باید از فایل داده مربوط به همان عنصر خوانده شود و در HTML به‌صورت ثابت تکرار نشود.

نام فایل‌ها و پوشه‌های جدید باید انگلیسی باشد.
