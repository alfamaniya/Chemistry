export function mountFooter(root) {
  if (!root) return;
  if (!root.children.length) {
    root.innerHTML = `
      <div class="container footer-inner">
        <div>
          <strong data-i18n="footerTitle">مرجع شیمی</strong>
          <p data-i18n="footerText">اطلاعات عناصر برای یادگیری ساده و مرحله‌ای.</p>
        </div>
        <a class="back-top" href="#top" data-i18n="backTop">بازگشت به بالا</a>
      </div>`;
  }
  const backTop = root.querySelector('.back-top[href="#top"]');
  if (backTop) backTop.dataset.componentReady = 'true';
}
