# Chemistry — Code Audit

## وضعیت بررسی

این فایل گزارش بازبینی عمیق کد مخزن در شاخه main است. بررسی در تاریخ 2026-09-29 انجام شد و فایل‌های اجرایی HTML/CSS/JavaScript/ESM، تنظیمات CI، localeها، runtime index و ساختار داده‌های عنصر بررسی شدند.

> روش بررسی: فایل‌های source به‌صورت کامل خوانده شدند و جریان بین HTML، CSS، JavaScript، locale و داده بررسی شد؛ سپس خطاهای منطقی، accessibility، responsive، performance، robustness، security، maintainability و CI استخراج شدند. فایل‌های ELEMENT_ATOMIC NUMBER_*.json داده خام هستند و کد اجرایی محسوب نمی‌شوند؛ ساختار و ارتباط آن‌ها با runtime نیز بررسی شد.

## اولویت‌ها
- P0 — بحرانی: خرابی جدی، ریسک امنیتی مهم یا مانع اجرای قابلیت اصلی.
- P1 — بالا: مشکل مهم در UX، accessibility، correctness یا معماری.
- P2 — متوسط: مشکل قابل‌توجه ولی غیرمسدودکننده.
- P3 — پایین: بهبود کیفیت، hardening، performance یا polish.

## فهرست ایرادات

