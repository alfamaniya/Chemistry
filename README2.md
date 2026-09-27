# README2 — شماره‌گذاری و توضیح اشیای صفحه اصلی

## وضعیت سند

این سند specification اولیهٔ قابلیت شماره‌گذاری بود و اکنون به مستندات وضعیت واقعی پیاده‌سازی تبدیل شده است.

- شماره‌گذاری هر ۱۱۸ عنصر جدول تناوبی **پیاده‌سازی شده است**.
- شمارهٔ هر عنصر مستقیماً از `AtomicNumber` دادهٔ runtime گرفته می‌شود.
- شماره‌گذاری اشیای عمومی UI (Header، Hero، کنترل‌ها و بخش‌های صفحه) در DOM به‌صورت شمارهٔ قابل مشاهده **هنوز پیاده‌سازی نشده است**؛ شماره‌های ۱ تا ۲۴ در این سند فقط شناسه‌های مستنداتی هستند.
- اطلاعات علمی عناصر از CSVهای runtime می‌آیند و برای ۱۱۸ عنصر در HTML به‌صورت دستی تکرار نشده‌اند.

## 1. اصول شماره‌گذاری

- شمارهٔ عنصر یکتا و قابل تشخیص است.
- شمارهٔ عنصر دقیقاً برابر `AtomicNumber` همان رکورد داده است.
- شماره از index آرایه محاسبه نمی‌شود.
- تغییر زبان فارسی/انگلیسی شماره را حذف یا تغییر نمی‌دهد.
- شماره در desktop، tablet، mobile، بلوک f و Themeهای موجود حفظ می‌شود.

## 2. اشیای اصلی صفحه

### 2.1 — Header

اشیای مستندشده: لوگو/هویت سایت، نام سایت، شعار، لینک جدول، لینک سطوح، لینک درباره، کنترل فارسی و کنترل English.

**وضعیت:** شمارهٔ قابل مشاهده برای این اشیا وجود ندارد؛ شماره‌های این بخش صرفاً مستنداتی‌اند.

### 2.2 — Hero

اشیای مستندشده: برچسب `CHEMISTRY • ELEMENTS`، عنوان اصلی، متن معرفی و دکمهٔ مشاهده جدول.

**وضعیت:** شمارهٔ قابل مشاهده برای این اشیا وجود ندارد؛ شماره‌های این بخش صرفاً مستنداتی‌اند.

### 2.3 — جدول تناوبی

اشیای مستندشده: عنوان جدول، توضیح جدول، کنترل Theme، توضیح Theme، شبکه `periodic-table-grid`، بلوک `f-block` و `table-status`.

شناسه‌های مهم فعلی که باید حفظ شوند:

```text
periodic-table-grid
f-block
table-status
selected-element
beginner-info
advanced-info
very-advanced-info
```

**وضعیت:** شمارهٔ مستقل برای این اشیای UI وجود ندارد؛ اما تمام کارت‌های عنصر در شبکه و f-block شمارهٔ واقعی عنصر را نمایش می‌دهند.

### 2.4 — جزئیات عنصر

اشیای مستندشده: عنوان جزئیات، `selected-element`، سطح Beginner، سطح Advanced و سطح Very Advanced.

**وضعیت:** شمارهٔ جداگانه برای این بلوک‌ها وجود ندارد؛ دادهٔ `AtomicNumber` در اطلاعات عنصر انتخاب‌شده نمایش داده می‌شود.

## 3. شماره‌گذاری ۱۱۸ عنصر — پیاده‌سازی واقعی

هر کارت عنصر توسط `createElementCard(element)` در `assets/js/main-legacy.js` ساخته می‌شود.

مسیر داده به UI:

```text
CSV runtime
    ↓
Element object
    ↓
AtomicNumber
    ↓
createElementCard(element)
    ↓
.element-number
```

نمونه:

```text
1   — H   — Hydrogen / هیدروژن
2   — He  — Helium / هلیوم
6   — C   — Carbon / کربن
8   — O   — Oxygen / اکسیژن
26  — Fe  — Iron / آهن
79  — Au  — Gold / طلا
118 — Og  — Oganesson / اوگانسون
```

در کد، مقدار `.element-number` مستقیماً از `element.AtomicNumber` ساخته می‌شود. بنابراین ترتیب آرایه، تغییر زبان یا تغییر Theme منبع شماره نیست.

## 4. توضیح هر عنصر

هر کارت عنصر حداقل این اطلاعات را دارد:

1. **Atomic Number** — شناسهٔ یکتای عنصر.
2. **Symbol** — نماد شیمیایی.
3. **Name** — نام عنصر با پشتیبانی فارسی و انگلیسی.
4. **Detail** — اطلاعات عنصر پس از انتخاب.

