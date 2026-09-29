# Chemistry

## وضعیت بررسی کد

این مخزن در شاخه `main` به‌صورت فایل‌های HTML/CSS/JavaScript و داده‌های JSON بررسی شده است. بررسی شامل ساختار پروژه، جریان اجرای صفحه، جدول تناوبی، جستجو، چندزبانه‌بودن، دسترسی‌پذیری، responsive، مدیریت خطا، performance و هم‌خوانی componentها با فایل ورودی است.

 > **دامنه بررسی:** فایل‌های `index.html`، `scripts/` و `styles/` و همچنین componentهای HTML که پیش از اصلاح در `components/` قرار داشتند بررسی شده‌اند. فایل‌های JSON به‌عنوان داده/پیکربندی بررسی شده‌اند، نه «کد اجرایی».  
> **تاریخ بررسی:** 2026-09-29  
> **شاخه:** `main`

## اولویت‌ها

- **P0 — بحرانی:** مانع اجرای اصلی یا باعث خرابی جدی قابلیت اصلی می‌شود.
- **P1 — بالا:** مشکل مهم در معماری، UX، accessibility، سازگاری یا نگهداری که باید در نزدیک‌ترین مرحله اصلاح شود.
- **P2 — متوسط:** مشکل قابل‌توجه ولی غیرمسدودکننده.
- **P3 — پایین:** بهبود کیفیت، مستندسازی یا polish.

## فهرست ایرادات

| # | اولویت | فایل/ناحیه | ایراد | اثر |
|---|---|---|---|---|
| 1 | P1 | `styles/periodic-table.css` | **حل شد:** wrapper جدول اکنون اسکرول افقی واقعی دارد و جدول حداقل عرض خوانا دارد. | — |
| 2 | P1 | `components/*` در برابر `index.html` | **حل شد:** componentهای HTML مستقل و stale حذف شدند و `index.html` به‌عنوان تنها source of truth markup باقی ماند. | — |
| 3 | P1 | `scripts/build-element-analysis.mjs` + `README.md` | مستندات از `data/analyzed/` و مدل تحلیل مشتق‌شده صحبت می‌کنند، ولی ساختار فعلی مخزن فایل فعال `data/elements-index.json` را در ریشه `data/` دارد و لایه `data/analyzed/` در وضعیت فعلی وجود ندارد. اسکریپت نیز خروجی جدیدی با schema متفاوت تولید می‌کند. | ابهام در منبع واقعی داده و خطر divergence بین داده runtime و داده تحلیل |
| 4 | P1 | `scripts/periodic-table.js` | کارت عنصر با `article role="button"` ساخته شده است. برای عنصر تعاملی، استفاده از `button` واقعی semantics و keyboard/accessibility بهتری دارد. | افزایش پیچیدگی accessibility و احتمال رفتار متفاوت screen readerها |
| 5 | P1 | `scripts/element-search.js` | الگوی ARIA جستجو ناقص است: `role="listbox"` و `role="option"` استفاده شده، اما navigation با ArrowUp/ArrowDown، مدیریت focus و `aria-activedescendant` پیاده‌سازی نشده و فقط اولین گزینه `aria-selected="false"` می‌گیرد. | جستجو برای keyboard و screen readerها تجربه ناقصی دارد |
| 6 | P1 | `scripts/periodic-table.js` + `styles/search-box.css` | پشتیبانی `prefers-reduced-motion` عملاً animation جاوااسکریپتی blink را متوقف نمی‌کند؛ CSS فقط `transition: none` تعیین کرده در حالی که تغییرات با `setTimeout` و class انجام می‌شوند. | عدم رعایت کامل نیاز کاربران حساس به حرکت |
| 7 | P2 | `scripts/periodic-table.js` | هر کلیک روی کارت سه timeout مستقل ایجاد می‌کند و کلیک‌های سریع می‌توانند sequenceهای قبلی را با sequence جدید تداخل دهند. | flicker، outline نهایی غیرقابل‌پیش‌بینی و هزینه اضافی timer |
| 8 | P2 | `scripts/element-data.js` | promise داده پس از reject شدن در `elementDataPromise` باقی می‌ماند؛ retry واقعی در همان session انجام نمی‌شود. | خطای موقت شبکه می‌تواند بارگذاری داده را برای ادامه session مسدود کند |
| 9 | P2 | `scripts/site-preferences.js` | مقدار `language` مستقیماً از `localStorage` خوانده می‌شود و قبل از fetch اعتبارسنجی نمی‌شود. مقدار نامعتبر باعث خطای 404 می‌شود. | تنظیمات خراب یا دستکاری‌شده باعث شکست بارگذاری locale می‌شود |
| 10 | P2 | `scripts/periodic-table.js` | جدول با `aria-live="polite"` روی container اصلی ۱۱۸ کارت را هنگام render در ناحیه live قرار می‌دهد. | ممکن است screen reader محتوای بسیار زیادی را announce کند |
| 11 | P2 | `index.html` | برای SEO پایه `meta description` و metadataهای مرتبط وجود ندارد؛ title نیز بسیار عمومی است. | discoverability و preview اشتراک‌گذاری ضعیف‌تر |
| 12 | P3 | کل پروژه | هیچ `package.json`، تست خودکار، lint/format configuration یا CI قابل مشاهده در ریشه مخزن وجود ندارد. | regressionها و خطاهای accessibility/JS/CSS به‌صورت خودکار کنترل نمی‌شوند |

