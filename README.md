# Chemistry Reference — Code Audit & Project Documentation

> **تاریخ بازبینی:** 2026-09-27  
> **Branch:** `main`  
> **آخرین commit بررسی‌شده:** `7848517221e09392cdae1c2dc83099f183ed2f8d`  
> **وضعیت:** repository، READMEها، HTML، JavaScript، CSS، CSVهای runtime و GitHub Actions بررسی شدند و مستندات با وضعیت واقعی کد همگام شده‌اند.

## خلاصهٔ معماری

این پروژه یک **static client-side web app** است و Backend، Database، `package.json` یا build system ندارد.

```text
Browser
  ├── index.html
  ├── assets/css/main.css
  ├── assets/js/main.js
  │     └── assets/js/main-legacy.js
  └── data/*.csv
```

- `index.html` ساختار رابط را فراهم می‌کند.
- `assets/css/main.css` ظاهر، responsive design، شمارهٔ عناصر، ظاهر Header/Footer و Themeهای جدول را مدیریت می‌کند.
- `assets/js/main.js` bootstrap، ساخت selector و اعمال/نگهداری Theme و background متحرک صفحه را مدیریت می‌کند.
- `assets/js/main-legacy.js` منطق runtime را نگه می‌دارد: زبان، بارگذاری CSV، ساخت جدول، شماره‌گذاری کارت‌های عناصر و نمایش اطلاعات انتخاب‌شده.
- داده‌ها مستقیماً با `fetch()` از CSVهای runtime بارگذاری می‌شوند.

## داده‌های runtime

منابع اصلی:

```text
data/PubChemElements_all.csv
data/ELEMENTS_118_ADVANCED.csv
data/ELEMENTS_118_VERY_ADVANCED.csv
```

کلید اصلی اتصال داده‌های عنصر `AtomicNumber` است. داده‌های advanced و very advanced پیش از نمایش با `normalizeDetailRow()` به نام‌گذاری مشترک تبدیل می‌شوند.

### وضعیت داده

- CSV پایه شامل ۱۱۸ عنصر و فیلدهای `AtomicNumber`, `Symbol`, `Name`, `NameFa` و مشخصات اصلی است.
- CSV پیشرفته با `atomic_number` به دادهٔ مشترک متصل می‌شود.
- CSV فوق‌پیشرفته علاوه بر مشخصات اصلی، `year_discovered` و `data_status` را نیز فراهم می‌کند.
- برای قابلیت شماره‌گذاری، هیچ دادهٔ علمی جدیدی به CSVها اضافه نشده است.

## زبان و جهت صفحه

رابط فارسی و انگلیسی دارد و با تغییر زبان، `lang` و `dir` سند بین `fa/rtl` و `en/ltr` تغییر می‌کند.

انتخاب زبان در `localStorage` با کلید زیر نگهداری می‌شود:

```text
chemistry-language
```

## شماره‌گذاری ۱۱۸ عنصر

قابلیت شماره‌گذاری عناصر اکنون در runtime پیاده‌سازی شده است.

مسیر اجرا:

```text
Element data
    ↓
AtomicNumber
    ↓
createElementCard(element)
    ↓
.element-number
```

هر کارت عنصر در `assets/js/main-legacy.js` شامل سه جزء اصلی است:

```text
Number → Symbol → Name
```

شماره مستقیماً از `element.AtomicNumber` گرفته می‌شود و به index آرایه وابسته نیست. جدول اصلی و f-block هر دو از همین مسیر مشترک استفاده می‌کنند؛ بنابراین هر ۱۱۸ عنصر منبع واحدی برای شماره دارد.

نمونه:

```text
1   — H   — Hydrogen / هیدروژن
26  — Fe  — Iron / آهن
79  — Au  — Gold / طلا
118 — Og  — Oganesson / اوگانسون
```

CSS مستقل این قابلیت:

```css
.element-number
```

است و در mobile نیز با اندازهٔ مناسب باقی می‌ماند.

> **نکته:** `README2.md` specification و وضعیت جزئیات شماره‌گذاری را به‌صورت مستقل مستند می‌کند. شماره‌های ۱ تا ۲۴ مربوط به اشیای عمومی صفحه در README2 در حال حاضر فقط شناسه‌های مستنداتی هستند؛ شمارهٔ قابل مشاهده برای خود این اشیای UI هنوز اجرا نشده است.

