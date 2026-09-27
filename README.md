# Chemistry — مرجع کامل پروژه، معماری و قراردادهای توسعه

> این فایل تنها README رسمی پروژه است و باید وضعیت واقعی Repository را توضیح دهد. در صورت اختلاف بین مستندات و کد، کد واقعی مبناست و README باید اصلاح شود.

## 1. هدف سایت

Chemistry یک وب‌سایت مرجع آموزشی و تعاملی برای مشاهده و مطالعهٔ ۱۱۸ عنصر جدول تناوبی است. برنامه کاملاً client-side و بدون Backend، Database، framework یا build system است.

کاربر می‌تواند:

- بین فارسی و انگلیسی جابه‌جا شود؛
- جدول تناوبی ۱۸ گروهی و f-block را ببیند؛
- روی هر عنصر کلیک کند و اطلاعات آن را در سه سطح Beginner، Advanced و Very Advanced ببیند؛
- از ۱۵ حالت رنگ‌بندی/دسته‌بندی جدول استفاده کند؛
- در desktop و mobile از جدول responsive استفاده کند؛
- از keyboard interaction و قابلیت‌های accessibility موجود استفاده کند.

اطلاعات علمی عناصر در HTML hard-code نمی‌شوند و از CSVهای runtime خوانده می‌شوند.

---

## 2. وضعیت معماری فعلی

پروژه به معماری Component-Based با Vanilla HTML/CSS/JavaScript منتقل شده است:

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
   └── Theme System
            ↓
       assets/js/app.js
       ├── core/i18n.js
       ├── core/data.js
       ├── Periodic Table
       └── Element Details
```

اصل معماری:

> Core مالک منطق مشترک است؛ Componentها مصرف‌کنندهٔ Core هستند؛ Componentها implementation داخلی یکدیگر را مستقیماً مصرف نمی‌کنند.

---

## 3. ساختار Repository

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
│       └── 118 CSV files — retained, non-runtime data
├── index.html
└── README.md
```

`README2.md` و `README3.md` حذف شده‌اند و دیگر بخشی از Repository نیستند.

`assets/js/main-legacy.js` نیز حذف شده و runtime فعلی به آن وابسته نیست.

---

## 4. Composition Layer — `index.html`

`index.html` فقط shell و slotهای Componentها، metadata و script entry point را نگه می‌دارد:

```html
<header class="site-header" data-component="header"></header>
<section class="hero container" data-component="hero"></section>
<section id="periodic-table" class="section container" data-component="periodic-table"></section>
<section class="element-details container" data-component="element-details"></section>
<footer id="footer" class="site-footer" data-component="footer"></footer>
<script type="module" src="assets/js/main.js"></script>
```

اطلاعات علمی ۱۱۸ عنصر نباید به این فایل برگردد.

IDهای حساس runtime:

```text
periodic-table-grid
f-block
table-theme-select
table-theme-description
selected-element
beginner-info
advanced-info
very-advanced-info
levels
```

`table-status` و عنوان/زیرعنوان قدیمی بخش Element Details دیگر در DOM وجود ندارند.

---

## 5. JavaScript

### `assets/js/main.js`

Bootstrap و Theme System است.

مسئولیت‌ها:

- import و mount کردن Componentها؛
- بارگذاری stylesheetهای Component؛
- تعریف ۱۵ Theme؛
- ساخت و ترجمهٔ Theme selector؛
- اعمال `theme-pdf` و `theme-1 ... theme-15` روی `.table-shell`؛
- ذخیره و بازیابی Theme از `localStorage`؛
- همگام‌سازی labelهای Theme با زبان سند؛
- مدیریت background متحرک صفحه؛
- رعایت `prefers-reduced-motion` برای background.

`main.js` نباید parser CSV، منطق علمی یا rendering جزئیات عنصر را مالک شود و selection animation عنصر در آن inject نمی‌شود.

### `assets/js/app.js`

Application Orchestrator است.

مسئولیت‌ها:

- دریافت داده از `core/data.js`؛
- اتصال Periodic Table به Element Details؛
- نگهداری state زبان در سطح application؛
- هماهنگی re-render بعد از تغییر زبان؛
- انتقال `AtomicNumber` انتخاب‌شده به Element Details؛
- مدیریت خطای بارگذاری داده.

