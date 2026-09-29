const normalizeSearchText = (value) => value
  .trim().toLocaleLowerCase()
  .replace(/[يى]/g, "ی").replace(/ك/g, "ک").replace(/[ۀة]/g, "ه");

const setupElementSearch = async () => {
  const input = document.querySelector("#search-input");
  const content = document.querySelector(".search-box__content");
  if (!input || !content) return;

  const results = document.createElement("div");
  results.className = "search-box__results";
  results.id = "search-results";
  results.setAttribute("role", "listbox");
  results.setAttribute("aria-labelledby", input.id);
  results.hidden = true;
  content.appendChild(results);

  input.setAttribute("role", "combobox");
  input.setAttribute("aria-controls", results.id);
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-expanded", "false");

  try {
    const elements = await window.getElementData();
    let matches = [];
    let activeIndex = -1;

    const setExpanded = (expanded) => {
      results.hidden = !expanded;
      input.setAttribute("aria-expanded", String(expanded));
      if (!expanded) {
        activeIndex = -1;
        input.removeAttribute("aria-activedescendant");
      }
    };

    const updateActive = (index) => {
      if (!matches.length) return;
      activeIndex = Math.max(0, Math.min(index, matches.length - 1));
      results.querySelectorAll("[role='option']").forEach((option, optionIndex) => {
        option.setAttribute("aria-selected", String(optionIndex === activeIndex));
      });
      const active = results.querySelectorAll("[role='option']")[activeIndex];
      if (active) {
        input.setAttribute("aria-activedescendant", active.id);
        active.scrollIntoView({ block: "nearest" });
      }
    };

    const selectElement = (element) => {
      input.value = document.documentElement.lang === "fa" ? element.persian_name : element.name;
      setExpanded(false);
      const card = document.querySelector(`.element-card[data-atomic-number="${element.atomic_number}"]`);
      if (!card) return;
      card.scrollIntoView({ behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center", inline: "center" });
      window.blinkElementCard?.(card);
    };

    let matches = [];
    let activeIndex = -1;

    const setExpanded = (expanded) => {
      results.hidden = !expanded;
      input.setAttribute("aria-expanded", String(expanded));
      if (!expanded) { activeIndex = -1; input.removeAttribute("aria-activedescendant"); }
    };

    const updateActive = (index) => {
      if (!matches.length) return;
      activeIndex = Math.max(0, Math.min(index, matches.length - 1));
      results.querySelectorAll("[role='option']").forEach((option, optionIndex) => option.setAttribute("aria-selected", String(optionIndex === activeIndex)));
      const active = results.querySelectorAll("[role='option']")[activeIndex];
      if (active) { input.setAttribute("aria-activedescendant", active.id); active.scrollIntoView({ block: "nearest" }); }
    };

    const renderResults = () => {
      const query = normalizeSearchText(input.value);
      results.replaceChildren();
      input.removeAttribute("aria-activedescendant");
      activeIndex = -1;
      matches = [];

      if (!query) {
        setExpanded(false);
        return;
      }

      const isPersian = document.documentElement.lang === "fa";
      matches = elements.filter((element) =>
        normalizeSearchText(element.name).includes(query) ||
        normalizeSearchText(element.persian_name).includes(query)
      ).sort((a, b) =>
        normalizeSearchText(isPersian ? a.persian_name : a.name)
          .localeCompare(normalizeSearchText(isPersian ? b.persian_name : b.name), isPersian ? "fa" : "en", { sensitivity: "base" })
      ).slice(0, 8);

      if (!matches.length) {
        const empty = document.createElement("div");
        empty.className = "search-box__no-results";
        empty.textContent = isPersian ? "عنصری پیدا نشد" : "No element found";
        results.appendChild(empty);
        setExpanded(true);
        return;
      }

      matches.forEach((element) => {
        const item = document.createElement("div");
        item.className = "search-box__result";
        item.id = `search-result-${element.atomic_number}`;
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", "false");
        item.tabIndex = -1;

        const name = document.createElement("span");
        name.className = "search-box__result-name";
        name.textContent = isPersian ? element.persian_name : element.name;
        const meta = document.createElement("span");
        meta.className = "search-box__result-meta";
        meta.textContent = `${element.symbol} · ${element.atomic_number}`;
        item.append(name, meta);
        item.addEventListener("mousedown", (event) => event.preventDefault());
        item.addEventListener("click", () => selectElement(element));
        results.appendChild(item);
      });
      setExpanded(true);
    };

    input.addEventListener("input", renderResults);
    input.addEventListener("search", renderResults);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (!results.hidden) {
          event.preventDefault();
          setExpanded(false);
        }
        return;
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        if (results.hidden || !matches.length) return;
        event.preventDefault();
        updateActive(activeIndex + (event.key === "ArrowDown" ? 1 : -1));
        return;
      }
      if (event.key === "Home" || event.key === "End") {
        if (results.hidden || !matches.length) return;
        event.preventDefault();
        updateActive(event.key === "Home" ? 0 : matches.length - 1);
        return;
      }
      if (event.key === "Enter" && !results.hidden && matches.length) {
        event.preventDefault();
        selectElement(matches[activeIndex >= 0 ? activeIndex : 0]);
      }
    });

    document.addEventListener("click", (event) => {
      if (!content.contains(event.target)) setExpanded(false);
    });

    window.updateElementSearchLanguage = renderResults;
  } catch (error) {
    console.error(error);
  }
};

document.addEventListener("DOMContentLoaded", setupElementSearch);
