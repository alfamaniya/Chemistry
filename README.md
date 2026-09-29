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
| 3 | P1 | `scripts/build-element-analysis.mjs` + `README.md` | **حل شد:** خروجی تحلیل اکنون با نام و schema مستقل `data/analyzed/elements-analysis.json` تولید می‌شود و `data/elements-index.json` صراحتاً فقط source runtime است. | — |
| 4 | P1 | `scripts/periodic-table.js` | **حل شد:** کارت‌های عنصر با native `<button type="button">` ساخته می‌شوند. | — |
| 5 | P1 | `scripts/element-search.js` | **حل شد:** combobox/listbox اکنون `aria-expanded`، `aria-activedescendant`، `aria-selected` و navigation با Arrow/Home/End/Escape/Enter را مدیریت می‌کند. | — |
| 6 | P1 | `scripts/periodic-table.js` + `styles/search-box.css` | **حل شد:** قبل از اجرای blink وضعیت `prefers-reduced-motion` بررسی می‌شود و در حالت reduce هیچ sequence جاوااسکریپتی اجرا نمی‌شود؛ اسکرول جستجو نیز در این حالت بدون smooth animation است. | — |
| 7 | P2 | `scripts/periodic-table.js` | **حل شد:** timerهای هر کارت در `WeakMap` نگهداری و قبل از sequence جدید پاک می‌شوند. | — |
| 8 | P2 | `scripts/element-data.js` | **حل شد:** پس از reject شدن promise، cache پاک می‌شود تا درخواست بعدی امکان retry داشته باشد. | — |
| 9 | P2 | `scripts/site-preferences.js` | **حل شد:** زبان ذخیره‌شده فقط در whitelist `fa`/`en` پذیرفته می‌شود و مقدار نامعتبر به `fa` برمی‌گردد. | — |
| 10 | P2 | `index.html` + `scripts/periodic-table.js` | **حل شد:** live region از container ۱۱۸ کارت جدا و به status کوچک اختصاصی منتقل شد. | — |
| 11 | P2 | `index.html` | **حل شد:** description، theme-color، Open Graph metadata و title معنادار اضافه شد و title با localeها همگام است. | — |
| 12 | P3 | کل پروژه | **حل شد:** `package.json`، validation بدون dependency و GitHub Actions برای syntax/JSON/i18n/runtime-data checks اضافه شد. | — |

## تحلیل جزئی‌تر

### 1. Responsive جدول — P1 — حل شد

در `styles/periodic-table.css`، wrapper جدول به `overflow-x: auto` تغییر کرده و جدول با یک حداقل عرض خوانا (`1120px`) از فشرده‌شدن ۱۸ ستون در نمایشگرهای کوچک جلوگیری می‌کند. اسکرول لمسی و `scrollbar-gutter` نیز در نظر گرفته شده است.

### 2. componentهای جدا از runtime — P1 — حل شد

فایل‌های HTML داخل `components/` با `index.html` همگام نبودند و هیچ‌کدام در runtime استفاده نمی‌شدند. این فایل‌های stale حذف شدند تا یک منبع حقیقت برای markup وجود داشته باشد. ساختار چندزبانه فعال نیز همان کلیدهای canonical موجود در `locales/fa.json` و `locales/en.json` را در `index.html` استفاده می‌کند.

### 3. مدل تحلیل داده — P1 — حل شد

`scripts/build-element-analysis.mjs` فایل‌های خام `ELEMENT_ATOMIC NUMBER_*.json` را می‌خواند و خروجی object شامل `schema_version` و `elements` تولید می‌کند. در مقابل، runtime از `data/elements-index.json` استفاده می‌کند که یک آرایه مستقیم از ۱۱۸ عنصر است.

اکنون این دو لایه صریحاً جدا هستند: `data/elements-index.json` منبع runtime است و `data/analyzed/elements-analysis.json` خروجی مشتق‌شده تحلیل است.

### 4. semantics کارت‌ها — P1 — حل شد

کارت‌ها با `article` ساخته شده‌اند ولی `role="button"` گرفته‌اند و سپس `tabIndex=0` و handler کیبورد اضافه شده است. این کار قابل اجراست، اما برای یک کنترل تعاملی ساده، `button` native رفتار استانداردتری برای focus و assistive technology فراهم می‌کند.

### 5. جستجو و ARIA — P1 — حل شد

ساختار نتیجه جستجو به سمت combobox/listbox رفته، اما چرخه کامل interaction پیاده نشده است. Enter و Escape پشتیبانی می‌شوند، ولی انتخاب با Arrow keys، focus management و selected state کامل نیست.

**نتیجه:** یک combobox/listbox کامل با keyboard navigation و active descendant پیاده‌سازی شده است.

### 6. Reduced Motion — P1 — حل شد

کد blink با `setTimeout` کلاس‌های visual را در سه مرحله اعمال می‌کند. media query مربوط به `prefers-reduced-motion` فقط transition را تغییر می‌دهد، اما transition اصلاً عامل animation اصلی نیست.

**نتیجه:** blink در حالت reduced motion اصلاً اجرا نمی‌شود.

### 7. مدیریت timerهای blink — P2 — حل شد

هر اجرای `blinkElementCard` سه timer و یک timer نهایی ایجاد می‌کند. اگر کاربر چند بار سریع کلیک کند، timerهای اجرای قبلی لغو نمی‌شوند.

**نتیجه:** timeoutهای هر کارت با `WeakMap` مدیریت می‌شوند.

### 8. retry داده — P2 — حل شد

`getElementData()` از یک promise cache استفاده می‌کند که تصمیم خوبی برای جلوگیری از fetch تکراری است؛ اما promise rejected نیز cache می‌شود.

**نتیجه:** cache در زمان خطا reset می‌شود.

### 9. اعتبارسنجی locale — P2 — حل شد

`localStorage.getItem("language")` بدون whitelist بررسی می‌شود.

**نتیجه:** whitelist زبان‌ها در runtime اعمال می‌شود.

### 10. live region جدول — P2 — حل شد

کل جدول ۱۱۸ عنصر داخل عنصر دارای `aria-live="polite"` است. برای چنین محتوای بزرگی live announcement مناسب نیست.

**نتیجه:** status مستقل از grid 118 کارت قرار گرفته است.

### 11. SEO — P2 — حل شد

`index.html` اکنون description، theme-color، Open Graph metadata و title معنادار دارد.

### 12. نبود ابزار کیفیت خودکار — P3 — حل شد

پروژه اکنون `package.json` و validation بدون dependency دارد و GitHub Actions در push/PR اجرا می‌شود. validation شامل JSON، ترتیب ۱۱۸ عنصر، parity کلیدهای locale، ساختار live region و syntax همه اسکریپت‌هاست.

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
- **تست/CI:** `npm run check` + GitHub Actions (`.github/workflows/quality.yml`).
- **وضعیت اصلاح:** هر ۱۲ ایراد ثبت‌شده در این audit اصلاح شده‌اند.

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

`scripts/build-element-analysis.mjs` فقط خروجی مشتق‌شده `data/analyzed/elements-analysis.json` را تولید می‌کند. این فایل با `data/elements-index.json` که source runtime است متفاوت و صریحاً نام‌گذاری شده است.

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
