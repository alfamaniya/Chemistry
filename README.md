# Chemistry Reference

مرجع آموزشی و تعاملی شیمی برای مشاهدهٔ جدول تناوبی ۱۱۸ عنصر و دسترسی مرحله‌ای به داده‌های عناصر. پروژه در وضعیت فعلی یک **سایت استاتیک سمت‌کاربر (static client-side web app)** است و برای اجرا به Backend، دیتابیس، Node package یا bundler نیاز ندارد.

> این README به‌عنوان راهنمای فنی پروژه و همچنین **context اصلی برای عامل‌های هوش مصنوعی (AI agents)** نوشته شده است. قبل از هر تغییر، ابتدا این فایل و ساختار واقعی مخزن را بررسی کنید و سپس فقط بخش‌های مرتبط با درخواست را تغییر دهید.

---

## 1. هدف پروژه

این پروژه یک رابط کاربری دوزبانه برای مطالعهٔ عناصر شیمیایی است که:

- جدول تناوبی کامل ۱۱۸ عنصر را نمایش می‌دهد.
- نام عنصرها را در فارسی و انگلیسی نمایش می‌دهد.
- اطلاعات عنصر انتخاب‌شده را در سه سطح ارائه می‌کند:
  1. مبتدی
  2. پیشرفته
  3. فوق پیشرفته
- داده‌ها را مستقیماً از فایل‌های CSV موجود در مخزن می‌خواند.
- از RTL برای فارسی و LTR برای انگلیسی استفاده می‌کند.
- انتخاب زبان را در localStorage نگه می‌دارد.
- ۱۵ حالت رنگی مرتبط با جدول‌های موجود در PDF مرجع را ارائه می‌کند.
- انتخاب حالت رنگی را در localStorage نگه می‌دارد.
- روی موبایل و دسکتاپ با CSS واکنش‌گرا است.
- در GitHub Actions، فایل‌های اصلی، syntax جاوااسکریپت و دسترسی HTTP به سایت را بررسی می‌کند.

---

## 2. وضعیت معماری

### معماری فعلی

```
text
Browser
  │
  ├── index.html
  │     ├── ساختار صفحه
  │     ├── رابط فارسی/انگلیسی
  │     └── محل جدول و پنل‌های اطلاعات
  │
  ├── assets/css/main.css
  │     └── ظاهر، layout، responsive design و themeها
  │
  └── assets/js/main.js
        ├── مدیریت زبان
        ├── مدیریت theme
        ├── fetch فایل‌های CSV
        ├── parse CSV
        ├── ساخت جدول تناوبی
        └── ساخت پنل اطلاعات عنصر
              │
              ├── data/PubChemElements_all.csv
              ├── data/ELEMENTS_118_ADVANCED.csv
              └── data/ELEMENTS_118_VERY_ADVANCED.csv
```

هیچ لایهٔ Backend، API اختصاصی، دیتابیس یا build system در کد فعلی وجود ندارد.

### نکتهٔ مهم دربارهٔ Node و npm

در این مخزن package.json وجود ندارد و کدی که با npm install، npm ci یا npx webpack اجرا شود نیز وجود ندارد. بنابراین پروژه را نباید به‌صورت پیش‌فرض یک پروژهٔ Node/React/Vue/Webpack فرض کرد.

جست‌وجوی مخزن نیز package.json و استفادهٔ واقعی از Webpack را نشان نمی‌دهد.

اگر در آینده نیاز به اضافه‌شدن Node یا bundler وجود داشت، این کار باید یک تغییر معماری آگاهانه باشد و صرفاً برای رفع خطای CI یک package.json ساختگی ایجاد نشود.

---

## 3. ساختار مخزن

ساختار اصلی فعلی:

