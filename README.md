# Code Audit / بررسی خط‌به‌خط کد

> **تاریخ بررسی اولیه:** 2026-09-27  
> **تاریخ اصلاح و بازبینی مجدد:** 2026-09-27  
> **Branch:** `main`  
> **دامنه بررسی:** ساختار repository، `README.md`، HTML، JavaScript، CSS، CSVهای runtime و GitHub Actions.  
> **وضعیت:** ایرادهای اجرایی و CI شناسایی‌شده در audit اولیه اصلاح شدند و سپس repository دوباره بررسی شد.

| # | فایل / خط | نوع | نتیجه بازبینی و اصلاح | وضعیت |
|---|---|---|---|---|
| 1 | `assets/js/main.js` | رفتار ناخواسته | حذف مستقیم `periodicSubtitle` از DOM برداشته شد؛ عنصر HTML و `data-i18n` آن اکنون حفظ می‌شوند. | **اصلاح شد** |
| 2 | `assets/js/main.js` + `assets/js/main-legacy.js` | معماری / initialization | مالکیت‌ها تفکیک شد: `main.js` فقط bootstrap و مدیریت selector/theme را انجام می‌دهد و `main-legacy.js` منطق runtime، زبان، داده و rendering را نگه می‌دارد. مسیرهای initialization تکراری theme حذف شدند. | **اصلاح شد** |
| 3 | `assets/js/main.js` + `assets/js/main-legacy.js` | کد تکراری | تعریف ۱۵ theme فقط در `main.js` باقی ماند؛ `pdfThemes` از legacy حذف شد. | **اصلاح شد** |
| 4 | `assets/js/main.js` | observer اضافه | `MutationObserver` روی خود selector حذف شد. فقط synchronization لازم با تغییر `documentElement.lang` باقی مانده است. | **اصلاح شد** |
| 5 | `assets/js/main-legacy.js` | state management تکراری | `populateThemeSelect()` و state مربوط به ساخت گزینه‌های theme از legacy حذف شد. legacy فقط اعمال theme انتخاب‌شده را انجام می‌دهد. | **اصلاح شد** |
| 6 | `assets/js/main-legacy.js` | migration مشکوک | migration جابه‌جاکنندهٔ themeهای `14` و `15` حذف شد. مقدار پیش‌فرض و ساخت selector اکنون فقط از مسیر `main.js` کنترل می‌شود. | **اصلاح شد** |
| 7 | `assets/js/main-legacy.js` | robustness | `parseCsv()` اکنون BOM را حذف می‌کند، header را اعتبارسنجی می‌کند، quote بازمانده را خطا می‌داند و ردیف‌های دارای تعداد ستون نامعتبر را نادیده می‌گیرد و گزارش می‌کند. CI نیز header و طول ردیف‌های سه CSV runtime را بررسی می‌کند. | **اصلاح شد** |
| 8 | `assets/js/main-legacy.js` | fallback داده | fallbackهای `normalizeDetailRow()` از `||` به `??` تغییر کردند تا مقدارهای معتبر ولی falsy مانند `0` از بین نروند. | **اصلاح شد** |
| 9 | `.github/workflows/npm-publish-github-packages.yml` | workflow اضافه | workflow انتشار npm حذف شد؛ repository فاقد `package.json` و npm package است و این workflow با معماری static site هم‌راستا نبود. | **اصلاح شد** |
| 10 | `.github/workflows/webpack.yml` | validation ناقص | syntax هر دو فایل JavaScript بررسی می‌شود؛ وجود فایل‌های runtime و دسترسی HTTP به هر دو JS و سه CSV نیز به smoke test اضافه شد. اعتبارسنجی ساختار CSVها هم اضافه شد. | **اصلاح شد** |
| 11 | `assets/css/main.css` | CSS اضافه | selector بلااستفاده `.level-card` حذف شد؛ responsive CSS اکنون فقط ساختار واقعی `.detail-level-card` را هدف می‌گیرد. | **اصلاح شد** |
| 12 | `assets/css/main.css` | CSS تکراری/بلااستفاده | `.section-number` و قوانین بلااستفاده `.level-icon` حذف شدند و قوانین تکراری theme مربوط به level icon نیز حذف شد. | **اصلاح شد** |
| 13 | `assets/js/main-legacy.js` | translation schema | کلیدهای `quickInfoAria`، `elementsCount`، `levelsCount` و `dataFormat` در DOM/runtime فعلی مصرف نمی‌شوند. این مورد پس از بازبینی به‌عنوان **دادهٔ ترجمهٔ بدون اثر اجرایی** طبقه‌بندی شد و حذف آن برای رفع باگ لازم نیست؛ بنابراین به‌عنوان cleanup اختیاری باقی می‌ماند. | **بازبینی شد / بدون باگ** |