## تحلیل جزئی‌تر

### 1. Responsive جدول — P1 — حل شد

در `styles/periodic-table.css`، wrapper جدول به `overflow-x: auto` تغییر کرده و جدول با یک حداقل عرض خوانا (`1120px`) از فشرده‌شدن ۱۸ ستون در نمایشگرهای کوچک جلوگیری می‌کند. اسکرول لمسی و `scrollbar-gutter` نیز در نظر گرفته شده است.

### 2. componentهای جدا از runtime — P1 — حل شد

فایل‌های HTML داخل `components/` با `index.html` همگام نبودند و هیچ‌کدام در runtime استفاده نمی‌شدند. این فایل‌های stale حذف شدند تا یک منبع حقیقت برای markup وجود داشته باشد. ساختار چندزبانه فعال نیز همان کلیدهای canonical موجود در `locales/fa.json` و `locales/en.json` را در `index.html` استفاده می‌کند.

### 3. مدل تحلیل داده — P1

`scripts/build-element-analysis.mjs` فایل‌های خام `ELEMENT_ATOMIC NUMBER_*.json` را می‌خواند و خروجی object شامل `schema_version` و `elements` تولید می‌کند. در مقابل، runtime از `data/elements-index.json` استفاده می‌کند که یک آرایه مستقیم از ۱۱۸ عنصر است.

این دو schema باید صریحاً از هم تفکیک یا یکی شوند؛ در غیر این صورت احتمال استفاده اشتباه از خروجی تحلیل به‌عنوان source runtime بالا می‌رود.

### 4. semantics کارت‌ها — P1

کارت‌ها با `article` ساخته شده‌اند ولی `role="button"` گرفته‌اند و سپس `tabIndex=0` و handler کیبورد اضافه شده است. این کار قابل اجراست، اما برای یک کنترل تعاملی ساده، `button` native رفتار استانداردتری برای focus و assistive technology فراهم می‌کند.

### 5. جستجو و ARIA — P1

ساختار نتیجه جستجو به سمت combobox/listbox رفته، اما چرخه کامل interaction پیاده نشده است. Enter و Escape پشتیبانی می‌شوند، ولی انتخاب با Arrow keys، focus management و selected state کامل نیست.

**راهکار:** یا یک combobox استاندارد کامل پیاده شود، یا ساختار ساده‌تر و semantic انتخاب شود تا ARIA اضافی بدون behavior متناظر باقی نماند.

