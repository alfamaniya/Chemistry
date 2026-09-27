import { translations, valueTranslations, getName, setLanguage } from "./core/i18n.js";
import { loadElementData } from "./core/data.js";

(() => {
  "use strict";

  const grid = document.getElementById("periodic-table-grid");
  const fBlock = document.getElementById("f-block");
  const status = document.getElementById("table-status");
  const selectedElementBox = document.getElementById("selected-element");
  const beginnerInfo = document.getElementById("beginner-info");
  const advancedInfo = document.getElementById("advanced-info");
  const veryAdvancedInfo = document.getElementById("very-advanced-info");
  const languageButtons = document.querySelectorAll(".language-button");

  const fieldLabels = {
    AtomicNumber: "atomicNumber", Symbol: "symbol", Name: "name", NameFa: "name",
    AtomicMass: "atomicMass", CPKHexColor: "cpkColor", ElectronConfiguration: "electronConfiguration",
    Electronegativity: "electronegativity", AtomicRadius: "atomicRadius", IonizationEnergy: "ionizationEnergy",
    ElectronAffinity: "electronAffinity", OxidationStates: "oxidationStates", StandardState: "standardState",
    MeltingPoint: "meltingPoint", BoilingPoint: "boilingPoint", Density: "density", GroupBlock: "groupBlock",
    YearDiscovered: "yearDiscovered", data_status: "dataStatus", dataStatus: "dataStatus"
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

  function updateStatus(message) {
    const t = translations[currentLanguage];
    if (message) { status.textContent = message; return; }
    const count = grid.querySelectorAll(".element").length + fBlock.querySelectorAll(".element").length;
    if (count) status.textContent = count + " " + t.loaded;
  }

  function createElementCard(element) {
    const card = document.createElement("button");
    card.className = "element";
    card.type = "button";
    card.dataset.type = element.GroupBlock || "";
    card.dataset.atomicNumber = element.AtomicNumber;
    card.setAttribute("aria-label", getName(element, currentLanguage) + ", " + translations[currentLanguage].elementDetails + " " + element.AtomicNumber);
    const number = document.createElement("span"); number.className = "element-number"; number.textContent = element.AtomicNumber;
    const symbol = document.createElement("span"); symbol.className = "element-symbol"; symbol.textContent = element.Symbol;
    const name = document.createElement("span"); name.className = "element-name"; name.textContent = getName(element, currentLanguage);
    card.append(number, symbol, name);
    card.addEventListener("click", () => {
      selectedAtomicNumber = Number(element.AtomicNumber);
      renderElementDetails(selectedAtomicNumber);
      const t = translations[currentLanguage];
      updateStatus(getName(element, currentLanguage) + " (" + element.Symbol + ") — " + t.elementDetails + " " + element.AtomicNumber);
      document.querySelectorAll(".element.selected").forEach(node => node.classList.remove("selected"));
      card.classList.remove("selected-flash");
      void card.offsetWidth;
      card.classList.add("selected", "selected-flash");
      card.addEventListener("animationend", () => card.classList.remove("selected-flash"), { once: true });
    });
    return card;
  }

  function createFRow(source, start, end) {
    const row = document.createElement("div"); row.className = "f-row";
    for (let i = 0; i < 2; i++) { const spacer = document.createElement("span"); spacer.className = "f-spacer"; row.appendChild(spacer); }
    source.filter(element => { const number = Number(element.AtomicNumber); return number >= start && number <= end; }).forEach(element => row.appendChild(createElementCard(element)));
    const finalSpacer = document.createElement("span"); finalSpacer.className = "f-spacer"; row.appendChild(finalSpacer);
    return row;
  }

  function renderPeriodicTable() {
    grid.innerHTML = ""; fBlock.innerHTML = "";
    elements.forEach(element => {
      const position = positions.get(Number(element.AtomicNumber));
      if (!position) return;
      const card = createElementCard(element);
      if (selectedAtomicNumber === Number(element.AtomicNumber)) card.classList.add("selected");
      card.style.gridColumn = position[1]; card.style.gridRow = position[0]; grid.appendChild(card);
    });
    fBlock.append(createFRow(elements, 57, 71), createFRow(elements, 89, 103));
  }

  function getRowByAtomicNumber(source, atomicNumber) {
    return source.find(row => Number(row.AtomicNumber || row.atomic_number || row.atomicNumber) === Number(atomicNumber));
  }
  function isUsable(value) { return value !== undefined && value !== null && String(value).trim() !== ""; }
  function formatValue(value, key) {
    if (!isUsable(value)) return "—";
    const dictionary = valueTranslations[key];
    if (dictionary && dictionary[currentLanguage] && dictionary[currentLanguage][String(value)] !== undefined) return dictionary[currentLanguage][String(value)];
    return String(value);
  }
  function createDataGrid(data, keys) {
    const t = translations[currentLanguage];
    const gridNode = document.createElement("div"); gridNode.className = "data-grid";
    keys.forEach(key => {
      if (!isUsable(data?.[key])) return;
      const item = document.createElement("div"); item.className = "data-item";
      const label = document.createElement("span"); label.className = "data-label"; label.textContent = t[fieldLabels[key]] || key;
      const value = document.createElement("span"); value.className = "data-value"; value.textContent = formatValue(data[key], key);
      item.append(label, value); gridNode.appendChild(item);
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
      beginnerInfo.innerHTML = '<div class="empty-state">—</div>'; advancedInfo.innerHTML = '<div class="empty-state">—</div>'; veryAdvancedInfo.innerHTML = '<div class="empty-state">—</div>'; return;
    }
    selectedElementBox.innerHTML = "";
    const identity = document.createElement("div"); identity.className = "selected-identity";
    const symbol = document.createElement("span"); symbol.className = "selected-symbol"; symbol.textContent = beginner.Symbol;
    const names = document.createElement("div"); names.className = "selected-names";
    const title = document.createElement("strong"); title.textContent = getName(beginner, currentLanguage);
    const subtitle = document.createElement("small"); subtitle.textContent = currentLanguage === "fa" ? beginner.Name : beginner.NameFa;
    names.append(title, subtitle); identity.append(symbol, names); selectedElementBox.appendChild(identity);
    selectedElementBox.appendChild(createDataGrid(beginner, ["AtomicNumber", "AtomicMass", "GroupBlock", "StandardState", "ElectronConfiguration", "OxidationStates"]));
    beginnerInfo.innerHTML = ""; beginnerInfo.appendChild(createDataGrid(beginner, ["AtomicNumber", "Symbol", "AtomicMass", "StandardState", "GroupBlock", "YearDiscovered"]));
    advancedInfo.innerHTML = ""; advancedInfo.appendChild(createDataGrid(advanced, ["AtomicNumber", "Symbol", "AtomicMass", "GroupBlock", "StandardState", "ElectronConfiguration", "OxidationStates", "Electronegativity", "AtomicRadius", "IonizationEnergy", "ElectronAffinity", "MeltingPoint", "BoilingPoint", "Density"]));
    veryAdvancedInfo.innerHTML = ""; veryAdvancedInfo.appendChild(createDataGrid(veryAdvanced, ["AtomicNumber", "Symbol", "AtomicMass", "GroupBlock", "StandardState", "ElectronConfiguration", "OxidationStates", "Electronegativity", "AtomicRadius", "IonizationEnergy", "ElectronAffinity", "MeltingPoint", "BoilingPoint", "Density", "YearDiscovered", "data_status"]));
  }
  function applyLanguage(language) {
    currentLanguage = setLanguage(language, {
      fBlock,
      languageButtons,
      onLanguageChanged: languageValue => {
        currentLanguage = languageValue;
        if (elements.length) renderPeriodicTable();
        if (selectedAtomicNumber) renderElementDetails(selectedAtomicNumber);
        updateStatus();
      }
    });
  }
  async function loadElements() {
    try {
      const data = await loadElementData();
      elements = data.elements; advancedElements = data.advancedElements; veryAdvancedElements = data.veryAdvancedElements;
      renderPeriodicTable(); updateStatus();
    } catch (error) {
      console.error(error);
      const t = translations[currentLanguage];
      grid.innerHTML = '<div class="loading">' + t.loadError + '</div>'; fBlock.innerHTML = "";
      selectedElementBox.innerHTML = '<div class="empty-state">' + t.loadError + '</div>';
      beginnerInfo.innerHTML = ""; advancedInfo.innerHTML = ""; veryAdvancedInfo.innerHTML = ""; status.textContent = t.loadError;
    }
  }

  document.addEventListener("chemistry:language-change", event => applyLanguage(event.detail?.language || currentLanguage));
  applyLanguage(currentLanguage);
  loadElements();
})();
