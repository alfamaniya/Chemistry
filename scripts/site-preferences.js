const translations = {
  fa: {
    language: "English",
    theme: "حالت تاریک",
    description: "توضیحات صفحه در این قسمت قرار می‌گیرد.",
    search: "جستجو",
    searchPlaceholder: "عبارت مورد نظر را وارد کنید"
  },
  en: {
    language: "فارسی",
    theme: "Dark mode",
    description: "Page descriptions appear in this section.",
    search: "Search",
    searchPlaceholder: "Enter your search term"
  }
};

const applyLanguage = (language) => {
  const text = translations[language];
  document.documentElement.lang = language;
  document.documentElement.dir = language === "fa" ? "rtl" : "ltr";

  document.querySelector("[data-i18n='description']").textContent = text.description;
  document.querySelector("[data-i18n='search-label']").textContent = text.search;
  document.querySelector("[data-i18n='search-button']").textContent = text.search;
  document.querySelector("[data-i18n='search-placeholder']").placeholder = text.searchPlaceholder;
  document.querySelector("[data-action='language']").textContent = text.language;
};

const applyTheme = (dark) => {
  document.documentElement.classList.toggle("dark-mode", dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
};

document.addEventListener("DOMContentLoaded", () => {
  let language = localStorage.getItem("language") || "fa";
  let dark = localStorage.getItem("theme") === "dark";

  applyLanguage(language);
  applyTheme(dark);

  document.querySelector("[data-action='language']").addEventListener("click", () => {
    language = language === "fa" ? "en" : "fa";
    localStorage.setItem("language", language);
    applyLanguage(language);
  });

  document.querySelector("[data-action='theme']").addEventListener("click", () => {
    dark = !dark;
    applyTheme(dark);
  });
});