## selector دسته‌بندی PDF

جدول ۱۵ حالت رنگی دارد و فقط **یک selector** برای کنترل آن وجود دارد. گزینه‌ها در `main.js` تعریف می‌شوند و هنگام تغییر زبان، برچسب آن‌ها همگام می‌شود.

ترتیب فعلی:

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

در هر load یا refresh حالت **بدون دسته‌بندی** فعال می‌شود. شناسه‌های CSS `theme-pdf` و `theme-1 ... theme-15` حفظ شده‌اند.

## مسئولیت فایل‌های JavaScript

### `assets/js/main.js`

- منبع واحد تعریف ۱۵ Theme.
- ساخت و labelگذاری selector.
- اعمال Theme و نگهداری انتخاب در `localStorage`.
- همگام‌سازی labelهای selector با `documentElement.lang`.
- افزودن background متحرک orange-red با پشتیبانی از `prefers-reduced-motion`.
- بارگذاری `main-legacy.js`.

### `assets/js/main-legacy.js`

- ترجمهٔ فارسی/انگلیسی.
- بارگذاری سه CSV.
- parser مقاوم CSV با حذف BOM، اعتبارسنجی header و نادیده‌گرفتن ردیف‌های malformed.
- normalize کردن schema داده‌های advanced.
- mapping موقعیت ۱۸ گروه جدول.
- ساخت کارت عناصر و f-block.
- شماره‌گذاری کارت با `AtomicNumber`.
- نمایش اطلاعات عنصر در سه سطح دانشی.

`main-legacy.js` مالک ساخت selector یا تعریف Themeها نیست؛ این مسئولیت در `main.js` متمرکز شده است.

## CSS و responsive behavior

`assets/css/main.css` مسئول:

- layout اصلی و header/hero/footer؛
- ظاهر Header هماهنگ با Footer؛
- جدول ۱۸ گروهی و f-block؛
- کارت عناصر و `.element-number`؛
- بخش جزئیات سه‌سطحی؛
- ۱۵ Theme جدول؛
- responsive behavior برای موبایل؛
- پشتیبانی از `prefers-reduced-motion` در قواعد transition/scroll.

### قرارداد ظاهری Header

Header و Footer اکنون از رنگ زمینهٔ مشترک `#182033` استفاده می‌کنند تا در ظاهر سایت یکپارچگی ایجاد شود. برای حفظ خوانایی روی زمینهٔ تیره:

- متن اصلی Header از `#e9ecf5` استفاده می‌کند.
- متن ثانویه و ناوبری از `#aeb6c8` استفاده می‌کنند.
- حالت فعال انتخاب زبان با `#3346a8` مشخص می‌شود.
- خط جداکنندهٔ پایین Header با `#3b455c` با ساختار Footer هماهنگ است.
- این تغییر فقط در CSS انجام شده و ساختار HTML، منطق JavaScript و responsive behavior تغییر نکرده‌اند.

برای mobile، جدول با حداقل عرض داخلی و horizontal scrolling حفظ می‌شود تا ساختار ۱۸ ستونهٔ جدول خراب نشود.

## Accessibility و UX

- کارت عنصر `button` است و keyboard interaction را حفظ می‌کند.
- `aria-label` کارت شامل نام عنصر و عدد اتمی است.
- `table-status` با `role="status"` برای اعلام وضعیت استفاده می‌شود.
- شمارهٔ عنصر، Symbol و Name عناصر جداگانهٔ DOM هستند.
- RTL/LTR و زبان در runtime تغییر می‌کنند.
- Header تیره با متن روشن، لینک‌های ناوبری و کنترل زبان را با کنتراست مناسب از Footer هم‌راستا نگه می‌دارد.
- `prefers-reduced-motion` برای جلوگیری از انیمیشن‌های غیرضروری رعایت شده است.

## اجرای محلی

چون CSVها با `fetch()` بارگذاری می‌شوند، پروژه را با `file://` اجرا نکنید. از ریشهٔ repository اجرا کنید:

```bash
python -m http.server 8000
```

سپس:

```text
http://localhost:8000
```

## اعتبارسنجی و CI

Workflow اصلی در `.github/workflows/webpack.yml` با عنوان `Static site validation` اجرا می‌شود و این موارد را بررسی می‌کند:

1. وجود فایل‌های runtime.
2. syntax هر دو JavaScript با `node --check`.
3. header و تعداد ستون‌های هر سه CSV.
4. دسترسی HTTP به HTML، JavaScript و CSVهای runtime با smoke test.

آخرین اجرای workflow برای commit `e4067bc297f6791945acfeb3a99981a938874bd7` در GitHub Actions با وضعیت `completed / success` ثبت شده است.

## تغییرات و auditهای انجام‌شده

### JavaScript

- حذف ناخواستهٔ `periodicSubtitle` از DOM متوقف شد.
- مالکیت Theme و selector در `main.js` متمرکز شد.
- initializationهای تکراری Theme حذف شدند.
- migration قدیمی Themeهای `14/15` حذف شد.
- parser CSV مقاوم‌تر شد.
- fallbackهای داده با nullish coalescing اصلاح شدند.
- شمارهٔ واقعی عناصر با `AtomicNumber` در مسیر ساخت کارت اضافه/تأیید شد.

### CSS

- selectorهای بلااستفاده حذف شدند.
- قوانین تکراری level icon حذف شدند.
- `.element-number` به‌عنوان selector مستقل برای شمارهٔ عناصر حفظ و responsive شد.
- Themeهای PDF حفظ شدند.
- Header به رنگ و زبان بصری Footer هماهنگ شد، بدون تغییر ساختار DOM یا منطق runtime.

### GitHub Actions

- workflow قدیمی npm publishing حذف شده است؛ repository npm package نیست.
- validation استاتیک و smoke test تقویت شده‌اند.
- آخرین run قابل مشاهدهٔ CI موفق بوده است.

## قراردادهای مهم برای تغییرات آینده

- `AtomicNumber` تنها منبع شمارهٔ عنصر است.
- اطلاعات علمی عناصر نباید در HTML hard-code شوند.
- مسیر CSVها نسبت به ریشهٔ سایت تعریف شده است.
- CSVها منبع runtime هستند و تغییر schema آن‌ها نیازمند بازبینی `normalizeDetailRow()` است.
- پروژه عمداً بدون Backend، Database و build step نگه داشته شده است.
- تغییرات UI باید فارسی/انگلیسی، RTL/LTR و responsive behavior را حفظ کنند.
- برای تغییرات غیرمرتبط، معماری موجود نباید دستکاری شود.
- اگر شماره‌گذاری اشیای عمومی UI در آینده اجرا شود، نباید با `AtomicNumber` عناصر مخلوط شود و باید accessibility/i18n/responsive behavior آن جداگانه بررسی شود.
- Header و Footer باید در تغییرات آینده از قرارداد رنگی مشترک خود خارج نشوند، مگر با تصمیم طراحی جدید.

## وضعیت نهایی بازبینی

- [x] Repository و ساختار فایل‌ها بررسی شد.
- [x] README.md و README2.md بررسی و با وضعیت واقعی هماهنگ شدند.
- [x] ارتباط HTML، JS، CSS و CSVها بررسی شد.
- [x] نبود Backend/Database و static بودن معماری تأیید شد.
- [x] شماره‌گذاری ۱۱۸ عنصر از `AtomicNumber` تأیید شد.
- [x] f-block از همان مسیر ساخت کارت عنصر استفاده می‌کند.
- [x] CSVها برای شماره‌گذاری تغییر غیرضروری نکرده‌اند.
- [x] Header از نظر رنگ و ظاهر با Footer هماهنگ شد.
- [x] responsive behavior موجود حفظ شد.
- [x] workflow validation بررسی شد.
- [x] آخرین اجرای CI موفق (`success`) مشاهده شد.

---

## فایل مرجع دوم

برای specification و جزئیات قابلیت شماره‌گذاری، به `README2.md` مراجعه کنید. این فایل عمداً وضعیت واقعی پیاده‌سازی را از specification اولیه تفکیک می‌کند.
