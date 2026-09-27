(() => {
  "use strict";

  const DATA_URL = "data/PubChemElements_all.csv";
  const ADVANCED_URL = "data/ELEMENTS_118_ADVANCED.csv";
  const VERY_ADVANCED_URL = "data/ELEMENTS_118_VERY_ADVANCED.csv";

  const grid = document.getElementById("periodic-table-grid");
  const fBlock = document.getElementById("f-block");
  const status = document.getElementById("table-status");
  const selectedElementBox = document.getElementById("selected-element");
  const beginnerInfo = document.getElementById("beginner-info");
  const advancedInfo = document.getElementById("advanced-info");
  const veryAdvancedInfo = document.getElementById("very-advanced-info");
  const languageButtons = document.querySelectorAll(".language-button");

  const translations = {
    fa: {
      eyebrow: "شیمی • عناصر", quickInfoAria: "راهنمای سریع", fBlockAria: "لانتانیدها و اکتینیدها", brand: "مرجع شیمی", brandTagline: "یادگیری ساده، دقیق و مرحله‌ای",
      navPeriodic: "جدول تناوبی", navLevels: "سطوح آموزشی", navAbout: "درباره",
      heroTitle: "مرجع شیمی و جدول تناوبی",
      heroText: "یک مسیر روشن برای شناخت عناصر شیمیایی؛ از شناخت بنیادین تا ژرف‌کاوی علمی.",
      heroButton: "مشاهده جدول تناوبی", periodicTitle: "جدول تناوبی",
      periodicSubtitle: "چیدمان ۱۸ گروهی بر اساس مرجع جدول تناوبی",
      levelsTitle: "لایه‌های دانش", levelsSubtitle: "اطلاعات عنصر انتخاب‌شده در سه لایهٔ دانشی",
      beginnerTitle: "شناخت بنیادین", beginnerDescription: "داده‌های پایه و ضروری برای درک عنصر",
      professionalTitle: "تحلیل تخصصی", professionalDescription: "ویژگی‌ها و روابط گسترده‌تر برای بررسی دقیق‌تر",
      veryAdvancedTitle: "ژرف‌کاوی علمی",
      advancedDescription: "جزئیات عمیق‌تر برای بررسی جامع عنصر",
      elementsCount: "عنصر در مجموعه", levelsCount: "سطح آموزشی", dataFormat: "منبع دادهٔ ساختاریافته",
      footerTitle: "مرجع شیمی", footerText: "پروژه‌ای برای دسترسی ساده‌تر به داده‌های عناصر شیمیایی.",
      backTop: "بازگشت به بالا ↑", loading: "در حال بارگذاری عناصر…",
      loaded: "عنصر از منبع داده بارگذاری شد.", elementDetails: "عدد اتمی",
      categoryUnknown: "دسته‌بندی نامشخص", loadError: "بارگذاری داده‌ها انجام نشد. صفحه را از طریق یک وب‌سرور محلی اجرا کنید.",
      themeSelectLabel: "دسته‌بندی رنگ جدول", themeSelectDescription: "یکی از ۱۴ دسته‌بندی PDF یا حالت «بدون دسته‌بندی» را انتخاب کنید.",
      selectedElementTitle: "اطلاعات مختصر عنصر",
      selectedElementSubtitle: "برای دیدن اطلاعات، یکی از عناصر جدول را انتخاب کنید.",
      selectElement: "یک عنصر را از جدول انتخاب کنید.",
      atomicNumber: "عدد اتمی", symbol: "نماد", name: "نام", atomicMass: "جرم اتمی",
      groupBlock: "دسته", standardState: "حالت استاندارد", electronConfiguration: "آرایش الکترونی",
      oxidationStates: "حالت‌های اکسایش", electronegativity: "الکترونگاتیویته",
      atomicRadius: "شعاع اتمی (pm)", ionizationEnergy: "انرژی یونش (eV)",
      electronAffinity: "الکترون‌خواهی (eV)", meltingPoint: "نقطه ذوب (K)",
      boilingPoint: "نقطه جوش (K)", density: "چگالی (g/cm³)", yearDiscovered: "سال کشف",
      dataStatus: "وضعیت داده", cpkColor: "رنگ CPK"
    },
    en: {
      eyebrow: "CHEMISTRY • ELEMENTS", quickInfoAria: "Quick facts", fBlockAria: "Lanthanides and Actinides", brand: "Chemistry Reference", brandTagline: "Simple, accurate, step-by-step learning",
      navPeriodic: "Periodic Table", navLevels: "Learning Levels", navAbout: "About",
      heroTitle: "Chemistry Reference & Periodic Table",
      heroText: "A clear path to understanding chemical elements — from foundational knowledge to deep scientific exploration.",
      heroButton: "View Periodic Table", periodicTitle: "Periodic Table",
      periodicSubtitle: "18-group layout based on the reference periodic table",
      levelsTitle: "Knowledge Layers", levelsSubtitle: "Information for the selected element across three knowledge layers",
      beginnerTitle: "Foundational Insight", beginnerDescription: "Essential data for understanding the element",
      professionalTitle: "Specialized Analysis", professionalDescription: "Broader properties for deeper examination",
      veryAdvancedTitle: "Scientific Deep Dive", advancedDescription: "In-depth details for comprehensive exploration",
      elementsCount: "elements in the collection", levelsCount: "learning levels", dataFormat: "structured data source",
      footerTitle: "Chemistry Reference", footerText: "A project for easier access to chemical element data.",
      backTop: "Back to top ↑", loading: "Loading elements…",
      loaded: "elements loaded from the data source.", elementDetails: "Atomic number",
      categoryUnknown: "Unknown category", loadError: "The data could not be loaded. Please run the page through a local web server.",
      themeSelectLabel: "Table Color Category", themeSelectDescription: "Choose one of the 14 PDF categories or the “Uncategorized” default mode.",
      selectedElementTitle: "Selected Element — Quick Information",
      selectedElementSubtitle: "Select an element from the table to view its information.",
      selectElement: "Select an element from the table.",
      atomicNumber: "Atomic number", symbol: "Symbol", name: "Name", atomicMass: "Atomic mass",
      groupBlock: "Group / block", standardState: "Standard state", electronConfiguration: "Electron configuration",
      oxidationStates: "Oxidation states", electronegativity: "Electronegativity",
      atomicRadius: "Atomic radius (pm)", ionizationEnergy: "Ionization energy (eV)",
      electronAffinity: "Electron affinity (eV)", meltingPoint: "Melting point (K)",
      boilingPoint: "Boiling point (K)", density: "Density (g/cm³)", yearDiscovered: "Year discovered",
      dataStatus: "Data status", cpkColor: "CPK color"
    }
  };

  const fieldLabels = {
    AtomicNumber: "atomicNumber", Symbol: "symbol", Name: "name", NameFa: "name",
    AtomicMass: "atomicMass", CPKHexColor: "cpkColor", ElectronConfiguration: "electronConfiguration",
    Electronegativity: "electronegativity", AtomicRadius: "atomicRadius",
    IonizationEnergy: "ionizationEnergy", ElectronAffinity: "electronAffinity",
    OxidationStates: "oxidationStates", StandardState: "standardState",
    MeltingPoint: "meltingPoint", BoilingPoint: "boilingPoint", Density: "density",
    GroupBlock: "groupBlock", YearDiscovered: "yearDiscovered", data_status: "dataStatus",
    dataStatus: "dataStatus"
  };

  const valueTranslations = {
    GroupBlock: {
      fa: {
        "Nonmetal": "نافلز", "Noble gas": "گاز نجیب", "Alkali metal": "فلز قلیایی",
        "Alkaline earth metal": "فلز قلیایی خاکی", "Metalloid": "شبه‌فلز",
        "Transition metal": "فلز واسطه", "Post-transition metal": "فلز پس‌واسطه",
        "Lanthanide": "لانتانید", "Actinide": "اکتینید", "Halogen": "هالوژن"
      },
      en: {
        "Nonmetal": "Nonmetal", "Noble gas": "Noble gas", "Alkali metal": "Alkali metal",
        "Alkaline earth metal": "Alkaline earth metal", "Metalloid": "Metalloid",
        "Transition metal": "Transition metal", "Post-transition metal": "Post-transition metal",
        "Lanthanide": "Lanthanide", "Actinide": "Actinide", "Halogen": "Halogen"
      }
    },
    StandardState: {
      fa: {
        "Gas": "گاز", "Solid": "جامد", "Liquid": "مایع",
        "Expected to be a Solid": "احتمالاً جامد", "Expected to be a Gas": "احتمالاً گاز"
      },
      en: {
        "Gas": "Gas", "Solid": "Solid", "Liquid": "Liquid",
        "Expected to be a Solid": "Expected to be a Solid", "Expected to be a Gas": "Expected to be a Gas"
      }
    },
    data_status: {
      fa: { "predicted_or_estimated": "پیش‌بینی‌شده / برآوردشده" },
      en: { "predicted_or_estimated": "predicted / estimated" }
    },
    YearDiscovered: {
      fa: { "Ancient": "باستانی" },
      en: { "Ancient": "Ancient" }
    }
  };

  const positions = new Map([
    [1,[1,1]],[2,[1,18]],[3,[2,1]],[4,[2,2]],[5,[2,13]],[6,[2,14]],[7,[2,15]],[8,[2,16]],[9,[2,17]],[10,[2,18]],
    [11,[3,1]],[12,[3,2]],[13,[3,13]],[14,[3,14]],[15,[3,15]],[16,[3,16]],[17,[3,17]],[18,[3,18]],
    [19,[4,1]],[20,[4,2]],[21,[4,3]],[22,[4,4]],[23,[4,5]],[24,[4,6]],[25,[4,7]],[26,[4,8]],[27,[4,9]],[28,[4,10]],[29,[4,11]],[30,[4,12]],[31,[4,13]],[32,[4,14]],[33,[4,15]],[34,[4,16]],[35,[4,17]],[36,[4,18]],
    [37,[5,1]],[38,[5,2]],[39,[5,3]],[40,[5,4]],[41,[5,5]],[42,[5,6]],[43,[5,7]],[44,[5,8]],[45,[5,9]],[46,[5,10]],[47,[5,11]],[48,[5,12]],[49,[5,13]],[50,[5,14]],[51,[5,15]],[52,[5,16]],[53,[5,17]],[54,[5,18]],
    [55,[6,1]],[56,[6,2]],[72,[6,4]],[73,[6,5]],[74,[6,6]],[75,[6,7]],[76,[6,8]],[77,[6,9]],[78,[6,10]],[79,[6,11]],[80,[6,12]],[81,[6,13]],[82,[6,14]],[83,[6,15]],[84,[6,16]],[85,[6,17]],[86,[6,18]],
    [87,[7,1]],[88,[7,2]],[104,[7,4]],[105,[7,5]],[106,[7,6]],[107,[7,7]],[108,[7,8]],[109,[7,9]],[110,[7,10]],[111,[7,11]],[112,[7,12]],[113,[7,13]],[114,[7,14]],[115,[7,15]],[116,[7,16]],[117,[7,17]],[118,[7,18]]
  ]);

  let currentLanguage = localStorage.getItem("chemistry-language") || "fa";
  let elements = [];
  let advancedElements = [];
  let veryAdvancedElements = [];
  let selectedAtomicNumber = null;

  function parseCsv(text) {
    const rows = [];
    let row = [], cell = "", quoted = false;
    const source = String(text).replace(/^\uFEFF/, "");

    for (let i = 0; i < source.length; i++) {
      const ch = source[i], next = source[i + 1];
      if (ch === '"' && quoted && next === '"') { cell += '"'; i++; continue; }
      if (ch === '"') { quoted = !quoted; continue; }
      if (ch === ',' && !quoted) { row.push(cell); cell = ""; continue; }
      if ((ch === "\n" || ch === "\r") && !quoted) {
        if (ch === "\r" && next === "\n") i++;
        row.push(cell); cell = "";
        if (row.some(value => value !== "")) rows.push(row);
        row = [];
        continue;
      }
      cell += ch;
    }

    if (quoted) throw new Error("Malformed CSV: unclosed quoted field");
    if (cell || row.length) { row.push(cell); rows.push(row); }

    const headers = (rows.shift() || []).map(header => header.trim());
    if (!headers.length || headers.some(header => !header)) throw new Error("Malformed CSV: missing or empty header");

    const validRows = [];
    let malformedRows = 0;
    rows.forEach(values => {
      if (values.length !== headers.length) {
        malformedRows++;
        return;
      }
      validRows.push(Object.fromEntries(headers.map((header, i) => [header, values[i]])));
    });

    if (malformedRows) console.warn(`Ignored ${malformedRows} malformed CSV row(s)`);
    return validRows;
  }

  function getName(element) {
    return currentLanguage === "fa" ? (element.NameFa || element.Name) : element.Name;
  }

  function setLanguage(language) {
    currentLanguage = language === "en" ? "en" : "fa";
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

    languageButtons.forEach(button => {
      const active = button.dataset.language === currentLanguage;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    localStorage.setItem("chemistry-language", currentLanguage);

    if (elements.length) renderPeriodicTable();
    if (selectedAtomicNumber) renderElementDetails(selectedAtomicNumber);
    updateStatus();
  }

  function updateStatus(message) {
    const t = translations[currentLanguage];
    if (message) {
      status.textContent = message;
      return;
    }
    const count = grid.querySelectorAll(".element").length + fBlock.querySelectorAll(".element").length;
    if (count) status.textContent = count + " " + t.loaded;
  }

  function createElementCard(element) {
    const card = document.createElement("button");
    card.className = "element";
    card.type = "button";
    card.dataset.type = element.GroupBlock || "";
    card.dataset.atomicNumber = element.AtomicNumber;
    card.setAttribute("aria-label", getName(element) + ", " + translations[currentLanguage].elementDetails + " " + element.AtomicNumber);

    const number = document.createElement("span");
    number.className = "element-number";
    number.textContent = element.AtomicNumber;

    const symbol = document.createElement("span");
    symbol.className = "element-symbol";
    symbol.textContent = element.Symbol;

    const name = document.createElement("span");
    name.className = "element-name";
    name.textContent = getName(element);

    card.append(number, symbol, name);
    card.addEventListener("click", () => {
      selectedAtomicNumber = Number(element.AtomicNumber);
      renderElementDetails(selectedAtomicNumber);
      const t = translations[currentLanguage];
      updateStatus(getName(element) + " (" + element.Symbol + ") — " + t.elementDetails + " " + element.AtomicNumber);

      document.querySelectorAll(".element.selected").forEach(node => node.classList.remove("selected"));
      card.classList.remove("selected-flash");
      void card.offsetWidth;
      card.classList.add("selected", "selected-flash");
      card.addEventListener("animationend", () => card.classList.remove("selected-flash"), { once: true });
    });
    return card;
  }

  function createFRow(source, start, end) {
    const row = document.createElement("div");
    row.className = "f-row";

    for (let i = 0; i < 2; i++) {
      const spacer = document.createElement("span");
      spacer.className = "f-spacer";
      row.appendChild(spacer);
    }

    source.filter(element => {
      const number = Number(element.AtomicNumber);
      return number >= start && number <= end;
    }).forEach(element => row.appendChild(createElementCard(element)));

    const finalSpacer = document.createElement("span");
    finalSpacer.className = "f-spacer";
    row.appendChild(finalSpacer);
    return row;
  }

  function renderPeriodicTable() {
    grid.innerHTML = "";
    fBlock.innerHTML = "";

    elements.forEach(element => {
      const position = positions.get(Number(element.AtomicNumber));
      if (!position) return;
      const card = createElementCard(element);
      if (selectedAtomicNumber === Number(element.AtomicNumber)) card.classList.add("selected");
      card.style.gridColumn = position[1];
      card.style.gridRow = position[0];
      grid.appendChild(card);
    });

    fBlock.append(createFRow(elements, 57, 71), createFRow(elements, 89, 103));
  }

  function getRowByAtomicNumber(source, atomicNumber) {
    return source.find(row => Number(row.AtomicNumber || row.atomic_number || row.atomicNumber) === Number(atomicNumber));
  }

  function isUsable(value) {
    return value !== undefined && value !== null && String(value).trim() !== "";
  }

  function formatValue(value, key) {
    if (!isUsable(value)) return "—";
    const dictionary = valueTranslations[key];
    if (dictionary && dictionary[currentLanguage] && dictionary[currentLanguage][String(value)] !== undefined) return dictionary[currentLanguage][String(value)];
    return String(value);
  }

  function createDataGrid(data, keys) {
    const t = translations[currentLanguage];
    const gridNode = document.createElement("div");
    gridNode.className = "data-grid";

    keys.forEach(key => {
      if (!isUsable(data?.[key])) return;
      const item = document.createElement("div");
      item.className = "data-item";
      const label = document.createElement("span");
      label.className = "data-label";
      label.textContent = t[fieldLabels[key]] || key;
      const value = document.createElement("span");
      value.className = "data-value";
      value.textContent = formatValue(data[key], key);
      item.append(label, value);
      gridNode.appendChild(item);
    });

    if (!gridNode.children.length) gridNode.innerHTML = '<div class="empty-state">—</div>';
    return gridNode;
  }

  function renderElementDetails(atomicNumber) {
    const beginner = getRowByAtomicNumber(elements, atomicNumber);
    const advanced = getRowByAtomicNumber(advancedElements, atomicNumber);
    const veryAdvanced = getRowByAtomicNumber(veryAdvancedElements, atomicNumber);

    if (!beginner) {
      selectedElementBox.innerHTML = '<div class="empty-state">' + translations[currentLanguage].selectElement + '</div>';
      beginnerInfo.innerHTML = '<div class="empty-state">—</div>';
      advancedInfo.innerHTML = '<div class="empty-state">—</div>';
      veryAdvancedInfo.innerHTML = '<div class="empty-state">—</div>';
      return;
    }

    selectedElementBox.innerHTML = "";
    const identity = document.createElement("div");
    identity.className = "selected-identity";
    const symbol = document.createElement("span");
    symbol.className = "selected-symbol";
    symbol.textContent = beginner.Symbol;
    const names = document.createElement("div");
    names.className = "selected-names";
    const title = document.createElement("strong");
    title.textContent = getName(beginner);
    const subtitle = document.createElement("small");
    subtitle.textContent = currentLanguage === "fa" ? beginner.Name : beginner.NameFa;
    names.append(title, subtitle);
    identity.append(symbol, names);
    selectedElementBox.appendChild(identity);
    selectedElementBox.appendChild(createDataGrid(beginner, ["AtomicNumber", "AtomicMass", "GroupBlock", "StandardState", "ElectronConfiguration", "OxidationStates"]));

    beginnerInfo.innerHTML = "";
    beginnerInfo.appendChild(createDataGrid(beginner, ["AtomicNumber", "Symbol", "AtomicMass", "StandardState", "GroupBlock", "YearDiscovered"]));
    advancedInfo.innerHTML = "";
    advancedInfo.appendChild(createDataGrid(advanced, ["AtomicNumber", "Symbol", "AtomicMass", "GroupBlock", "StandardState", "ElectronConfiguration", "OxidationStates", "Electronegativity", "AtomicRadius", "IonizationEnergy", "ElectronAffinity", "MeltingPoint", "BoilingPoint", "Density"]));
    veryAdvancedInfo.innerHTML = "";
    veryAdvancedInfo.appendChild(createDataGrid(veryAdvanced, ["AtomicNumber", "Symbol", "AtomicMass", "GroupBlock", "StandardState", "ElectronConfiguration", "OxidationStates", "Electronegativity", "AtomicRadius", "IonizationEnergy", "ElectronAffinity", "MeltingPoint", "BoilingPoint", "Density", "YearDiscovered", "data_status"]));
  }

  async function fetchCsv(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch " + url);
    return parseCsv(await response.text());
  }

  function normalizeDetailRow(row) {
    return {
      ...row,
      AtomicNumber: row.AtomicNumber ?? row.atomic_number,
      Symbol: row.Symbol ?? row.symbol,
      Name: row.Name ?? row.name,
      AtomicMass: row.AtomicMass ?? row.atomic_mass,
      GroupBlock: row.GroupBlock ?? row.group_block,
      StandardState: row.StandardState ?? row.standard_state,
      ElectronConfiguration: row.ElectronConfiguration ?? row.electron_configuration,
      OxidationStates: row.OxidationStates ?? row.oxidation_states,
      Electronegativity: row.Electronegativity ?? row.electronegativity,
      AtomicRadius: row.AtomicRadius ?? row.atomic_radius_pm,
      IonizationEnergy: row.IonizationEnergy ?? row.ionization_energy_eV,
      ElectronAffinity: row.ElectronAffinity ?? row.electron_affinity_eV,
      MeltingPoint: row.MeltingPoint ?? row.melting_point_K,
      BoilingPoint: row.BoilingPoint ?? row.boiling_point_K,
      Density: row.Density ?? row.density_g_cm3,
      YearDiscovered: row.YearDiscovered ?? row.year_discovered,
      data_status: row.data_status ?? row.dataStatus
    };
  }

  async function loadElements() {
    try {
      const [pubchem, advanced, veryAdvanced] = await Promise.all([fetchCsv(DATA_URL), fetchCsv(ADVANCED_URL), fetchCsv(VERY_ADVANCED_URL)]);
      elements = pubchem.filter(element => element.AtomicNumber);
      advancedElements = advanced.filter(element => element.atomic_number || element.AtomicNumber).map(normalizeDetailRow);
      veryAdvancedElements = veryAdvanced.filter(element => element.atomic_number || element.AtomicNumber).map(normalizeDetailRow);
      renderPeriodicTable();
      updateStatus();
    } catch (error) {
      console.error(error);
      const t = translations[currentLanguage];
      grid.innerHTML = '<div class="loading">' + t.loadError + '</div>';
      fBlock.innerHTML = "";
      selectedElementBox.innerHTML = '<div class="empty-state">' + t.loadError + '</div>';
      beginnerInfo.innerHTML = "";
      advancedInfo.innerHTML = "";
      veryAdvancedInfo.innerHTML = "";
      status.textContent = t.loadError;
    }
  }

  languageButtons.forEach(button => button.addEventListener("click", () => setLanguage(button.dataset.language)));
  setLanguage(currentLanguage);
  loadElements();
})();