# Chemistry — برنامهٔ مرحله‌ای Refactor معماری Component-Based

> **وضعیت سند:** مراحل ۱ تا ۹ تکمیل شده‌اند.
> **هدف:** تبدیل تدریجی پروژه به معماری Component-Based با حفظ رفتار، داده‌ها، ظاهر، accessibility و قراردادهای runtime.
> **قانون:** هر مرحله جداگانه اجرا و گزارش می‌شود؛ طبق درخواست فعلی، مراحل ۷ تا ۹ به‌صورت یک بسته انجام شدند.

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
11. مالکیت CSS و JS باید به Component مربوطه نزدیک باشد، اما انتقال تدریجی است تا runtime نشکند.

---

# 2. معماری هدف

```text
index.html
   └── Page Composition

assets/
├── css/
│   ├── main.css                 # global + legacy theme styles during migration
│   └── components/
│       ├── header.css
│       ├── hero.css
│       ├── periodic-table.css
│       ├── element-details.css
│       └── footer.css
└── js/
    ├── main.js
    ├── main-legacy.js           # orchestration during migration
    ├── core/
    │   ├── i18n.js
    │   └── data.js
    └── components/
        ├── header/header.js
        ├── hero/hero.js
        ├── periodic-table/periodic-table.js
        ├── element-details/element-details.js
        └── footer/footer.js
```

Core مالک منطق مشترک است و Componentها مصرف‌کننده Core هستند؛ Core نباید به implementation داخلی Componentها وابسته شود.

---

# 3. مراحل انجام‌شده

## مرحله 1 — تثبیت وضعیت فعلی و Baseline

**وضعیت: ✓ تکمیل‌شده**

Repository، runtime، CSVها، CI، IDها، selectorها، eventها، stateها و localStorage keyها بررسی و ثبت شدند. تداخل animation انتخاب عنصر و وجود `data/Elements/` نیز به‌عنوان نقاط حساس ثبت شد.

## مرحله 2 — تعریف مرزهای Component و Core

**وضعیت: ✓ تکمیل‌شده**

مالکیت منطقی Header، Hero، Periodic Table، Element Details، Footer، Shared Core و Theme System مشخص شد.

## مرحله 3 — استخراج Shared Core

**وضعیت: ✓ تکمیل‌شده**

`assets/js/core/i18n.js` مسئول dictionary و زبان و `assets/js/core/data.js` مسئول CSV parser/fetch/normalization و `loadElementData()` شدند.

## مرحله 4 — جداسازی Header

**وضعیت: ✓ تکمیل‌شده**

`assets/js/components/header/header.js` ساخته شد. کنترل زبان از طریق قرارداد `chemistry:language-change` به runtime متصل است.

## مرحله 5 — جداسازی Hero

**وضعیت: ✓ تکمیل‌شده**

`assets/js/components/hero/hero.js` ساخته شد و قرارداد لینک اصلی `#periodic-table` را کنترل می‌کند.

## مرحله 6 — جداسازی Periodic Table

**وضعیت: ✓ تکمیل‌شده**

`assets/js/components/periodic-table/periodic-table.js` مالک mapping هجده‌گروهی، کارت‌ها، f-block، render، status و selection شد. انتخاب عنصر از طریق `onElementSelected(AtomicNumber)` به orchestrator داده می‌شود.

---

## مرحله 7 — جداسازی Element Details

**وضعیت: ✓ تکمیل‌شده**

فایل جدید:

```text
assets/js/components/element-details/element-details.js
```

مسئولیت‌های منتقل‌شده:

- نگهداری قرارداد داده سه سطح جزئیات.
- `getRowByAtomicNumber()`.
- `isUsable()` و `formatValue()`.
- ساخت `data-grid`.
- rendering کارت هویت عنصر.
- rendering سه سطح `beginner`، `advanced` و `very-advanced`.

Component از طریق `setData()` داده‌های Core را دریافت می‌کند و با `render(AtomicNumber)` عنصر انتخاب‌شده را نمایش می‌دهد.

ارتباط نهایی:

```text
Periodic Table
   ↓ onElementSelected(AtomicNumber)
main-legacy.js
   ↓ elementDetails.render(AtomicNumber)
Element Details
```

هیچ CSV یا dictionary داخل Component کپی نشده است.

---

## مرحله 8 — جداسازی Footer

**وضعیت: ✓ تکمیل‌شده**

فایل جدید:

```text
assets/js/components/footer/footer.js
```

