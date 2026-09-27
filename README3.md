# Chemistry — برنامهٔ مرحله‌ای Refactor معماری Component-Based

> **وضعیت سند:** مراحل ۱ تا ۱۲ تکمیل شده‌اند.
> **هدف:** تبدیل تدریجی پروژه به معماری Component-Based با حفظ رفتار، داده‌ها، ظاهر، accessibility و قراردادهای runtime.
> **قانون:** هر مرحله جداگانه اجرا و گزارش می‌شود؛ مراحل ۱۰ تا ۱۲ در این بسته انجام شدند.

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

# 2. معماری فعلی

```text
index.html
   └── Page Composition / component slots

assets/
├── css/
│   ├── main.css                 # global + legacy theme styles during migration
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

`assets/js/components/header/header.js` ساخته شد و اکنون markup و eventهای Header را نیز مالک است. کنترل زبان از طریق قرارداد `chemistry:language-change` به orchestrator متصل است.

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

CSS اختصاصی Componentها در `assets/css/components/` ایجاد و load شد. Themeهای ۱۵گانه همچنان در `main.css` باقی می‌مانند چون مالک آن‌ها Theme System است.

## مرحله 10 — تعیین مالک نهایی Theme و Selection Animation

**وضعیت: ✓ تکمیل‌شده**

مالکیت رفتاری selection animation به Component جدول منتقل شد:

```text
Periodic Table Component
   └── .element.selected-flash
       └── chemistry-element-selection
```

انیمیشن canonical اکنون در `assets/css/components/periodic-table.css` قرار دارد و رفتار مطلوب حفظ شده است:

- دو flash نرم: آبی و سپس سبز.
- پس از پایان animation، `selected` باقی می‌ماند.
- سایهٔ ثابت نارنجی تیره باقی می‌ماند.
- `prefers-reduced-motion` به حالت ثابت نارنجی تیره برمی‌گردد.
- animation دیگر توسط `main.js` تزریق نمی‌شود.

Theme System همچنان مالک `theme-1` تا `theme-15` و localStorage مربوط به Theme است.

> **یادداشت migration:** تعریف قدیمی `selected-flash` در `main.css` هنوز به‌عنوان legacy CSS باقی مانده است؛ تعریف Component با stylesheet جداگانه canonical و loadشده است. حذف کامل legacy CSS در مرحلهٔ نهایی validation/cleanup قابل انجام است.

## مرحله 11 — تبدیل `index.html` به Composition Layer

**وضعیت: ✓ تکمیل‌شده**

`index.html` از markup داخلی Componentها خالی شد و اکنون فقط shell، slotهای Component و metadata سند را نگه می‌دارد:

```html
<header data-component="header"></header>
<section data-component="hero"></section>
<section data-component="periodic-table"></section>
<section data-component="element-details"></section>
<footer data-component="footer"></footer>
```

Markup اختصاصی هر Component اکنون در mount function همان Component ساخته می‌شود. IDهای runtime مانند `periodic-table-grid`, `f-block`, `table-theme-select`, `selected-element`, `beginner-info`, `advanced-info` و `very-advanced-info` حفظ شده‌اند.

## مرحله 12 — پاک‌سازی `main.js` و runtime legacy

**وضعیت: ✓ تکمیل‌شده**

`main.js` به bootstrap و Theme System محدود شد و دیگر `main-legacy.js` را dynamic-load نمی‌کند.

`main-legacy.js` به `assets/js/app.js` تبدیل شد تا نام فایل نیز با نقش واقعی آن (application orchestrator) هماهنگ باشد. فایل قدیمی حذف شد.

مسئولیت `app.js` اکنون فقط orchestration است:

```text
Core Data + Core i18n
        ↓
      app.js
      ├── Periodic Table
      └── Element Details
```

کدهای rendering، parser و component markup در orchestrator کپی نشده‌اند.

---

# 4. مسیر اجرای فعلی

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

# 5. مراحل باقی‌مانده

## مرحله 13 — بررسی `data/Elements/`

**اولویت: پایین و مستقل**

۱۱۸ CSV بدون مصرف runtime بررسی می‌شوند؛ حذف فقط با تصمیم جداگانه مجاز است.

## مرحله 14 — Validation و مستندسازی نهایی

**اولویت: نهایی**

CI، syntax، data flow، runtime، responsive، accessibility، dependencyها و مستندات نهایی بررسی می‌شوند.

---

# 6. Validation مراحل ۱۰ تا ۱۲

- ساختار جدید importها و مسیر Componentها بررسی شد.
- `index.html` به Composition Layer تبدیل شد.
- IDهای runtime موردنیاز حفظ شدند.
- animation انتخاب عنصر به CSS Component منتقل شد.
- injection مربوط به selection animation از `main.js` حذف شد.
- `main-legacy.js` به `app.js` منتقل و فایل legacy حذف شد.
- CSVهای علمی و داده‌های عنصر در این مراحل تغییر نکردند.
- Themeهای ۱۵گانه و کلیدهای `localStorage` حفظ شدند.
- ترجمهٔ عنوان سه سطح جزئیات با کلیدهای موجود `beginnerTitle`, `professionalTitle`, `veryAdvancedTitle` تطبیق داده شد.
- بررسی syntax با اجرای Node در محیط فعلی ممکن نشد چون محیط به GitHub دسترسی شبکه‌ای برای دریافت فایل‌ها ندارد؛ بنابراین موفقیت runtime/CI ادعا نمی‌شود.
- validation نهایی end-to-end در مرحله ۱۴ انجام خواهد شد.

---

# 7. وضعیت فعلی

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
[ ] 13 — orphan data review
[ ] 14 — final validation
```

---

# 8. قانون گزارش‌دهی

بعد از هر مرحله گزارش شامل این موارد است:

1. شماره و عنوان مرحله.
2. فایل‌های ایجاد/تغییر/حذف‌شده.
3. مسئولیت‌های منتقل‌شده.
4. تست‌ها و validationهای انجام‌شده.
5. اختلاف با baseline.
6. commit مربوط به مرحله.
7. وضعیت مرحله بعد.
