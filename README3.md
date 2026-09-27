# Chemistry — برنامهٔ مرحله‌ای Refactor معماری Component-Based

> **وضعیت سند:** مراحل ۱ تا ۵ تکمیل شده‌اند؛ مرحله ۶ منتظر تأیید کاربر است.
> **هدف:** تبدیل تدریجی پروژه به معماری Component-Based با حفظ رفتار، داده‌ها، ظاهر، accessibility و قراردادهای runtime.
> **قانون:** هر مرحله جداگانه اجرا و گزارش می‌شود و مرحله بعد فقط با تأیید کاربر شروع می‌شود.

---

## 1. اصول غیرقابل‌تغییر

1. CSVهای علمی در refactor تغییر نمی‌کنند.
2. `AtomicNumber` کلید اصلی اتصال داده‌ها باقی می‌ماند.
3. ۱۱۸ عنصر، f-block و layout هجده‌گروهی حفظ می‌شوند.
4. سه سطح `beginner`، `advanced` و `very-advanced` حفظ می‌شوند.
5. فارسی/انگلیسی و RTL/LTR حفظ می‌شوند.
6. کلیدهای `chemistry-language` و `chemistry-pdf-theme` حفظ می‌شوند.
7. ظاهر و responsive behavior بدون دلیل تغییر نمی‌کنند.
8. accessibility و keyboard interaction حفظ می‌شوند.
9. پروژه static client-side باقی می‌ماند.
10. `data/Elements/` بدون تصمیم مستقل حذف نمی‌شود.
11. هیچ مرحله‌ای بدون گزارش و تأیید وارد مرحله بعد نمی‌شود.

---

# 2. معماری هدف

```text
index.html
   └── Page Composition

assets/js/
├── main.js
├── main-legacy.js
├── core/
│   ├── i18n.js
│   └── data.js
└── components/
    ├── header/
    │   └── header.js
    ├── hero/
    │   └── hero.js
    ├── periodic-table/
    ├── element-details/
    └── footer/
```

Core مالک منطق مشترک است و Componentها مصرف‌کننده Core هستند؛ Core نباید به implementation داخلی Componentها وابسته شود.

---

# 3. مراحل انجام‌شده

## مرحله 1 — تثبیت وضعیت فعلی و Baseline

**وضعیت: ✓ تکمیل‌شده**

Repository، runtime، CSVها، CI، IDها، selectorها، eventها، stateها و localStorage keyها بررسی و ثبت شدند. تداخل animation انتخاب عنصر و وجود `data/Elements/` نیز به‌عنوان نقاط حساس ثبت شد.

در این مرحله هیچ کد اجرایی تغییر نکرد.

---

## مرحله 2 — تعریف مرزهای Component و Core

**وضعیت: ✓ تکمیل‌شده**

مالکیت منطقی Header، Hero، Periodic Table، Element Details، Footer، Shared Core و Theme System مشخص شد.

Theme System مستقل باقی ماند و فقط با `.table-shell` و زبان سند ارتباط دارد.

---

## مرحله 3 — استخراج Shared Core

**وضعیت: ✓ تکمیل‌شده**

دو ماژول ایجاد شدند:

### `assets/js/core/i18n.js`

مسئول dictionaryها، ترجمه DOM، نام عنصر، زبان سند، RTL/LTR، دکمه‌های زبان و `chemistry-language` است.

### `assets/js/core/data.js`

مسئول مسیر CSVها، parser، fetch، normalization و `loadElementData()` است.

`main-legacy.js` دیگر مالک parser/fetch/normalization و dictionary نیست.

---

## مرحله 4 — جداسازی Header

**وضعیت: ✓ تکمیل‌شده**

فایل جدید:

```text
assets/js/components/header/header.js
```

مسئولیت Component:

- پیدا کردن کنترل‌های زبان داخل Header.
- جلوگیری از bind شدن دوبارهٔ همان دکمه‌ها.
- انتشار رویداد `chemistry:language-change`.

`main-legacy.js` دیگر listener مستقیم روی `.language-button` ندارد و تغییر زبان را از قرارداد رویداد Header دریافت می‌کند.

Markup فعلی Header عمداً فعلاً در `index.html` باقی مانده است تا در مرحلهٔ Composition نهایی جابه‌جایی DOM بدون duplicate یا تغییر ترتیب بارگذاری انجام شود. تفکیک فیزیکی markup و CSS در مراحل ۹ و ۱۱ تکمیل خواهد شد.

---

## مرحله 5 — جداسازی Hero

**وضعیت: ✓ تکمیل‌شده**

فایل جدید:

```text
assets/js/components/hero/hero.js
```

این Component قرارداد Hero را به‌صورت مستقل mount می‌کند و وجود لینک اصلی `#periodic-table` را بررسی می‌کند.

