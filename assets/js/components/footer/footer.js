export function mountFooter(root) {
  if (!root) return;

  const backTop = root.querySelector('.back-top[href="#top"]');
  if (backTop) backTop.dataset.componentReady = "true";
}