| # | اولویت | فایل/ناحیه | ایراد | وضعیت |
|---|---|---|---|---|
| 1 | P1 | styles/periodic-table.css | فشرده‌شدن ۱۸ ستون روی موبایل و نبود اسکرول افقی واقعی | حل شد |
| 2 | P1 | components/* | componentهای stale و ناسازگار با runtime | حل شد |
| 3 | P1 | لایه داده/تحلیل | اختلاط source runtime و خروجی تحلیل | حل شد |
| 4 | P1 | scripts/periodic-table.js | semantics نامناسب کارت‌های تعاملی | حل شد |
| 5 | P1 | scripts/element-search.js | مدل ناقص combobox/listbox و keyboard navigation | حل شد |
| 6 | P1 | reduced motion | blink جاوااسکریپتی با prefers-reduced-motion متوقف نمی‌شد | حل شد |
| 7 | P2 | blink timers | overlap شدن timerها در کلیک‌های سریع | حل شد |
| 8 | P2 | element-data.js | cache شدن Promise ناموفق و نبود retry | حل شد |
| 9 | P2 | site-preferences.js | پذیرش locale نامعتبر از localStorage | حل شد |
| 10 | P2 | live region | قرارگرفتن ۱۱۸ کارت داخل aria-live | حل شد |
| 11 | P2 | index.html | SEO metadata ناکافی | حل شد |
| 12 | P3 | CI/tooling | نبود validation و CI پایه | حل شد |
| 13 | P1 | site-preferences.css + search-box.css + information-boxes.css | کنتراست و theme در Dark Mode برای بعضی سطوح UI کامل نیست | باز |
| 14 | P1 | periodic-table.js | ترتیب Tab با ترتیب بصری جدول، مخصوصاً f-block، هم‌خوان نیست | باز |
| 15 | P1 | site-preferences.js | دسترسی مستقیم به localStorage بدون مدیریت SecurityError/Unavailable Storage | باز |
| 16 | P1 | periodic-table.js + element-data.js | failure state برای load جدول و search یکپارچه نیست | باز |
| 17 | P2 | validate-project.mjs | validation فقط بخشی از قرارداد داده/HTML را بررسی می‌کند | باز |
| 18 | P2 | .github/workflows/quality.yml | Actionها با tag نسخه‌ای pin شده‌اند و permissions حداقلی صریح نیست | باز |
| 19 | P2 | CI + package.json | تحلیل داده در CI اجرا نمی‌شود و test واقعی browser وجود ندارد | باز |
| 20 | P2 | site-preferences.js | locale بعد از parse از نظر schema و کلیدهای موردنیاز validate نمی‌شود | باز |
| 21 | P2 | periodic-table.js | layout و categoryها duplicate/hand-maintained هستند و validation مستقل ندارند | باز |
| 22 | P2 | data/ELEMENT_ATOMIC NUMBER_*.json | حجم و تعداد بالای فایل‌های raw data نگهداری و diff را دشوار می‌کند | باز |
| 23 | P3 | periodic-table.css | periodic-table-scroll:focus-visible روی عنصر غیرقابل focus عملاً بی‌اثر است | باز |
| 24 | P3 | periodic-table.css | کلاس element-card--f-block تعریف شده ولی در ساخت کارت استفاده نمی‌شود | باز |
| 25 | P3 | index.html | SEO پایه بهتر شده اما canonical/robots/icon و metadata کامل‌تر وجود ندارد | باز |
| 26 | P3 | کل پروژه | تست regression برای interactionهای اصلی وجود ندارد | باز |

# تحلیل تفصیلی

## 1 تا 12 — موارد قبلی که اصلاح شده‌اند

1. Responsive جدول: wrapper با overflow-x:auto و حداقل عرض خوانا اصلاح شد.
2. componentهای stale حذف شدند و index.html تنها source of truth markup شد.
3. runtime data از خروجی تحلیل جدا شد.
4. کارت‌های عنصر به native button تبدیل شدند.
5. combobox/listbox و keyboard navigation تکمیل شد.
6. reduced motion در blink جاوااسکریپتی رعایت شد.
7. timerهای blink با WeakMap مدیریت شدند.
8. Promise ناموفق data layer دیگر دائمی cache نمی‌شود.
9. زبان localStorage فقط از fa/en پذیرفته می‌شود.
10. live region از grid بزرگ ۱۱۸ کارت جدا شد.
11. description، theme-color، Open Graph و title اضافه شدند.
12. package.json، validator و GitHub Actions اضافه شدند.

## 13. Dark Mode ناقص — P1

در site-preferences.css برای برخی containerهای اصلی dark theme تعریف شده، اما تمام سطوح UI یکپارچه theme نمی‌شوند.

- information-box__content پس‌زمینه روشن خود را حفظ می‌کند در حالی که رنگ متن می‌تواند روشن باشد.
- search-box__results پس‌زمینه روشن دارد ولی رنگ متن از context تیره به ارث می‌رسد.
- resultهای search در Dark Mode می‌توانند کنتراست نامناسب داشته باشند.
- theme token مرکزی وجود ندارد و رنگ‌ها در چند فایل به‌صورت literal تکرار شده‌اند.

اثر: کاهش خوانایی و accessibility در Dark Mode.
راهکار: تعریف CSS custom properties برای background/text/border/surface و اعمال صریح theme روی تمام سطح‌های interactive.

## 14. ترتیب Tab با ترتیب بصری جدول — P1

DOM کارت‌ها بر اساس atomic number ساخته می‌شود، در حالی که CSS Grid کارت‌های 57–71 و 89–103 را به ردیف‌های جدا منتقل می‌کند. در نتیجه keyboard user ممکن است از 56 به f-block برود، در حالی که از نظر بصری ادامه جدول اصلی به 72 می‌رسد.

اثر: navigation غیرقابل‌پیش‌بینی برای keyboard/assistive-technology users.
راهکار: هماهنگ‌کردن DOM order با reading/navigation order مطلوب یا تعریف navigation keyboard اختصاصی برای grid. از tabindex مثبت تا حد امکان اجتناب شود.

## 15. localStorage بدون defensive handling — P1

در site-preferences.js چند مسیر مستقیماً localStorage.getItem/setItem را فراخوانی می‌کنند. در محیط‌هایی که storage در دسترس نیست یا SecurityError می‌دهد، initialization تنظیمات می‌تواند متوقف شود.

راهکار: wrapper امن برای storage با try/catch و fallback حافظه‌ای.

## 16. failure state کامل load — P1

renderPeriodicTable و search هر دو به getElementData وابسته‌اند، اما failure handling مستقل است. جدول پیام خطا نمایش می‌دهد، در حالی که search صرفاً console.error می‌کند و UI وضعیت خطا یا retry ندارد.

راهکار: error state مشترک برای data layer و UI feedback مشخص + retry action.

## 17. validation داده ناقص — P2

validator فعلی تعداد و ترتیب ۱۱۸ عنصر، parity locale، چند key اصلی HTML و syntax اسکریپت‌ها را بررسی می‌کند؛ اما موارد زیر را کامل validate نمی‌کند:

- نوع و وجود symbol/name/persian_name برای همه عناصر.
- یکتا بودن symbol و name.
- تطابق index با ۱۱۸ فایل raw.
- تطابق atomic number فایل raw با محتوای همان فایل.
- قرارداد schema فایل‌های raw.
- تمام data-i18n و data-i18n-aria-label های HTML با localeها.
- موفقیت اجرای check:analysis.

## 18. hardening GitHub Actions — P2

workflow از actions/checkout@v4 و actions/setup-node@v4 استفاده می‌کند و permissions صریح ندارد. برای workflow production بهتر است Actionها با commit SHA کامل pin شوند و permissions حداقلی تعریف شود. GitHub نیز pin کردن Actionها به SHA کامل را برای immutable/hardening توصیه می‌کند.

## 19. CI و test coverage ناکافی — P2

CI فقط npm run check را اجرا می‌کند. اجرای واقعی browser، rendering جدول، search keyboard interaction، تغییر زبان، Dark Mode، reduced motion و check:analysis به‌صورت خودکار تست نمی‌شوند.

راهکار: browser smoke/E2E test و اجرای analysis validation در CI.

## 20. schema validation برای locale — P2

loadLocale فقط JSON را parse می‌کند. schema رسمی برای locale وجود ندارد و missing/extra/incorrect-type بودن مقادیر به‌صورت مرکزی گزارش نمی‌شود.

راهکار: validator مرکزی برای required keys و type آن‌ها.

## 21. layout و categoryهای hand-maintained — P2

PERIODIC_TABLE_LAYOUT و PERIODIC_TABLE_CATEGORIES مجموعه‌های بزرگی هستند که دستی نگهداری می‌شوند. در صورت تغییر داده، mismatch بین atomic number، position، category و rendering ممکن است رخ دهد.

راهکار: canonical metadata یا validation که تمام ۱۱۸ عنصر دقیقاً layout/category معتبر داشته باشند.

## 22. raw data fragmentation — P2

data شامل تعداد زیادی JSON مستقل با نام‌هایی مانند ELEMENT_ATOMIC NUMBER_1.json است. این ساختار audit منبع را ساده می‌کند، اما diff/review را دشوار، naming را نامنظم و scriptها را به regex وابسته می‌کند.

راهکار: اگر فایل‌های مستقل لازم‌اند، manifest/schema و naming convention بدون space اضافه شود؛ در غیر این صورت canonical dataset versioned نگهداری ساده‌تری دارد.

## 23. focus-visible بی‌اثر — P3

periodic-table-scroll:focus-visible تعریف شده، اما wrapper focusable نیست و tabindex ندارد؛ بنابراین selector در حالت عادی فعال نمی‌شود.

راهکار: حذف rule یا انتقال focus behavior به عنصر واقعاً focusable.

## 24. CSS dead rule — P3

کلاس element-card--f-block در CSS تعریف شده ولی createCard آن را به کارت‌ها اضافه نمی‌کند.

راهکار: حذف rule یا استفاده واقعی پس از تعیین طراحی نهایی f-block.

## 25. SEO هنوز کامل نیست — P3

SEO پایه اضافه شده، اما canonical URL، robots در صورت نیاز، favicon/site icon، Open Graph image و metadata کامل‌تر شبکه‌های اجتماعی وجود ندارند.

## 26. نبود regression test — P3

validator فعلی static validation است و تضمین نمی‌کند تغییر آینده در JavaScript باعث خرابی search selection، language switching، blinking، table rendering یا theme switching نشود.

راهکار: حداقل browser smoke test برای مسیرهای اصلی.

# یافته‌های مثبت

1. runtime فقط index سبک ۱۱۸ عنصری را می‌خواند و ۱۱۸ فایل raw در startup fetch نمی‌شوند.
2. ساخت DOM با createElement و textContent انجام می‌شود و در مسیرهای بررسی‌شده injection با innerHTML دیده نشد.
3. کارت‌ها native button هستند.
4. RTL/LTR و bidi جداگانه مدیریت شده‌اند.
5. search از normalized Persian text استفاده می‌کند.
6. Promise caching از fetchهای تکراری جلوگیری می‌کند.
7. error handling برای rendering جدول وجود دارد.
8. CI فعلی بدون dependency خارجی برای validation پروژه قابل اجراست.
9. داده runtime تعداد و ترتیب ۱۱۸ عنصر را حفظ می‌کند.
10. ساختار پروژه کوچک و قابل توسعه است.

# دامنه و محدودیت

- بررسی source شامل index.html، تمام scripts/ و styles/، localeها، package/CI و runtime data index انجام شد.
- فایل‌های خام عنصر به‌عنوان داده علمی بررسی شدند، نه خط‌به‌خط از نظر صحت علمی هر property.
- صحت علمی تک‌تک مقادیر ۱۱۸ فایل raw بدون تطبیق با منبع علمی خارجی تأیید نشده است.
- تست visual واقعی در همه browser/deviceها در این audit انجام نشده است؛ بنابراین مشکلات browser-specific ممکن است باقی مانده باشند.

# وضعیت نهایی

تعداد موارد ثبت‌شده: 26
حل‌شده از auditهای قبلی: 12
ایرادات جدید باز: 14
P0: 0
P1 باز: 4
P2 باز: 6
P3 باز: 4

این README گزارش audit است و در این مرحله کد ایرادات جدید شماره 13 تا 26 تغییر داده نشده است.