export function mountHero(root) {
  if (!root) return;

  const primaryButton = root.querySelector('.primary-button[href="#periodic-table"]');
  if (primaryButton) primaryButton.dataset.componentReady = 'true';
}
