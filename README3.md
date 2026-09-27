# Chemistry — برنامهٔ مرحله‌ای Refactor معماری Component-Based

> **وضعیت سند:** مراحل ۱ تا ۱۴ تکمیل شده‌اند.
> **هدف:** تبدیل تدریجی پروژه به معماری Component-Based با حفظ رفتار، داده‌ها، ظاهر، accessibility و قراردادهای runtime.
> **وضعیت نهایی:** migration معماری انجام شد؛ `data/Elements/` عمداً به‌عنوان دادهٔ غیر-runtime نگه داشته شد و CI با معماری جدید همگام شد.

---

## 1. اصول غیرقابل‌تغییر

1. CSVهای علمی در refactor تغییر نمی‌کنند.
2. `AtomicNumber` کلید اصلی اتصال داده‌ها باقی می‌ماند.
3. ۱۱۸ عنصر، f-block و layout هجده‌گروهی حفظ می‌شوند.
4. سه سطح `beginner`، `advanced` و `very-advanced` حفظ می‌شوند.
5. فارسی/انگلیسی و RTL/LTR حفظ می‌شوند.
6. کلیدهای `chemistry-language` و `chemistry-pdf-theme` حفظ می‌شوند.
7. ظاهر و responsive behavior بدون دلیل تغییر نمی‌کنند.
8. accessibility و keyboard interaction حفظ می‌شوند.
9. پروژه static client-side باقی می‌ماند.
10. `data/Elements/` بدون تصمیم مستقل حذف نمی‌شود.
11. مالکیت CSS و JS باید به Component مربوطه نزدیک باشد.

---

# 2. معماری نهایی

```text
index.html
   └── Page Composition / component slots

assets/
├── css/
│   ├── main.css                 # global + legacy theme styles
│   └── components/
│       ├── header.css
│       ├── hero.css
│       ├── periodic-table.css
│       ├── element-details.css
│       └── footer.css
└── js/
    ├── main.js                  # bootstrap + Theme System
    ├── app.js                   # application orchestrator
    ├── core/
    │   ├── i18n.js
    │   └── data.js
    └── components/
        ├── header/header.js
        ├── hero/hero.js
        ├── periodic-table/periodic-table.js
        ├── element-details/element-details.js
        └── footer/footer.js
```

Core مالک منطق مشترک است و Componentها مصرف‌کننده Core هستند؛ Core به implementation داخلی Componentها وابسته نیست.

---

# 3. مراحل انجام‌شده

## مرحله 1 — تثبیت وضعیت فعلی و Baseline

**وضعیت: ✓ تکمیل‌شده**

Repository، runtime، CSVها، CI، IDها، selectorها، eventها، stateها و localStorage keyها بررسی و ثبت شدند. تداخل animation انتخاب عنصر و وجود `data/Elements/` نیز به‌عنوان نقاط حساس ثبت شد.

## مرحله 2 — تعریف مرزهای Component و Core

**وضعیت: ✓ تکمیل‌شده**

مالکیت منطقی Header، Hero، Periodic Table، Element Details، Footer، Shared Core و Theme System مشخص شد.

## مرحله 3 — استخراج Shared Core

**وضعیت: ✓ تکمیل‌شده**

`assets/js/core/i18n.js` مسئول dictionary و زبان و `assets/js/core/data.js` مسئول CSV parser/fetch/normalization و `loadElementData()` شدند.

## مرحله 4 — جداسازی Header

**وضعیت: ✓ تکمیل‌شده**

`assets/js/components/header/header.js` ساخته شد و markup و eventهای Header را مالک است. کنترل زبان از طریق قرارداد `chemistry:language-change` به orchestrator متصل است.

## مرحله 5 — جداسازی Hero

**وضعیت: ✓ تکمیل‌شده**

`assets/js/components/hero/hero.js` markup و قرارداد لینک اصلی `#periodic-table` را کنترل می‌کند.

## مرحله 6 — جداسازی Periodic Table