ارتباط انتخاب عنصر:

```text
Periodic Table
    ↓ onElementSelected(AtomicNumber)
app.js
    ↓
Element Details
```

### `assets/js/core/i18n.js`

مالک Shared i18n است:

- dictionary فارسی/انگلیسی؛
- ترجمهٔ `[data-i18n]`؛
- ترجمهٔ `data-i18n-aria` در صورت وجود؛
- `lang` و `dir`؛
- وضعیت دکمه‌های زبان؛
- `chemistry-language` در localStorage؛
- نام فارسی/انگلیسی عناصر؛
- ترجمهٔ مقادیر علمی مانند GroupBlock و StandardState.

کلیدهای UI حذف‌شده مانند عنوان/زیرعنوان قبلی Periodic Table، عنوان/زیرعنوان قبلی Element Details و پیام شمارش عناصر دیگر در dictionary نگهداری نمی‌شوند؛ dictionary فقط قراردادهای فعال را نگه می‌دارد.

### `assets/js/core/data.js`

Data Layer مشترک است و مسئول:

- مسیر سه CSV runtime؛
- `fetch()`؛
- parser CSV؛
- حذف BOM؛
- پشتیبانی از quoted fields، comma و newline داخل field؛
- رد ردیف‌های malformed؛
- `normalizeDetailRow()`؛
- بارگذاری موازی سه CSV با `Promise.all()`.

منابع:

```text
data/PubChemElements_all.csv
data/ELEMENTS_118_ADVANCED.csv
data/ELEMENTS_118_VERY_ADVANCED.csv
```

کلید اتصال داده‌ها:

```text
AtomicNumber
```

در Advanced و Very Advanced، `atomic_number` به قرارداد `AtomicNumber` normalize می‌شود.

---

## 6. Componentها

### Header

```text
assets/js/components/header/header.js
assets/css/components/header.css
```

مالک brand، navigation و language switcher است. تغییر زبان با event قراردادی `chemistry:language-change` به `app.js` منتقل می‌شود.

### Hero

```text
assets/js/components/hero/hero.js
assets/css/components/hero.css
```

مالک معرفی سایت و CTA به `#periodic-table` است و به دادهٔ علمی وابسته نیست.

### Periodic Table

```text
assets/js/components/periodic-table/periodic-table.js
assets/css/components/periodic-table.css
```

مالک:

- mapping جدول ۱۸ گروهی؛
- ۱۱۸ کارت عنصر؛
- f-block؛
- selection؛
- شمارهٔ عنصر؛
- قرارداد `onElementSelected(AtomicNumber)`.

عنوان «جدول تناوبی»، زیرعنوان آن و پیام `elements loaded` از این Component حذف شده‌اند. Theme selector همچنان در ابتدای این Component قرار دارد.

شمارهٔ کارت فقط از داده می‌آید:

```text
CSV → AtomicNumber → .element-number
```

نمونه:

```text
1 — H — Hydrogen / هیدروژن
26 — Fe — Iron / آهن
79 — Au — Gold / طلا
118 — Og — Oganesson / اوگانسون
```

### Element Details

```text
assets/js/components/element-details/element-details.js
assets/css/components/element-details.css
```

عنوان و زیرعنوان معرفی این بخش حذف شده‌اند تا بعد از جدول مستقیماً کارت عنصر انتخاب‌شده/پیام انتخاب عنصر و سپس سه سطح اطلاعات نمایش داده شوند.

سه سطح:

```text
Beginner
Advanced
Very Advanced
```

داده‌ها در این نقاط DOM قرار می‌گیرند:

```text
selected-element
beginner-info
advanced-info
very-advanced-info
```

هر فیلد علمی در `createDataGrid()` به یک `.data-item` مستقل تبدیل می‌شود. این کارت‌های کوچک عمداً به‌صورت محتوایی و واکنش‌گرا اندازه می‌گیرند:

- `.data-grid` از `flex-wrap` استفاده می‌کند تا فیلدها تا حد ممکن کنار هم قرار بگیرند؛
- عرض `.data-item` بر اساس محتوای همان فیلد تنظیم می‌شود، نه بر اساس یک شبکهٔ دو ستونهٔ ثابت؛
- اگر متن طولانی باشد، آیتم حداکثر تا عرض فضای در دسترس رشد می‌کند و متن داخل همان کارت wrap می‌شود؛
- در mobile نیز فیلدها همچنان به‌صورت چند ردیف فشرده می‌شوند و دیگر همهٔ مشخصات الزاماً یک ستون بلند تشکیل نمی‌دهند؛
- فاصله و padding کارت‌ها کوچک نگه داشته شده تا ارتفاع اشغال‌شده توسط اطلاعات کاهش یابد و خوانایی حفظ شود.

بنابراین چهار ناحیهٔ بیرونی Element Details (کارت عنصر انتخاب‌شده و سه سطح اطلاعات) همچنان حفظ می‌شوند، اما مشخصات داخل هر ناحیه به کارت‌های کوچک و پویا تقسیم می‌شوند تا فضای عمودی کمتری مصرف شود.

### Footer

```text
assets/js/components/footer/footer.js
assets/css/components/footer.css
```

مالک footer، متن ترجمه‌شده و لینک `#top` است.

---

## 7. Selection Animation — وضعیت واقعی

مالک canonical انیمیشن انتخاب عنصر، فایل زیر است:

```text
assets/css/components/periodic-table.css
```

منطق افزودن کلاس انتخاب در:

```text
assets/js/components/periodic-table/periodic-table.js
```

رفتار فعلی:

1. با کلیک، کارت `selected` می‌شود.
2. کلاس موقت `selected-flash` اضافه می‌شود.
3. انیمیشن حدود ۲٫۷ ثانیه یک بار اجرا می‌شود.
4. دو flash اصلی دیده می‌شود: ابتدا آبی، سپس سبز.
5. بعد از پایان animation، کلاس `selected-flash` حذف می‌شود.
6. کلاس `selected` باقی می‌ماند.
7. سایهٔ انتخاب نهایی نارنجی تیره باقی می‌ماند.
8. در `prefers-reduced-motion` animation اجرا نمی‌شود و حالت نارنجی تیره ثابت می‌ماند.

پس مشاهدهٔ زیر رفتار مورد انتظار است:

```text
نارنجی تیره پایه
      ↓
آبی
      ↓
سبز
      ↓
نارنجی تیره ثابت
```

### نکتهٔ legacy CSS

در `assets/css/main.css` یک تعریف قدیمی برای `selected-flash` و flash قرمز تاریخی هنوز وجود دارد. stylesheet مربوط به Periodic Table بعد از `main.css` بارگذاری می‌شود و تعریف canonical آبی→سبز را اعمال می‌کند. بنابراین رفتار runtime فعلی همان آبی→سبز→نارنجی تیره است.

این تعریف قدیمی نباید به‌عنوان رفتار فعال جدید توسعه داده شود و در refactor بعدی می‌تواند به‌صورت مستقل حذف شود؛ حذف آن در این مرحله برای کاهش ریسک migration انجام نشده است.

---

## 8. Theme System

۱۵ حالت در selector وجود دارد. IDهای داخلی به دلایل compatibility الزاماً برابر با ترتیب نمایش نیستند.

| ID داخلی | حالت |
|---|---|
| `15` | Uncategorized / بدون دسته‌بندی |
| `1` | Atomic Mass / جرم اتمی |
| `2` | Density / چگالی |
| `3` | Standard State / حالت استاندارد |
| `10` | Melting Point / نقطه ذوب |
| `11` | Boiling Point / نقطه جوش |
| `7` | Atomic Radius / شعاع اتمی |
| `6` | Electron Configuration / آرایش الکترونی |
| `5` | Ionization Energy / انرژی یونش |
| `9` | Electron Affinity / الکترون‌خواهی |
| `4` | Electronegativity / الکترونگاتیویته |
| `8` | Oxidation States / حالت‌های اکسایش |
| `13` | Metal / Metalloid / Nonmetal |
| `14` | Chemical Group / Family |
| `12` | Year Discovered / سال کشف |

کلاس‌ها:

```text
theme-pdf
theme-1 ... theme-15
```

کلید storage:

```text
chemistry-pdf-theme
```

انتخاب Theme اکنون در refresh نیز از localStorage بازیابی می‌شود؛ مقدار ذخیره‌شده دیگر در شروع صفحه بدون دلیل به `15` reset نمی‌شود.