```
text
.
├── .github/
│   └── workflows/
│       ├── webpack.yml
│       └── npm-publish-github-packages.yml
│
├── assets/
│   ├── css/
│   │   └── main.css
│   └── js/
│       └── main.js
│
├── data/
│   ├── PubChemElements_all.csv
│   ├── ELEMENTS_118_ADVANCED.csv
│   ├── ELEMENTS_118_VERY_ADVANCED.csv
│   └── Elements/
│       └── فایل‌های جداگانهٔ عناصر
│
├── index.html
└── README.md
```

پوشهٔ data/Elements/ شامل فایل‌های جداگانه برای عناصر است و در منطق فعلی main.js مستقیماً برای ساخت رابط اصلی استفاده نمی‌شود؛ رابط فعلی سه CSV سطحی را که در بخش داده‌ها معرفی شده‌اند، بارگذاری می‌کند.

---

## 4. فایل‌های اصلی و مسئولیت آن‌ها

### index.html

نقطهٔ ورود برنامه است و مسئول:

- ساخت HTML اصلی صفحه
- header و navigation
- دکمهٔ تغییر زبان
- بخش معرفی
- جدول تناوبی
- selector مربوط به ۱۵ theme
- محل نمایش عنصر انتخاب‌شده
- سه پنل اطلاعاتی
- footer
- بارگذاری assets/js/main.js

این فایل نباید شامل منطق سنگین داده یا CSS گسترده شود؛ منطق رفتاری در main.js و ظاهر در main.css قرار دارد.

---

### assets/js/main.js

هستهٔ رفتار سمت‌کاربر پروژه است.

#### منابع داده

در ابتدای فایل سه مسیر اصلی تعریف شده‌اند:

```
text
data/PubChemElements_all.csv
data/ELEMENTS_118_ADVANCED.csv
data/ELEMENTS_118_VERY_ADVANCED.csv
```

#### جریان بارگذاری داده

تابع loadElements() هر سه CSV را به‌صورت هم‌زمان با Promise.all() بارگذاری می‌کند:

```
text
fetch CSVs
   ↓
parseCsv()
   ↓
normalizeDetailRow() برای داده‌های advanced
   ↓
ذخیره در آرایه‌های حافظه
   ↓
renderPeriodicTable()
   ↓
updateStatus()
```

اگر یکی از منابع قابل بارگذاری نباشد، رابط وضعیت خطا را نمایش می‌دهد.

#### Parser

parseCsv() یک parser داخلی ساده برای CSV است که:

- comma را تشخیص می‌دهد.
- quoted values را پشتیبانی می‌کند.
- "" داخل مقدار quoted را به quote تبدیل می‌کند.
- newlineهای LF و CRLF را مدیریت می‌کند.
- header را به‌عنوان کلید object استفاده می‌کند.

بنابراین برای تغییر فرمت CSV، ابتدا باید سازگاری آن با این parser بررسی شود.

#### داده‌های normalize شده

فایل‌های advanced و very advanced نام ستون‌های متفاوتی دارند. normalizeDetailRow() این نام‌ها را به نام‌های مشترک مورد استفادهٔ رابط تبدیل می‌کند؛ از جمله:

- atomic_number → AtomicNumber
- symbol → Symbol
- name → Name
- atomic_mass → AtomicMass
- group_block → GroupBlock
- standard_state → StandardState
- electron_configuration → ElectronConfiguration
- oxidation_states → OxidationStates
- electronegativity → Electronegativity
- atomic_radius_pm → AtomicRadius
- ionization_energy_eV → IonizationEnergy
- electron_affinity_eV → ElectronAffinity
- melting_point_K → MeltingPoint
- boiling_point_K → BoilingPoint
- density_g_cm3 → Density
- year_discovered → YearDiscovered
- data_status / dataStatus → data_status

هر تغییری در schema CSV باید با این normalization هماهنگ شود.

---

## 5. منطق جدول تناوبی

جدول با CSS Grid و یک Map از موقعیت عناصر ساخته می‌شود.

positions عدد اتمی را به [row, column] نگاشت می‌کند و چیدمان ۱۸ گروهی را کنترل می‌کند.

