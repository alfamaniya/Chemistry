const BLINK_DURATION_MS = 3000;
const BLINK_CLASS = "element-card--blink";
const blinkTimers = new WeakMap();

const clearBlink = (card) => {
  const timer = blinkTimers.get(card);
  if (timer) window.clearTimeout(timer);
  blinkTimers.delete(card);
  card.classList.remove(BLINK_CLASS);
};

const blinkElementCard = (card) => {
  if (!card) return;
  clearBlink(card);
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  card.classList.add(BLINK_CLASS);
  const timer = window.setTimeout(() => clearBlink(card), BLINK_DURATION_MS);
  blinkTimers.set(card, timer);
};
window.blinkElementCard = blinkElementCard;

let periodicTableMetaPromise;
const getPeriodicTableMeta = () => {
  if (!periodicTableMetaPromise) {
    periodicTableMetaPromise = fetch("data/periodic-table-meta.json", { cache: "no-cache" })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load periodic table metadata");
        return response.json();
      })
      .then((payload) => {
        if (!payload || payload.element_count !== 118 || !Array.isArray(payload.elements) || payload.elements.length !== 118) {
          throw new Error("Periodic table metadata requires exactly 118 elements");
        }
        return new Map(payload.elements.map((item) => [item.atomic_number, item]));
      })
      .catch((error) => {
        periodicTableMetaPromise = undefined;
        throw error;
      });
  }
  return periodicTableMetaPromise;
};

const moveCardFocus = (cards, currentCard, direction) => {
  const row = Number(currentCard.dataset.row);
  const column = Number(currentCard.dataset.column);
  if (!Number.isFinite(row) || !Number.isFinite(column)) return;

  const delta = direction === "left" || direction === "up" ? -1 : 1;
  const target = cards
    .map((card) => ({ card, row: Number(card.dataset.row), column: Number(card.dataset.column) }))
    .filter((item) => Number.isFinite(item.row) && Number.isFinite(item.column))
    .find((item) => direction === "left" || direction === "right"
      ? item.row === row && item.column === column + delta
      : item.column === column && item.row === row + delta);

  if (!target) return;
  currentCard.tabIndex = -1;
  target.card.tabIndex = 0;
  target.card.focus();
};

const createCard = (element, meta) => {
  const card = document.createElement("button");
  card.type = "button";
  card.className = `element-card element-card--${meta.category}`;
  card.style.gridRow = String(meta.row);
  card.style.gridColumn = String(meta.column);
  card.dataset.atomicNumber = String(element.atomic_number);
  card.dataset.englishName = element.name;
  card.dataset.persianName = element.persian_name;
  card.dataset.row = String(meta.row);
  card.dataset.column = String(meta.column);
  card.setAttribute("aria-label", `${element.atomic_number} ${element.persian_name}`);
  card.tabIndex = -1;

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

  card.addEventListener("click", () => blinkElementCard(card));
  card.addEventListener("keydown", (event) => {
    const keyMap = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
    const direction = keyMap[event.key];
    if (!direction) return;
    event.preventDefault();
    moveCardFocus([...document.querySelectorAll(".element-card")], card, direction);
  });
  return card;
};

const renderPeriodicTable = async () => {
  const table = document.querySelector("#periodic-table");
  if (!table) return;

  const [elements, metadata] = await Promise.all([window.getElementData(), getPeriodicTableMeta()]);
  table.replaceChildren();
  elements.forEach((element) => {
    const meta = metadata.get(element.atomic_number);
    if (meta) table.appendChild(createCard(element, meta));
  });

  const firstCard = table.querySelector(".element-card");
  if (firstCard) firstCard.tabIndex = 0;
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
  const load = async () => {
    try {
      await renderPeriodicTable();
      window.updateElementCardLanguages();
    } catch (error) {
      console.error(error);
    }
  };
  await load();
});
