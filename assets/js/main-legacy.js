import { translations, valueTranslations, getName, setLanguage } from "./core/i18n.js";
import { loadElementData } from "./core/data.js";
import { mountPeriodicTable } from "./components/periodic-table/periodic-table.js";

(() => {
  "use strict";

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

  let currentLanguage = localStorage.getItem("chemistry-language") || "fa";
  let elements = [];
  let advancedElements = [];
  let veryAdvancedElements = [];
  let selectedAtomicNumber = null;

  const periodicTable = mountPeriodicTable({
    getLanguage: () => currentLanguage,
    onElementSelected: atomicNumber => {
      selectedAtomicNumber = atomicNumber;
      renderElementDetails(selectedAtomicNumber);
    }
  });

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
      fBlock: document.getElementById("f-block"),
      languageButtons,
      onLanguageChanged: languageValue => {
        currentLanguage = languageValue;
        if (elements.length) periodicTable.render(elements);
        if (selectedAtomicNumber) renderElementDetails(selectedAtomicNumber);
        periodicTable.updateStatus();
      }
    });
  }

  async function loadElements() {
    try {
      const data = await loadElementData();
      elements = data.elements;
      advancedElements = data.advancedElements;
      veryAdvancedElements = data.veryAdvancedElements;
      periodicTable.render(elements);
    } catch (error) {
      console.error(error);
      const t = translations[currentLanguage];
      document.getElementById("periodic-table-grid").innerHTML = '<div class="loading">' + t.loadError + '</div>';
      document.getElementById("f-block").innerHTML = "";
      selectedElementBox.innerHTML = '<div class="empty-state">' + t.loadError + '</div>';
      beginnerInfo.innerHTML = ""; advancedInfo.innerHTML = ""; veryAdvancedInfo.innerHTML = "";
      document.getElementById("table-status").textContent = t.loadError;
    }
  }

  document.addEventListener("chemistry:language-change", event => applyLanguage(event.detail?.language || currentLanguage));
  applyLanguage(currentLanguage);
  loadElements();
})();
