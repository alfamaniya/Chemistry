# Chemistry — مرجع کامل پروژه، معماری و قراردادهای توسعه

> این فایل مرجع اصلی پروژه است. هدف آن این است که یک مهندس یا هوش مصنوعی بتواند فقط با خواندن Repository و این README، معماری، داده‌ها، runtime، رفتار UI، قراردادهای مهم، validation و نقاطی که باید قبل از تغییر بررسی شوند را درک کند.
>
> **نوع پروژه:** Static client-side web application  
> **Backend:** ندارد  
> **Database:** ندارد  
> **Build system / package.json:** ندارد  
> **Branch مرجع:** `main`

---

## 1. هدف سایت

Chemistry یک وب‌سایت مرجع تعاملی برای مشاهده و مطالعهٔ **۱۱۸ عنصر جدول تناوبی** است. سایت باید اطلاعات عناصر را از CSVهای داده دریافت کند و آن‌ها را در یک جدول تناوبی ۱۸ ستونه، شامل f-block، نمایش دهد.

کاربر می‌تواند:

- بین فارسی و انگلیسی جابه‌جا شود؛
- جدول تناوبی و ۱۱۸ عنصر را مشاهده کند؛
- با کلیک روی هر عنصر، اطلاعات آن را در سه سطح آموزشی ببیند؛
- از Theme Selector برای تغییر حالت دسته‌بندی/رنگ‌بندی جدول استفاده کند؛
- در desktop و mobile از جدول responsive استفاده کند؛
- از keyboard interaction و قابلیت‌های accessibility موجود استفاده کند.

اطلاعات علمی نباید به‌صورت دستی در HTML برای هر عنصر تکرار شوند؛ منبع runtime داده‌ها CSV است.

---

# 2. ساختار فعلی Repository

```text
Repository
├── .github/
│   └── workflows/
│       └── webpack.yml
├── assets/
│   ├── css/
│   │   ├── main.css
│   │   └── components/
│   │       ├── header.css
│   │       ├── hero.css
│   │       ├── periodic-table.css
│   │       ├── element-details.css
│   │       └── footer.css
│   └── js/
│       ├── main.js
│       ├── app.js
│       ├── core/
│       │   ├── i18n.js
│       │   └── data.js
│       └── components/
│           ├── header/header.js
│           ├── hero/hero.js
│           ├── periodic-table/periodic-table.js
│           ├── element-details/element-details.js
│           └── footer/footer.js
├── data/
│   ├── PubChemElements_all.csv
│   ├── ELEMENTS_118_ADVANCED.csv
│   ├── ELEMENTS_118_VERY_ADVANCED.csv
│   └── Elements/
│       └── 118 CSV files — non-runtime / retained data
├── index.html
└── README.md
```

`README2.md` و `README3.md` دیگر بخشی از پروژه نیستند؛ تمام مستندات آن‌ها در این فایل ادغام شده است.

---

# 3. معماری نهایی

پروژه پس از refactor به معماری Component-Based تقسیم شده است، اما همچنان **Vanilla JavaScript / CSS / HTML** و بدون framework باقی مانده است.

```text
index.html
    ↓
main.js
    ├── global/component CSS
    ├── mount Header
    ├── mount Hero
    ├── mount Periodic Table
    ├── mount Element Details
    ├── mount Footer
    └── Theme System
            ↓
          app.js
            ├── core/i18n.js
            ├── core/data.js
            ├── Periodic Table Component
            └── Element Details Component
```

اصل مهم معماری:

> **Core مالک منطق مشترک است و Componentها مصرف‌کنندهٔ Core هستند؛ Core نباید به implementation داخلی Componentها وابسته شود.**

---

# 4. مسئولیت فایل‌ها

## `index.html`

Composition Layer است: metadata، shell، slotهای Component و IDهای قراردادی runtime را نگه می‌دارد. اطلاعات علمی ۱۱۸ عنصر نباید داخل آن hard-code شوند.

IDهای حساس:

```text
periodic-table-grid
f-block
table-theme-select
table-status
selected-element
beginner-info
advanced-info
very-advanced-info
```

## `assets/js/main.js`

Bootstrap و Theme System اصلی:

- راه‌اندازی Componentها؛
- بارگذاری stylesheetهای Component؛
- تعریف ۱۵ Theme؛
- ساخت و labelگذاری Theme selector؛
- اعمال Theme روی `.table-shell`؛
- نگهداری انتخاب Theme در `localStorage`؛
- همگام‌سازی labelهای selector با زبان سند؛
- مدیریت background متحرک صفحه؛
- رعایت `prefers-reduced-motion` در بخش‌های مربوط به خود.

`main.js` نباید مالک parser CSV، منطق علمی یا rendering جزئیات عنصر باشد و نباید selection animation را دوباره inject کند.

## `assets/js/app.js`

Application Orchestrator است و اتصال Core و Componentها را انجام می‌دهد:

- دریافت داده از Data Core؛
- انتقال داده به Periodic Table و Element Details؛
- هماهنگ‌کردن انتخاب عنصر؛
- هماهنگ‌کردن قراردادهای Componentها.

این فایل جایگزین `main-legacy.js` شده است و `main-legacy.js` نباید dependency runtime باشد.

---

# 5. Shared Core

## `assets/js/core/i18n.js`

مسئول dictionary فارسی/انگلیسی، ترجمهٔ `data-i18n`، ترجمهٔ مقادیر، `lang` و `dir`، language buttonها و localStorage زبان است.

```text
chemistry-language
```

```text
fa → rtl
en → ltr
```

## `assets/js/core/data.js`

مسئول:

- مسیر CSVهای runtime؛
- `fetch()`؛
- parser CSV؛
- حذف BOM؛
- اعتبارسنجی header؛
- رد ردیف‌های malformed؛
- `normalizeDetailRow()`؛
- بارگذاری موازی سه CSV؛
- آماده‌سازی داده برای Componentها.

منابع:

```text
data/PubChemElements_all.csv
data/ELEMENTS_118_ADVANCED.csv
data/ELEMENTS_118_VERY_ADVANCED.csv
```

کلید اتصال:

```text
AtomicNumber
```

در advanced و very-advanced، `atomic_number` باید به `AtomicNumber` normalize شود.

---

# 6. Componentها

## Header

```text
assets/js/components/header/header.js
assets/css/components/header.css
```

مسئول brand، navigation و language switcher است و از i18n استفاده می‌کند.

قرارداد رنگی Header/Footer:

```text
#182033  background
#e9ecf5  primary text
#aeb6c8  secondary/navigation text
#3346a8  active language state
#3b455c  separator/border
```

## Hero

```text
assets/js/components/hero/hero.js
assets/css/components/hero.css
```

مسئول معرفی سایت و CTA اصلی به `#periodic-table` است و منطق دادهٔ عنصر ندارد.

## Periodic Table

```text
assets/js/components/periodic-table/periodic-table.js
assets/css/components/periodic-table.css
```

مسئول جدول ۱۸ گروهی، mapping، کارت‌ها، f-block، status، selection و شمارهٔ عنصر است.

شماره دقیقاً از `AtomicNumber` می‌آید:

```text
CSV → AtomicNumber → createElementCard(element) → .element-number
```

نمونه:

```text
1 — H — Hydrogen / هیدروژن
26 — Fe — Iron / آهن
79 — Au — Gold / طلا
118 — Og — Oganesson / اوگانسون
```

ارتباط با جزئیات:

```text
Periodic Table
      ↓
onElementSelected(AtomicNumber)
      ↓
app.js
      ↓
Element Details
```

Selection animation باید فقط یک مالک canonical داشته باشد. رفتار مطلوب فعلی: دو flash نرم آبی و سپس سبز، باقی‌ماندن state انتخاب و سایهٔ نارنجی تیره، و حالت بدون animation در `prefers-reduced-motion`.

## Element Details

```text
assets/js/components/element-details/element-details.js
assets/css/components/element-details.css
```

سه سطح:

```text
Beginner
Advanced
Very Advanced
```

مسئول lookup، formatting، data-grid و پرکردن:

```text
selected-element
beginner-info
advanced-info
very-advanced-info
```

## Footer

```text
assets/js/components/footer/footer.js
assets/css/components/footer.css
```

مسئول اطلاعات کوتاه پروژه، ترجمه و back-to-top/anchor قراردادی است.

---

# 7. CSS Architecture

```text
assets/css/main.css
assets/css/components/
├── header.css
├── hero.css
├── periodic-table.css
├── element-details.css
└── footer.css
```

