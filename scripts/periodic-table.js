const renderPeriodicTable = async () => {
  const container = document.getElementById("periodic-table");
  if (!container) return;

  try {
    const response = await fetch("data/elements-index.json", { cache: "no-cache" });
    if (!response.ok) throw new Error("Unable to load element index");

    const elements = await response.json();
    container.replaceChildren();

    elements.forEach((element) => {
      const card = document.createElement("article");
      card.className = "element-card";
      card.dataset.atomicNumber = String(element.atomic_number);

      const atomicNumber = document.createElement("span");
      atomicNumber.className = "element-card__atomic-number";
      atomicNumber.textContent = element.atomic_number;

      const symbol = document.createElement("span");
      symbol.className = "element-card__symbol";
      symbol.textContent = element.symbol;

      const name = document.createElement("span");
      name.className = "element-card__name";
      name.dataset.nameEn = element.name;
      name.dataset.nameFa = element.persian_name;
      name.textContent = getElementDisplayName(element);

      card.append(atomicNumber, symbol, name);
      container.appendChild(card);
    });
  } catch (error) {
    console.error(error);
  }
};

const getElementDisplayName = (element) => {
  return document.documentElement.lang === "fa"
    ? element.persian_name
    : element.name;
};

const updateElementCardLanguages = () => {
  document.querySelectorAll(".element-card__name").forEach((name) => {
    name.textContent = document.documentElement.lang === "fa"
      ? name.dataset.nameFa
      : name.dataset.nameEn;
  });
};

document.addEventListener("DOMContentLoaded", () => {
  renderPeriodicTable();
});

window.updateElementCardLanguages = updateElementCardLanguages;
