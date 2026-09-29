const PERIODIC_TABLE_POSITIONS = {
  1: [1, 1], 2: [1, 18],
  3: [2, 1], 4: [2, 2], 5: [2, 13], 6: [2, 14], 7: [2, 15], 8: [2, 16], 9: [2, 17], 10: [2, 18],
  11: [3, 1], 12: [3, 2], 13: [3, 13], 14: [3, 14], 15: [3, 15], 16: [3, 16], 17: [3, 17], 18: [3, 18],
  19: [4, 1], 20: [4, 2], 21: [4, 3], 22: [4, 4], 23: [4, 5], 24: [4, 6], 25: [4, 7], 26: [4, 8], 27: [4, 9], 28: [4, 10], 29: [4, 11], 30: [4, 12], 31: [4, 13], 32: [4, 14], 33: [4, 15], 34: [4, 16], 35: [4, 17], 36: [4, 18],
  37: [5, 1], 38: [5, 2], 39: [5, 3], 40: [5, 4], 41: [5, 5], 42: [5, 6], 43: [5, 7], 44: [5, 8], 45: [5, 9], 46: [5, 10], 47: [5, 11], 48: [5, 12], 49: [5, 13], 50: [5, 14], 51: [5, 15], 52: [5, 16], 53: [5, 17], 54: [5, 18],
  55: [6, 1], 56: [6, 2], 72: [6, 4], 73: [6, 5], 74: [6, 6], 75: [6, 7], 76: [6, 8], 77: [6, 9], 78: [6, 10], 79: [6, 11], 80: [6, 12], 81: [6, 13], 82: [6, 14], 83: [6, 15], 84: [6, 16], 85: [6, 17], 86: [6, 18],
  87: [7, 1], 88: [7, 2], 104: [7, 4], 105: [7, 5], 106: [7, 6], 107: [7, 7], 108: [7, 8], 109: [7, 9], 110: [7, 10], 111: [7, 11], 112: [7, 12], 113: [7, 13], 114: [7, 14], 115: [7, 15], 116: [7, 16], 117: [7, 17], 118: [7, 18]
};

const CATEGORY_RANGES = [
  [57, 71, "lanthanide"],
  [89, 103, "actinide"],
  [3, 3, "alkali"], [11, 11, "alkali"], [19, 19, "alkali"], [37, 37, "alkali"], [55, 55, "alkali"], [87, 87, "alkali"],
  [4, 4, "alkaline"], [12, 12, "alkaline"], [20, 20, "alkaline"], [38, 38, "alkaline"], [56, 56, "alkaline"], [88, 88, "alkaline"],
  [21, 30, "transition"], [39, 48, "transition"], [72, 80, "transition"], [104, 112, "transition"],
  [13, 13, "post-transition"], [31, 31, "post-transition"], [49, 50, "post-transition"], [81, 82, "post-transition"], [83, 84, "post-transition"], [113, 114, "post-transition"], [115, 116, "post-transition"],
  [5, 5, "metalloid"], [14, 14, "metalloid"], [32, 32, "metalloid"], [33, 33, "metalloid"], [51, 51, "metalloid"], [52, 52, "metalloid"],
  [1, 1, "nonmetal"], [6, 8, "nonmetal"], [15, 16, "nonmetal"], [34, 34, "nonmetal"],
  [9, 9, "halogen"], [17, 17, "halogen"], [35, 35, "halogen"], [53, 53, "halogen"], [85, 85, "halogen"], [117, 117, "halogen"],
  [2, 2, "noble"], [10, 10, "noble"], [18, 18, "noble"], [36, 36, "noble"], [54, 54, "noble"], [86, 86, "noble"], [118, 118, "noble"]
];

const getElementCategory = (atomicNumber) => {
  const match = CATEGORY_RANGES.find(([start, end]) => atomicNumber >= start && atomicNumber <= end);
  return match ? match[2] : "unknown";
};

const createElementCard = (element) => {
  const card = document.createElement("article");
  card.className = `element-card element-card--${getElementCategory(element.atomic_number)}`;
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
  return card;
};

const renderLabels = (mainGrid) => {
  for (let group = 1; group <= 18; group += 1) {
    const label = document.createElement("span");
    label.className = "periodic-table__group-label";
    label.textContent = group;
    label.style.gridColumn = String(group + 1);
    label.style.gridRow = "1";
    mainGrid.appendChild(label);
  }

  for (let period = 1; period <= 7; period += 1) {
    const label = document.createElement("span");
    label.className = "periodic-table__period-label";
    label.textContent = period;
    label.style.gridColumn = "1";
    label.style.gridRow = String(period + 1);
    mainGrid.appendChild(label);
  }
};

const renderPeriodicTable = async () => {
  const container = document.getElementById("periodic-table");
  if (!container) return;

  try {
    const response = await fetch("data/elements-index.json", { cache: "no-cache" });
    if (!response.ok) throw new Error("Unable to load element index");

    const elements = await response.json();
    container.replaceChildren();

    const mainGrid = document.createElement("div");
    mainGrid.className = "periodic-table__main";
    renderLabels(mainGrid);

    const fBlock = document.createElement("div");
    fBlock.className = "periodic-table__f-block";

    elements.forEach((element) => {
      const atomicNumber = element.atomic_number;
      const card = createElementCard(element);

      if (PERIODIC_TABLE_POSITIONS[atomicNumber]) {
        const [period, group] = PERIODIC_TABLE_POSITIONS[atomicNumber];
        card.style.gridColumn = String(group + 1);
        card.style.gridRow = String(period + 1);
        mainGrid.appendChild(card);
      } else if (atomicNumber >= 57 && atomicNumber <= 71) {
        card.style.gridColumn = String(atomicNumber - 57 + 5);
        card.style.gridRow = "1";
        fBlock.appendChild(card);
      } else if (atomicNumber >= 89 && atomicNumber <= 103) {
        card.style.gridColumn = String(atomicNumber - 89 + 5);
        card.style.gridRow = "2";
        fBlock.appendChild(card);
      }
    });

    container.append(mainGrid, fBlock);
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
