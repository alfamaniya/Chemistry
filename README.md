# Chemistry — مرجع کامل پروژه، معماری و قراردادهای توسعه

> این فایل README رسمی پروژه است و باید رفتار واقعی Repository را توضیح دهد. در صورت اختلاف بین مستندات و کد، کد واقعی مبناست و README باید اصلاح شود.

## 1. هدف سایت

Chemistry یک وب‌سایت آموزشی و تعاملی برای مشاهده و مطالعهٔ ۱۱۸ عنصر جدول تناوبی است. پروژه کاملاً client-side و بدون Backend، Database، framework یا build system است.

کاربر می‌تواند:

- بین فارسی و انگلیسی جابه‌جا شود؛
- جدول تناوبی ۱۸ گروهی و f-block را ببیند؛
- روی هر عنصر کلیک کند و اطلاعات آن را در سه سطح Beginner، Advanced و Very Advanced ببیند؛
- از ۱۵ حالت رنگ‌بندی/دسته‌بندی جدول استفاده کند؛
- در desktop و mobile از جدول responsive استفاده کند؛
- از keyboard interaction و قابلیت‌های accessibility موجود استفاده کند.

اطلاعات علمی عناصر در HTML hard-code نمی‌شوند و از سه CSV runtime خوانده می‌شوند.

---

## 2. معماری فعلی

پروژه با Vanilla HTML/CSS/JavaScript و معماری Component-Based اجرا می‌شود:

```text
index.html
   ↓
assets/js/main.js
   ├── mount Header / Hero / Periodic Table shell / Element Details shell / Footer
   ├── load Component CSS
   ├── Theme System
   ├── page background
   └── selection flash animation definition
            ↓
       assets/js/app.js
       ├── core/i18n.js
       ├── core/data.js
       ├── Periodic Table
       └── Element Details
```

اصل معماری:

> Core مالک منطق مشترک است؛ Componentها مصرف‌کنندهٔ Core هستند؛ Componentها implementation داخلی یکدیگر را مستقیماً مصرف نمی‌کنند.

### Dependency اصلی

```text
main.js
  ├─ imports component modules
  ├─ mounts component shells
  ├─ loads component CSS
  └─ imports app.js

app.js
  ├─ core/data.js → سه CSV runtime
  ├─ core/i18n.js → زبان و ترجمه
  ├─ periodic-table.js → جدول و selection
  └─ element-details.js → جزئیات سه سطح
```

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

عنوان/زیرعنوان قدیمی جدول، `table-status` و عنوان/زیرعنوان قدیمی Element Details دیگر در DOM وجود ندارند.

---

## 5. JavaScript

### `assets/js/main.js`

Bootstrap و Theme System است و مسئول این موارد است:

- import و mount کردن Componentها؛
- بارگذاری stylesheetهای Component؛
- تعریف ۱۵ Theme؛
- ساخت و ترجمهٔ Theme selector؛
- اعمال `theme-pdf` و `theme-1 ... theme-15` روی `.table-shell`؛
- ذخیره و بازیابی Theme از `localStorage`؛
- همگام‌سازی labelهای Theme با زبان سند؛
- مدیریت background متحرک صفحه؛
- تعریف تنها animation مربوط به flash انتخاب عنصر؛
- رعایت `prefers-reduced-motion` برای background و selection flash.

### `assets/js/app.js`

Application Orchestrator است و مسئول:

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
- ترجمهٔ `[data-i18n]` و `data-i18n-aria` در صورت وجود؛
- `lang` و `dir`؛
- وضعیت دکمه‌های زبان؛
- `chemistry-language` در localStorage؛
- نام فارسی/انگلیسی عناصر؛
- ترجمهٔ مقادیر علمی مانند GroupBlock و StandardState.

Dictionary فقط کلیدهای مورد استفاده در UI/runtime فعلی را نگه می‌دارد.

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

منابع runtime:

```text
data/PubChemElements_all.csv
data/ELEMENTS_118_ADVANCED.csv
data/ELEMENTS_118_VERY_ADVANCED.csv
```

کلید اتصال داده‌ها `AtomicNumber` است. در Advanced و Very Advanced، `atomic_number` به قرارداد `AtomicNumber` normalize می‌شود.

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
- قرارداد `onElementSelected(AtomicNumber)`؛
- افزودن/حذف موقت کلاس `selected-flash` فقط برای اجرای افکت بصری انتخاب.

شمارهٔ کارت فقط از داده می‌آید:

```text
CSV → AtomicNumber → .element-number
```

### Element Details

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

داده‌ها در این نقاط DOM قرار می‌گیرند:

```text
selected-element
beginner-info
advanced-info
very-advanced-info
```