**وضعیت: ✓ تکمیل‌شده**

`assets/js/components/periodic-table/periodic-table.js` مالک mapping هجده‌گروهی، کارت‌ها، f-block، render، status و selection شد. انتخاب عنصر از طریق `onElementSelected(AtomicNumber)` به orchestrator داده می‌شود.

## مرحله 7 — جداسازی Element Details

**وضعیت: ✓ تکمیل‌شده**

`assets/js/components/element-details/element-details.js` مالک دادهٔ سه سطح جزئیات، lookup، formatting، data-grid و rendering شد و با `setData()` داده‌های Core را دریافت می‌کند.

## مرحله 8 — جداسازی Footer

**وضعیت: ✓ تکمیل‌شده**

`assets/js/components/footer/footer.js` markup و قرارداد لینک `#top` را کنترل می‌کند.

## مرحله 9 — تفکیک CSS

**وضعیت: ✓ تکمیل‌شده — انتقال تدریجی**

CSS اختصاصی Componentها در `assets/css/components/` ایجاد و load شد. Themeهای ۱۵گانه همچنان در `main.css` باقی مانده‌اند چون مالک آن‌ها Theme System است.

## مرحله 10 — تعیین مالک نهایی Theme و Selection Animation

**وضعیت: ✓ تکمیل‌شده**

مالکیت رفتاری selection animation به Component جدول منتقل شد. انیمیشن canonical در `assets/css/components/periodic-table.css` قرار دارد و رفتار مطلوب حفظ شده است:

- دو flash نرم: آبی و سپس سبز.
- پس از پایان animation، `selected` باقی می‌ماند.
- سایهٔ ثابت نارنجی تیره باقی می‌ماند.
- `prefers-reduced-motion` به حالت ثابت نارنجی تیره برمی‌گردد.
- animation دیگر توسط `main.js` تزریق نمی‌شود.

Theme System همچنان مالک `theme-1` تا `theme-15` و localStorage مربوط به Theme است.

> تعریف قدیمی `selected-flash` در `main.css` به‌عنوان legacy CSS باقی مانده و تعریف Component نسخهٔ canonical است؛ این legacy تعریف در این refactor حذف نشده تا migration محافظه‌کارانه باقی بماند.

## مرحله 11 — تبدیل `index.html` به Composition Layer

**وضعیت: ✓ تکمیل‌شده**

`index.html` از markup داخلی Componentها خالی شد و اکنون shell، slotهای Component و metadata سند را نگه می‌دارد. IDهای runtime مانند `periodic-table-grid`, `f-block`, `table-theme-select`, `selected-element`, `beginner-info`, `advanced-info` و `very-advanced-info` حفظ شده‌اند.

## مرحله 12 — پاک‌سازی `main.js` و runtime legacy

**وضعیت: ✓ تکمیل‌شده**

`main.js` به bootstrap و Theme System محدود شد. `main-legacy.js` به `assets/js/app.js` تبدیل شد و فایل legacy حذف شد. `app.js` فقط orchestration بین Core، Periodic Table و Element Details را انجام می‌دهد.

## مرحله 13 — بررسی `data/Elements/`

**وضعیت: ✓ تکمیل‌شده — بدون حذف**

پوشهٔ `data/Elements/` بررسی شد و شامل **۱۱۸ فایل CSV**، یکی برای هر `AtomicNumber`، است. نمونهٔ فایل‌ها ساختار دادهٔ PubChem-like و اطلاعات علمی مستقل دارند. این فایل‌ها در مسیر runtime فعلی توسط `assets/js/core/data.js` مصرف نمی‌شوند؛ runtime فقط سه CSV اصلی را load می‌کند.

تصمیم این مرحله: **هیچ‌کدام از ۱۱۸ فایل حذف نشدند.** دلیل: وجود نداشتن مصرف runtime به‌تنهایی برای حذف دادهٔ علمی کافی نیست و ممکن است این مجموعه برای import، archive یا توسعهٔ آینده ارزش داشته باشد. بنابراین به‌عنوان دادهٔ غیر-runtime retained باقی ماند.

