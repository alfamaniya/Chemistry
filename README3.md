# Chemistry — برنامهٔ مرحله‌ای Refactor معماری Component-Based

> **وضعیت سند:** برنامهٔ اجرایی، بدون شروع refactor
> **هدف:** تقسیم تدریجی رابط و منطق پروژه به Componentهای مستقل، بدون تغییر رفتار، ظاهر، داده‌ها و قراردادهای فعلی سایت.
> **قانون اجرا:** هر مرحله به‌صورت مستقل انجام می‌شود. پس از پایان هر شماره، نتیجه گزارش می‌شود و اجرای شمارهٔ بعدی فقط پس از تأیید کاربر انجام خواهد شد.

---

## 1. هدف اصلی

هدف این برنامه تبدیل ساختار فعلی پروژه از معماری متمرکز در `index.html`، `main.css` و دو فایل JavaScript به معماری Component-Based و قابل نگهداری‌تر است.

وضعیت فعلی به‌صورت کلی:

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

اصل مهم این است که refactor نباید صرفاً فایل‌های بیشتری ایجاد کند؛ هر مسئولیت باید مالک مشخص و یگانه داشته باشد.

---

# 2. اصول غیرقابل‌تغییر در کل پروژه

در تمام مراحل موارد زیر باید حفظ شوند:

1. داده‌های علمی CSVها تغییر نکنند، مگر اینکه در مرحله‌ای جداگانه صراحتاً تأیید شود.
2. `AtomicNumber` همچنان کلید اصلی اتصال اطلاعات عنصر باقی بماند.
3. جدول ۱۱۸ عنصر، f-block و ساختار ۱۸ گروهی حفظ شود.
4. سه سطح اطلاعات `beginner`، `advanced` و `very-advanced` حفظ شوند.
5. زبان فارسی/انگلیسی و RTL/LTR حفظ شود.
6. Themeهای موجود و selector آن‌ها حفظ شوند.
7. localStorage keyهای فعلی بدون دلیل تغییر نکنند:
   - `chemistry-language`
   - `chemistry-pdf-theme`
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

**اولویت: بسیار بالا — اولین مرحله**

قبل از هر جابه‌جایی باید وضعیت فعلی به‌عنوان مرجع ثبت شود.

### کارها

- بررسی ساختار فعلی repository.
- بررسی فایل‌های runtime.
- بررسی `index.html`، `main.js`، `main-legacy.js` و `main.css`.
- بررسی CSVهای runtime.
- بررسی workflow موجود.
- ثبت dependencyهای واقعی.
- ثبت selectorها، IDها، eventها و localStorage keyهای حساس.
- اجرای validationهای موجود در حد امکانات repository.

### خروجی

یک baseline مشخص که بتوان رفتار قبل و بعد از هر refactor را با آن مقایسه کرد.

### معیار پایان

هیچ ابهام مهمی دربارهٔ قراردادهای فعلی runtime باقی نماند.

---

## مرحله 2 — تعریف مرزهای Component و Core

**اولویت: بسیار بالا**

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

منطق مشترک از `main-legacy.js` جدا می‌شود.

موارد مورد بررسی:

- ترجمه و dictionaryها.
- مدیریت زبان و `lang`/`dir`.
- CSV loading.
- CSV parsing.
- normalization داده‌های advanced و very-advanced.
- utilityهای واقعاً مشترک.
- stateهایی که چند Component به آن‌ها نیاز دارند.

هدف این مرحله جلوگیری از انتقال اشتباه منطق مشترک به یکی از Componentها است.

---

## مرحله 4 — جداسازی Header

**اولویت: بالا**

Header شامل موارد زیر می‌شود:

- HTML مربوط به Header.
- CSS اختصاصی Header.
- اتصال به i18n مشترک.
- کنترل language buttonها در محدودهٔ مسئولیت مناسب.

Header نباید مالک dictionary یا Data Layer باشد.

---

## مرحله 5 — جداسازی Hero

**اولویت: متوسط**

Hero به‌دلیل نداشتن منطق runtime پیچیده، Component کم‌ریسکی است.

موارد انتقال:

- HTML Hero.
- CSS اختصاصی Hero.
- اتصال `data-i18n` به Core.

---

## مرحله 6 — جداسازی Periodic Table

**اولویت: بسیار بالا**

این مرحله اصلی‌ترین بخش refactor است.

موارد مربوط به Periodic Table:

