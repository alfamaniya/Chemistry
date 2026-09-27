(async () => {
  "use strict";

  // Component bootstrap runs before the data-driven runtime so that shared
  // DOM contracts exist before i18n and table logic attach to them.
  const [{ mountHeader }, { mountHero }, { mountFooter }] = await Promise.all([
    import("./components/header/header.js"),
    import("./components/hero/hero.js"),
    import("./components/footer/footer.js")
  ]);

  function loadComponentStyles() {
    ["header", "hero", "periodic-table", "element-details", "footer"].forEach(name => {
      const href = `assets/css/components/${name}.css`;
      if (document.querySelector(`link[data-component-css="${name}"]`)) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.componentCss = name;
      document.head.appendChild(link);
    });
  }

  loadComponentStyles();
  mountHeader(document.querySelector(".site-header"));
  mountHero(document.querySelector(".hero"));
  mountFooter(document.querySelector(".site-footer"));

  // Bootstrap the data-driven application as an ES module.
  import("./main-legacy.js").catch(error => console.error("Failed to load application module", error));

  // Dynamic orange-red page background. The reduced-motion media query keeps
  // the page static for users who request reduced motion at OS/browser level.
  const backgroundStyle = document.createElement("style");
  backgroundStyle.textContent = `
    body {
      background: linear-gradient(120deg, #ff6a00, #ff3d00, #e11d48, #ff7a00, #ef4444);
      background-size: 500% 500%;
      animation: chemistry-orange-red-background 18s ease-in-out infinite;
    }
    @keyframes chemistry-orange-red-background {
      0% { background-position: 0% 50%; }
      25% { background-position: 100% 20%; }
      50% { background-position: 100% 80%; }
      75% { background-position: 0% 100%; }
      100% { background-position: 0% 50%; }
    }
    @media (prefers-reduced-motion: reduce) {
      body { animation: none; background: #f45a24; }
    }
  `;
  document.head.appendChild(backgroundStyle);

  // Element selection: exactly two soft flashes (blue, then green), followed
  // by a stable dark-orange glow.
  const selectionStyle = document.createElement("style");
  selectionStyle.textContent = `
    .element.selected-flash {
      animation: chemistry-element-selection 2.7s ease-in-out 1 both !important;
    }
    @keyframes chemistry-element-selection {
      0%, 15%, 45%, 75%, 100% {
        filter: brightness(1);
        box-shadow: 0 9px 22px rgba(194,65,12,.34);
      }
      30% {
        filter: brightness(1.12);
        box-shadow: 0 0 0 4px rgba(37,99,235,.28), 0 12px 26px rgba(37,99,235,.48);
      }
      60% {
        filter: brightness(1.12);
        box-shadow: 0 0 0 4px rgba(22,163,74,.28), 0 12px 26px rgba(22,163,74,.48);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .element.selected-flash {
        animation: none !important;
        box-shadow: 0 9px 22px rgba(194,65,12,.34) !important;
      }
    }
  `;
  document.head.appendChild(selectionStyle);

  const themeSelect = document.getElementById("table-theme-select");
  const tableShell = document.querySelector(".table-shell");

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

  function currentLanguage() { return document.documentElement.lang === "en" ? "en" : "fa"; }
  function applyTheme(themeId) {
    if (!tableShell) return;
    for (let i = 1; i <= 15; i++) tableShell.classList.remove("theme-" + i);
    const normalizedTheme = Number(themeId) >= 1 && Number(themeId) <= 15 ? Number(themeId) : 15;
    tableShell.classList.add("theme-pdf", "theme-" + normalizedTheme);
    localStorage.setItem("chemistry-pdf-theme", String(normalizedTheme));
  }
  function syncThemeSelect(forceDefault = false) {
    if (!themeSelect) return;
    const lang = currentLanguage();
    const saved = localStorage.getItem("chemistry-pdf-theme");
    const current = forceDefault ? "15" : (themeSelect.value || saved || "15");
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
    applyTheme(themeSelect.value);
  }
  function install() {
    if (!themeSelect) return;
    syncThemeSelect(true);
    themeSelect.addEventListener("change", event => applyTheme(event.target.value));
    new MutationObserver(() => syncThemeSelect(false)).observe(document.documentElement, {attributes: true, attributeFilter: ["lang"]});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, {once: true});
  else install();
})();
