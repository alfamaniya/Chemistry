export const translations = {
  fa: {
    eyebrow: "شیمی • عناصر", fBlockAria: "لانتانیدها و اکتینیدها", brand: "مرجع شیمی", brandTagline: "یادگیری ساده، دقیق و مرحله‌ای",
    navPeriodic: "جدول تناوبی", navLevels: "سطوح آموزشی", navAbout: "درباره",
    heroTitle: "مرجع شیمی و جدول تناوبی", heroText: "یک مسیر روشن برای شناخت عناصر شیمیایی؛ از شناخت بنیادین تا ژرف‌کاوی علمی.",
    heroButton: "مشاهده جدول تناوبی", periodicTitle: "جدول تناوبی", periodicSubtitle: "چیدمان ۱۸ گروهی بر اساس مرجع جدول تناوبی",
    beginnerTitle: "شناخت بنیادین", professionalTitle: "تحلیل تخصصی", veryAdvancedTitle: "ژرف‌کاوی علمی",
    footerTitle: "مرجع شیمی", footerText: "پروژه‌ای برای دسترسی ساده‌تر به داده‌های عناصر شیمیایی.",
    backTop: "بازگشت به بالا ↑", loading: "در حال بارگذاری عناصر…", loaded: "عنصر از منبع داده بارگذاری شد.", elementDetails: "عدد اتمی",
    loadError: "بارگذاری داده‌ها انجام نشد. صفحه را از طریق یک وب‌سرور محلی اجرا کنید.",
    themeSelectLabel: "دسته‌بندی رنگ جدول", themeSelectDescription: "یکی از ۱۴ دسته‌بندی PDF یا حالت «بدون دسته‌بندی» را انتخاب کنید.",
    selectedElementTitle: "اطلاعات مختصر عنصر", selectedElementSubtitle: "برای دیدن اطلاعات، یکی از عناصر جدول را انتخاب کنید.", selectElement: "یک عنصر را از جدول انتخاب کنید.",
    atomicNumber: "عدد اتمی", symbol: "نماد", name: "نام", atomicMass: "جرم اتمی", groupBlock: "دسته", standardState: "حالت استاندارد", electronConfiguration: "آرایش الکترونی",
    oxidationStates: "حالت‌های اکسایش", electronegativity: "الکترونگاتیویته", atomicRadius: "شعاع اتمی (pm)", ionizationEnergy: "انرژی یونش (eV)",
    electronAffinity: "الکترون‌خواهی (eV)", meltingPoint: "نقطه ذوب (K)", boilingPoint: "نقطه جوش (K)", density: "چگالی (g/cm³)", yearDiscovered: "سال کشف", dataStatus: "وضعیت داده", cpkColor: "رنگ CPK"
  },
  en: {
    eyebrow: "CHEMISTRY • ELEMENTS", fBlockAria: "Lanthanides and Actinides", brand: "Chemistry Reference", brandTagline: "Simple, accurate, step-by-step learning",
    navPeriodic: "Periodic Table", navLevels: "Learning Levels", navAbout: "About", heroTitle: "Chemistry Reference & Periodic Table",
    heroText: "A clear path to understanding chemical elements — from foundational knowledge to deep scientific exploration.", heroButton: "View Periodic Table",
    periodicTitle: "Periodic Table", periodicSubtitle: "18-group layout based on the reference periodic table",
    beginnerTitle: "Foundational Insight", professionalTitle: "Specialized Analysis", veryAdvancedTitle: "Scientific Deep Dive",
    footerTitle: "Chemistry Reference", footerText: "A project for easier access to chemical element data.", backTop: "Back to top ↑", loading: "Loading elements…",
    loaded: "elements loaded from the data source.", elementDetails: "Atomic number",
    loadError: "The data could not be loaded. Please run the page through a local web server.", themeSelectLabel: "Table Color Category",
    themeSelectDescription: "Choose one of the 14 PDF categories or the “Uncategorized” default mode.", selectedElementTitle: "Selected Element — Quick Information",
    selectedElementSubtitle: "Select an element from the table to view its information.", selectElement: "Select an element from the table.", atomicNumber: "Atomic number", symbol: "Symbol", name: "Name", atomicMass: "Atomic mass",
    groupBlock: "Group / block", standardState: "Standard state", electronConfiguration: "Electron configuration", oxidationStates: "Oxidation states", electronegativity: "Electronegativity",
    atomicRadius: "Atomic radius (pm)", ionizationEnergy: "Ionization energy (eV)", electronAffinity: "Electron affinity (eV)", meltingPoint: "Melting point (K)", boilingPoint: "Boiling point (K)", density: "Density (g/cm³)", yearDiscovered: "Year discovered", dataStatus: "Data status", cpkColor: "CPK color"
  }
};

export const valueTranslations = {
  GroupBlock: {
    fa: { Nonmetal: "نافلز", "Noble gas": "گاز نجیب", "Alkali metal": "فلز قلیایی", "Alkaline earth metal": "فلز قلیایی خاکی", Metalloid: "شبه‌فلز", "Transition metal": "فلز واسطه", "Post-transition metal": "فلز پس‌واسطه", Lanthanide: "لانتانید", Actinide: "اکتینید", Halogen: "هالوژن" },
    en: { Nonmetal: "Nonmetal", "Noble gas": "Noble gas", "Alkali metal": "Alkali metal", "Alkaline earth metal": "Alkaline earth metal", Metalloid: "Metalloid", "Transition metal": "Transition metal", "Post-transition metal": "Post-transition metal", Lanthanide: "Lanthanide", Actinide: "Actinide", Halogen: "Halogen" }
  },
  StandardState: {
    fa: { Gas: "گاز", Solid: "جامد", Liquid: "مایع", "Expected to be a Solid": "احتمالاً جامد", "Expected to be a Gas": "احتمالاً گاز" },
    en: { Gas: "Gas", Solid: "Solid", Liquid: "Liquid", "Expected to be a Solid": "Expected to be a Solid", "Expected to be a Gas": "Expected to be a Gas" }
  },
  data_status: { fa: { predicted_or_estimated: "پیش‌بینی‌شده / برآوردشده" }, en: { predicted_or_estimated: "predicted / estimated" } },
  YearDiscovered: { fa: { Ancient: "باستانی" }, en: { Ancient: "Ancient" } }
};

export function getName(element, language) {
  return language === "fa" ? (element.NameFa || element.Name) : element.Name;
}

export function setLanguage(language, { fBlock, languageButtons, onLanguageChanged } = {}) {
  const currentLanguage = language === "en" ? "en" : "fa";
  const t = translations[currentLanguage];
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === "fa" ? "rtl" : "ltr";
  document.body.classList.toggle("lang-en", currentLanguage);

  document.querySelectorAll("[data-i18n]").forEach(node => {
    const key = node.dataset.i18n;
    if (t[key]) node.textContent = t[key];
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(node => {
    const key = node.dataset.i18nAria;
    if (t[key]) node.setAttribute("aria-label", t[key]);
  });
  if (fBlock) fBlock.setAttribute("aria-label", t.fBlockAria);

  if (languageButtons) languageButtons.forEach(button => {
    const active = button.dataset.language === currentLanguage;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  localStorage.setItem("chemistry-language", currentLanguage);
  if (onLanguageChanged) onLanguageChanged(currentLanguage);
  return currentLanguage;
}
