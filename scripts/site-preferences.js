const SUPPORTED_LANGUAGES = new Set(["fa", "en"]);
const localeCache = new Map();
const memoryStorage = new Map();

const storage = {
  get(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memoryStorage.get(key) ?? null;
    }
  },
  set(key, value) {
    memoryStorage.set(key, value);
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Storage may be unavailable or blocked; memory fallback remains active.
    }
  }
};

const getStoredLanguage = () => {
  const stored = storage.get("language");
  return SUPPORTED_LANGUAGES.has(stored) ? stored : "fa";
};

const loadLocale = async (language) => {
  if (localeCache.has(language)) return localeCache.get(language);
  const response = await fetch(`locales/${language}.json`, { cache: "no-cache" });
  if (!response.ok) throw new Error(`Unable to load locale: ${language}`);
  const locale = await response.json();
  const requiredKeys = ["language", "theme", "description", "search", "searchPlaceholder", "periodicTableTitle", "pageTitle"];
  if (!locale || typeof locale !== "object" || requiredKeys.some((key) => typeof locale[key] !== "string")) {
    throw new Error(`Invalid locale schema: ${language}`);
  }
  localeCache.set(language, locale);
  return locale;
};

const applyLanguage = async (language) => {
  const safeLanguage = SUPPORTED_LANGUAGES.has(language) ? language : "fa";
  const text = await loadLocale(safeLanguage);
  const root = document.documentElement;
  root.lang = safeLanguage;
  root.dir = safeLanguage === "fa" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (!(key in text)) return;
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) element.placeholder = text[key];
    else element.textContent = text[key];
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    if (key in text) element.setAttribute("aria-label", text[key]);
  });

  const title = document.querySelector("title");
  if (title && text.pageTitle) title.textContent = text.pageTitle;

  const languageButton = document.querySelector("[data-action='language']");
  if (languageButton) languageButton.textContent = text.language;
  const themeButton = document.querySelector("[data-action='theme']");
  if (themeButton) themeButton.textContent = text.theme;

  window.updateElementCardLanguages?.();
  window.updateElementSearchLanguage?.();
};

const applyTheme = (dark) => {
  document.documentElement.classList.toggle("dark-mode", dark);
  storage.set("theme", dark ? "dark" : "light");
};

document.addEventListener("DOMContentLoaded", async () => {
  let language = getStoredLanguage();
  let dark = storage.get("theme") === "dark";
  applyTheme(dark);

  try {
    await applyLanguage(language);
  } catch (error) {
    console.error(error);
  }

  document.querySelector("[data-action='language']")?.addEventListener("click", async () => {
    language = language === "fa" ? "en" : "fa";
    storage.set("language", language);
    try {
      await applyLanguage(language);
    } catch (error) {
      console.error(error);
    }
  });

  document.querySelector("[data-action='theme']")?.addEventListener("click", () => {
    dark = !dark;
    applyTheme(dark);
  });
});