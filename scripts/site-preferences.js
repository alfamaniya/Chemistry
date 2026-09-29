const localeCache = new Map();

const loadLocale = async (language) => {
  if (localeCache.has(language)) return localeCache.get(language);

  const response = await fetch(`locales/${language}.json`, { cache: "no-cache" });
  if (!response.ok) throw new Error(`Unable to load locale: ${language}`);

  const locale = await response.json();
  localeCache.set(language, locale);
  return locale;
};

const applyLanguage = async (language) => {
  const text = await loadLocale(language);
  const root = document.documentElement;

  root.lang = language;
  root.dir = language === "fa" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (!(key in text)) return;

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      element.placeholder = text[key];
    } else {
      element.textContent = text[key];
    }
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    if (key in text) element.setAttribute("aria-label", text[key]);
  });

  const languageButton = document.querySelector("[data-action='language']");
  if (languageButton) languageButton.textContent = text.language;

  const themeButton = document.querySelector("[data-action='theme']");
  if (themeButton) themeButton.textContent = text.theme;

  window.updateElementCardLanguages?.();
};

const applyTheme = (dark) => {
  document.documentElement.classList.toggle("dark-mode", dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
};

document.addEventListener("DOMContentLoaded", async () => {
  let language = localStorage.getItem("language") || "fa";
  let dark = localStorage.getItem("theme") === "dark";

  applyTheme(dark);

  try {
    await applyLanguage(language);
  } catch (error) {
    console.error(error);
  }

  document.querySelector("[data-action='language']")?.addEventListener("click", async () => {
    language = language === "fa" ? "en" : "fa";
    localStorage.setItem("language", language);
    await applyLanguage(language);
  });

  document.querySelector("[data-action='theme']")?.addEventListener("click", () => {
    dark = !dark;
    applyTheme(dark);
  });
});
