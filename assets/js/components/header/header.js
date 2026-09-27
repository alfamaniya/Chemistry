export function mountHeader(root) {
  if (!root) return;
  if (!root.children.length) {
    root.innerHTML = `
      <div class="container header-inner">
        <a class="brand" href="#top" aria-label="صفحه اصلی / Home">
          <span class="brand-mark">ش</span>
          <span>
            <strong data-i18n="brand">مرجع شیمی</strong>
            <small data-i18n="brandTagline">یادگیری ساده، دقیق و مرحله‌ای</small>
          </span>
        </a>
        <nav class="main-nav" aria-label="ناوبری اصلی / Main navigation">
          <a href="#periodic-table" data-i18n="navPeriodic">جدول تناوبی</a>
          <a href="#levels" data-i18n="navLevels">سطوح آموزشی</a>
          <a href="#footer" data-i18n="navAbout">درباره</a>
        </nav>
        <div class="language-switcher" role="group" aria-label="انتخاب زبان / Language">
          <button class="language-button active" type="button" data-language="fa" aria-pressed="true">فارسی</button>
          <span aria-hidden="true">|</span>
          <button class="language-button" type="button" data-language="en" aria-pressed="false">English</button>
        </div>
      </div>`;
  }
  root.querySelectorAll('.language-button').forEach(button => {
    if (button.dataset.componentBound === 'true') return;
    button.dataset.componentBound = 'true';
    button.addEventListener('click', () => document.dispatchEvent(new CustomEvent('chemistry:language-change', {detail:{language:button.dataset.language}})));
  });
}
