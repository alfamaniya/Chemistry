export function mountHeader(root) {
  if (!root) return;

  const languageButtons = root.querySelectorAll('.language-button');
  languageButtons.forEach(button => {
    if (button.dataset.componentBound === 'true') return;
    button.dataset.componentBound = 'true';
    button.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('chemistry:language-change', {
        detail: { language: button.dataset.language }
      }));
    });
  });
}
