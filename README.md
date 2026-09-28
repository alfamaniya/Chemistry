# Chemistry — مرجع پروژه

> در صورت اختلاف مستندات و کد، کد اجراشونده مبناست.

## 1. هدف

Chemistry یک وب‌سایت آموزشی و تعاملی برای ۱۱۸ عنصر جدول تناوبی است.

- HTML/CSS/JavaScript خالص و client-side برای Runtime سایت
- فارسی و انگلیسی
- جدول ۱۸ گروهی و f-block
- اطلاعات Beginner، Advanced و Very Advanced
- ۱۵ Theme
- responsive و دارای قابلیت‌های accessibility
- داده Runtime فعلی سایت از سه CSV اصلی خوانده می‌شود
- ۱۱۸ فایل JSON کامل عناصر نیز در `data/all/` نگهداری و در یک SQLite یکپارچه می‌شوند

## 2. ساختار اصلی

```text
Repository
├── .github/workflows/
│   ├── webpack.yml
│   └── build-database.yml
├── assets/
│   ├── css/main.css
│   ├── css/components/
│   └── js/
│       ├── main.js
│       ├── app.js
│       ├── core/
│       └── components/
├── data/
│   ├── PubChemElements_all.csv
│   ├── ELEMENTS_118_ADVANCED.csv
│   ├── ELEMENTS_118_VERY_ADVANCED.csv
│   ├── Elements/                 # 118 CSV غیر Runtime؛ عمداً حفظ شده
│   ├── all/                      # 118 JSON کامل عناصر
│   └── chemistry.sqlite          # دیتابیس یکپارچه JSONها
├── scripts/
│   └── build_sqlite_database.py
├── index.html
└── README.md
```

`README2.md`، `README3.md` و `assets/js/main-legacy.js` در Repository فعلی وجود ندارند.

## 3. معماری JavaScript

- `assets/js/main.js`: Bootstrap، Theme system، background و selection flash.
- `assets/js/app.js`: orchestration، ارتباط جدول با جزئیات و state انتخاب.
- `assets/js/core/i18n.js`: ترجمه فارسی/انگلیسی، زبان، نام عناصر و ترجمه مقادیر.
- `assets/js/core/data.js`: دریافت و parse سه CSV و normalize داده‌های پیشرفته.
- Componentها در `assets/js/components/` قرار دارند.

مسیر انتخاب عنصر:

```text
Periodic Table → onElementSelected(AtomicNumber) → app.js → Element Details
```

## 4. Selection Flash

توالی انتخاب عنصر:

```text
کلیک → آبی → سبز → قرمز پایدار
```

- تنها `assets/js/main.js` مالک animation/keyframes است.
- آبی: `rgba(37,99,235,...)`
- سبز: `rgba(22,163,74,...)`
- قرمز نهایی: `rgba(220,38,38,...)`
- در reduced motion مستقیماً حالت قرمز نهایی اعمال می‌شود.

## 5. Theme

۱۵ Theme در `assets/js/main.js` وجود دارد. Theme در `localStorage["chemistry-pdf-theme"]` ذخیره و هنگام reload بازیابی می‌شود.

## 6. داده‌های Runtime

سه CSV اصلی هرکدام باید دقیقاً ۱۱۸ ردیف داده داشته باشند:

| فایل | کاربرد |
|---|---|
| `data/PubChemElements_all.csv` | داده پایه و جدول |
| `data/ELEMENTS_118_ADVANCED.csv` | Advanced |
| `data/ELEMENTS_118_VERY_ADVANCED.csv` | Very Advanced |

`data/Elements/` شامل ۱۱۸ CSV غیر Runtime است و بدون دستور صریح نباید حذف شود.

## 7. JSONهای کامل و SQLite

`data/all/` شامل دقیقاً ۱۱۸ فایل JSON است. هر فایل یک Record کامل عنصر را با ساختار تو در تو نگهداری می‌کند.

فایل یکپارچه:

```text
 data/chemistry.sqlite
```

این SQLite از تمام ۱۱۸ JSON ساخته می‌شود و داده خام را از بین نمی‌برد.

### جداول SQLite

```text
chemistry.sqlite
├── elements
│   ├── atomic_number (PK)
│   ├── record_type
│   ├── record_title
│   ├── source_file
│   └── raw_json
├── sections
│   ├── id (PK)
│   ├── atomic_number (FK)
│   ├── parent_section_id (FK)
│   ├── toc_heading
│   ├── description
│   └── url
└── information
    ├── id (PK)
    ├── section_id (FK)
    ├── reference_number
    ├── name
    ├── reference_json
    ├── extended_reference_json
    └── value_json
```

در نتیجه هم نسخه کامل خام هر JSON نگهداری می‌شود و هم Sections و Information برای Query ساختاریافته در دسترس هستند.

سازنده دیتابیس:

```text
scripts/build_sqlite_database.py
```

اجرای دستی:

```bash
python3 scripts/build_sqlite_database.py
```

## 8. ساخت خودکار SQLite

Workflow زیر مسئول ساخت و اعتبارسنجی دیتابیس است:

```text
.github/workflows/build-database.yml
```

Workflow:

1. Repository را دریافت می‌کند.
2. تعداد فایل‌های JSON را دقیقاً ۱۱۸ بررسی می‌کند.
3. SQLite را از `data/all/` می‌سازد.
4. تعداد عناصر و جداول داده را اعتبارسنجی می‌کند.
5. در صورت تغییر دیتابیس، `data/chemistry.sqlite` را commit می‌کند.

دیتابیس منبع Runtime فعلی سایت نیست؛ سه CSV فعلی همچنان قرارداد Runtime هستند.

## 9. CI اصلی

`.github/workflows/webpack.yml` اعتبارسنجی‌های زیر را انجام می‌دهد:

- وجود فایل‌های اصلی
- non-empty بودن CSSهای Component
- syntax تمام JavaScriptها با `node --check`
- قرارداد selection animation و رنگ‌ها
- header و عرض ردیف CSV
- دقیقاً ۱۱۸ ردیف در هر CSV Runtime
- دقیقاً ۱۱۸ فایل در `data/Elements/`
- smoke test HTTP

## 10. قرارداد توسعه

- `data/all/` باید ۱۱۸ JSON عنصر را نگه دارد.
- `data/chemistry.sqlite` باید از JSONها ساخته شود و دستی ویرایش نشود.
- `data/Elements/` بدون دستور صریح حذف نشود.
- CSVهای Runtime باید ۱۱۸ عنصر را حفظ کنند.
- selection flash فقط یک منبع حقیقت داشته باشد.
- داده علمی در HTML hard-code نشود.
- تغییرات غیرمرتبط با درخواست انجام نشود.
- پس از تغییر، syntax و validation بررسی شود.

## 11. اجرای محلی سایت

چون CSVها با `fetch()` خوانده می‌شوند، از `file://` استفاده نکنید:

```bash
python3 -m http.server 8000
```

سپس سایت را از `http://127.0.0.1:8000/` اجرا کنید.
