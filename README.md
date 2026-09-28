# Chemistry — مرجع کامل پروژه

> این README وضعیت واقعی Repository را توضیح می‌دهد. در صورت اختلاف بین مستندات و کد، کد اجراشونده مبناست.

## 1. هدف

Chemistry یک وب‌سایت آموزشی و تعاملی برای ۱۱۸ عنصر جدول تناوبی است.

- HTML/CSS/JavaScript خالص و کاملاً client-side
- بدون Backend، Database، framework یا build system
- فارسی و انگلیسی
- جدول ۱۸ گروهی و f-block
- اطلاعات هر عنصر در سه سطح Beginner، Advanced و Very Advanced
- ۱۵ Theme: چهارده دسته‌بندی PDF و یک حالت «بدون دسته‌بندی»
- responsive برای desktop و mobile
- keyboard interaction و قابلیت‌های accessibility موجود
- داده‌های علمی از سه CSV runtime

## 2. ساختار Repository

```text
Repository
├── .github/workflows/webpack.yml
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
│       ├── core/i18n.js
│       ├── core/data.js
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
│   └── Elements/                 # 118 فایل non-runtime، عمداً حفظ شده
├── index.html
└── README.md
```

`README2.md`، `README3.md` و `assets/js/main-legacy.js` در Repository فعلی وجود ندارند.

## 3. HTML

`index.html` فقط metadata، shell صفحه و entry point را نگه می‌دارد:

```html
<header class="site-header" data-component="header"></header>
<main id="top">
  <section class="hero container" data-component="hero"></section>
  <section id="periodic-table" class="section container" data-component="periodic-table"></section>
  <section class="element-details container" data-component="element-details"></section>
</main>
<footer id="footer" class="site-footer" data-component="footer"></footer>
<script type="module" src="assets/js/main.js"></script>
```

محتوای علمی عناصر در HTML hard-code نمی‌شود.

IDهای حساس runtime:

```text
periodic-table-grid
table-theme-select
table-theme-description
table-status
f-block
selected-element
beginner-info
advanced-info
very-advanced-info
levels
```

## 4. JavaScript Architecture

### `assets/js/main.js`

Bootstrap و Theme/visual system است:

- import و mount Componentها
- بارگذاری CSSهای Component
- تعریف و اعمال ۱۵ Theme
- ذخیره/بازیابی `chemistry-pdf-theme`
- هماهنگ‌سازی Theme selector با زبان
- background متحرک
- تعریف تنها animation مربوط به selection flash
- رعایت `prefers-reduced-motion`

### `assets/js/app.js`

Application orchestrator است:

- دریافت داده از `core/data.js`
- اتصال Periodic Table به Element Details
- نگهداری زبان فعلی
- re-render بعد از تغییر زبان
- انتقال `AtomicNumber` انتخاب‌شده
- مدیریت خطای بارگذاری

مسیر انتخاب:

```text
Periodic Table → onElementSelected(AtomicNumber) → app.js → Element Details
```

### `assets/js/core/i18n.js`

مالک dictionary فارسی/انگلیسی، `lang/dir`، language buttons، localStorage زبان، نام عناصر و ترجمهٔ مقادیر علمی است.

کلیدهای ترجمهٔ بلااستفادهٔ قدیمی حذف شده‌اند.

### `assets/js/core/data.js`

مالک fetch و parse سه CSV است و شامل BOM removal، quoted fields، newline داخل field، رد ردیف‌های malformed، normalize داده‌های پیشرفته و `Promise.all()` است. ردیف کاملاً خالی انتهای CSV اضافه نمی‌شود.

## 5. Componentها

### Header

`assets/js/components/header/header.js` و `assets/css/components/header.css`

Brand، navigation و language switcher. تغییر زبان با `chemistry:language-change` انجام می‌شود.

### Hero

`assets/js/components/hero/hero.js` و `assets/css/components/hero.css`

معرفی سایت و CTA جدول.

### Periodic Table

`assets/js/components/periodic-table/periodic-table.js` و `assets/css/components/periodic-table.css`

چیدمان ۱۸ گروهی، ۱۱۸ عنصر، f-block، انتخاب، شماره/نماد/نام و `table-status` را مدیریت می‌کند. عنوان و زیرعنوان جدول نیز توسط همین Component ساخته و ترجمه می‌شوند.

### Element Details

`assets/js/components/element-details/element-details.js` و `assets/css/components/element-details.css`

سه سطح Beginner، Advanced و Very Advanced را نمایش می‌دهد. هر فیلد یک `.data-item` مستقل است. `.data-grid` با `flex-wrap` و عرض محتوایی، فضای خالی را کم می‌کند؛ `max-width:100%` و wrapping از خروج متن جلوگیری می‌کنند و در mobile سطح‌ها تک‌ستونه می‌شوند.

### Footer

`assets/js/components/footer/footer.js` و `assets/css/components/footer.css`

Footer و لینک بازگشت به بالا.

## 6. Selection Flash

توالی فعلی:

```text
کلیک → آبی → سبز → قرمز پایدار
```