هر فیلد علمی در `createDataGrid()` یک `.data-item` مستقل است. `.data-grid` از `flex-wrap` استفاده می‌کند و عرض آیتم بر اساس محتوا تنظیم می‌شود؛ متن طولانی در همان کارت wrap می‌شود و در mobile نیز آیتم‌ها به ردیف‌های فشرده تقسیم می‌شوند. بنابراین فضای عمودی کمتری نسبت به شبکهٔ ثابت دو ستونه مصرف می‌شود، بدون اینکه داده یا schema تغییر کند.

### Footer

```text
assets/js/components/footer/footer.js
assets/css/components/footer.css
```

مالک footer، متن ترجمه‌شده و لینک `#top` است.

---

## 7. Selection Flash — رفتار واقعی فعلی

افکت انتخاب عنصر اکنون **دو بار و با دو رنگ** اجرا می‌شود:

```text
کلیک
  ↓
آبی — یک flash
  ↓
سبز — یک flash
  ↓
قرمز — رنگ پایدار انتخاب
```

جزئیات قرارداد:

- تنها تعریف animation و `@keyframes` در `assets/js/main.js` و در runtime به‌صورت `<style>` تزریق می‌شود؛
- تعریف تکراری یا مردهٔ `selected-flash` و `@keyframes` در `periodic-table.css` وجود ندارد؛
- مدت animation برابر `2.7s` و یک iteration است؛
- آبی: `rgba(37,99,235,...)`؛
- سبز: `rgba(22,163,74,...)`؛
- رنگ پایدار پس از پایان: `rgba(220,38,38,...)`؛
- شدت و الگوی glow رنگ قرمز با الگوی قبلی سایهٔ انتخاب حفظ شده است؛
- بعد از `animationend` کلاس `selected-flash` حذف می‌شود و کلاس `selected` باقی می‌ماند؛
- انتخاب عنصر و انتقال `AtomicNumber` به Element Details مستقل از animation است؛
- هنگام انتخاب عنصر دیگر، وضعیت flash قبلی پاک می‌شود تا فقط عنصر جدید flash بزند.

در `prefers-reduced-motion: reduce`، animation اجرا نمی‌شود و عنصر مستقیماً با همان سایهٔ قرمز نهایی نمایش داده می‌شود.

نکتهٔ معماری مهم:

```text
periodic-table.js
    → کنترل کلاس selected / selected-flash

main.js
    → تنها محل تعریف animation و keyframes

periodic-table.css
    → فقط وضعیت پایدار selected با box-shadow قرمز
```

بنابراین selection logic و selection animation از نظر مسئولیت از هم جدا هستند، اما برای اجرای افکت فقط از همان state انتخاب موجود استفاده می‌شود.

---

## 8. Theme System

۱۵ حالت در selector وجود دارد. IDهای داخلی به دلایل compatibility الزاماً برابر با ترتیب نمایش نیستند.

| ID | حالت |
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

کلاس‌های Theme:

```text
theme-pdf
theme-1 ... theme-15
```

کلید storage:

```text
chemistry-pdf-theme
```

Theme انتخاب‌شده در refresh از localStorage بازیابی می‌شود. تغییر زبان فقط labelهای selector را بازسازی می‌کند و ID انتخاب‌شده را حفظ می‌کند.

---

## 9. Data Model و Flow

سه CSV اصلی شامل ۱۱۸ عنصر هستند. دادهٔ پایه برای Beginner و جدول استفاده می‌شود و دو فایل Advanced/Very Advanced دادهٔ جزئیات تکمیلی را فراهم می‌کنند.

Flow:

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

بارگذاری سه فایل با `Promise.all()` موازی است.

---

## 10. `data/Elements/` — retained data

پوشهٔ زیر عمداً حفظ شده است:

```text
data/Elements/
```

این پوشه شامل دقیقاً **۱۱۸ فایل CSV**، یکی برای هر عنصر، است. این فایل‌ها توسط runtime فعلی مصرف نمی‌شوند و سه CSV اصلی همچنان تنها منابع runtime هستند.

تصمیم رسمی:

> **این ۱۱۸ فایل حذف نشوند.**

unused بودن runtime به‌تنهایی دلیل کافی برای حذف دادهٔ علمی نیست و این مجموعه ممکن است برای archive، import یا توسعهٔ آینده مورد نیاز باشد.

CI نیز تعداد ۱۱۸ فایل را بررسی می‌کند.

---

## 11. State و Storage

| State | محل | توضیح |
|---|---|---|
| Language | i18n + document + localStorage | زبان و جهت صفحه |
| Theme | main.js + `.table-shell` + localStorage | Theme انتخاب‌شده |
| Selected Element | Periodic Table + app.js | `AtomicNumber` انتخاب‌شده |
| Element Data | data.js + app.js | سه dataset در حافظه |
| Selection Visual State | `.element.selected` و موقتاً `.selected-flash` | وضعیت بصری انتخاب |