`main.css` برای global styles و بخش‌های مشترک/Theme System باقی می‌ماند و CSS اختصاصی تا حد امکان در Component خود قرار دارد.

Responsive جدول ۱۸ ستونه باید در mobile با horizontal scrolling / حداقل عرض داخلی قابل استفاده باقی بماند.

---

# 8. Theme System

۱۵ حالت:

1. Uncategorized / بدون دسته‌بندی
2. Atomic Mass / جرم اتمی
3. Density / چگالی
4. Standard State / حالت استاندارد
5. Melting Point / نقطه ذوب
6. Boiling Point / نقطه جوش
7. Atomic Radius / شعاع اتمی
8. Electron Configuration / آرایش الکترونی
9. Ionization Energy / انرژی یونش
10. Electron Affinity / الکترون‌خواهی
11. Electronegativity / الکترونگاتیویته
12. Oxidation States / حالت‌های اکسایش
13. Metal / Metalloid / Nonmetal / فلز / شبه‌فلز / نافلز
14. Chemical Group / Family / گروه / خانواده شیمیایی
15. Year Discovered / سال کشف

کلاس‌های قراردادی:

```text
theme-pdf
theme-1 ... theme-15
```

Theme روی `.table-shell` اعمال می‌شود.

کلید localStorage:

```text
chemistry-pdf-theme
```

رفتار واقعی refresh باید از سورس بررسی شود و README صرفاً intended behavior را مبنا قرار ندهد.

---

# 9. Data Flow

```text
PubChemElements_all.csv ─────┐
ELEMENTS_118_ADVANCED.csv ───┼→ core/data.js
ELEMENTS_118_VERY_ADVANCED ──┘          ↓
                                  normalized data
                                         ↓
                                      app.js
                                      /    \
                                     /      \
                         Periodic Table   Element Details
                                ↓
                         selected AtomicNumber
                                ↓
                         Element Details
```

Base dataset شامل ۱۱۸ عنصر و فیلدهای اصلی مانند `AtomicNumber`, `Symbol`, `Name`, `NameFa` است. Advanced با `atomic_number` و Very Advanced نیز با normalization به قرارداد `AtomicNumber` متصل می‌شوند و Very Advanced فیلدهایی مانند `year_discovered` و `data_status` دارد.

---

# 10. State و Storage

| State | محل | توضیح |
|---|---|---|
| Language | i18n + document + localStorage | زبان و جهت |
| Theme | Theme System + `.table-shell` + localStorage | Theme جدول |
| Selected Element | Periodic Table / app | AtomicNumber انتخاب‌شده |
| Element Data | data.js | سه dataset |
| Selection Animation | DOM class | state بصری موقت |

کلیدها:

```text
chemistry-language
chemistry-pdf-theme
```

اطلاعات علمی نباید منبع اصلی خود را از localStorage بگیرد.

---

# 11. Accessibility و UX

- کارت عنصر control قابل تعامل با keyboard است.
- `aria-label` کارت باید اطلاعات کافی دربارهٔ عنصر داشته باشد.
- `table-status` برای وضعیت جدول استفاده می‌شود.
- Symbol، Name و Atomic Number در DOM قابل تفکیک‌اند.
- فارسی/انگلیسی و RTL/LTR حفظ می‌شوند.
- mobile layout نباید ۱۸ ستون را به layout نامعتبر تبدیل کند.
- `prefers-reduced-motion` باید رعایت شود.
- focus state و keyboard interaction نباید در تغییرات CSS حذف شوند.

---

# 12. `data/Elements/` — دادهٔ غیر-runtime

`data/Elements/` شامل ۱۱۸ CSV، یکی برای هر `AtomicNumber` است. بررسی معماری نشان داده که runtime اصلی سه CSV دیگر را مصرف می‌کند و این ۱۱۸ فایل در مسیر runtime فعلی مصرف نمی‌شوند.

تصمیم فعلی: **حذف نشوند مگر با تصمیم مستقل.** صرفاً unused بودن runtime دلیل کافی برای حذف دادهٔ علمی نیست. قبل از هر حذف باید usage کل Repository، CI و documentation بررسی شود.

---

# 13. GitHub Actions و Validation

Workflow:

```text
.github/workflows/webpack.yml
```