### 6. Reduced Motion — P1

کد blink با `setTimeout` کلاس‌های visual را در سه مرحله اعمال می‌کند. media query مربوط به `prefers-reduced-motion` فقط transition را تغییر می‌دهد، اما transition اصلاً عامل animation اصلی نیست.

**راهکار:** قبل از اجرای blink، `matchMedia('(prefers-reduced-motion: reduce)'` بررسی شود یا animation با CSS و media query به‌صورت کامل کنترل شود.

### 7. مدیریت timerهای blink — P2

هر اجرای `blinkElementCard` سه timer و یک timer نهایی ایجاد می‌کند. اگر کاربر چند بار سریع کلیک کند، timerهای اجرای قبلی لغو نمی‌شوند.

**راهکار:** یک animation state یا timeout reference برای هر کارت نگهداری و قبل از اجرای sequence جدید پاک شود.

### 8. retry داده — P2

`getElementData()` از یک promise cache استفاده می‌کند که تصمیم خوبی برای جلوگیری از fetch تکراری است؛ اما promise rejected نیز cache می‌شود.

**راهکار:** در `catch`، cache به `undefined` برگردانده شود تا retry کنترل‌شده ممکن باشد.

### 9. اعتبارسنجی locale — P2

`localStorage.getItem("language")` بدون whitelist بررسی می‌شود.

**راهکار:** فقط `fa` و `en` مجاز باشند و در غیر این صورت مقدار پیش‌فرض `fa` انتخاب شود.

### 10. live region جدول — P2

کل جدول ۱۱۸ عنصر داخل عنصر دارای `aria-live="polite"` است. برای چنین محتوای بزرگی live announcement مناسب نیست.

**راهکار:** live region کوچک و اختصاصی برای status بارگذاری/انتخاب عنصر ایجاد شود.

### 11. SEO — P2

`index.html` فقط title عمومی `Chemistry` دارد. description و metadataهای پایه برای موتور جستجو و اشتراک‌گذاری وجود ندارد.

### 12. نبود ابزار کیفیت خودکار — P3

پروژه فاقد package manager metadata و pipeline قابل مشاهده برای lint، format، test یا validation است.

**راهکار:** حداقل validation مربوط به JSON، JavaScript syntax، accessibility smoke test و build/check در CI اضافه شود.

## موارد مثبت مشاهده‌شده

1. داده‌های ۱۱۸ عنصر در runtime از یک منبع مشترک خوانده می‌شوند و fetch با promise cache از درخواست تکراری جلوگیری می‌کند.
2. برای خروجی HTML از `textContent` استفاده شده و در بخش‌های بررسی‌شده injection مستقیم با `innerHTML` دیده نشد.
3. چیدمان جدول ۱۸ گروه را صریحاً مدل کرده و f-block را جداگانه در ردیف‌های ۹ و ۱۰ قرار می‌دهد.
4. نام فارسی/انگلیسی کارت‌ها از dataset نگهداری می‌شود و با تغییر زبان دوباره render کامل داده لازم نیست.
5. برای keyboard روی کارت‌ها Enter و Space در نظر گرفته شده است.
6. ساختار locale مرکزی و پشتیبانی RTL/LTR از ابتدا در معماری لحاظ شده است.

## وضعیت فعلی

- **Runtime data index:** `data/elements-index.json`
- **تعداد عناصر runtime:** ۱۱۸
- **زبان‌ها:** `fa` و `en`
- **بخش جدول:** `scripts/periodic-table.js` + `styles/periodic-table.css`
- **جستجو:** `scripts/element-search.js`
- **تنظیمات زبان/تم:** `scripts/site-preferences.js`
- **تست/CI:** در ریشه مخزن مورد قابل مشاهده‌ای وجود ندارد.
- **وضعیت اصلاح:** موارد 1 و 2 اصلاح شده‌اند؛ اولویت بعدی بررسی موارد 3 تا 6 است.