اطلاعات کارت از داده‌های runtime گرفته می‌شوند و برای هر عنصر در HTML hard-code نشده‌اند.

## 5. مدل شیء عنصر

```text
Element Object
├── AtomicNumber
├── Symbol
├── Name / NameFa
├── Position / Group / Period
├── Classification / GroupBlock
└── Detail Data
```

## 6. منبع داده

منابع runtime فعلی:

```text
data/PubChemElements_all.csv
data/ELEMENTS_118_ADVANCED.csv
data/ELEMENTS_118_VERY_ADVANCED.csv
```

کلید اتصال داده‌های عنصر `AtomicNumber` است. در داده‌های advanced و very advanced، `atomic_number` توسط `normalizeDetailRow()` به `AtomicNumber` نرمال می‌شود.

## 7. الزام JavaScript و وضعیت اجرا

`renderPeriodicTable()` برای جدول اصلی و `createFRow()` برای f-block هر دو از `createElementCard()` استفاده می‌کنند؛ بنابراین شماره‌گذاری در یک مسیر مشترک انجام می‌شود.

## 8. الزام CSS و وضعیت اجرا

selector مستقل شمارهٔ عنصر در `assets/css/main.css` وجود دارد:

```css
.element-number
```

این selector:

- با RTL/LTR سازگار است؛
- در mobile responsive است؛
- layout جدول را خراب نمی‌کند؛
- با Symbol و Name هم‌پوشانی ندارد؛
- در Themeهای جدول باقی می‌ماند.

### 8.1 — هماهنگی ظاهری Header با Footer

ظاهر Header در CSS با Footer هم‌راستا شده است:

```text
Header background = #182033
Footer background = #182033
```

برای Header:

- متن اصلی از `#e9ecf5` استفاده می‌کند.
- متن ثانویه و ناوبری از `#aeb6c8` استفاده می‌کنند.
- زبان فعال با زمینهٔ `#3346a8` مشخص می‌شود.
- خط پایینی Header از `#3b455c` استفاده می‌کند.

این تغییر صرفاً styling است و شناسه‌های HTML، منطق ترجمه، selector جدول و rendering عناصر را تغییر نمی‌دهد.

## 9. Accessibility و UX

- کارت عنصر یک `button` واقعی است و keyboard interaction را حفظ می‌کند.
- `aria-label` کارت شامل نام عنصر، عدد اتمی و توضیح عدد اتمی است.
- شماره با hover/focus پنهان نمی‌شود.
- شماره در mobile باقی می‌ماند.
- شماره، Symbol و Name عناصر جداگانهٔ DOM هستند.
- Header تیره با متن روشن و کنترل زبان همچنان برای RTL/LTR و mobile قابل استفاده است.

## 10. کنترل نهایی پس از پیاده‌سازی

- [x] شمارهٔ کارت از `AtomicNumber` همان عنصر گرفته می‌شود.
- [x] شماره از index آرایه محاسبه نمی‌شود.
- [x] selector مستقل `.element-number` وجود دارد.
- [x] بلوک f از همان مسیر `createElementCard()` استفاده می‌کند.
- [x] شماره‌ها با تغییر زبان حفظ می‌شوند.
- [x] شماره‌ها با Themeهای موجود حفظ می‌شوند.
- [x] responsive CSS برای mobile وجود دارد.
- [x] Header و Footer از رنگ زمینهٔ مشترک استفاده می‌کنند.
- [x] انتخاب عنصر و بخش جزئیات حفظ شده است.
- [x] CSVها برای این قابلیت تغییر غیرضروری نکرده‌اند.
- [x] دادهٔ علمی جدید به‌صورت hard-code وارد HTML نشده است.
- [x] workflow پروژه syntax JavaScript و ساختار CSVهای runtime را validate می‌کند.
- [x] آخرین اجرای workflow قبلی `Static site validation` برای commit `e4067bc297f6791945acfeb3a99981a938874bd7` با نتیجه `success` ثبت شده است.

## 11. موارد باقی‌مانده

- [ ] در صورت تصمیم قطعی محصول، شمارهٔ قابل مشاهده برای اشیای عمومی UI نیز اضافه شود.
- [ ] در صورت اجرای آن بخش، accessibility، responsive layout و i18n شماره‌های UI جداگانه تست شوند.

## 12. محدودیت تغییرات

هماهنگ‌سازی ظاهر Header با Footer با کمترین تغییر در معماری فعلی انجام شده است. تغییر فقط در `assets/css/main.css` اعمال شده و داده‌های CSV، مسیر بارگذاری، rendering فعلی، منطق JavaScript و معماری static client-side حفظ شده‌اند. Backend، Database یا build system جدیدی اضافه نشده است.
