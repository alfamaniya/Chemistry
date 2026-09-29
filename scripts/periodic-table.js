const PERIODS = {
  1: { 1: 1, 18: 2 },
  2: { 1: 3, 2: 4, 13: 5, 14: 6, 15: 7, 16: 8, 17: 9, 18: 10 },
  3: { 1: 11, 2: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18 },
  4: { 1: 19, 2: 20, 3: 21, 4: 22, 5: 23, 6: 24, 7: 25, 8: 26, 9: 27, 10: 28, 11: 29, 12: 30, 13: 31, 14: 32, 15: 33, 16: 34, 17: 35, 18: 36 },
  5: { 1: 37, 2: 38, 3: 39, 4: 40, 5: 41, 6: 42, 7: 43, 8: 44, 9: 45, 10: 46, 11: 47, 12: 48, 13: 49, 14: 50, 15: 51, 16: 52, 17: 53, 18: 54 },
  6: { 1: 55, 2: 56, 4: 72, 5: 73, 6: 74, 7: 75, 8: 76, 9: 77, 10: 78, 11: 79, 12: 80, 13: 81, 14: 82, 15: 83, 16: 84, 17: 85, 18: 86 },
  7: { 1: 87, 2: 88, 4: 104, 5: 105, 6: 106, 7: 107, 8: 108, 9: 109, 10: 110, 11: 111, 12: 112, 13: 113, 14: 114, 15: 115, 16: 116, 17: 117, 18: 118 }
};

const CATEGORY_RANGES = [
  [57, 71, "lanthanide"], [89, 103, "actinide"],
  [3, 3, "alkali"], [11, 11, "alkali"], [19, 19, "alkali"], [37, 37, "alkali"], [55, 55, "alkali"], [87, 87, "alkali"],
  [4, 4, "alkaline"], [12, 12, "alkaline"], [20, 20, "alkaline"], [38, 38, "alkaline"], [56, 56, "alkaline"], [88, 88, "alkaline"],
  [21, 30, "transition"], [39, 48, "transition"], [72, 80, "transition"], [104, 112, "transition"],
  [13, 13, "post-transition"], [31, 31, "post-transition"], [49, 50, "post-transition"], [81, 82, "post-transition"], [83, 84, "post-transition"], [113, 114, "post-transition"], [115, 116, "post-transition"],
  [5, 5, "metalloid"], [14, 14, "metalloid"], [32, 32, "metalloid"], [33, 33, "metalloid"], [51, 51, "metalloid"], [52, 52, "metalloid"],
  [1, 1, "nonmetal"], [6, 8, "nonmetal"], [15, 16, "nonmetal"], [34, 34, "nonmetal"],
  [9, 9, "halogen"], [17, 17, "halogen"], [35, 35, "halogen"], [53, 53, "halogen"], [85, 85, "halogen"], [117, 117, "halogen"],
  [2, 2, "noble"], [10, 10, "noble"], [18, 18, "noble"], [36, 36, "noble"], [54, 54, "noble"], [86, 86, "noble"], [118, 118, "noble"]
];

const getCategory = (atomicNumber) => {
  const match = CATEGORY_RANGES.find(([start, end]) => atomicNumber >= start && atomicNumber <= end);
  return match ? match[2] : "unknown";
};

const getDisplayName = (element) => (
  document.documentElement.lang === "fa" ? element.persian_name : element.name
);

const createLabel = (className, text, column, row) => {
  const label = document.createElement("span");
  label.className = className;
  label.textContent = text;
  label.style.gridColumn = String(column);
  label.style.gridRow = String(row);
  return label;
};

const createElementCard = (element) => {
  const card = document.createElement("article");
  card.className = `element-card element-card--${getCategory(element.atomic_number)}`;
  card.dataset.atomicNumber = String(element.atomic_number);

  const number = document.createElement("span");
  number.className = "element-card__atomic-number";
  number.textContent = element.atomic_number;

  const symbol = document.createElement("span");
  symbol.className = "element-card__symbol";
  symbol.textContent = element.symbol;

  const name = document.createElement("span");
  name.className = "element-card__name";
  name.dataset.nameEn = element.name;
  name.dataset.nameFa = element.persian_name;
  name.textContent = getDisplayName(element);

  card.append(number, symbol, name);
  return card;
};

const renderMainTable = (elementsByAtomicNumber) => {
  const grid = document.createElement("div");
  grid.className = "periodic-table__main";

  for (let group = 1; group <= 18; group += 1) {
    grid.appendChild(createLabel("periodic-table__group-label", group, group + 1, 1));
  }

  for (let period = 1; period <= 7; period += 1) {
    grid.appendChild(createLabel("periodic-table__period-label", period, 1, period + 1));

    Object.entries(PERIODS[period]).forEach(([group, atomicNumber]) => {
      const element = elementsByAtomicNumber.get(atomicNumber);
      if (!element) return;
      const card = createElementCard(element);
      card.style.gridColumn = String(Number(group) + 1);
      card.style.gridRow = String(period + 1);
      grid.appendChild(card);
    });
  }

  return grid;
};

const renderFBlock = (elements) => {
  const grid = document.createElement("div");
  grid.className = "periodic-table__f-block";

  elements.forEach((element) => {
    const { atomic_number: atomicNumber } = element;
    const isLanthanide = atomicNumber >= 57 && atomicNumber <= 71;
    const isActinide = atomicNumber >= 89 && atomicNumber <= 103;
    if (!isLanthanide && !isActinide) return;

    const start = isLanthanide ? 57 : 89;
    const row = isLanthanide ? 1 : 2;
    const card = createElementCard(element);
    card.style.gridColumn = String(atomicNumber - start + 5);
    card.style.gridRow = String(row);
    grid.appendChild(card);
  });

  return grid;
};

const renderPeriodicTable = async () => {
  const container = document.getElementById("periodic-table");
  if (!container) return;

  try {
    const response = await fetch("data/elements-index.json", { cache: "no-cache" });
    if (!response.ok) throw new Error("Unable to load element index");

    const elements = await response.json();
    if (!Array.isArray(elements) || elements.length !== 118) {
      throw new Error("Element index must contain exactly 118 elements");
    }

    const elementsByAtomicNumber = new Map(
      elements.map((element) => [element.atomic_number, element])
    );

    container.replaceChildren(
      renderMainTable(elementsByAtomicNumber),
      renderFBlock(elements)
    );
  } catch (error) {
    console.error("Periodic table rendering failed:", error);
  }
};

const updateElementCardLanguages = () => {
  document.querySelectorAll(".element-card__name").forEach((name) => {
    name.textContent = document.documentElement.lang === "fa"
      ? name.dataset.nameFa
      : name.dataset.nameEn;
  });
};

document.addEventListener("DOMContentLoaded", renderPeriodicTable);
window.updateElementCardLanguages = updateElementCardLanguages;