Hero منطق داده، جدول یا i18n مستقل ندارد و متن‌های آن همچنان از `data-i18n` و Core i18n استفاده می‌کنند.

Markup Hero فعلاً در `index.html` به‌عنوان Composition Layer باقی مانده و CSS آن هنوز در stylesheet اصلی است. تفکیک فیزیکی CSS در مرحله ۹ و تبدیل `index.html` به Composition Layer در مرحله ۱۱ انجام می‌شود.

---

# 4. تغییرات فنی مراحل ۴ و ۵

### `main.js`

Bootstrap اکنون ابتدا Componentهای Header و Hero را load/mount می‌کند و سپس runtime داده‌ای را اجرا می‌کند:

```text
main.js
   ↓
header.js + hero.js
   ↓
main-legacy.js
```

### `main-legacy.js`

اتصال مستقیم click به دکمه‌های زبان حذف شد و به event زیر منتقل شد:

```text
chemistry:language-change
```

منطق اصلی `setLanguage()` همچنان در Core i18n باقی مانده است.

### عمداً تغییر نکرد

- CSVها و داده‌های علمی
- Themeها
- animation انتخاب عنصر
- layout جدول
- Element Details
- Footer
- کلیدهای localStorage

---

# 5. ساختار فعلی

```text
assets/js/
├── main.js
├── main-legacy.js
├── core/
│   ├── i18n.js
│   └── data.js
└── components/
    ├── header/
    │   └── header.js
    └── hero/
        └── hero.js
```

---

# 6. مراحل باقی‌مانده

## مرحله 6 — جداسازی Periodic Table

**اولویت: بسیار بالا — منتظر تأیید**

انتقال `renderPeriodicTable()`، `createElementCard()`، `createFRow()`، mapping موقعیت‌ها، status و selection behavior به Component اختصاصی جدول.

Data Layer و i18n داخل Component کپی نمی‌شوند و فقط از Core مصرف می‌شوند.

## مرحله 7 — جداسازی Element Details

**اولویت: بسیار بالا**

انتقال rendering سه سطح جزئیات و تبدیل ارتباط مستقیم جدول → جزئیات به قرارداد مشخص selected element.

## مرحله 8 — جداسازی Footer

**اولویت: متوسط**

Footer به Component مستقل تبدیل می‌شود.

## مرحله 9 — تفکیک CSS

**اولویت: بالا**

Global styles و styles اختصاصی Componentها جدا می‌شوند و تعریف‌های تکراری animation نیز بررسی می‌شوند.

## مرحله 10 — تعیین مالک نهایی Theme و Selection Animation

**اولویت: بالا**

برای `.element.selected-flash` یک مالک نهایی تعیین می‌شود و تعریف‌های متناقض حذف می‌شوند، بدون تغییر رفتار مگر با تأیید.

## مرحله 11 — تبدیل `index.html` به Composition Layer

**اولویت: بالا**

پس از آماده شدن Componentها، markup اختصاصی Componentها از `index.html` به ساختار Component منتقل می‌شود و `index.html` عمدتاً shell ترکیب‌کننده خواهد بود.

## مرحله 12 — پاک‌سازی `main.js` و `main-legacy.js`

**اولویت: بالا**

کدهای منتقل‌شده حذف و bootstrap نهایی ساده می‌شود.

## مرحله 13 — بررسی `data/Elements/`

**اولویت: پایین و مستقل**

۱۱۸ فایل CSV بدون مصرف runtime بررسی می‌شوند؛ حذف فقط با تصمیم جداگانه مجاز است.

## مرحله 14 — Validation و مستندسازی نهایی

**اولویت: نهایی**

CI، syntax، data flow، runtime، responsive، accessibility، dependencyها و مستندات نهایی بررسی می‌شوند.

---

# 7. قانون گزارش‌دهی

بعد از هر مرحله گزارش شامل این موارد است:

1. شماره و عنوان مرحله.
2. فایل‌های ایجاد/تغییر/حذف‌شده.
3. مسئولیت‌های منتقل‌شده.
4. تست‌ها و validationهای انجام‌شده.
5. اختلاف با baseline.
6. commit مربوط به مرحله.
7. وضعیت مرحله بعد.

---

# 8. وضعیت فعلی

```text
[✓] 1 — Baseline
[✓] 2 — Component/Core boundaries
[✓] 3 — Shared Core
[✓] 4 — Header
[✓] 5 — Hero
[ ] 6 — Periodic Table — منتظر تأیید
[ ] 7 — Element Details
[ ] 8 — Footer
[ ] 9 — CSS separation
[ ] 10 — Theme / Selection ownership
[ ] 11 — index composition
[ ] 12 — main cleanup
[ ] 13 — orphan data review
[ ] 14 — final validation
```
