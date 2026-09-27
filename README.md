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