دو بخش f-block جداگانه وجود دارد:

```
text
Lanthanides: 57–71
Actinides:   89–103
```

این عناصر در زیر جدول اصلی نمایش داده می‌شوند.

در نتیجه، اگر جایگاه عنصر یا layout جدول تغییر کند، باید positions و منطق f-block با هم بررسی شوند.

---

## 6. انتخاب عنصر و نمایش جزئیات

وقتی کاربر یک عنصر را انتخاب می‌کند، renderElementDetails(atomicNumber) همان عدد اتمی را در هر سه منبع پیدا می‌کند.

### پنل خلاصه

اطلاعات زیر در کارت عنصر انتخاب‌شده استفاده می‌شوند:

- Atomic Number
- Atomic Mass
- Group / Block
- Standard State
- Electron Configuration
- Oxidation States

### سطح مبتدی

از PubChemElements_all.csv:

- Atomic Number
- Symbol
- Atomic Mass
- Standard State
- Group / Block
- Year Discovered

### سطح پیشرفته

از ELEMENTS_118_ADVANCED.csv:

- Atomic Number
- Symbol
- Atomic Mass
- Group / Block
- Standard State
- Electron Configuration
- Oxidation States
- Electronegativity
- Atomic Radius
- Ionization Energy
- Electron Affinity
- Melting Point
- Boiling Point
- Density

### سطح فوق پیشرفته

از ELEMENTS_118_VERY_ADVANCED.csv:

- موارد سطح پیشرفته
- Year Discovered
- Data Status

مقادیر خالی با — جایگزین می‌شوند و فیلدهای بدون مقدار در grid جزئیات نمایش داده نمی‌شوند.

---

## 7. سیستم زبان

پروژه در حال حاضر دو زبان دارد:

```
text
fa
en
```

ترجمه‌های رابط در object translations داخل main.js قرار دارند.

با تغییر زبان:

1. document.documentElement.lang تغییر می‌کند.
2. dir بین rtl و ltr تغییر می‌کند.
3. کلاس lang-en روی body مدیریت می‌شود.
4. عناصر دارای data-i18n ترجمه می‌شوند.
5. نام عنصرها نیز از NameFa یا Name انتخاب می‌شود.
6. وضعیت انتخاب زبان در این کلید ذخیره می‌شود:

```
text
chemistry-language
```

اگر متن جدیدی به رابط اضافه می‌شود و باید دوزبانه باشد، ترجیحاً باید:

- یک key جدید در translations.fa و translations.en اضافه شود.
- در HTML از data-i18n استفاده شود.

از hard-code کردن متن قابل‌مشاهده در یک زبان، در صورت امکان، خودداری شود.

---

## 8. سیستم ۱۵ حالت رنگی PDF

در main.js آرایهٔ pdfThemes شامل ۱۵ موضوع است:

1. جرم اتمی / Atomic Mass
2. چگالی / Density
3. حالت استاندارد / Standard State
4. الکترونگاتیویته / Electronegativity
5. انرژی یونش / Ionization Energy
6. آرایش الکترونی / Electron Configuration
7. شعاع اتمی / Atomic Radius
8. حالت‌های اکسایش / Oxidation States
9. الکترون‌خواهی / Electron Affinity
10. نقطه ذوب / Melting Point
11. نقطه جوش / Boiling Point
12. اشغال اوربیتال / Orbital Occupancy
13. فلز / شبه‌فلز / نافلز
14. پایداری شیمیایی / Chemical Stability
15. گروه / خانواده شیمیایی / Chemical Group / Family

theme با کلاس‌هایی مانند زیر روی .table-shell اعمال می‌شود:

```
text
theme-pdf
theme-1
theme-2
...
theme-15
```

تعریف رنگ‌ها در assets/css/main.css انجام شده است.

انتخاب theme در این کلید ذخیره می‌شود:

```
text
chemistry-pdf-theme
```