فقط این دو کلید localStorage قراردادی‌اند:

```text
chemistry-language
chemistry-pdf-theme
```

`selectedAtomicNumber` در localStorage ذخیره نمی‌شود.

---

## 12. Accessibility و UX

- کارت‌های عنصر `button` هستند و با keyboard قابل تعامل‌اند.
- `aria-label` کارت شامل نام عنصر و Atomic Number است.
- زبان فارسی با `rtl` و انگلیسی با `ltr` مدیریت می‌شود.
- focus state نباید در refactorهای آینده حذف شود.
- `prefers-reduced-motion` برای background و selection flash رعایت می‌شود.
- جدول ۱۸ ستونه در mobile با حداقل عرض داخلی و horizontal scrolling قابل استفاده می‌ماند.
- Element Details در mobile فشرده است و فیلدهای هر سطح با `flex-wrap` و اندازهٔ محتوایی نمایش داده می‌شوند.
- متن‌های طولانی فیلدها داخل کارت خود wrap می‌شوند و نباید باعث خروج افقی محتوا از container شوند.

---

## 13. CSS Architecture

`main.css` مالک global styles و متغیرهای پایه است. CSS اختصاصی Componentها در این مسیرهاست:

```text
assets/css/components/
├── header.css
├── hero.css
├── periodic-table.css
├── element-details.css
└── footer.css
```

در `periodic-table.css` وضعیت پایدار `.element.selected` با سایهٔ قرمز `rgba(220,38,38,.34)` تعریف می‌شود. Animation و keyframes مربوط به flash در CSS Component تعریف نمی‌شوند و فقط در `main.js` وجود دارند.

در `element-details.css`، `.data-grid` با `flex-wrap` و `.data-item` با اندازهٔ محتوایی و محدودیت `max-width:100%` پیاده‌سازی شده‌اند تا متن‌های کوتاه و بلند adaptive باقی بمانند.

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
- وجود `main.js`، `app.js`، Core و Componentهای JS؛
- وجود CSSهای Component؛
- `node --check` برای تمام JSهای زیر `assets/js`؛
- header و عرض ردیف‌های سه CSV runtime؛
- وجود دقیق ۱۱۸ فایل در `data/Elements/`؛
- smoke test HTTP برای HTML، JSهای اصلی/Core/Periodic Table و سه CSV runtime.

CI browser automation ندارد؛ smoke test دسترسی HTTP و syntax/data validation انجام می‌دهد، نه اجرای کامل UI در مرورگر.

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
6. selection logic در `periodic-table.js` باقی بماند و animation definition فقط در `main.js` نگهداری شود.
7. رنگ پایدار selection قرمز `rgba(220,38,38,...)` باقی بماند مگر با تصمیم صریح UI.
8. `prefers-reduced-motion` نباید animation selection را اجرا کند و باید همان وضعیت قرمز نهایی را نشان دهد.
9. i18n در Core بماند.
10. Componentها implementation داخلی یکدیگر را مستقیم مصرف نکنند.
11. `data/Elements/` بدون تصمیم مستقل حذف نشود.
12. localStorage فقط برای stateهای قراردادی UI استفاده شود، نه منبع علمی.
13. پروژه بدون Backend/Database/build system باقی بماند مگر تصمیم معماری صریح گرفته شود.
14. قبل از refactor جدید، Repository واقعی بررسی شود و README تنها source of truth فرض نشود.
15. اگر code و documentation اختلاف داشتند، رفتار واقعی code مبناست و README اصلاح شود.
16. تغییرات غیرمرتبط با درخواست انجام نشوند.
17. layout فیلدهای Element Details باید برای متن کوتاه و بلند adaptive باقی بماند و به شبکهٔ ثابت یا ارتفاع ثابت برنگردد.

---

## 17. آخرین تغییر این مرحله

باگ افکت انتخاب عنصر اصلاح شد. اکنون هنگام کلیک روی یک عنصر:

```text
قرمز نهایی
   ↓
آبی — یک بار
   ↓
قرمز
   ↓
سبز — یک بار
   ↓
قرمز نهایی و پایدار
```

رنگ آبی و سبز از مقادیر قراردادی پروژه حفظ شده‌اند و رنگ پایدار از نارنجی تیره به `rgba(220,38,38,...)` تغییر کرده است. هیچ تغییری در CSVها، i18n، Themeهای جدول، ساختار HTML یا مسیر انتقال دادهٔ عنصر به Element Details انجام نشده است.

این تغییر فقط برای برگرداندن/اصلاح selection feedback بصری انجام شده و منطق انتخاب عنصر همچنان همان `selectedAtomicNumber` و `onElementSelected(AtomicNumber)` است.
