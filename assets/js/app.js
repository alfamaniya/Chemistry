import { translations, valueTranslations, getName, setLanguage } from "./core/i18n.js";
import { loadElementData } from "./core/data.js";
import { mountPeriodicTable } from "./components/periodic-table/periodic-table.js";
import { createElementDetailsController } from "./components/element-details/element-details.js";

(() => {
  "use strict";

  const selectedElementBox = document.getElementById("selected-element");
  const beginnerInfo = document.getElementById("beginner-info");
  const advancedInfo = document.getElementById("advanced-info");
  const veryAdvancedInfo = document.getElementById("very-advanced-info");
  const tableStatus = document.getElementById("table-status");
  const languageButtons = document.querySelectorAll(".language-button");

  let currentLanguage = localStorage.getItem("chemistry-language") || "fa";
  let elements = [];
  let selectedAtomicNumber = null;

  const elementDetails = createElementDetailsController({
    getLanguage: () => currentLanguage,
    translations,
    valueTranslations,
    getName
  });

  const periodicTable = mountPeriodicTable({
    getLanguage: () => currentLanguage,
    onElementSelected: atomicNumber => {
      selectedAtomicNumber = atomicNumber;
      elementDetails.render(selectedAtomicNumber);
    }
  });

  function applyLanguage(language) {
    currentLanguage = setLanguage(language, {
      fBlock: document.getElementById("f-block"),
      languageButtons,
      onLanguageChanged: languageValue => {
        currentLanguage = languageValue;
        if (elements.length) periodicTable.render(elements);
        if (selectedAtomicNumber) elementDetails.render(selectedAtomicNumber);
      }
    });
  }

  async function loadElements() {
    try {
      const data = await loadElementData();
      elements = data.elements;
      elementDetails.setData(data);
      periodicTable.render(elements);
    } catch (error) {
      console.error(error);
      const t = translations[currentLanguage];
      document.getElementById("periodic-table-grid").innerHTML = '<div class="loading">' + t.loadError + '</div>';
      document.getElementById("f-block").innerHTML = "";
      if (tableStatus) tableStatus.textContent = t.loadError;
      selectedElementBox.innerHTML = '<div class="empty-state">' + t.loadError + '</div>';
      beginnerInfo.innerHTML = "";
      advancedInfo.innerHTML = "";
      veryAdvancedInfo.innerHTML = "";
    }
  }

  document.addEventListener("chemistry:language-change", event => applyLanguage(event.detail?.language || currentLanguage));
  applyLanguage(currentLanguage);
  loadElements();
})();