- تنها `assets/js/main.js` مالک animation و keyframes است.
- تعریف قدیمی `element-selection-flash` در CSS وجود ندارد.
- مدت animation برابر `2.7s` و یک iteration است.
- آبی: `rgba(37,99,235,...)`
- سبز: `rgba(22,163,74,...)`
- قرمز نهایی: `rgba(220,38,38,...)`
- بعد از `animationend` فقط `selected-flash` حذف می‌شود و `selected` باقی می‌ماند.
- انتخاب جدید selection قبلی را پاک می‌کند.
- listener پایان animation فقط animation موردنظر را بررسی می‌کند تا انتخاب سریع/تکراری باعث حذف زودهنگام کلاس نشود.
- در `prefers-reduced-motion: reduce` animation اجرا نمی‌شود و سایهٔ قرمز نهایی مستقیماً اعمال می‌شود.

## 7. Theme System

۱۵ Theme در `assets/js/main.js` تعریف شده‌اند:

```text
15 Uncategorized
1  Atomic Mass
2  Density
3  Standard State
10 Melting Point
11 Boiling Point
7  Atomic Radius
6  Electron Configuration
5  Ionization Energy
9  Electron Affinity
4  Electronegativity
8  Oxidation States
13 Metal / Metalloid / Nonmetal
14 Chemical Group / Family
12 Year Discovered
```

Theme در `localStorage["chemistry-pdf-theme"]` ذخیره و در reload بازیابی می‌شود. تغییر زبان labelها را عوض می‌کند ولی Theme را از بین نمی‌برد.

## 8. State و Storage

| State | محل | ماندگاری |
|---|---|---|
| زبان | application + `document.documentElement` | `localStorage` |
| Theme | کلاس‌های `theme-*` روی `.table-shell` | `localStorage` |
| عنصر انتخاب‌شده | state Periodic Table/application | تا refresh |
| داده‌های CSV | state application | تا refresh |

کلیدهای localStorage فقط:

```text
chemistry-language
chemistry-pdf-theme
```

## 9. Data

سه CSV runtime باید هرکدام ۱۱۸ ردیف داده داشته باشند:

| فایل | کاربرد |
|---|---|
| `data/PubChemElements_all.csv` | داده پایه و جدول |
| `data/ELEMENTS_118_ADVANCED.csv` | Advanced |
| `data/ELEMENTS_118_VERY_ADVANCED.csv` | Very Advanced |

ستون `level` در دو CSV پیشرفته عمداً حفظ شده، اما runtime فعلی برای منطق نمایش به آن وابسته نیست.

`data/Elements/` شامل ۱۱۸ CSV جداگانه است و **عمداً نگه داشته شده است**. این پوشه runtime نیست و نباید بدون دستور صریح حذف شود.

## 10. CSS

`assets/css/main.css` شامل قواعد عمومی، responsive و Themeهای جدول است. CSSهای Component نیز جداگانه از `assets/css/components/` بارگذاری می‌شوند.

هیچ animation/keyframes متناقضی برای selection flash نباید در CSSهای دیگر اضافه شود؛ منبع selection flash `assets/js/main.js` است.

## 11. CI / Validation

Workflow در `.github/workflows/webpack.yml` قرار دارد. نام فایل تاریخی است؛ پروژه Webpack build ندارد و job فعلی Static site validation است.

CI شامل این کنترل‌هاست:

1. وجود فایل‌های اصلی؛
2. non-empty بودن CSSهای Component؛
3. `node --check` برای JavaScriptها؛
4. کنترل قرارداد animation، رنگ‌های selection و headingهای اصلی؛
5. اعتبارسنجی header و عرض ردیف CSV؛
6. اطمینان از ۱۱۸ ردیف در هر CSV runtime؛
7. اطمینان از دقیقاً ۱۱۸ فایل در `data/Elements/`؛
8. smoke test با HTTP server محلی و `curl`.

## 12. قرارداد توسعه

- `data/Elements/` بدون دستور صریح حذف نشود.
- CSVهای runtime باید ۱۱۸ عنصر را حفظ کنند.
- منطق انتخاب عنصر مستقل از animation باشد.
- selection flash فقط یک منبع حقیقت داشته باشد.
- رنگ پایدار selection قرمز `rgba(220,38,38,...)` باشد.
- داده علمی در HTML hard-code نشود.
- متن قابل ترجمه از dictionary عبور کند.
- تغییرات غیرمرتبط با درخواست انجام نشود.
- بعد از تغییر، syntax و validationهای CI بررسی شوند.

## 13. اجرای محلی

CSVها با `fetch()` خوانده می‌شوند؛ بنابراین صفحه را با `file://` اجرا نکنید. از وب‌سرور محلی استفاده کنید:

```bash
python3 -m http.server 8000
```

## 14. وضعیت فعلی

اصلاحات اصلی اعمال‌شده:

- headingهای جدول و Element Details به UI و i18n برگشته‌اند؛
- `table-status` و حالت صفر عنصر وجود دارد؛
- خطای بارگذاری داده در status نیز نمایش داده می‌شود؛
- selection flash فقط یک منبع animation دارد و توالی آن آبی → سبز → قرمز است؛
- Theme ذخیره‌شده در reload بازیابی می‌شود؛
- parser CSV ردیف پایانی خالی ایجاد نمی‌کند؛
- مسیر ترجمهٔ aria بلااستفاده حذف شده است؛
- CSSهای Component در CI خالی بودنشان کنترل می‌شوند؛
- `data/Elements/` عمداً حفظ شده است؛
- README2 و README3 حذف شده‌اند.