نکته: این themeها **رنگ‌بندی رابط** هستند و نباید بدون بررسی منطق داده، به‌عنوان محاسبه یا منبع علمی جدید تلقی شوند.

---

## 9. CSS و responsive design

assets/css/main.css مسئول:

- layout کلی
- header
- hero
- جدول
- کارت عناصر
- پنل‌های اطلاعات
- footer
- responsive design
- حالت RTL/LTR
- ۱۵ PDF theme

جدول حداقل عرض کنترل‌شده دارد تا در موبایل از فشرده‌شدن بیش از حد جلوگیری شود و با horizontal scrolling قابل استفاده باقی بماند.

برای موبایل breakpointهای اصلی در حدود 680px و 390px تعریف شده‌اند.

---

## 10. منابع داده

### data/PubChemElements_all.csv

منبع اصلی جدول و داده‌های پایه است.

schema مشاهده‌شده:

```
text
AtomicNumber
Symbol
Name
AtomicMass
CPKHexColor
ElectronConfiguration
Electronegativity
AtomicRadius
IonizationEnergy
ElectronAffinity
OxidationStates
StandardState
MeltingPoint
BoilingPoint
Density
GroupBlock
YearDiscovered
NameFa
```

وجود NameFa برای نمایش نام فارسی عناصر مهم است.

---

### data/ELEMENTS_118_ADVANCED.csv

دادهٔ سطح پیشرفته برای ۱۱۸ عنصر است.

schema فعلی شامل:

```
text
level
atomic_number
symbol
name
atomic_mass
group_block
standard_state
electron_configuration
oxidation_states
electronegativity
atomic_radius_pm
ionization_energy_eV
electron_affinity_eV
melting_point_K
boiling_point_K
density_g_cm3
```

---

### data/ELEMENTS_118_VERY_ADVANCED.csv

نسخهٔ گسترده‌تر دادهٔ پیشرفته است و علاوه بر فیلدهای بالا شامل:

```
text
year_discovered
data_status
```

نیز هست.

---

## 11. اجرای محلی

چون main.js از fetch() برای خواندن CSV استفاده می‌کند، اجرای مستقیم با file:// روش مناسب اجرای پروژه نیست.

از ریشهٔ repository یک وب‌سرور ساده اجرا کنید:

```
bash
python -m http.server 8000
```

سپس:

```
text
http://localhost:8000
```

را در مرورگر باز کنید.

اگر Python در محیط موجود نیست، از هر static HTTP server معادل استفاده کنید.

---

## 12. GitHub Actions

فایل:

```
text
.github/workflows/webpack.yml
```

در وضعیت فعلی دیگر Webpack را build نمی‌کند. نام فایل قدیمی باقی مانده است، اما workflow به‌عنوان **Static site validation** تعریف شده است.

این workflow:

1. repository را checkout می‌کند.
2. Node.js 22 را در runner آماده می‌کند.
3. وجود فایل‌های اصلی را بررسی می‌کند.
4. syntax فایل assets/js/main.js را با node --check بررسی می‌کند.
5. با python3 -m http.server یک static server موقت اجرا می‌کند.
6. با curl دسترسی به index.html و فایل JavaScript را smoke-test می‌کند.

بنابراین برای workflow فعلی:

```
text
npm install
npm ci
npx webpack
```

لازم نیست.

### Workflow مربوط به npm package

فایل:

```
text
.github/workflows/npm-publish-github-packages.yml
```

یک workflow عمومی برای انتشار npm package است و هنوز شامل npm ci و npm publish است.

با توجه به معماری فعلی و نبود package.json، این workflow با پروژهٔ فعلی به‌صورت native سازگار نیست و در صورت فعال‌شدن توسط release می‌تواند به خطای npm منجر شود.

این README آن را عمداً به workflow استاتیک تبدیل نمی‌کند؛ اگر قرار است انتشار npm package بخشی از معماری آینده باشد، ابتدا باید تصمیم معماری مشخصی دربارهٔ package شدن پروژه گرفته شود.