Footer اکنون mount مستقل دارد و قرارداد لینک `#top` را بررسی می‌کند. متن‌های Footer همچنان از i18n عمومی مصرف می‌شوند و منطق علمی یا داده‌ای وارد Component نشده است.

`main.js` اکنون Header، Hero و Footer را در bootstrap mount می‌کند.

---

## مرحله 9 — تفکیک CSS

**وضعیت: ✓ تکمیل‌شده — انتقال تدریجی**

فایل‌های CSS Componentها ایجاد شدند:

```text
assets/css/components/
├── header.css
├── hero.css
├── periodic-table.css
├── element-details.css
└── footer.css
```

مالکیت CSS به همان Componentهای JS نزدیک شده است. `main.js` این stylesheetها را با شناسه `data-component-css` فقط یک‌بار load می‌کند.

### نکته مهم درباره روش انتقال

در این مرحله CSS اختصاصی Componentها **به‌صورت canonical جداگانه ایجاد و load شده است، اما تعریف‌های legacy متناظر هنوز در `main.css` باقی مانده‌اند**. این تصمیم عمدی است تا حذف همزمان selectorهای قدیمی و themeهای جدول باعث تغییر ناخواسته ظاهر نشود.

بنابراین مرحله ۹ یک **تفکیک ایمن و غیرمخرب** است، نه حذف کامل CSS قدیمی. حذف selectorهای تکراری و تعیین مالک نهایی animation/theme در مراحل بعدی انجام می‌شود.

CSS مربوط به Themeهای ۱۵گانه فعلاً در `main.css` باقی می‌ماند چون مالک آن Theme System است و نه Component پایهٔ جدول.

---

# 4. وضعیت فعلی معماری

```text
main.js
 ├── mountHeader()
 ├── mountHero()
 ├── mountFooter()
 ├── load component CSS
 └── import main-legacy.js

main-legacy.js
 ├── Core i18n
 ├── Core data
 ├── Periodic Table Component
 └── Element Details Component

Component CSS
 ├── Header
 ├── Hero
 ├── Periodic Table
 ├── Element Details
 └── Footer
```

---

# 5. مراحل باقی‌مانده

## مرحله 10 — تعیین مالک نهایی Theme و Selection Animation

**اولویت: بسیار بالا**

برای `.element.selected-flash` یک مالک نهایی تعیین می‌شود. تعریف‌های متناقض CSS/runtime بررسی و فقط موارد زائد حذف می‌شوند؛ رفتار مطلوب فعلی (دو flash آبی/سبز و glow نارنجی تیره) نباید بدون دلیل تغییر کند.

## مرحله 11 — تبدیل `index.html` به Composition Layer

**اولویت: بالا**

Markup اختصاصی Componentها از shell اصلی جدا و `index.html` به لایهٔ Composition نزدیک می‌شود؛ IDهای runtime باید حفظ شوند.

## مرحله 12 — پاک‌سازی `main.js` و `main-legacy.js`

**اولویت: بالا**

کدهای منتقل‌شده حذف، orchestration ساده و dependency graph نهایی می‌شود.

## مرحله 13 — بررسی `data/Elements/`

**اولویت: پایین و مستقل**

۱۱۸ CSV بدون مصرف runtime بررسی می‌شوند؛ حذف فقط با تصمیم جداگانه مجاز است.

## مرحله 14 — Validation و مستندسازی نهایی

**اولویت: نهایی**

CI، syntax، data flow، runtime، responsive، accessibility، dependencyها و مستندات نهایی بررسی می‌شوند.

---

# 6. قانون گزارش‌دهی

بعد از هر مرحله گزارش شامل این موارد است:

1. شماره و عنوان مرحله.
2. فایل‌های ایجاد/تغییر/حذف‌شده.
3. مسئولیت‌های منتقل‌شده.
4. تست‌ها و validationهای انجام‌شده.
5. اختلاف با baseline.
6. commit مربوط به مرحله.
7. وضعیت مرحله بعد.

---

# 7. وضعیت فعلی

```text
[✓] 1 — Baseline
[✓] 2 — Component/Core boundaries
[✓] 3 — Shared Core
[✓] 4 — Header
[✓] 5 — Hero
[✓] 6 — Periodic Table
[✓] 7 — Element Details
[✓] 8 — Footer
[✓] 9 — CSS separation (safe migration)
[ ] 10 — Theme / Selection ownership
[ ] 11 — index composition
[ ] 12 — main cleanup
[ ] 13 — orphan data review
[ ] 14 — final validation
```