تغییر زبان فقط labelهای selector را بازسازی می‌کند و ID انتخاب‌شده را حفظ می‌کند.

---

## 9. Data Model

### `PubChemElements_all.csv`

۱۱۸ عنصر با فیلدهای اصلی مانند:

```text
AtomicNumber
Symbol
Name
NameFa
AtomicMass
GroupBlock
...
```

### `ELEMENTS_118_ADVANCED.csv`

۱۱۸ ردیف سطح Advanced و کلید `atomic_number` که در Data Core به `AtomicNumber` normalize می‌شود.

### `ELEMENTS_118_VERY_ADVANCED.csv`

۱۱۸ ردیف سطح Very Advanced، با فیلدهای تکمیلی مانند:

```text
year_discovered
data_status
```

### Data Flow

```text
three runtime CSVs
       ↓
core/data.js
       ↓
parse + filter + normalize
       ↓
app.js
   ↙       ↘
Periodic   Details
 Table        ↑
   ↓          │
AtomicNumber ─┘
```

---

## 10. `data/Elements/` — retained data

پوشهٔ زیر عمداً حفظ شده است:

```text
data/Elements/
```

این پوشه شامل دقیقاً **۱۱۸ فایل CSV** است، یکی برای هر عنصر.

بررسی runtime نشان داده که این فایل‌ها توسط Data Core مصرف نمی‌شوند؛ runtime فقط سه CSV اصلی بخش `data/` را fetch می‌کند.

تصمیم رسمی:

> **این ۱۱۸ فایل حذف نشوند.**

دلیل: unused بودن runtime به‌تنهایی دلیل کافی برای حذف دادهٔ علمی نیست و ممکن است این مجموعه برای archive، import یا توسعهٔ آینده مورد نیاز باشد.

CI نیز تعداد ۱۱۸ فایل را بررسی می‌کند تا این تصمیم قابل مشاهده و قابل validation باقی بماند.

---

## 11. State و Storage

| State | محل | توضیح |
|---|---|---|
| Language | i18n + document + localStorage | زبان و جهت صفحه |
| Theme | main.js + `.table-shell` + localStorage | Theme انتخاب‌شده |
| Selected Element | Periodic Table + app.js | `AtomicNumber` انتخاب‌شده |
| Element Data | data.js + app.js | سه dataset در حافظه |
| Selection Animation | DOM class | state بصری موقت |

فقط این دو کلید localStorage قراردادی‌اند:

```text
chemistry-language
chemistry-pdf-theme
```

---

## 12. Accessibility و UX

- کارت‌های عنصر `button` هستند و با keyboard قابل تعامل‌اند.
- `aria-label` کارت شامل نام عنصر و Atomic Number است.
- وضعیت شمارندهٔ `table-status` دیگر در UI وجود ندارد و به‌عنوان قرارداد runtime استفاده نمی‌شود.
- زبان فارسی با `rtl` و انگلیسی با `ltr` مدیریت می‌شود.
- focus state نباید در refactorهای آینده حذف شود.
- `prefers-reduced-motion` برای selection و background رعایت می‌شود.
- جدول ۱۸ ستونه در mobile با حداقل عرض داخلی و horizontal scrolling قابل استفاده می‌ماند.
- Element Details در mobile به یک ستون برای سه سطح اصلی تبدیل می‌شود، اما فیلدهای داخل هر سطح به کارت‌های کوچک و content-sized با `flex-wrap` تقسیم می‌شوند تا فضای عمودی کمتر و مشاهدهٔ اطلاعات راحت‌تر شود.
- متن‌های طولانی فیلدها باید داخل کارت خود wrap شوند و نباید باعث خروج افقی محتوا از container شوند.

---

## 13. CSS Architecture

`main.css` مالک global styles، متغیرهای CSS و Theme System است.

CSS اختصاصی Componentها در این مسیرهاست:

```text
assets/css/components/
├── header.css
├── hero.css
├── periodic-table.css
├── element-details.css
└── footer.css
```

در `element-details.css`، `.data-grid` با `flex-wrap` پیاده‌سازی شده و `.data-item` به‌صورت محتوایی (`width: max-content`) اندازه می‌گیرد، با `max-width: 100%` محدود می‌شود و برای متن‌های طولانی `overflow-wrap:anywhere` دارد. این طراحی جایگزین شبکهٔ ثابت دو ستونهٔ قبلی شده است تا اطلاعات فشرده‌تر نمایش داده شوند.