## گزارش تغییرات

### JavaScript

- `main.js` اکنون تنها منبع تعریف themeها و ساخت selector است.
- حذف ناخواستهٔ `periodicSubtitle` متوقف شد.
- observer اضافی selector حذف شد.
- `main-legacy.js` دیگر selector را populate نمی‌کند و migration قدیمی theme را اجرا نمی‌کند.
- اعمال CSS theme و ذخیرهٔ انتخاب کاربر همچنان در legacy انجام می‌شود تا رفتار runtime فعلی حفظ شود.
- parser CSV مقاوم‌تر شد و malformed rowها دیگر silently به object ناقص تبدیل نمی‌شوند.
- fallbackهای داده با nullish coalescing اصلاح شدند.

### CSS

- selectorهای بدون مصرف واقعی از DOM حذف شدند.
- قوانین تکراری مربوط به `.level-icon` حذف شدند.
- responsive rule مربوط به `.level-card` که با DOM فعلی همخوانی نداشت حذف شد.

### GitHub Actions

- workflow قدیمی npm publishing حذف شد.
- workflow `Static site validation` حفظ شد و تقویت شد.
- syntax هر دو JavaScript با `node --check` بررسی می‌شود.
- وجود `main-legacy.js` و دسترسی HTTP به آن بررسی می‌شود.
- هر سه CSV runtime از نظر header و تعداد ستون‌های هر ردیف validate می‌شوند.
- smoke test دسترسی به HTML، JavaScript و CSVهای runtime را بررسی می‌کند.

## وضعیت اعتبارسنجی نهایی

- repository روی branch `main` دوباره بررسی شد.
- workflow npm publishing دیگر در tree پروژه وجود ندارد.
- ساختار runtime همچنان static client-side است و Backend، Database، `package.json` یا build system به آن اضافه نشده است.
- سه منبع اصلی CSV و مسیرهای runtime حفظ شده‌اند.
- آخرین commit repository پس از اصلاحات شامل `README.md`، `main.js`، `main-legacy.js`، `main.css` و workflow validation به‌روزشده است.
- اجرای مستقیم GitHub Actions برای commit نهایی از طریق اتصال فعلی در لحظهٔ بازبینی هنوز run قابل مشاهده‌ای برنگرداند؛ بنابراین وضعیت CI نهایی را **تأییدشده توسط ساختار workflow، اما فاقد run قابل مشاهده در connector** ثبت می‌کنیم و ادعای موفقیت اجرای remote CI نمی‌کنیم.

---

# Chemistry Reference

مرجع آموزشی و تعاملی شیمی برای مشاهدهٔ جدول تناوبی ۱۱۸ عنصر و دسترسی مرحله‌ای به داده‌های عناصر.

## معماری

این پروژه یک **static client-side web app** است و Backend، دیتابیس، `package.json` یا build system ندارد.

```text
Browser
  ├── index.html
  ├── assets/css/main.css
  ├── assets/js/main.js
  │     └── assets/js/main-legacy.js
  └── data/*.csv
```

