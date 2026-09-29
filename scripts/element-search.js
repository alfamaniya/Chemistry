const normalizeSearchText = (value) => value
  .trim().toLocaleLowerCase()
  .replace(/[يى]/g, "ی").replace(/ك/g, "ک").replace(/[ۀة]/g, "ه");

const setupElementSearch = async () => {
  const input = document.querySelector("#search-input");
  const content = document.querySelector(".search-box__content");
  if (!input || !content) return;

  const results = document.createElement("div");
  results.className = "search-box__results"; results.id = "search-results";
  results.setAttribute("role", "listbox"); results.setAttribute("aria-label", "نتایج جستجو");
  content.appendChild(results); input.setAttribute("aria-controls", results.id); input.setAttribute("aria-autocomplete", "list");

  try {
    const elements = await window.getElementData();
    const renderResults = () => {
      const query = normalizeSearchText(input.value);
      results.replaceChildren(); input.removeAttribute("aria-activedescendant");
      if (!query) { results.hidden = true; return; }
      const isPersian = document.documentElement.lang === "fa";
      const matches = elements.filter((element) => normalizeSearchText(element.name).includes(query) || normalizeSearchText(element.persian_name).includes(query))
        .sort((a, b) => normalizeSearchText(isPersian ? a.persian_name : a.name).localeCompare(normalizeSearchText(isPersian ? b.persian_name : b.name), isPersian ? "fa" : "en", { sensitivity: "base" }))
        .slice(0, 8);

      if (!matches.length) {
        const empty = document.createElement("div"); empty.className = "search-box__no-results";
        empty.textContent = isPersian ? "عنصری پیدا نشد" : "No element found"; results.appendChild(empty); results.hidden = false; return;
      }

      matches.forEach((element, index) => {
        const item = document.createElement("button"); item.type = "button"; item.className = "search-box__result";
        item.id = `search-result-${element.atomic_number}`; item.setAttribute("role", "option");
        const name = document.createElement("span"); name.className = "search-box__result-name"; name.textContent = isPersian ? element.persian_name : element.name;
        const meta = document.createElement("span"); meta.className = "search-box__result-meta"; meta.textContent = `${element.symbol} · ${element.atomic_number}`;
        item.append(name, meta); item.addEventListener("click", () => selectElement(element)); results.appendChild(item);
        if (index === 0) item.setAttribute("aria-selected", "false");
      });
      results.hidden = false;
    };

    const selectElement = (element) => {
      input.value = document.documentElement.lang === "fa" ? element.persian_name : element.name;
      results.hidden = true;
      const card = document.querySelector(`.element-card[data-atomic-number="${element.atomic_number}"]`); if (!card) return;
      card.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }); window.blinkElementCard?.(card);
    };

    input.addEventListener("input", renderResults); input.addEventListener("search", renderResults);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") { results.hidden = true; return; }
      if (event.key === "Enter") { const first = results.querySelector(".search-box__result"); if (first && !results.hidden) { event.preventDefault(); first.click(); } }
    });
    document.addEventListener("click", (event) => { if (!content.contains(event.target)) results.hidden = true; });
    window.updateElementSearchLanguage = renderResults;
  } catch (error) { console.error(error); }
};

document.addEventListener("DOMContentLoaded", setupElementSearch);
