# Chemistry — برنامهٔ مرحله‌ای Refactor معماری Component-Based

> **وضعیت سند:** مرحله ۱ تکمیل شد؛ اجرای مرحله ۲ منوط به تأیید کاربر است.
> **هدف:** تقسیم تدریجی رابط و منطق پروژه به Componentهای مستقل، بدون تغییر رفتار، ظاهر، داده‌ها و قراردادهای فعلی سایت.
> **قانون اجرا:** هر مرحله به‌صورت مستقل انجام می‌شود. پس از پایان هر شماره، نتیجه گزارش می‌شود و اجرای شمارهٔ بعدی فقط پس از تأیید کاربر انجام خواهد شد.

---

# 1. هدف اصلی

هدف این برنامه تبدیل ساختار فعلی پروژه از معماری متمرکز در `index.html`، `main.css` و دو فایل JavaScript به معماری Component-Based و قابل نگهداری‌تر است.

وضعیت فعلی:

```text
index.html
   ├── Header
   ├── Hero
   ├── Periodic Table
   ├── Element Details
   └── Footer

main.js
   └── Theme System + bootstrap + runtime styles

main-legacy.js
   ├── i18n
   ├── CSV/Data Layer
   ├── Periodic Table
   ├── Element Selection
   └── Element Details

main.css
   └── Global + Component styles + Theme styles
```

هدف نهایی:

```text
index.html
   └── Composition / page shell

core/
   ├── i18n
   ├── data loading / parsing / normalization
   └── shared state / utilities

components/
   ├── header
   ├── hero
   ├── periodic-table
   ├── element-details
   └── footer
```

اصل مهم: refactor نباید صرفاً فایل‌های بیشتری ایجاد کند؛ هر مسئولیت باید مالک مشخص و یگانه داشته باشد.

---

# 2. اصول غیرقابل‌تغییر در کل پروژه

1. داده‌های علمی CSVها تغییر نکنند، مگر اینکه در مرحله‌ای جداگانه صراحتاً تأیید شود.
2. `AtomicNumber` همچنان کلید اصلی اتصال اطلاعات عنصر باقی بماند.
3. جدول ۱۱۸ عنصر، f-block و ساختار ۱۸ گروهی حفظ شود.
4. سه سطح اطلاعات `beginner`، `advanced` و `very-advanced` حفظ شوند.
5. زبان فارسی/انگلیسی و RTL/LTR حفظ شود.
6. Themeهای موجود و selector آن‌ها حفظ شوند.
7. localStorage keyهای فعلی بدون دلیل تغییر نکنند: `chemistry-language` و `chemistry-pdf-theme`.
8. ظاهر فعلی سایت تا حد امکان بدون تغییر باقی بماند.
9. accessibility و keyboard interaction حفظ شود.
10. رفتار responsive سایت حفظ شود.
11. اجرای پروژه همچنان بدون backend و به‌صورت static client-side باقی بماند.
12. هیچ تغییر غیرمرتبط با refactor انجام نشود.
13. در هر مرحله، اگر امکان تست وجود دارد، قبل از ادامه تست انجام شود.
14. هیچ مرحله‌ای بدون گزارش و تأیید کاربر به مرحلهٔ بعدی وارد نشود.

---

# 3. اولویت‌بندی مراحل اجرا

## مرحله 1 — تثبیت وضعیت فعلی و ایجاد Baseline

**اولویت: بسیار بالا — تکمیل‌شده**

قبل از هر جابه‌جایی، وضعیت فعلی repository به‌عنوان مرجع بررسی و ثبت شد.

### اقدامات انجام‌شده