---

## 13. چرا خطای npm ERR! ENOENT package.json رخ می‌داد؟

علت مستقیم خطای قبلی این بود که workflow قدیمی Webpack دستورهایی مانند:

```
bash
npm install
npx webpack
```

را اجرا می‌کرد، در حالی که repository فاقد:

```
text
package.json
```

و فاقد Webpack configuration واقعی بود.

در چنین ساختاری npm install نمی‌تواند package metadata پروژه را پیدا کند و خطای ENOENT برای package.json طبیعی است.

راه‌حل فعلی، تغییر CI به validation مخصوص سایت استاتیک بوده است؛ نه اضافه‌کردن فایل‌های npm غیرضروری.

---

## 14. راهنمای توسعه برای AI Agents

اگر یک عامل هوش مصنوعی می‌خواهد روی این repository تغییر ایجاد کند، این ترتیب را رعایت کند:

### مرحله 1 — Repository را بررسی کن

ابتدا ساختار فایل‌ها و workflowها را بررسی کن. فرض نکن پروژه Node، React یا Webpack است.

### مرحله 2 — README را بخوان

README قراردادهای معماری و وابستگی‌های اصلی پروژه را توضیح می‌دهد.

### مرحله 3 — مسیر داده را بررسی کن

قبل از تغییر UI مربوط به عنصرها، این زنجیره را بررسی کن:

```
text
CSV schema
   ↓
parseCsv()
   ↓
normalizeDetailRow()
   ↓
getRowByAtomicNumber()
   ↓
renderElementDetails()
```

اگر schema تغییر کند، ممکن است چند بخش هم‌زمان نیاز به اصلاح داشته باشند.

### مرحله 4 — کمترین تغییر ممکن

از ایجاد تغییرات غیرمرتبط خودداری کن.

برای مثال:

- برای یک تغییر CSS، Node را وارد پروژه نکن.
- برای یک تغییر داده، parser را بدون نیاز بازنویسی نکن.
- برای رفع خطای static-site CI، package.json ساختگی نساز.
- برای تغییر متن UI، معماری داده را تغییر نده.

### مرحله 5 — دو زبان را حفظ کن

هر متن جدید کاربرمحور باید در فارسی و انگلیسی در نظر گرفته شود.

### مرحله 6 — موبایل را حفظ کن

تغییرات جدول و پنل‌ها باید رفتار responsive فعلی را خراب نکنند.

### مرحله 7 — داده و UI را قاطی نکن

اطلاعات علمی باید از CSVها بیاید. متن‌های رابط و ترجمه‌ها باید در سیستم ترجمهٔ main.js مدیریت شوند.

### مرحله 8 — قبل از commit بررسی کن

حداقل این موارد را بررسی کن:

```
bash
node --check assets/js/main.js
python -m http.server 8000
```

سپس دسترسی HTTP به index.html و فایل JavaScript را بررسی کن.

---

## 15. قراردادهای مهم پروژه

### قرارداد شماره ۱: کلید اتصال داده‌ها

AtomicNumber شناسهٔ اصلی اتصال اطلاعات یک عنصر بین منابع داده است.

### قرارداد شماره ۲: نام فارسی

در دادهٔ پایه، NameFa برای نام فارسی استفاده می‌شود.

### قرارداد شماره ۳: مسیرهای نسبی

مسیرهای CSV نسبت به ریشهٔ سایت تعریف شده‌اند:

```
text
data/...
```

اجرای پروژه از یک subdirectory بدون تنظیم base path جدید ممکن است این مسیرها را بشکند.

### قرارداد شماره ۴: CSV به‌عنوان منبع runtime

CSVها در زمان اجرای مرورگر fetch می‌شوند؛ بنابراین حذف، rename یا جابه‌جایی آن‌ها بدون تغییر main.js باعث شکست runtime می‌شود.

### قرارداد شماره ۵: بدون build step

در معماری فعلی، index.html و assetهای آن مستقیماً قابل سرو شدن هستند و build step ضروری وجود ندارد.