- ساخت کارت عنصر.
- mapping موقعیت عناصر.
- ساخت f-block.
- rendering جدول.
- وضعیت جدول.
- selection کارت عنصر.
- animation انتخاب عنصر.
- Theme integration.

Periodic Table مصرف‌کنندهٔ Data Layer خواهد بود، اما نباید مالک CSV parser یا dictionary عمومی باشد.

---

## مرحله 7 — جداسازی Element Details

**اولویت: بسیار بالا**

Element Details باید مستقل از implementation داخلی Periodic Table شود.

هدف معماری:

```text
Periodic Table
      ↓
Selected Element State / Event Contract
      ↓
Element Details
```

در صورت امکان، وابستگی مستقیم فعلی `createElementCard()` به `renderElementDetails()` حذف و به یک قرارداد مشخص بین دو Component تبدیل می‌شود.

هیچ دادهٔ علمی جدیدی به HTML اضافه نمی‌شود.

---

## مرحله 8 — جداسازی Footer

**اولویت: متوسط**

Footer شامل:

- HTML Footer.
- CSS Footer.
- اتصال به i18n در صورت نیاز.

Footer نباید وابستگی به Periodic Table یا Data Layer داشته باشد.

---

## مرحله 9 — تفکیک CSS به Global و Component Styles

**اولویت: بالا، پس از تثبیت Componentها**

CSS فعلی به دو دسته تقسیم می‌شود:

```text
Global
   ├── :root
   ├── reset/base
   ├── body
   ├── container
   ├── responsive foundations
   └── accessibility/motion foundations

Component
   ├── header.css
   ├── hero.css
   ├── periodic-table.css
   ├── element-details.css
   └── footer.css
```

Theme selectorها و animation انتخاب عنصر باید تنها یک منبع تعریف داشته باشند.

---

## مرحله 10 — تعیین مالک نهایی Theme و Selection Animation

**اولویت: بالا**

در وضعیت فعلی دو منبع برای `.element.selected-flash` وجود دارد: CSS استاتیک و style تزریق‌شده توسط `main.js`.

در این مرحله باید:

- یک مالک نهایی برای animation انتخاب عنصر تعیین شود.
- تعریف تکراری حذف شود.
- رفتار واقعی فعلی حفظ یا فقط در صورت تأیید کاربر تغییر کند.
- Theme System فقط مسئول Theme باشد و منطق unrelated به آن نداشته باشد.

این مرحله برای جلوگیری از regression بصری ضروری است.

---

## مرحله 11 — تبدیل `index.html` به Composition Layer

**اولویت: بالا**

پس از آماده شدن Componentها، `index.html` باید عمدتاً نقش ترکیب‌کننده داشته باشد.

هدف:

```text
index.html
   ↓
compose components
   ↓
page
```

نباید منطق علمی، CSV، Theme یا selection داخل HTML قرار گیرد.

---

## مرحله 12 — پاک‌سازی `main.js` و `main-legacy.js`

**اولویت: بالا**

پس از انتقال موفق مسئولیت‌ها:

- کدهای منتقل‌شده حذف می‌شوند.
- bootstrap اصلی ساده می‌شود.
- نام `main-legacy.js` در صورت امکان حذف یا تبدیل به bootstrap/Core مناسب می‌شود.
- dependencyهای باقی‌مانده بررسی می‌شوند.

این مرحله فقط بعد از اینکه Componentها واقعاً مستقل و تست‌شده باشند انجام می‌شود.

---

## مرحله 13 — بررسی فایل‌های دادهٔ بدون مصرف

**اولویت: پایین / جدا از refactor اصلی**

پوشهٔ `data/Elements/` شامل ۱۱۸ CSV است و طبق بررسی فعلی در runtime استفاده نمی‌شود.

در این مرحله فقط بررسی و تصمیم‌گیری انجام می‌شود.

**حذف این فایل‌ها بدون تأیید جداگانه مجاز نیست.**

---

## مرحله 14 — به‌روزرسانی و اعتبارسنجی نهایی

**اولویت: نهایی**

پس از پایان تمام مراحل:

- ساختار نهایی repository بررسی می‌شود.
- dependencyها دوباره بررسی می‌شوند.
- JavaScript syntax بررسی می‌شود.
- CSV runtime بررسی می‌شود.
- workflow بررسی می‌شود.
- مسیرهای جدید فایل‌ها بررسی می‌شوند.
- رفتار اصلی سایت با baseline مقایسه می‌شود.
- مستندات مربوط به معماری جدید در پایان به‌روزرسانی می‌شوند.

