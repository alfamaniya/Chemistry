export function mountHero(root) {
  if (!root) return;
  if (!root.children.length) {
    root.innerHTML = `
      <div>
        <p class="eyebrow" data-i18n="eyebrow">CHEMISTRY • ELEMENTS</p>
        <h1 data-i18n="heroTitle">مرجع شیمی و جدول تناوبی</h1>
        <p class="hero-text" data-i18n="heroText">یک نقطهٔ شروع ساده برای مشاهدهٔ جدول تناوبی و دسترسی سریع به اطلاعات عناصر، از سطح مبتدی تا پیشرفته.</p>
        <a class="primary-button" href="#periodic-table" data-i18n="heroButton">مشاهده جدول تناوبی</a>
      </div>`;
  }
  const primaryButton = root.querySelector('.primary-button[href="#periodic-table"]');
  if (primaryButton) primaryButton.dataset.componentReady = 'true';
}