## ساختار چندزبانه

سیستم زبان سایت به‌صورت متمرکز مدیریت می‌شود و در حال حاضر از فارسی (`fa`) و انگلیسی (`en`) پشتیبانی می‌کند.

### فایل‌های زبان

- `locales/fa.json` — تمام متن‌ها و برچسب‌های فارسی رابط کاربری.
- `locales/en.json` — تمام متن‌ها و برچسب‌های انگلیسی رابط کاربری.
- `scripts/site-preferences.js` — بارگذاری و اعمال فایل زبان، تغییر جهت `RTL/LTR` و ذخیره زبان انتخاب‌شده در `localStorage`.

برای اضافه‌کردن متن جدید به سایت، کلید متن باید در هر دو فایل locale تعریف شود و سپس در HTML با `data-i18n` استفاده شود. برای برچسب‌های دسترسی نیز از `data-i18n-aria-label` استفاده شود.

## جدول تناوبی

باکس بعد از جستجو به‌عنوان جدول تناوبی عناصر استفاده می‌شود و ساختار آن بر اساس چیدمان استاندارد ۱۸ گروه و ۷ دوره پیاده‌سازی شده است.

- `data/elements-index.json` — منبع runtime شامل ۱۱۸ عنصر با عدد اتمی، نماد، نام انگلیسی و نام فارسی.
- `scripts/periodic-table.js` — ساخت کارت‌های ۱۱۸ عنصر، جایگذاری در گروه/دوره صحیح، مدیریت لانتانیدها و اکتینیدها و تعویض نام فارسی/انگلیسی.
- `styles/periodic-table.css` — چیدمان واکنش‌گرا، رنگ‌بندی دسته‌های عناصر، کارت‌ها و حالت تاریک جدول.
- جدول از نظر ساختار شیمیایی همیشه `LTR` است تا ترتیب گروه‌ها و نمادهای عناصر ثابت بماند؛ نام عنصر بر اساس زبان صفحه تغییر می‌کند.

> **وضعیت:** اسکرول افقی موبایل در ایراد شماره 1 اصلاح شده است.

## داده عناصر

پوشه `data/` شامل فایل‌های JSON مستقل عناصر و فایل index runtime است.

### لایه تحلیل داده

`scripts/build-element-analysis.mjs` یک لایه مشتق‌شده برای تحلیل فایل‌های خام عناصر تولید می‌کند. خروجی این اسکریپت با index runtime یکسان نیست و باید به‌صورت مستقل و صریح مستندسازی/مدیریت شود؛ این موضوع در ایراد شماره 3 ثبت شده است.

اجرای تحلیل از ریشه پروژه:

```bash
node scripts/build-element-analysis.mjs
```

اسکریپت در صورتی که دقیقاً ۱۱۸ فایل عنصر پیدا نکند متوقف می‌شود تا از ناقص‌شدن index جلوگیری شود.

## ساختار فعلی

- `index.html` — نقطه ورود صفحه و اتصال قابلیت‌ها.
- `index.html` — تنها منبع markup صفحه؛ componentهای HTML stale حذف شده‌اند تا duplication ایجاد نشود.
- `styles/` — فایل‌های CSS تفکیک‌شده برای قابلیت‌ها و قوانین RTL/LTR.
- `scripts/` — منطق تعاملی، تنظیمات سایت و ابزار تحلیل داده.
- `locales/` — فرهنگ لغات زبان‌های پشتیبانی‌شده.
- `data/` — داده خام عناصر و index runtime.

## استاندارد زبان

- فارسی و عربی با جهت `RTL` نمایش داده می‌شوند.
- انگلیسی با جهت `LTR` نمایش داده می‌شود.
- متن‌های ترکیبی از قوانین دوطرفه (`bidi`) استفاده می‌کنند.
- زبان انتخاب‌شده در مرورگر ذخیره می‌شود و در مراجعه بعدی حفظ خواهد شد.