---

## 16. تست و اعتبارسنجی

CI فعلی تست‌های زیر را پوشش می‌دهد:

```
text
[✓] index.html exists
[✓] main.css exists
[✓] main.js exists
[✓] required CSV files exist
[✓] main.js syntax is valid
[✓] index.html is served over HTTP
[✓] main.js is served over HTTP
```

این تست‌ها عمدتاً **ساختاری و smoke test** هستند و صحت علمی مقادیر CSV، ظاهر بصری یا رفتار تک‌تک تعاملات مرورگر را اثبات نمی‌کنند.

برای تغییرات مهم UI یا داده‌ای، علاوه بر CI، بررسی دستی در مرورگر توصیه می‌شود.

---

## 17. محدودیت‌های فعلی

- Backend ندارد.
- Database ندارد.
- Authentication ندارد.
- API اختصاصی ندارد.
- package manager یا package.json ندارد.
- داده‌ها در فایل‌های CSV نگهداری می‌شوند.
- parser CSV داخلی است.
- تست end-to-end مرورگر در CI وجود ندارد.
- صحت علمی داده‌ها توسط CI اعتبارسنجی نمی‌شود.
- themeهای PDF رنگ‌بندی UI هستند و محاسبات علمی انجام نمی‌دهند.

---

## 18. هنگام تغییر داده‌ها به چه چیزهایی توجه شود؟

اگر CSVها تغییر کردند، حداقل این موارد را بررسی کنید:

1. آیا headerها همچنان با parser سازگار هستند؟
2. آیا AtomicNumber یا atomic_number برای هر ردیف موجود است؟
3. آیا ۱۱۸ عنصر قابل پیدا کردن هستند؟
4. آیا نام فارسی NameFa برای منبع پایه حفظ شده است؟
5. آیا نام ستون‌های advanced با normalizeDetailRow() سازگار هستند؟
6. آیا مقادیر quoted، comma و newline داخل CSV parser را تحت تأثیر قرار نمی‌دهند؟
7. آیا مسیر فایل‌ها با constantهای main.js یکسان است؟

---

## 19. هنگام تغییر UI به چه چیزهایی توجه شود؟

قبل از commit:

- زبان فارسی و انگلیسی هر دو بررسی شوند.
- RTL/LTR بررسی شود.
- جدول روی موبایل بررسی شود.
- انتخاب عنصر بررسی شود.
- سه سطح اطلاعات بررسی شوند.
- selector مربوط به ۱۵ theme بررسی شود.
- refresh صفحه و localStorage بررسی شود.
- خطای نبودن یا قابل‌بارگذاری نبودن CSV بررسی شود.

---

## 20. فلسفهٔ نگهداری پروژه

این پروژه عمداً ساده و فایل‌محور است. اصل نگهداری آن:

> **سادگی معماری را حفظ کن، داده را از UI جدا نگه دار، و فقط در صورت نیاز وابستگی جدید اضافه کن.**

هر تغییر آینده باید با این سؤال شروع شود:

```
text
آیا این تغییر واقعاً به تغییر معماری نیاز دارد،
یا می‌توان آن را با ساختار فعلی HTML + CSS + JS + CSV انجام داد؟
```

تا زمانی که نیاز واقعی به build system، backend، database یا package management وجود ندارد، ساختار فعلی نباید صرفاً برای استانداردهای یک پروژهٔ Node تغییر داده شود.

---

## 21. وضعیت فعلی

در شاخهٔ main، CI سایت استاتیک از workflow قدیمی Webpack جدا شده و README نیز با معماری واقعی پروژه هماهنگ شده است.

آخرین تغییرات مرتبط شامل:

- تبدیل validation به static-site validation
- مستندسازی وابستگی نداشتن پروژه به package.json و Webpack
- مستندسازی سه سطح داده
- مستندسازی سیستم فارسی/انگلیسی
- مستندسازی ۱۵ PDF theme
- مستندسازی قراردادهای داده و راهنمای کار برای AI agents

