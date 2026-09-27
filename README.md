# Code Audit / بررسی خط‌به‌خط کد

> **تاریخ بررسی:** 2026-09-27  
> **Branch:** `main`  
> **دامنه بررسی:** ساختار repository، `README.md`، HTML، JavaScript، CSS، CSVهای runtime و GitHub Actions.  
> **نتیجه کلی:** چند مورد نیازمند اصلاح و چند بخش تکراری/بلااستفاده شناسایی شد. در این مرحله فقط همین جدول به README اضافه شده و کد اجرایی دستکاری نشده است.

| # | فایل / خط | نوع | ایراد / کد اضافه / مورد نیازمند اصلاح | شدت | پیشنهاد اصلاح |
|---|---|---|---|---|---|
| 1 | `assets/js/main.js:60` | کد اضافه / رفتار ناخواسته | عنصر `periodicSubtitle` مستقیماً از DOM حذف می‌شود، در حالی که در `index.html` وجود دارد و `data-i18n` دارد. این کار باعث می‌شود متن توضیحی بخش جدول عملاً حذف شود و ترجمه‌پذیری آن بی‌اثر شود. | **زیاد** | این خط حذف شود؛ اگر subtitle واقعاً لازم نیست، خود عنصر HTML نیز به‌صورت آگاهانه حذف و README هم هماهنگ شود. |
| 2 | `assets/js/main.js:4-6` + `assets/js/main-legacy.js` | معماری / تکرار | `main.js`، فایل `main-legacy.js` را به‌صورت پویا inject می‌کند و هم‌زمان منطق theme و initialization جدید را نیز اجرا می‌کند. در نتیجه دو entry-point و دو مسیر initialization وجود دارد. | **متوسط** | یک entry-point مشخص نگه داشته شود و منطق legacy به توابع مشترک/ماژول داخلی منتقل شود. |
| 3 | `assets/js/main.js:10-22` و `assets/js/main-legacy.js:18-22` | کد تکراری | فهرست ۱۵ theme در دو محل مستقل (`themes` و `pdfThemes`) نگهداری می‌شود. | **متوسط** | یک منبع واحد برای تعریف themeها استفاده شود تا تغییر نام/ID باعث ناسازگاری نشود. |
| 4 | `assets/js/main.js:62-69` | کد پیچیده / observer اضافه | دو مسیر برای همگام‌سازی selector وجود دارد: `MutationObserver` روی خود selector و observer جداگانه روی `documentElement.lang`. بخش زیادی از این synchronization ناشی از تکرار منطق theme است. | **متوسط** | synchronization به یک مسیر مشخص و event-driven محدود شود؛ observer مربوط به تغییرات غیرضروری selector حذف شود. |
| 5 | `assets/js/main-legacy.js:18-50` | کد تکراری / state management | `pdfThemes` و `populateThemeSelect()` علاوه بر منطق جدید `main.js` هنوز فعال هستند و `localStorage` مربوط به theme را نیز مدیریت می‌کنند. | **متوسط** | مدیریت theme از legacy حذف و فقط در یک لایه نگهداری شود. |
| 6 | `assets/js/main-legacy.js:37-42` | migration مشکوک | migration نسخه `chemistry-pdf-theme-version` در صورت نبود نسخه، مقدارهای `14` و `15` را جابه‌جا می‌کند؛ سپس `main.js` بلافاصله theme `15` را به‌عنوان default تحمیل می‌کند. این دو منطق یکدیگر را بی‌دلیل خنثی می‌کنند. | **متوسط** | migration فقط برای نسخه‌های واقعاً قدیمی نگه داشته شود؛ در غیر این صورت حذف شود. default نیز فقط یک‌بار و در یک محل تعیین شود. |
| 7 | `assets/js/main-legacy.js:180-198` | نیازمند اصلاح robustness | `parseCsv()` parser دستی و حداقلی است؛ BOM، عدم تطابق تعداد ستون‌ها و برخی CSV edge-caseها اعتبارسنجی نمی‌شوند. | **متوسط** | حداقل BOM header حذف، تعداد ستون‌ها validate و خطاهای malformed row مدیریت شوند؛ در صورت امکان parser استاندارد/سبک استفاده شود. |
| 8 | `assets/js/main-legacy.js:440-458` | نیازمند اصلاح | `normalizeDetailRow()` در fallbackها از `||` استفاده می‌کند. در صورت وجود مقدار معتبر ولی falsy مثل `0`، fallback اشتباه فعال می‌شود. | **کم** | برای fallback داده‌ها از `??` استفاده شود. |
| 9 | `.github/workflows/npm-publish-github-packages.yml` | کد/فایل اضافه | workflow انتشار npm با معماری اعلام‌شده پروژه سازگار نیست؛ README صراحتاً پروژه را بدون `package.json` و build system معرفی می‌کند. آخرین اجرای این workflow در GitHub Actions نیز `failure` بوده است. | **زیاد** | اگر package publishing واقعاً مورد نیاز نیست، workflow حذف شود. در غیر این صورت باید `package.json` و فرایند انتشار واقعی به پروژه اضافه و README اصلاح شود. |
| 10 | `.github/workflows/webpack.yml` | تست ناقص | workflow با عنوان validation فقط `node --check assets/js/main.js` را اجرا می‌کند، در حالی که `main-legacy.js` نیز بخش اصلی runtime است و README بررسی syntax هر دو فایل را توصیه می‌کند. | **متوسط** | `node --check assets/js/main-legacy.js` نیز به CI اضافه شود و smoke test دست‌کم وجود/دسترسی هر دو فایل و CSVهای runtime را بررسی کند. |
| 11 | `assets/css/main.css` | CSS اضافه | selector `.level-card` در responsive CSS وجود دارد، اما در HTML فعلی کلاس `.level-card` استفاده نشده و کلاس واقعی `.detail-level-card` است. | **کم** | selector بلااستفاده حذف یا با کلاس واقعی هماهنگ شود. |
| 12 | `assets/css/main.css` | CSS تکراری/بلااستفاده | selectorهای `.section-number` و `.level-icon` در ساختار HTML فعلی مصرف مشخصی ندارند؛ همچنین قوانین `.professional .level-icon` و `.advanced .level-icon` دوباره تکرار شده‌اند. | **کم** | پس از یک جستجوی نهایی در DOM، CSSهای بدون مصرف حذف و قوانین تکراری merge شوند. |
| 13 | `assets/js/main-legacy.js` | کد/داده اضافه | چند translation key مانند `quickInfoAria`، `elementsCount`، `levelsCount` و `dataFormat` در مسیر فعلی rendering مصرف مشخصی ندارند. | **کم** | کلیدهای واقعاً بدون مصرف پس از audit نهایی DOM حذف شوند تا فایل translation کوچک‌تر و قابل نگهداری‌تر شود. |