CI نیز وجود دقیق ۱۱۸ فایل را بررسی می‌کند تا این تصمیم شفاف و قابل مشاهده بماند.

## مرحله 14 — Validation و مستندسازی نهایی

**وضعیت: ✓ تکمیل‌شده**

CI با معماری جدید همگام شد و موارد زیر را بررسی می‌کند:

- وجود `index.html`، `main.js`، `app.js`، Core و تمام Componentهای JS.
- وجود stylesheetهای Component.
- syntax تمام فایل‌های JavaScript زیر `assets/js` با `node --check`.
- header و عرض ردیف‌های سه CSV runtime.
- وجود دقیق ۱۱۸ فایل در `data/Elements/`.
- smoke test HTTP برای HTML، JSهای اصلی/Core/Component و سه CSV runtime.

Workflow قدیمی که به `main-legacy.js` وابسته بود اصلاح شد و اکنون با معماری نهایی `app.js` و Componentها کار می‌کند.

---

# 4. مسیر اجرای نهایی

```text
index.html
   ↓
assets/js/main.js
   ├── mount Header
   ├── mount Hero
   ├── mount Periodic Table shell
   ├── mount Element Details shell
   ├── mount Footer
   ├── load Component CSS
   └── initialize Theme System
            ↓
       assets/js/app.js
            ├── core/i18n.js
            ├── core/data.js
            ├── Periodic Table Component
            └── Element Details Component
```

---

# 5. Validation نهایی

### بررسی Repository

- فایل legacy `assets/js/main-legacy.js` در معماری نهایی استفاده نمی‌شود و حذف شده است.
- مسیرهای جدید Component/Core در CI صریحاً بررسی می‌شوند.
- `data/Elements/` به‌صورت عمدی retained است.

### بررسی داده

سه CSV runtime تغییر نکرده‌اند و `AtomicNumber` همچنان کلید اتصال داده‌هاست.

### بررسی runtime

`main.js` اکنون Componentها را import و mount می‌کند و سپس `app.js` را load می‌کند. `app.js` داده را از Core دریافت و بین Periodic Table و Element Details orchestration می‌کند.

### بررسی animation

مالک canonical selection animation، Periodic Table Component است؛ `main.js` دیگر selection animation را inject نمی‌کند.

### بررسی CI

Workflow `Static site validation` از مسیرهای جدید استفاده می‌کند و به `main-legacy.js` وابسته نیست.

> **محدودیت:** در این محیط اجرای واقعی مرورگر و اجرای GitHub Actions از داخل session قابل مشاهده/اجرا نبود؛ بنابراین validation به بررسی سورس، مسیرهای Repository و تعریف CI محدود شد و موفقیت اجرای واقعی workflow ادعا نمی‌شود.

---

# 6. وضعیت نهایی

```text
[✓] 1 — Baseline
[✓] 2 — Component/Core boundaries
[✓] 3 — Shared Core
[✓] 4 — Header
[✓] 5 — Hero
[✓] 6 — Periodic Table
[✓] 7 — Element Details
[✓] 8 — Footer
[✓] 9 — CSS separation (safe migration)
[✓] 10 — Theme / Selection ownership
[✓] 11 — index composition
[✓] 12 — main cleanup + app orchestrator
[✓] 13 — orphan data review (retained, not deleted)
[✓] 14 — final validation + documentation
```

---

# 7. قانون گزارش‌دهی

بعد از هر مرحله گزارش شامل این موارد است:

1. شماره و عنوان مرحله.
2. فایل‌های ایجاد/تغییر/حذف‌شده.
3. مسئولیت‌های منتقل‌شده.
4. تست‌ها و validationهای انجام‌شده.
5. اختلاف با baseline.
6. commit مربوط به مرحله.
7. وضعیت مرحله بعد.