---

## 22. خلاصهٔ سریع برای AI

اگر فقط چند خط اول context را لازم داری:

```
text
Project type: Static client-side web app
Entry point: index.html
JavaScript: assets/js/main.js
CSS: assets/css/main.css
Data: CSV files under data/
Backend: None
Database: None
Node/package.json: None
Build system: None
Primary data key: AtomicNumber
Languages: Persian + English
Directions: RTL + LTR
Element count: 118
Detail levels: Beginner + Advanced + Very Advanced
Runtime requirement: HTTP server because CSVs are loaded with fetch()
CI: GitHub Actions validates files, JS syntax and HTTP smoke tests
Main rule: Preserve the existing HTML/CSS/JS/CSV architecture unless a real requirement justifies an architectural change.
```

## 15. قراردادهای مهم پروژه

### قرارداد شماره ۱: کلید اتصال داده‌ها

AtomicNumber شناسهٔ اصلی اتصال اطلاعات یک عنصر بین منابع داده است.

### قرارداد شماره ۲: نام فارسی

در دادهٔ پایه، NameFa برای نام فارسی استفاده می‌شود.

### قرارداد شماره ۳: مسیرهای نسبی

مسیرهای CSV نسبت به ریشهٔ سایت تعریف شده‌اند:

```
text
data/...
```

اجرای پروژه از یک subdirectory بدون تنظیم مسیرهای جدید ممکن است باعث خطای fetch شود.

---

## 16. قرارداد دوزبانگی و دسته‌بندی داده‌ها

از این نسخه، بررسی متن‌های قابل‌مشاهده و برچسب‌های دسترس‌پذیری با هدف جلوگیری از باقی‌ماندن واژهٔ تک‌زبانه انجام شده است. این ممیزی پیش از ثبت تغییرات در شاخهٔ اصلاحی انجام شد.

### رابط کاربری

- متن‌های کاربرمحور در `translations.fa` و `translations.en` نگهداری می‌شوند.
- متن‌های ثابت HTML که باید با زبان تغییر کنند از `data-i18n` استفاده می‌کنند.
- برچسب‌های ARIA قابل‌تغییر از `data-i18n-aria` یا به‌روزرسانی مستقیم در `setLanguage()` استفاده می‌کنند.
- نام عناصر از `NameFa` در فارسی و `Name` در انگلیسی نمایش داده می‌شود.

### دسته‌بندی‌های علمی

مقادیر خام CSV عمداً انگلیسی باقی می‌مانند تا schema و منطق CSS تغییر نکند؛ اما هنگام نمایش در رابط، دسته‌بندی‌های زیر به‌صورت دوزبانه ترجمه می‌شوند:

- Group / Block: Nonmetal، Noble gas، Alkali metal، Alkaline earth metal، Metalloid، Transition metal، Post-transition metal، Lanthanide، Actinide، Halogen
- Standard State: Gas، Solid، Liquid، Expected to be a Solid، Expected to be a Gas
- Data Status: predicted_or_estimated
- Year Discovered: Ancient

این تفکیک باعث می‌شود دادهٔ منبع و selectorهای CSS دست‌نخورده بمانند، در حالی که کاربر در هر دو زبان مقدار خوانا و متناسب با زبان انتخاب‌شده می‌بیند.

### موارد بررسی‌شده

- نام برند، tagline، navigation، hero، دکمه‌ها، عنوان بخش‌ها و footer
- برچسب‌های جدول و اطلاعات عنصر
- ۱۵ عنوان theme
- وضعیت بارگذاری و خطا
- نام‌های فارسی/انگلیسی ۱۱۸ عنصر
- دسته‌بندی‌های گروه/بلوک
- حالت استاندارد
- وضعیت داده
- مقدار Ancient در سال کشف
- برچسب‌های ARIA برای جدول، f-block و بخش اطلاعات سریع