- ساختار فعلی repository و فایل‌های runtime بررسی شد.
- `index.html`، `assets/js/main.js`، `assets/js/main-legacy.js` و `assets/css/main.css` به‌عنوان هسته runtime شناسایی شدند.
- سه CSV اصلی runtime و مسیر مصرف آن‌ها در `main-legacy.js` بررسی شد.
- workflow موجود در `.github/workflows/webpack.yml` بررسی شد.
- dependencyهای واقعی، selectorها، IDهای حساس، eventها و localStorage keyها ثبت شدند.
- دو منبع تعریف برای `.element.selected-flash` به‌عنوان نقطهٔ حساس refactor ثبت شد: تعریف استاتیک در CSS و style تزریق‌شده توسط `main.js`.
- `data/Elements/` به‌عنوان ۱۱۸ فایل CSV بدون مصرف runtime ثبت شد؛ در این مرحله حذف نشد.
- قراردادهای CI فعلی ثبت شد: بررسی فایل‌های runtime، syntax check جاوااسکریپت، اعتبارسنجی header/width CSV و smoke test HTTP.
- commitهای نزدیک به baseline نیز بررسی شدند تا وضعیت فعلی با تغییرات اخیر اشتباه گرفته نشود.

### Baseline معماری فعلی

```text
index.html
   ↓
main.css
   ↓
main.js
   ├── Theme System
   ├── runtime styles
   └── loads main-legacy.js
             ├── i18n
             ├── CSV/Data Layer
             ├── Periodic Table
             ├── Element Selection
             └── Element Details
```

### قراردادهای ثبت‌شده برای مراحل بعد

- زبان: `chemistry-language`
- Theme: `chemistry-pdf-theme`
- عنصر انتخاب‌شده: state در حافظه و بر پایهٔ `AtomicNumber`
- نقاط DOM حساس: `#periodic-table-grid`, `#f-block`, `#table-theme-select`, `#table-status`, `#selected-element`, `#beginner-info`, `#advanced-info`, `#very-advanced-info`
- CSVهای runtime:
  - `data/PubChemElements_all.csv`
  - `data/ELEMENTS_118_ADVANCED.csv`
  - `data/ELEMENTS_118_VERY_ADVANCED.csv`

### نتیجه مرحله ۱

Baseline برای ادامهٔ refactor ثبت شد و **هیچ Component یا Core جدیدی در این مرحله ایجاد نشد**. هیچ فایل داده‌ای حذف یا تغییر داده نشد و رفتار runtime عمداً دست‌نخورده باقی ماند.

### معیار پایان

مرحله ۱ با ثبت قراردادهای اصلی runtime و نقاط حساس معماری پایان یافته است. اجرای مرحله ۲ فقط پس از تأیید کاربر مجاز است.

---

## مرحله 2 — تعریف مرزهای Component و Core

**اولویت: بسیار بالا — منتظر تأیید**

قبل از انتقال کد باید مالکیت هر بخش مشخص شود.

### Componentها

```text
Header
Hero
Periodic Table
Element Details
Footer
```

### Shared Core

```text
i18n
Data Layer
Shared State
Shared Utilities
```

### Theme System

Themeها باید مالک مشخص داشته باشند و وابستگی آن‌ها به Periodic Table روشن باشد.

### اصل مالکیت

هیچ رفتار مهمی نباید هم‌زمان توسط دو بخش کنترل شود.

---

## مرحله 3 — استخراج Shared Core

**اولویت: بالا**

منطق مشترک از `main-legacy.js` جدا می‌شود: ترجمه و dictionaryها، مدیریت `lang`/`dir`، CSV loading/parsing، normalization، utilityهای واقعاً مشترک و stateهای مشترک.

---

## مرحله 4 — جداسازی Header

**اولویت: بالا**

HTML، CSS اختصاصی و اتصال Header به i18n مشترک جدا می‌شود. Header نباید مالک dictionary یا Data Layer باشد.

---

## مرحله 5 — جداسازی Hero

**اولویت: متوسط**

HTML و CSS اختصاصی Hero جدا می‌شود و `data-i18n` از Core استفاده خواهد کرد.

---

## مرحله 6 — جداسازی Periodic Table

**اولویت: بسیار بالا**

ساخت کارت عناصر، mapping موقعیت‌ها، f-block، rendering، وضعیت جدول، selection، animation انتخاب عنصر و Theme integration در این Component قرار می‌گیرند. CSV parser و dictionary عمومی در آن قرار نمی‌گیرند.

---

## مرحله 7 — جداسازی Element Details

**اولویت: بسیار بالا**

Element Details باید از implementation داخلی Periodic Table مستقل شود.