استایل‌های اختصاصی عنوان/زیرعنوان حذف‌شده Element Details و `.table-status` نیز از stylesheetهای Component پاک شده‌اند.

در حال حاضر بعضی selectorهای legacy مربوط به Componentها هنوز در `main.css` نیز باقی مانده‌اند تا migration محافظه‌کارانه بماند. stylesheetهای Component بعد از `main.css` بارگذاری می‌شوند و source جدید Component را اعمال می‌کنند.

این legacy duplication باید در refactor بعدی با احتیاط حذف شود، نه با تغییر همزمان رفتار بصری.

---

## 14. CI / GitHub Actions

Workflow:

```text
.github/workflows/webpack.yml
```

نام:

```text
Static site validation
```

موارد validation:

- وجود `index.html`؛
- وجود `main.js` و `app.js`؛
- وجود Core و Componentهای JS؛
- وجود CSSهای Component؛
- `node --check` برای تمام JSهای زیر `assets/js`؛
- header و عرض ردیف‌های سه CSV runtime؛
- وجود دقیق ۱۱۸ فایل در `data/Elements/`؛
- smoke test HTTP برای HTML، JSهای اصلی/Core/Periodic Table و سه CSV runtime.

CI دیگر نباید به `main-legacy.js` یا `table-status` ارجاع دهد.

نکته: workflow فعلی browser automation ندارد؛ smoke test دسترسی HTTP و syntax/data validation انجام می‌دهد، نه اجرای کامل UI در مرورگر.

---

## 15. اجرای محلی

چون CSVها با `fetch()` خوانده می‌شوند، صفحه را با `file://` اجرا نکنید.

```bash
python -m http.server 8000
```

سپس:

```text
http://localhost:8000
```

Syntax check:

```bash
find assets/js -type f -name '*.js' -print0 | xargs -0 -n1 node --check
```

---

## 16. قراردادهای توسعه آینده

1. `AtomicNumber` تنها منبع شمارهٔ عنصر است.
2. دادهٔ علمی در HTML hard-code نشود.
3. schema CSV بدون بررسی Data Core تغییر نکند.
4. IDهای runtime بدون بررسی dependencyها تغییر نکنند.
5. Theme System از Data Layer جدا بماند.
6. Selection animation فقط یک مالک canonical داشته باشد.
7. i18n در Core بماند.
8. Componentها implementation داخلی یکدیگر را مستقیم مصرف نکنند.
9. `data/Elements/` بدون تصمیم مستقل حذف نشود.
10. localStorage فقط برای stateهای قراردادی UI استفاده شود، نه منبع علمی.
11. پروژه بدون Backend/Database/build system باقی بماند مگر تصمیم معماری صریح گرفته شود.
12. قبل از refactor جدید، Repository واقعی بررسی شود و README تنها source of truth فرض نشود.
13. اگر code و documentation اختلاف داشتند، رفتار واقعی code مبناست و README اصلاح شود.
14. تغییرات غیرمرتبط با درخواست انجام نشوند.
15. layout فیلدهای Element Details باید برای متن کوتاه و بلند adaptive باقی بماند و به شبکهٔ ثابت یا ارتفاع ثابت برنگردد.

---

## 17. تاریخچهٔ Refactor

مراحل معماری انجام‌شده:

```text
1  Baseline و بررسی Repository
2  تعریف مرزهای Component/Core
3  استخراج Shared Core
4  جداسازی Header
5  جداسازی Hero
6  جداسازی Periodic Table
7  جداسازی Element Details
8  جداسازی Footer
9  تفکیک CSS
10 تعیین مالک Theme و Selection Animation
11 تبدیل index.html به Composition Layer
12 حذف runtime legacy و ایجاد app.js
13 بررسی و حفظ data/Elements
14 validation و مستندسازی نهایی
15 حذف عنوان/زیرعنوان‌های اضافی UI و وضعیت شمارندهٔ جدول
16 فشرده‌سازی پویا و واکنش‌گرای فیلدهای Element Details
```

وضعیت فعلی:

```text
index.html
   ↓
main.js
   ↓
app.js
   ├── core/i18n.js
   ├── core/data.js
   ├── Header
   ├── Hero
   ├── Periodic Table
   ├── Element Details
   └── Footer
```

---

## 18. آخرین اصلاحات رفتاری و پاک‌سازی

### Theme persistence

مشکل: `main.js` در شروع صفحه selector را با `forceDefault=true` به Theme 15 برمی‌گرداند.

اصلاح: initialization اکنون مقدار ذخیره‌شده در `chemistry-pdf-theme` را حفظ می‌کند و فقط در نبود مقدار معتبر به Theme 15 برمی‌گردد.

### Translation cleanup

کلیدهایی که در UI/runtime فعلی مصرف نمی‌شدند حذف شده‌اند؛ از جمله کلیدهای مربوط به quick facts، شمارنده‌ها، توضیحات قدیمی levelها و عنوان/زیرعنوان‌هایی که در UI جدید دیگر وجود ندارند.

کلید `fBlockAria` حفظ شده چون هنوز مستقیماً توسط `setLanguage()` مصرف می‌شود.

### UI cleanup — آخرین تغییر

سه بخش متنی اضافی که در نسخهٔ قبلی روی صفحه دیده می‌شدند حذف شده‌اند:

1. عنوان «جدول تناوبی» و زیرعنوان آن در ابتدای Component جدول؛
2. پیام شمارندهٔ «118 elements loaded from the data source» زیر جدول؛
3. عنوان «اطلاعات مختصر عنصر» و زیرعنوان آن در ابتدای Element Details.

Theme selector، خود جدول، f-block و تمام سه سطح اطلاعات عنصر حفظ شده‌اند.

### Selection animation

رفتار مورد انتظار فعلی تغییری نکرده است:

```text
آبی → سبز → نارنجی تیرهٔ ثابت
```

نسخهٔ canonical در `periodic-table.css` قرار دارد و `main.js` آن را inject نمی‌کند.

### Element Details — compact responsive fields

در آخرین اصلاح، چیدمان ثابت دو ستونهٔ `.data-grid` حذف شد. اکنون هر مشخصه در `.data-item` مستقل قرار می‌گیرد و اندازهٔ آن بر اساس حجم محتوای همان مشخصه تعیین می‌شود. آیتم‌ها در یک flex container کنار هم قرار می‌گیرند و در صورت کمبود عرض به ردیف بعد می‌روند.

برای فیلدهای طولانی مانند `ElectronConfiguration` یا مقادیر متنی طولانی، `max-width:100%` و `overflow-wrap:anywhere` مانع از overflow می‌شوند. در نتیجه در desktop و mobile فضای خالی غیرضروری کمتر شده و اطلاعات بیشتری در ارتفاع کمتر صفحه قابل مشاهده است.

این تغییر فقط layout/CSS مربوط به Element Details را تغییر می‌دهد و schema داده، نام IDها، منطق JavaScript و قراردادهای داده‌ای را تغییر نمی‌دهد.

---

## 19. وضعیت نهایی

Repository فعلی یک Static Vanilla Web Application با معماری Component-Based است. دادهٔ runtime از سه CSV اصلی می‌آید، دادهٔ `data/Elements/` عمداً retained است، `main-legacy.js` دیگر وجود ندارد، و Core/Component/Application boundaries مشخص شده‌اند.

در وضعیت فعلی UI، بعد از Hero مستقیماً Theme selector و جدول نمایش داده می‌شوند و عنوان/زیرعنوان اضافی جدول یا پیام شمارندهٔ بارگذاری نمایش داده نمی‌شود. بعد از جدول نیز Element Details بدون heading معرفی اضافی آغاز می‌شود و سه سطح اطلاعات همچنان فعال هستند.

مشخصات علمی داخل کارت عنصر و سه سطح اطلاعات، به‌صورت کارت‌های کوچک و پویا چیده می‌شوند؛ اندازهٔ هر کارت با حجم متن سازگار است، فیلدهای طولانی داخل container می‌شکنند و layout در mobile نیز فشرده و قابل مشاهده باقی می‌ماند.

هر تغییر بعدی باید ابتدا Repository و این README را بررسی کند، سپس با کمترین دستکاری لازم انجام شود و در پایان همین README متناسب با رفتار واقعی کد به‌روزرسانی شود.