نام:

```text
Static site validation
```

موارد مورد انتظار validation:

- وجود runtime files؛
- syntax JavaScript؛
- header و ساختار CSVهای runtime؛
- smoke test HTTP برای HTML/JS/CSV؛
- بررسی مسیرهای Component/Core؛
- عدم dependency به `main-legacy.js` حذف‌شده؛
- در صورت حفظ قرارداد فعلی، وجود ۱۱۸ فایل `data/Elements`.

نتیجهٔ واقعی آخرین CI باید از GitHub Actions خوانده شود و نباید فقط از روی README فرض شود.

---

# 14. اجرای محلی

از `file://` استفاده نشود، چون CSV با `fetch()` خوانده می‌شود.

```bash
python -m http.server 8000
```

سپس:

```text
http://localhost:8000
```

Syntax check نمونه:

```bash
node --check assets/js/main.js
node --check assets/js/app.js
```

تمام JSهای زیر `assets/js` نیز باید در validation بررسی شوند.

---

# 15. قراردادهای مهم توسعه آینده

1. `AtomicNumber` تنها منبع شمارهٔ عنصر است.
2. اطلاعات علمی در HTML hard-code نشود.
3. تغییر schema CSV بدون بررسی Data Core انجام نشود.
4. IDهای runtime بدون بررسی dependencyها تغییر نکنند.
5. Header و Footer قرارداد رنگی مشترک خود را حفظ کنند مگر تصمیم طراحی جدید وجود داشته باشد.
6. Theme System از Data Layer جدا بماند.
7. Selection animation فقط یک مالک canonical داشته باشد.
8. Componentها implementation داخلی یکدیگر را مستقیماً مصرف نکنند.
9. i18n در Core بماند.
10. پروژه بدون Backend/Database/build system باقی بماند مگر تصمیم معماری صریح گرفته شود.
11. تغییرات غیرمرتبط با درخواست انجام نشوند.
12. قبل از refactor جدید، Repository واقعی بررسی شود و README تنها source of truth فرض نشود.
13. بعد از تغییر معماری، dependency graph و CI دوباره بررسی شوند.
14. اگر code و documentation اختلاف داشتند، رفتار واقعی code مبناست و README باید اصلاح شود.

---

# 16. تاریخچهٔ Refactor

```text
1  Baseline
2  Component/Core boundaries
3  Shared Core
4  Header
5  Hero
6  Periodic Table
7  Element Details
8  Footer
9  CSS separation
10 Theme / Selection ownership
11 index composition
12 main cleanup + app orchestrator
13 orphan data review
14 final validation + documentation
```

نتیجهٔ معماری:

```text
index.html
   ↓
main.js
   ↓
app.js
   ├── core/i18n.js
   ├── core/data.js
   ├── components/header
   ├── components/hero
   ├── components/periodic-table
   ├── components/element-details
   └── components/footer
```

---

# 17. موارد تاریخی که نباید با وضعیت فعلی اشتباه شوند

در نسخه‌های قدیمی پروژه `main-legacy.js`، markup داخلی Componentها در `index.html`، و تعریف‌های قدیمی selection flash وجود داشته‌اند. این موارد تاریخی‌اند. source of truth برای وضعیت فعلی Repository است.

---

# 18. پرسش‌هایی برای هوش مصنوعی بررسی‌کننده Repository

**دستور:**

```text
Repository را کامل بررسی کن. README.md را بخوان، اما آن را تنها منبع حقیقت ندان. HTML، تمام JavaScriptها، CSSها، CSVها و GitHub Actions را با README تطبیق بده. هیچ تغییری در کد ایجاد نکن؛ فقط audit و گزارش بده.
```

### 1 — معماری
آیا معماری واقعاً Component-Based است؟ برای هر Component فایل JS، CSS، markup، dependency و coupling مستقیم را مشخص کن. آیا `app.js` واقعاً orchestrator است؟

### 2 — Core
آیا `core/i18n.js` و `core/data.js` واقعاً Shared Core هستند یا logic مشترک هنوز تکرار شده؟ parser، normalization، language state، translation و utilities را بررسی کن.

### 3 — Dependency Graph
از روی importها، DOM selectors، eventها و data flow یک dependency graph واقعی بساز و cycleها را مشخص کن.