هدف:

```text
Periodic Table
      ↓
Selected Element State / Event Contract
      ↓
Element Details
```

در صورت امکان وابستگی مستقیم `createElementCard()` به `renderElementDetails()` به یک قرارداد مشخص بین دو Component تبدیل می‌شود.

---

## مرحله 8 — جداسازی Footer

**اولویت: متوسط**

HTML و CSS Footer و اتصال آن به i18n در صورت نیاز جدا می‌شوند. Footer نباید وابستگی به Periodic Table یا Data Layer داشته باشد.

---

## مرحله 9 — تفکیک CSS به Global و Component Styles

**اولویت: بالا**

CSS به پایه‌های Global و stylesheetهای اختصاصی Componentها تقسیم می‌شود. Themeها و animation انتخاب عنصر نباید تعریف تکراری داشته باشند.

---

## مرحله 10 — تعیین مالک نهایی Theme و Selection Animation

**اولویت: بالا**

برای `.element.selected-flash` یک مالک نهایی تعیین و تعریف تکراری حذف می‌شود، بدون تغییر رفتار مگر با تأیید کاربر. Theme System نیز فقط مسئول Theme خواهد بود.

---

## مرحله 11 — تبدیل `index.html` به Composition Layer

**اولویت: بالا**

پس از آماده شدن Componentها، `index.html` عمدتاً نقش ترکیب‌کنندهٔ صفحه را خواهد داشت و منطق علمی، CSV، Theme یا selection در آن قرار نخواهد گرفت.

---

## مرحله 12 — پاک‌سازی `main.js` و `main-legacy.js`

**اولویت: بالا**

پس از انتقال و تست موفق مسئولیت‌ها، کدهای منتقل‌شده حذف و bootstrap ساده می‌شود. نام `main-legacy.js` نیز در صورت امکان به ساختار مناسب Core/bootstrap تبدیل خواهد شد.

---

## مرحله 13 — بررسی فایل‌های دادهٔ بدون مصرف

**اولویت: پایین / جدا از refactor اصلی**

`data/Elements/` شامل ۱۱۸ CSV است که در runtime فعلی مصرف نمی‌شود. فقط بررسی و تصمیم‌گیری انجام می‌شود؛ حذف بدون تأیید جداگانه مجاز نیست.

---

## مرحله 14 — به‌روزرسانی و اعتبارسنجی نهایی

**اولویت: نهایی**

در پایان runtime، CI، ساختار فایل‌ها، dependencyها، responsive behavior، accessibility و رفتار اصلی سایت بررسی می‌شوند و مستندات پروژه متناسب با معماری نهایی به‌روزرسانی خواهند شد.

---

# 4. قانون گزارش‌دهی بین مراحل

بعد از هر مرحله باید این موارد گزارش شوند:

1. شماره و عنوان مرحله.
2. فایل‌های ایجادشده، تغییرکرده یا حذف‌شده.
3. منطق منتقل‌شده یا اصلاح‌شده.
4. تست‌ها و validationهای اجراشده.
5. هر اختلاف با baseline.
6. commit مربوط به مرحله.
7. وضعیت مرحلهٔ بعد: **فقط منتظر تأیید کاربر**.

تا زمانی که کاربر صراحتاً مرحلهٔ بعد را تأیید نکرده باشد، هیچ تغییر مربوط به آن مرحله انجام نمی‌شود.

---

# 5. وضعیت فعلی برنامه

```text
[✓] مرحله 1 — Baseline
[ ] مرحله 2 — Component/Core boundaries — منتظر تأیید
[ ] مرحله 3 — Shared Core
[ ] مرحله 4 — Header
[ ] مرحله 5 — Hero
[ ] مرحله 6 — Periodic Table
[ ] مرحله 7 — Element Details
[ ] مرحله 8 — Footer
[ ] مرحله 9 — CSS separation
[ ] مرحله 10 — Theme/Selection ownership
[ ] مرحله 11 — index composition
[ ] مرحله 12 — main.js/main-legacy.js cleanup
[ ] مرحله 13 — orphan data review
[ ] مرحله 14 — final validation/documentation
```