- `index.html` ساختار رابط را فراهم می‌کند.
- `assets/css/main.css` ظاهر، responsive design و themeهای جدول را مدیریت می‌کند.
- `assets/js/main.js` نقطهٔ ورود JavaScript است و تنظیمات selector theme را مدیریت می‌کند.
- `assets/js/main-legacy.js` منطق runtime پروژه را نگه می‌دارد: زبان، بارگذاری CSV، ساخت جدول و نمایش اطلاعات عناصر و اعمال theme انتخاب‌شده.
- داده‌ها مستقیماً از CSVها با `fetch()` بارگذاری می‌شوند.

## داده‌ها

منابع اصلی runtime:

```text
data/PubChemElements_all.csv
data/ELEMENTS_118_ADVANCED.csv
data/ELEMENTS_118_VERY_ADVANCED.csv
```

کلید اتصال داده‌های یک عنصر `AtomicNumber` است. داده‌های advanced و very advanced پیش از نمایش با `normalizeDetailRow()` به نام‌گذاری مشترک تبدیل می‌شوند.

## زبان

رابط فارسی و انگلیسی دارد و جهت صفحه بین `RTL` و `LTR` تغییر می‌کند. انتخاب زبان در `localStorage` با کلید `chemistry-language` نگهداری می‌شود.

## selector دسته‌بندی PDF

جدول دارای ۱۵ حالت رنگی مطابق PDF مرجع است. برای جلوگیری از شلوغ شدن رابط، فقط **یک selector** وجود دارد و نوع هر دسته‌بندی داخل پرانتز کنار عنوان آن نمایش داده می‌شود.

عنوان کنترل selector نیز به‌جای عبارت عمومی «دسته‌بندی رنگ جدول»، ماهیت دسته‌بندی‌ها را توضیح می‌دهد و به پنج گروه **Physical، Atomic، Chemical، Classification و History** اشاره می‌کند.

ترتیب فعلی selector:

1. **بدون دسته‌بندی / Uncategorized** — حالت پیش‌فرض
2. **جرم اتمی / Atomic Mass** *(Physical)*
3. **چگالی / Density** *(Physical)*
4. **حالت استاندارد / Standard State** *(Physical)*
5. **نقطه ذوب / Melting Point** *(Physical)*
6. **نقطه جوش / Boiling Point** *(Physical)*
7. **شعاع اتمی / Atomic Radius** *(Atomic)*
8. **آرایش الکترونی / Electron Configuration** *(Atomic)*
9. **انرژی یونش / Ionization Energy** *(Atomic)*
10. **الکترون‌خواهی / Electron Affinity** *(Atomic)*
11. **الکترونگاتیویته / Electronegativity** *(Chemical)*
12. **حالت‌های اکسایش / Oxidation States** *(Chemical)*
13. **فلز / شبه‌فلز / نافلز / Metal / Metalloid / Nonmetal** *(Classification)*
14. **گروه / خانواده شیمیایی / Chemical Group / Family** *(Classification)*
15. **سال کشف / Year Discovered** *(History)*

### رفتار پیش‌فرض

در هر بار load یا refresh صفحه، حالت **بدون دسته‌بندی** فعال می‌شود. بنابراین انتخاب theme قبلی باعث نمی‌شود سایت با همان theme باز شود.

پس از بارگذاری، کاربر همچنان می‌تواند هر یک از ۱۴ دسته‌بندی دیگر را انتخاب کند و رنگ جدول تغییر می‌کند.

شناسه‌های داخلی themeها عمداً حفظ شده‌اند:

```text
theme-pdf
theme-1 ... theme-15
```

این موضوع باعث می‌شود رنگ‌بندی موجود در `assets/css/main.css` بدون بازنویسی حفظ شود.

## دسته‌بندی مفهومی themeها

برای نمایش کنار عنوان‌ها از پنج گروه مفهومی استفاده شده است:

- **Physical** — جرم اتمی، چگالی، حالت استاندارد، نقطه ذوب، نقطه جوش
- **Atomic** — شعاع اتمی، آرایش الکترونی، انرژی یونش، الکترون‌خواهی
- **Chemical** — الکترونگاتیویته، حالت‌های اکسایش
- **Classification** — فلز/شبه‌فلز/نافلز، گروه/خانواده شیمیایی
- **History** — سال کشف

این گروه‌ها فقط برچسب رابط کاربری هستند و منوی چندسطحی یا دسته‌بندی جدیدی به ساختار سایت اضافه نمی‌کنند.

## جدول تناوبی

جدول با CSS Grid و mapping موقعیت عناصر ساخته می‌شود. عناصر ۱ تا ۱۱۸ نمایش داده می‌شوند و لانتانیدها و اکتینیدها در f-block قرار دارند.

## اطلاعات عنصر

برای عنصر انتخاب‌شده سه لایهٔ اطلاعاتی نمایش داده می‌شود:

1. **شناخت بنیادین / Foundational Insight**
2. **تحلیل تخصصی / Specialized Analysis**
3. **ژرف‌کاوی علمی / Scientific Deep Dive**

منطق این سه سطح و schema داده‌ها در `assets/js/main-legacy.js` حفظ شده است.

## اجرای محلی

چون CSVها با `fetch()` بارگذاری می‌شوند، پروژه را مستقیماً با `file://` اجرا نکنید. از ریشهٔ repository یک HTTP server ساده اجرا کنید:

```bash
python -m http.server 8000
```

سپس در مرورگر باز کنید:

```text
http://localhost:8000
```

## اعتبارسنجی

حداقل بررسی syntax برای فایل‌های JavaScript:

```bash
node --check assets/js/main.js
node --check assets/js/main-legacy.js
```

همچنین وجود فایل‌های زیر باید بررسی شود:

```text
index.html
assets/css/main.css
assets/js/main.js
assets/js/main-legacy.js
data/PubChemElements_all.csv
data/ELEMENTS_118_ADVANCED.csv
data/ELEMENTS_118_VERY_ADVANCED.csv
```

برای اعتبارسنجی کامل‌تر همان checks در `.github/workflows/webpack.yml` اجرا می‌شوند.

## قراردادهای مهم

- `AtomicNumber` شناسهٔ اصلی عنصر است.
- `NameFa` نام فارسی عنصر در منبع پایه است.
- مسیر CSVها نسبت به ریشهٔ سایت تعریف شده‌اند.
- CSVها منبع runtime هستند و حذف یا جابه‌جایی آن‌ها بدون تغییر JavaScript باعث خطا می‌شود.
- پروژه عمداً بدون Backend، Database و build step نگه داشته شده است.
- تغییرات UI باید فارسی/انگلیسی و RTL/LTR را حفظ کنند.
- تغییرات جدول باید رفتار responsive موبایل را حفظ کنند.
- برای تغییرات غیرمرتبط، معماری موجود نباید دستکاری شود.

## آخرین تغییر

در selector مربوط به PDF:

- «بدون دسته‌بندی» به ابتدای لیست منتقل شده است.
- «بدون دسته‌بندی» حالت پیش‌فرض هنگام load و refresh است.
- دسته‌بندی‌ها بر اساس Physical، Atomic، Chemical، Classification و History مرتب شده‌اند.
- نوع دسته‌بندی داخل پرانتز کنار عنوان نمایش داده می‌شود.
- عنوان کنترل selector اکنون گروه‌های مفهومی دسته‌بندی‌ها را نیز توضیح می‌دهد.
- یک selector واحد حفظ شده و منوی چندگانه‌ای به سایت اضافه نشده است.
- شناسه‌های theme و رنگ‌بندی CSS موجود حفظ شده‌اند.
- مدیریت selector و theme از منطق runtime legacy جدا شده تا یک منبع واحد برای تعریف themeها وجود داشته باشد.
- validation مربوط به JavaScript و CSVها در CI تقویت شده است.
