(() => {
  "use strict";

  const DATA_URL = "data/PubChemElements_all.csv";
  const grid = document.getElementById("periodic-table-grid");
  const fBlock = document.getElementById("f-block");
  const status = document.getElementById("table-status");
  const languageButtons = document.querySelectorAll(".language-button");

  const translations = {
    fa: {
      brand: "مرجع شیمی", brandTagline: "یادگیری ساده، دقیق و مرحله‌ای",
      navPeriodic: "جدول تناوبی", navLevels: "سطوح آموزشی", navAbout: "درباره",
      heroTitle: "مرجع شیمی و جدول تناوبی",
      heroText: "یک نقطهٔ شروع ساده برای مشاهدهٔ جدول تناوبی و دسترسی سریع به اطلاعات عناصر، از سطح مبتدی تا پیشرفته.",
      heroButton: "مشاهده جدول تناوبی", periodicTitle: "جدول تناوبی",
      periodicSubtitle: "چیدمان ۱۸ گروهی بر اساس مرجع جدول تناوبی",
      levelsTitle: "سطوح آموزشی", levelsSubtitle: "اطلاعات دسته‌بندی‌شده برای مسیرهای مختلف یادگیری",
      beginnerTitle: "اطلاعات دسته‌بندی شده مبتدی", beginnerDescription: "مفاهیم پایه و مشخصات اصلی ۱۱۸ عنصر",
      professionalTitle: "اطلاعات دسته‌بندی شده حرفه‌ای", professionalDescription: "ویژگی‌های عددی و شیمیایی گسترده‌تر",
      advancedTitle: "اطلاعات دسته‌بندی شده پیشرفته", advancedDescription: "جزئیات تکمیلی برای مطالعهٔ عمیق‌تر",
      elementsCount: "عنصر در مجموعه", levelsCount: "سطح آموزشی", dataFormat: "منبع دادهٔ ساختاریافته",
      footerTitle: "مرجع شیمی", footerText: "پروژه‌ای برای دسترسی ساده‌تر به داده‌های عناصر شیمیایی.",
      backTop: "بازگشت به بالا ↑", loading: "در حال بارگذاری عناصر…",
      loaded: "عنصر از منبع داده بارگذاری شد.", elementDetails: "عدد اتمی",
      categoryUnknown: "دسته‌بندی نامشخص", loadError: "بارگذاری داده‌ها انجام نشد. صفحه را از طریق یک وب‌سرور محلی اجرا کنید."
    },
    en: {
      brand: "Chemistry Reference", brandTagline: "Simple, accurate, step-by-step learning",
      navPeriodic: "Periodic Table", navLevels: "Learning Levels", navAbout: "About",
      heroTitle: "Chemistry Reference & Periodic Table",
      heroText: "A simple starting point for exploring the periodic table and accessing element information from beginner to advanced levels.",
      heroButton: "View Periodic Table", periodicTitle: "Periodic Table",
      periodicSubtitle: "18-group layout based on the reference periodic table",
      levelsTitle: "Learning Levels", levelsSubtitle: "Organized information for different learning paths",
      beginnerTitle: "Beginner Information", beginnerDescription: "Core concepts and key facts for all 118 elements",
      professionalTitle: "Professional Information", professionalDescription: "Broader numerical and chemical properties",
      advancedTitle: "Advanced Information", advancedDescription: "Additional details for deeper study",
      elementsCount: "elements in the collection", levelsCount: "learning levels", dataFormat: "structured data source",
      footerTitle: "Chemistry Reference", footerText: "A project for easier access to chemical element data.",
      backTop: "Back to top ↑", loading: "Loading elements…",
      loaded: "elements loaded from the data source.", elementDetails: "Atomic number",
      categoryUnknown: "Unknown category", loadError: "The data could not be loaded. Please run the page through a local web server."
    }
  };

  // Main table positions: period -> group. F-block is rendered separately below group 3,
  // matching the reference PDF.
  const positions = new Map([
    [1,[1,1]],[2,[1,18]],[3,[2,1]],[4,[2,2]],[5,[2,13]],[6,[2,14]],[7,[2,15]],[8,[2,16]],[9,[2,17]],[10,[2,18]],
    [11,[3,1]],[12,[3,2]],[13,[3,13]],[14,[3,14]],[15,[3,15]],[16,[3,16]],[17,[3,17]],[18,[3,18]],
    [19,[4,1]],[20,[4,2]],[21,[4,3]],[22,[4,4]],[23,[4,5]],[24,[4,6]],[25,[4,7]],[26,[4,8]],[27,[4,9]],[28,[4,10]],[29,[4,11]],[30,[4,12]],[31,[4,13]],[32,[4,14]],[33,[4,15]],[34,[4,16]],[35,[4,17]],[36,[4,18]],
    [37,[5,1]],[38,[5,2]],[39,[5,3]],[40,[5,4]],[41,[5,5]],[42,[5,6]],[43,[5,7]],[44,[5,8]],[45,[5,9]],[46,[5,10]],[47,[5,11]],[48,[5,12]],[49,[5,13]],[50,[5,14]],[51,[5,15]],[52,[5,16]],[53,[5,17]],[54,[5,18]],
    [55,[6,1]],[56,[6,2]],[72,[6,4]],[73,[6,5]],[74,[6,6]],[75,[6,7]],[76,[6,8]],[77,[6,9]],[78,[6,10]],[79,[6,11]],[80,[6,12]],[81,[6,13]],[82,[6,14]],[83,[6,15]],[84,[6,16]],[85,[6,17]],[86,[6,18]],
    [87,[7,1]],[88,[7,2]],[104,[7,4]],[105,[7,5]],[106,[7,6]],[107,[7,7]],[108,[7,8]],[109,[7,9]],[110,[7,10]],[111,[7,11]],[112,[7,12]],[113,[7,13]],[114,[7,14]],[115,[7,15]],[116,[7,16]],[117,[7,17]],[118,[7,18]]
  ]);

  let currentLanguage = localStorage.getItem("chemistry-language") || "fa";

  function parseCsv(text) {
    const rows = [];
    let row = [], cell = "", quoted = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i], next = text[i + 1];
      if (ch === '"' && quoted && next === '"') { cell += '"'; i++; continue; }
      if (ch === '"') { quoted = !quoted; continue; }
      if (ch === "," && !quoted) { row.push(cell); cell = ""; continue; }
      if ((ch === "\n" || ch === "\r") && !quoted) {
        if (ch === "\r" && next === "\n") i++;
        row.push(cell); cell = "";
        if (row.some(value => value !== "")) rows.push(row);
        row = [];
        continue;
      }
      cell += ch;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    const headers = rows.shift() || [];
    return rows.map(values => Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""])));
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
    languageButtons.forEach(button => {
      const active = button.dataset.language === currentLanguage;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    localStorage.setItem("chemistry-language", currentLanguage);
    updateStatus();
  }

  function updateStatus() {
    const t = translations[currentLanguage];
    const count = grid.querySelectorAll(".element").length + fBlock.querySelectorAll(".element").length;
    if (count) status.textContent = count + " " + t.loaded;
  }

  function createElementCard(element) {
    const card = document.createElement("button");
    card.className = "element";
    card.type = "button";
    card.dataset.type = element.GroupBlock || "";
    card.setAttribute("aria-label", element.Name + ", " + translations[currentLanguage].elementDetails + " " + element.AtomicNumber);

    const number = document.createElement("span");
    number.className = "element-number";
    number.textContent = element.AtomicNumber;

    const symbol = document.createElement("span");
    symbol.className = "element-symbol";
    symbol.textContent = element.Symbol;

    const name = document.createElement("span");
    name.className = "element-name";
    name.textContent = element.Name;

    card.append(number, symbol, name);
    card.addEventListener("click", () => {
      const t = translations[currentLanguage];
      status.textContent = element.Name + " (" + element.Symbol + ") — " + t.elementDetails + " " + element.AtomicNumber + " — " + (element.GroupBlock || t.categoryUnknown);
    });
    return card;
  }

  function createFRow(elements, start, end) {
    const row = document.createElement("div");
    row.className = "f-row";

    for (let i = 0; i < 2; i++) {
      const spacer = document.createElement("span");
      spacer.className = "f-spacer";
      row.appendChild(spacer);
    }

    elements.filter(element => {
      const number = Number(element.AtomicNumber);
      return number >= start && number <= end;
    }).forEach(element => row.appendChild(createElementCard(element)));

    const finalSpacer = document.createElement("span");
    finalSpacer.className = "f-spacer";
    row.appendChild(finalSpacer);
    return row;
  }

  async function loadElements() {
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) throw new Error("fetch failed");

      const elements = parseCsv(await response.text()).filter(element => element.AtomicNumber);
      grid.innerHTML = "";
      fBlock.innerHTML = "";

      elements.forEach(element => {
        const position = positions.get(Number(element.AtomicNumber));
        if (!position) return;
        const card = createElementCard(element);
        card.style.gridColumn = position[1];
        card.style.gridRow = position[0];
        grid.appendChild(card);
      });

      fBlock.append(
        createFRow(elements, 57, 71),
        createFRow(elements, 89, 103)
      );

      updateStatus();
    } catch (error) {
      const t = translations[currentLanguage];
      grid.innerHTML = '<div class="loading">' + t.loadError + '</div>';
      fBlock.innerHTML = "";
      status.textContent = DATA_URL;
    }
  }

  languageButtons.forEach(button => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });

  setLanguage(currentLanguage);
  loadElements();
})();