### وضعیت اعتبارسنجی فعلی

- ساختار repository بررسی شد و پروژه یک **static client-side web app** بدون Backend، Database، `package.json` و build system است.
- runtime اصلی شامل `index.html`، `assets/css/main.css`، `assets/js/main.js`، `assets/js/main-legacy.js` و سه CSV اصلی است.
- CSV پایه دارای داده‌های ۱۱۸ عنصر است و فایل‌های advanced و very advanced نیز تا عنصر ۱۱۸ ادامه دارند.
- آخرین اجرای workflow `Static site validation` در commit فعلی موفق بوده است؛ در مقابل workflow مربوط به npm publishing در همان commit ناموفق بوده و با معماری فعلی پروژه هم‌راستا نیست.
- این audit در این commit فقط مستندسازی شده و **هیچ‌یک از موارد بالا به‌صورت خودکار در کد اصلاح نشده‌اند** تا معماری فعلی بدون درخواست مستقیم برای refactor تغییر نکند.

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
- `assets/js/main.js` نقطهٔ ورود JavaScript است و تنظیمات جدید selector theme را روی منطق موجود اعمال می‌کند.
- `assets/js/main-legacy.js` منطق اصلی قبلی پروژه را حفظ می‌کند: زبان، بارگذاری CSV، ساخت جدول و نمایش اطلاعات عناصر.
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
