(() => {
  "use strict";

  const legacyScript = document.createElement("script");
  legacyScript.src = "assets/js/main-legacy.js";
  legacyScript.defer = false;
  document.head.appendChild(legacyScript);

  const themeSelect = document.getElementById("table-theme-select");

  const themes = [
    {id:"15", fa:"بدون دسته‌بندی", en:"Uncategorized", faGroup:"", enGroup:""},
    {id:"1", fa:"جرم اتمی", en:"Atomic Mass", faGroup:"فیزیکی", enGroup:"Physical"},
    {id:"2", fa:"چگالی", en:"Density", faGroup:"فیزیکی", enGroup:"Physical"},
    {id:"3", fa:"حالت استاندارد", en:"Standard State", faGroup:"فیزیکی", enGroup:"Physical"},
    {id:"10", fa:"نقطه ذوب", en:"Melting Point", faGroup:"فیزیکی", enGroup:"Physical"},
    {id:"11", fa:"نقطه جوش", en:"Boiling Point", faGroup:"فیزیکی", enGroup:"Physical"},
    {id:"7", fa:"شعاع اتمی", en:"Atomic Radius", faGroup:"اتمی", enGroup:"Atomic"},
    {id:"6", fa:"آرایش الکترونی", en:"Electron Configuration", faGroup:"اتمی", enGroup:"Atomic"},
    {id:"5", fa:"انرژی یونش", en:"Ionization Energy", faGroup:"اتمی", enGroup:"Atomic"},
    {id:"9", fa:"الکترون‌خواهی", en:"Electron Affinity", faGroup:"اتمی", enGroup:"Atomic"},
    {id:"4", fa:"الکترونگاتیویته", en:"Electronegativity", faGroup:"شیمیایی", enGroup:"Chemical"},
    {id:"8", fa:"حالت‌های اکسایش", en:"Oxidation States", faGroup:"شیمیایی", enGroup:"Chemical"},
    {id:"13", fa:"فلز / شبه‌فلز / نافلز", en:"Metal / Metalloid / Nonmetal", faGroup:"طبقه‌بندی", enGroup:"Classification"},
    {id:"14", fa:"گروه / خانواده شیمیایی", en:"Chemical Group / Family", faGroup:"طبقه‌بندی", enGroup:"Classification"},
    {id:"12", fa:"سال کشف", en:"Year Discovered", faGroup:"تاریخی", enGroup:"History"}
  ];

  function currentLanguage() {
    return document.documentElement.lang === "en" ? "en" : "fa";
  }

  function syncThemeSelect(forceDefault = false) {
    if (!themeSelect) return;
    const lang = currentLanguage();
    const current = forceDefault ? "15" : themeSelect.value;
    const fragment = document.createDocumentFragment();

    themes.forEach(theme => {
      const option = document.createElement("option");
      option.value = theme.id;
      const label = lang === "fa" ? theme.fa : theme.en;
      const group = lang === "fa" ? theme.faGroup : theme.enGroup;
      option.textContent = group ? `${label} (${group})` : label;
      fragment.appendChild(option);
    });

    themeSelect.replaceChildren(fragment);
    themeSelect.value = themes.some(theme => theme.id === current) ? current : "15";
    if (forceDefault) {
      themeSelect.value = "15";
      themeSelect.dispatchEvent(new Event("change", {bubbles: true}));
    }
  }

  function install() {
    if (!themeSelect) return;
    syncThemeSelect(true);

    document.querySelector('[data-i18n="periodicSubtitle"]')?.remove();

    const observer = new MutationObserver(() => {
      if (themeSelect.options.length !== themes.length || themeSelect.options[0]?.value !== "15") {
        const current = themeSelect.value;
        syncThemeSelect(false);
        if (current && themes.some(theme => theme.id === current)) themeSelect.value = current;
      }
    });
    observer.observe(themeSelect, {childList: true});

    new MutationObserver(() => syncThemeSelect(false)).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"]
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, {once: true});
  } else {
    install();
  }
})();