---

# 4. ترتیب اجرای اجباری

مراحل باید دقیقاً با این ترتیب انجام شوند:

```text
1. Baseline
   ↓
2. Component Boundaries
   ↓
3. Shared Core
   ↓
4. Header
   ↓
5. Hero
   ↓
6. Periodic Table
   ↓
7. Element Details
   ↓
8. Footer
   ↓
9. CSS Separation
   ↓
10. Theme / Selection Ownership
   ↓
11. index.html Composition
   ↓
12. main.js / main-legacy.js Cleanup
   ↓
13. Orphan Data Review
   ↓
14. Final Validation & Documentation
```

ترتیب بالا عمداً طوری انتخاب شده که هر مرحله بر پایهٔ مرحلهٔ قبلی انجام شود و در صورت بروز مشکل بتوان تغییرات را محدود به همان مرحله کرد.

---

# 5. قرارداد تأیید بین مراحل

بعد از هر مرحله، گزارش باید شامل این موارد باشد:

1. شماره و عنوان مرحله.
2. فایل‌های ایجادشده.
3. فایل‌های تغییرکرده.
4. فایل‌های حذف‌شده، در صورت وجود.
5. منطق منتقل‌شده.
6. dependencyهای تغییرکرده.
7. تست‌ها و validationهای انجام‌شده.
8. نتیجه و هر مسئلهٔ باقی‌مانده.
9. پیشنهاد صریح برای مرحلهٔ بعد.

سپس اجرای مرحلهٔ بعد **متوقف می‌شود** تا کاربر تأیید کند.

---

# 6. قوانین جلوگیری از Regression

در طول refactor:

- تغییر نام IDهای مورد استفاده توسط JavaScript بدون migration کنترل‌شده ممنوع است.
- تغییر نام کلاس‌های Theme بدون بررسی CSS و JS ممنوع است.
- تغییر localStorage keyها بدون migration ممنوع است.
- تغییر schema CSVها ممنوع است.
- تغییر مسیر CSVها بدون اصلاح تمام مصرف‌کنندگان ممنوع است.
- حذف `data/Elements/` بدون مرحلهٔ بررسی و تأیید ممنوع است.
- حذف accessibility attributes ممنوع است.
- تغییر رفتار animation بدون تأیید کاربر ممنوع است.
- تغییرات غیرضروری در UI ممنوع است.

---

# 7. ساختار هدف پیشنهادی

ساختار نهایی هدف به‌صورت مفهومی:

```text
chemistry/
│
├── index.html
│
├── assets/
│   ├── css/
│   │   └── global.css
│   │
│   └── js/
│       ├── core/
│       │   ├── i18n.js
│       │   ├── data.js
│       │   └── state.js
│       │
│       └── components/
│           ├── header/
│           │   ├── header.html
│           │   ├── header.css
│           │   └── header.js
│           ├── hero/
│           │   ├── hero.html
│           │   ├── hero.css
│           │   └── hero.js
│           ├── periodic-table/
│           │   ├── periodic-table.html
│           │   ├── periodic-table.css
│           │   ├── periodic-table.js
│           │   └── themes.js
│           ├── element-details/
│           │   ├── element-details.html
│           │   ├── element-details.css
│           │   └── element-details.js
│           └── footer/
│               ├── footer.html
│               ├── footer.css
│               └── footer.js
│
└── data/
    ├── PubChemElements_all.csv
    ├── ELEMENTS_118_ADVANCED.csv
    └── ELEMENTS_118_VERY_ADVANCED.csv
```

این ساختار **هدف معماری** است و در مراحل اجرایی الزاماً همهٔ نام‌ها یا مسیرها بدون بررسی دقیق کد به همین شکل اعمال نخواهند شد.

---

# 8. وضعیت فعلی اجرای برنامه

```text
مرحله 1  ⏳ منتظر تأیید شروع
مرحله 2  ⏸️
مرحله 3  ⏸️
مرحله 4  ⏸️
مرحله 5  ⏸️
مرحله 6  ⏸️
مرحله 7  ⏸️
مرحله 8  ⏸️
مرحله 9  ⏸️
مرحله 10 ⏸️
مرحله 11 ⏸️
مرحله 12 ⏸️
مرحله 13 ⏸️
مرحله 14 ⏸️
```

**قانون:** تا زمانی که کاربر مرحلهٔ جاری را تأیید نکرده است، مرحلهٔ بعدی اجرا نمی‌شود.
