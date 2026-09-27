# Chemistry — برنامهٔ مرحله‌ای Refactor معماری Component-Based

> **وضعیت سند:** مراحل ۱، ۲ و ۳ تکمیل شده‌اند؛ اجرای مرحله ۴ منوط به تأیید کاربر است.
> **هدف:** تقسیم تدریجی رابط و منطق پروژه به Componentهای مستقل، بدون تغییر قراردادهای داده و با حفظ رفتار فعلی سایت.
> **قانون اجرا:** هر مرحله مستقل است. بعد از هر مرحله گزارش داده می‌شود و مرحله بعد فقط با تأیید کاربر اجرا می‌شود.

---

# 1. هدف اصلی

هدف این برنامه تبدیل ساختار متمرکز فعلی به معماری قابل نگهداری‌تر است، بدون اینکه در این refactor داده‌های علمی، ظاهر، responsive behavior، زبان‌ها یا قراردادهای runtime بی‌دلیل تغییر کنند.

ساختار هدف:

```text
index.html
   └── Page Composition

assets/js/core/
   ├── i18n.js
   └── data.js

assets/js/components/
   ├── header/
   ├── hero/
   ├── periodic-table/
   ├── element-details/
   └── footer/
```

در پایان refactor، Componentها به Core وابستگی یک‌طرفه خواهند داشت و Core نباید به implementation داخلی Componentها وابسته باشد.

---

# 2. اصول غیرقابل‌تغییر

1. داده‌های علمی CSVها در این refactor تغییر نمی‌کنند.
2. `AtomicNumber` کلید اصلی اتصال اطلاعات عنصر باقی می‌ماند.
3. ۱۱۸ عنصر، f-block و layout هجده‌گروهی حفظ می‌شوند.
4. سه سطح `beginner`، `advanced` و `very-advanced` حفظ می‌شوند.
5. فارسی/انگلیسی و RTL/LTR حفظ می‌شوند.
6. کلیدهای `localStorage` یعنی `chemistry-language` و `chemistry-pdf-theme` حفظ می‌شوند.
7. ظاهر و responsive behavior فعلی نباید بدون دلیل تغییر کند.
8. accessibility و keyboard interaction حفظ می‌شوند.
9. پروژه همچنان static client-side باقی می‌ماند.
10. فایل‌های `data/Elements/` بدون تأیید جداگانه حذف نمی‌شوند.
11. هر مرحله باید قابل گزارش و قابل بازبینی باشد.
12. هیچ مرحله‌ای بدون تأیید کاربر به مرحله بعد وارد نمی‌شود.

---

# 3. اولویت‌بندی مراحل

## مرحله 1 — تثبیت وضعیت فعلی و Baseline

**وضعیت: ✓ تکمیل‌شده**

ساختار repository، runtime، CSVهای اصلی، CI، IDها، selectorها، eventها، stateها و localStorage keyها ثبت شدند. همچنین دو منبع animation برای `.element.selected-flash` به‌عنوان نقطه حساس ثبت شد و `data/Elements/` به‌عنوان داده‌های بدون مصرف runtime شناسایی شد.

**نتیجه:** هیچ کد اجرایی در این مرحله تغییر نکرد.

---

## مرحله 2 — تعریف مرزهای Component و Core

**وضعیت: ✓ تکمیل‌شده**

مالکیت منطقی پروژه مشخص شد:

### Components

- **Header:** markup هدر، کنترل زبان و اتصال به i18n؛ بدون مالکیت Data Layer.
- **Hero:** markup و presentation معرفی سایت؛ فقط مصرف‌کننده i18n.
- **Periodic Table:** ساخت جدول، f-block، کارت عنصر، selection و status؛ مصرف‌کننده Data Layer و i18n.
- **Element Details:** نمایش عنصر انتخاب‌شده در سه سطح؛ مصرف‌کننده داده نرمال‌شده و state انتخاب.
- **Footer:** markup و presentation فوتر؛ بدون وابستگی به Data Layer.

### Core

- **i18n:** dictionaryها، ترجمه DOM، زبان سند، RTL/LTR و localStorage زبان.
- **Data Layer:** مسیر CSVها، parser، fetch، normalization و بارگذاری سه مجموعه داده.
- **Shared Utilities:** utilityهای مشترک مانند انتخاب نام محلی‌شده و translation مقادیر.
- **Shared State:** state انتخاب عنصر در implementation فعلی هنوز داخل runtime اصلی است و در مراحل بعد، هنگام جداسازی Componentها، قرارداد آن مشخص می‌شود.

### Theme System

Theme System به‌عنوان یک مسئولیت مستقل باقی می‌ماند و فقط کلاس Theme را روی `.table-shell` اعمال می‌کند. ارتباط آن با i18n از طریق `document.documentElement.lang` باقی می‌ماند.

### قرارداد معماری مرحله ۲

```text
                 Shared Core
              /      |       \
            i18n    Data    Utilities
              \      |       /
               \     |      /
        ┌────────┴───┴──────┐
        │     Components    │
        ├───────────────────┤
        │ Header / Hero     │
        │ Periodic Table    │
        │ Element Details   │
        │ Footer            │
        └───────────────────┘

Theme System ──> Periodic Table shell
```

---

## مرحله 3 — استخراج Shared Core

**وضعیت: ✓ تکمیل‌شده**

منطق مشترک از `main-legacy.js` خارج شد و به ماژول‌های صریح ES Module منتقل شد.

### فایل جدید: `assets/js/core/i18n.js`

مسئولیت‌ها:

- `translations` فارسی و انگلیسی.
- `valueTranslations` برای مقادیر علمی ترجمه‌شونده.
- `getName()` برای نام محلی‌شده عنصر.
- `setLanguage()` برای:
  - تنظیم `document.documentElement.lang`
  - تنظیم `dir`
  - اعمال `lang-en` روی body
  - اعمال `data-i18n`
  - اعمال `data-i18n-aria`
  - به‌روزرسانی دکمه‌های زبان
  - ذخیره `chemistry-language`
  - اعلام تغییر زبان به runtime مصرف‌کننده.

### فایل جدید: `assets/js/core/data.js`

مسئولیت‌ها:

- تعریف مسیر سه CSV runtime.
- `parseCsv()` با همان parser مقاوم فعلی.
- `fetchCsv()`.
- `normalizeDetailRow()`.
- `loadElementData()` با `Promise.all()` برای بارگذاری موازی سه منبع.

خروجی Data Layer:

```text
loadElementData()
   ├── elements
   ├── advancedElements
   └── veryAdvancedElements
```

### تغییر `main-legacy.js`

`main-legacy.js` دیگر مالک dictionary، CSV parser، fetch و normalization نیست و آن‌ها را از Core import می‌کند. مسئولیت فعلی آن به runtime جدول، انتخاب عنصر و Element Details نزدیک‌تر شده است.

### تغییر `main.js`

بارگذاری قدیمی با `document.createElement("script")` حذف شد و bootstrap اکنون `main-legacy.js` را به‌صورت ES module با `import()` بارگذاری می‌کند تا dependencyهای Core به‌صورت صریح resolve شوند.

### چیزی که در مرحله ۳ تغییر نکرد

- CSVها.
- ساختار DOM اصلی.
- Themeهای موجود.
- کلیدهای localStorage.
- منطق انتخاب عنصر.
- تعداد عناصر و layout جدول.
- CSS و ظاهر سایت.
- `data/Elements/`.

---

# 4. ساختار فعلی پس از مراحل ۲ و ۳

```text
assets/js/
├── main.js
├── main-legacy.js
└── core/
    ├── i18n.js
    └── data.js
```

`main.js` نقش bootstrap + Theme System را دارد.
`main-legacy.js` در این مرحله هنوز runtime جدول و جزئیات را نگه می‌دارد و نام آن عمداً تغییر داده نشده است تا تا زمان انتقال کامل Componentها، refactor کم‌ریسک بماند.

---

# 5. مراحل باقی‌مانده

## مرحله 4 — جداسازی Header

**اولویت: بالا — منتظر تأیید**

HTML و CSS اختصاصی Header و اتصال آن به Core i18n جدا می‌شود. Header نباید dictionary یا Data Layer را مالک باشد.

## مرحله 5 — جداسازی Hero

**اولویت: متوسط**

HTML و CSS اختصاصی Hero جدا می‌شود و فقط از Core i18n مصرف می‌کند.

## مرحله 6 — جداسازی Periodic Table

**اولویت: بسیار بالا**

rendering، کارت‌ها، f-block، mapping، selection و status به Component جدول منتقل می‌شوند.

## مرحله 7 — جداسازی Element Details

**اولویت: بسیار بالا**

Element Details از implementation داخلی جدول مستقل می‌شود و قرارداد مشخصی برای selected element دریافت می‌کند.

## مرحله 8 — جداسازی Footer

**اولویت: متوسط**

Footer به Component مستقل تبدیل می‌شود و فقط در صورت نیاز به i18n متصل خواهد بود.

## مرحله 9 — تفکیک CSS

**اولویت: بالا**

Global styles و styles اختصاصی Componentها جدا می‌شوند.

## مرحله 10 — تعیین مالک نهایی Theme و Selection Animation

**اولویت: بالا**

برای `.element.selected-flash` یک مالک نهایی تعیین می‌شود و تعریف‌های متناقض حذف می‌شوند، بدون تغییر رفتار مگر با تأیید.

## مرحله 11 — تبدیل index.html به Composition Layer

**اولویت: بالا**

`index.html` عمدتاً shell ترکیب Componentها خواهد بود.

## مرحله 12 — پاک‌سازی main.js و main-legacy.js

**اولویت: بالا**

پس از انتقال موفق Componentها، کدهای منتقل‌شده حذف و bootstrap نهایی ساده می‌شود.

## مرحله 13 — بررسی data/Elements

**اولویت: پایین و مستقل**

۱۱۸ فایل بدون مصرف runtime فقط بررسی می‌شوند؛ حذف نیازمند تصمیم جداگانه است.

## مرحله 14 — Validation و مستندسازی نهایی

**اولویت: نهایی**

CI، syntax، data flow، runtime، responsive، accessibility و مستندات نهایی بررسی می‌شوند.

---

# 6. قانون گزارش‌دهی

بعد از هر مرحله باید گزارش شامل موارد زیر ارائه شود:

1. شماره و عنوان مرحله.
2. فایل‌های ایجاد/تغییر/حذف‌شده.
3. مسئولیت‌های منتقل‌شده.
4. تست‌ها و validationهای انجام‌شده.
5. اختلاف احتمالی با baseline.
6. commit مرحله.
7. وضعیت مرحله بعد و انتظار برای تأیید کاربر.

---

# 7. وضعیت فعلی

```text
[✓] 1 — Baseline
[✓] 2 — Component/Core boundaries
[✓] 3 — Shared Core
[ ] 4 — Header — منتظر تأیید
[ ] 5 — Hero
[ ] 6 — Periodic Table
[ ] 7 — Element Details
[ ] 8 — Footer
[ ] 9 — CSS separation
[ ] 10 — Theme/Selection ownership
[ ] 11 — index composition
[ ] 12 — main cleanup
[ ] 13 — orphan data review
[ ] 14 — final validation/documentation
```