### 4 — main.js / app.js
مرز مسئولیت این دو فایل منطقی است؟ آیا Theme System از data/application layer جداست؟

### 5 — Periodic Table
آیا تمام ۱۱۸ عنصر و f-block یک مسیر صحیح rendering دارند و `AtomicNumber` تنها منبع شماره است؟

### 6 — Selection Animation
کد واقعی را بررسی کن و دقیقاً بگو چند flash، چه رنگ‌هایی، چه مدت، چه shadow نهایی و چه reduced-motion behavior دارد. duplicate یا conflict را هم پیدا کن. اگر README و code اختلاف دارند، code واقعی را گزارش کن.

### 7 — Theme
۱۵ Theme را بررسی کن: mapping، selector، classها، localStorage، refresh و تغییر زبان labelها را دقیق گزارش کن.

### 8 — Element Details
مسیر انتخاب عنصر تا Beginner/Advanced/Very Advanced را بررسی کن و mismatch احتمالی datasetها را پیدا کن.

### 9 — CSV Schema
header و schema هر سه CSV را بررسی کن. کلید مشترک، normalization، missing fields و robustness parser در برابر quote/comma/newline/BOM را گزارش کن.

### 10 — data/Elements
تمام ۱۱۸ فایل را بررسی کن: dependency پنهان، duplicate بودن، دادهٔ اضافی، و منطقی‌بودن retained ماندن را تعیین کن.

### 11 — DOM Contract
تمام ID/classهایی را که JS query می‌کند استخراج کن و بررسی کن `index.html` همه را دارد. selectorهای شکننده را مشخص کن.

### 12 — Accessibility
keyboard، focus، button semantics، aria، RTL/LTR، language switching، reduced motion، contrast و mobile usability را audit کن و هر مشکل را با فایل/function/selector مشخص کن.

### 13 — Responsive
breakpointها، جدول ۱۸ ستونه، f-block، Header/Hero/Footer، Element Details و Theme selector را بررسی کن.

### 14 — Performance
تعداد requestها، module loading، fetch سه CSV، rendering ۱۱۸ کارت، re-render زبان، animation و دادهٔ غیر-runtime را بررسی کن و فقط مشکلات واقعی را گزارش کن.

### 15 — Security / Robustness
`innerHTML`، CSV content، `fetch()`، localStorage و dynamic module loading را از نظر امنیت و robustness بررسی کن.

### 16 — CI
workflow را با Repository تطبیق بده: مسیرها، references به فایل حذف‌شده، syntax checks، smoke tests و نبود/وجود browser test را مشخص کن.

### 17 — Dead Code
فایل‌ها و کدهای مشکوک به legacy/dead code را فهرست کن، اما چیزی را حذف نکن. dependencyهایی که قبل از حذف باید بررسی شوند را بنویس.

### 18 — Documentation vs Code
هر اختلاف را با این قالب گزارش کن:

```text
Documentation says:
Code does:
Recommended documentation correction:
```

### 19 — آیندهٔ Vanilla
اگر پروژه همچنان Vanilla JS بماند، آیا معماری فعلی مناسب است؟ اگر نه، فقط تغییرات محدود و ضروری را پیشنهاد کن.

### 20 — نتیجه
در پایان جدول زیر را ارائه کن:

| Area | Status | Risk | Evidence | Recommendation |
|---|---|---|---|---|

و سپس فقط این سه دسته را بده:

```text
Must Fix
Should Fix
Do Not Touch
```

---

# 19. قانون نهایی برای AI بررسی‌کننده

هوش مصنوعی بررسی‌کننده باید ابتدا Repository را باز و کد واقعی را بررسی کند. اگر README و code اختلاف داشتند:

1. code واقعی مبنا باشد؛
2. اختلاف صریح گزارش شود؛
3. حدس بدون evidence ارائه نشود؛
4. بدون درخواست صریح هیچ فایلی تغییر نکند.

---

# 20. وضعیت مستندات

این `README.md` تنها README رسمی پروژه است و مرجع اصلی هدف سایت، معماری، Repository، Componentها، Core، Data Model، Theme، Selection، Accessibility، Responsive behavior، CI، قراردادهای توسعه و audit آینده است.

هر تغییر معماری یا رفتار واقعی باید همراه با همان تغییر در این فایل مستند شود.
