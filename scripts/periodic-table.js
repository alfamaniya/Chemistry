const PERIODIC_TABLE_LAYOUT = new Map([
  [1, [1, 1]], [2, [1, 18]],
  [3, [2, 1]], [4, [2, 2]], [5, [2, 13]], [6, [2, 14]], [7, [2, 15]], [8, [2, 16]], [9, [2, 17]], [10, [2, 18]],
  [11, [3, 1]], [12, [3, 2]], [13, [3, 13]], [14, [3, 14]], [15, [3, 15]], [16, [3, 16]], [17, [3, 17]], [18, [3, 18]],
  [19, [4, 1]], [20, [4, 2]], [21, [4, 3]], [22, [4, 4]], [23, [4, 5]], [24, [4, 6]], [25, [4, 7]], [26, [4, 8]], [27, [4, 9]], [28, [4, 10]], [29, [4, 11]], [30, [4, 12]], [31, [4, 13]], [32, [4, 14]], [33, [4, 15]], [34, [4, 16]], [35, [4, 17]], [36, [4, 18]],
  [37, [5, 1]], [38, [5, 2]], [39, [5, 3]], [40, [5, 4]], [41, [5, 5]], [42, [5, 6]], [43, [5, 7]], [44, [5, 8]], [45, [5, 9]], [46, [5, 10]], [47, [5, 11]], [48, [5, 12]], [49, [5, 13]], [50, [5, 14]], [51, [5, 15]], [52, [5, 16]], [53, [5, 17]], [54, [5, 18]],
  [55, [6, 1]], [56, [6, 2]], [72, [6, 4]], [73, [6, 5]], [74, [6, 6]], [75, [6, 7]], [76, [6, 8]], [77, [6, 9]], [78, [6, 10]], [79, [6, 11]], [80, [6, 12]], [81, [6, 13]], [82, [6, 14]], [83, [6, 15]], [84, [6, 16]], [85, [6, 17]], [86, [6, 18]],
  [87, [7, 1]], [88, [7, 2]], [104, [7, 4]], [105, [7, 5]], [106, [7, 6]], [107, [7, 7]], [108, [7, 8]], [109, [7, 9]], [110, [7, 10]], [111, [7, 11]], [112, [7, 12]], [113, [7, 13]], [114, [7, 14]], [115, [7, 15]], [116, [7, 16]], [117, [7, 17]], [118, [7, 18]]
]);

const PERIODIC_TABLE_CATEGORIES = {
  alkali: new Set([3, 11, 19, 37, 55, 87]),
  alkaline: new Set([4, 12, 20, 38, 56, 88]),
  transition: new Set([...Array.from({ length: 10 }, (_, i) => i + 21), ...Array.from({ length: 10 }, (_, i) => i + 39), ...Array.from({ length: 9 }, (_, i) => i + 72), ...Array.from({ length: 9 }, (_, i) => i + 104)]),
  postTransition: new Set([13, 31, 32, 49, 50, 81, 82, 83, 84, 113, 114, 115, 116]),
  metalloid: new Set([5, 14, 33, 51, 52]),
  nonmetal: new Set([1, 6, 7, 8, 15, 16, 34]),
  halogen: new Set([9, 17, 35, 53, 85, 117]),
  noble: new Set([2, 10, 18, 36, 54, 86, 118]),
  lanthanide: new Set(Array.from({ length: 15 }, (_, i) => i + 57)),
  actinide: new Set(Array.from({ length: 15 }, (_, i) => i + 89))
};

const getElementCategory = (atomicNumber) => {
  for (const [category, numbers] of Object.entries(PERIODIC_TABLE_CATEGORIES)) {
    if (numbers.has(atomicNumber)) return category;
  }
  return "unknown";
};

const createCard = (element, row, column) => {
  const card = document.createElement("article");
  card.className = `element-card element-card--${getElementCategory(element.atomic_number)}`;
  card.style.gridRow = String(row);
  card.style.gridColumn = String(column + 1);
  card.dataset.atomicNumber = String(element.atomic_number);
  card.dataset.englishName = element.name;
  card.dataset.persianName = element.persian_name;

  const atomicNumber = document.createElement("span");
  atomicNumber.className = "element-card__atomic-number";
  atomicNumber.textContent = element.atomic_number;

  const symbol = document.createElement("span");
  symbol.className = "element-card__symbol";
  symbol.textContent = element.symbol;

  const name = document.createElement("span");
  name.className = "element-card__name";
  name.textContent = element.persian_name;

  card.append(atomicNumber, symbol, name);
  return card;
};

const renderPeriodicTable = async () => {
  const table = document.querySelector("#periodic-table");
  if (!table) return;

  const response = await fetch("data/elements-index.json", { cache: "no-cache" });
  if (!response.ok) throw new Error("Unable to load element index");

  const elements = await response.json();
  if (!Array.isArray(elements) || elements.length !== 118) {
    throw new Error("Periodic table requires exactly 118 elements");
  }

  table.replaceChildren();

  for (let group = 1; group <= 18; group += 1) {
    const label = document.createElement("span");
    label.className = "periodic-table__group-label";
    label.textContent = group;
    label.style.gridColumn = String(group + 1);
    label.style.gridRow = "1";
    table.appendChild(label);
  }

  for (let period = 1; period <= 7; period += 1) {
    const label = document.createElement("span");
    label.className = "periodic-table__period-label";
    label.textContent = period;
    label.style.gridColumn = "1";
    label.style.gridRow = String(period + 1);
    table.appendChild(label);
  }

  elements.forEach((element) => {
    const isLanthanide = element.atomic_number >= 57 && element.atomic_number <= 71;
    const isActinide = element.atomic_number >= 89 && element.atomic_number <= 103;
    const isFBlock = isLanthanide || isActinide;
    const layout = PERIODIC_TABLE_LAYOUT.get(element.atomic_number);

    if (!layout && !isFBlock) return;

    let row;
    let column;
    if (isLanthanide) {
      row = 10;
      column = element.atomic_number - 53;
    } else if (isActinide) {
      row = 11;
      column = element.atomic_number - 85;
    } else {
      const [period, group] = layout;
      row = period + 1;
      column = group;
    }

    table.appendChild(createCard(element, row, column));
  });
};

window.updateElementCardLanguages = () => {
  const language = document.documentElement.lang;
  document.querySelectorAll(".element-card").forEach((card) => {
    const name = card.querySelector(".element-card__name");
    if (!name) return;
    name.textContent = language === "fa" ? card.dataset.persianName : card.dataset.englishName;
    name.style.direction = language === "fa" ? "rtl" : "ltr";
    card.setAttribute("aria-label", `${card.dataset.atomicNumber} ${name.textContent}`);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await renderPeriodicTable();
    window.updateElementCardLanguages();
  } catch (error) {
    console.error(error);
  }
});
