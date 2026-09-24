const DATA_URL = "data/PubChemElements_all.csv";
const cards = [...document.querySelectorAll(".element")];
const loadStatus = document.querySelector("#load-status");

let selectedCard = null;
let selectionTimer = null;

function installSelectionStyles() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes element-selection-blink {
      0%, 8% { opacity: 1; transform: scale(1); box-shadow: var(--card-shadow); filter: saturate(1); }
      12% { opacity: .42; transform: scale(.992); box-shadow: 0 0 0 3px rgba(59,130,246,.12); filter: saturate(.92); }
      18%, 28% { opacity: 1; transform: scale(1.012); box-shadow: 0 0 12px rgba(59,130,246,.22); filter: saturate(1.03); }
      33% { opacity: .48; transform: scale(.994); box-shadow: 0 0 0 4px rgba(59,130,246,.13); filter: saturate(.94); }
      43%, 53% { opacity: 1; transform: scale(1.018); box-shadow: 0 0 15px rgba(59,130,246,.25); filter: saturate(1.05); }
      60% { opacity: .56; transform: scale(.996); box-shadow: 0 0 0 4px rgba(59,130,246,.14); filter: saturate(.96); }
      72%, 100% { opacity: 1; transform: scale(1.04); box-shadow: 0 10px 24px rgba(59,130,246,.22), 0 0 0 2px rgba(59,130,246,.30); filter: saturate(1.08); }
    }

    .element.is-blinking {
      animation: element-selection-blink 2.6s ease-in-out 1 forwards !important;
    }

    .element.is-selected {
      z-index: 10;
      transform: scale(1.04);
      box-shadow: 0 10px 24px rgba(59,130,246,.22), 0 0 0 2px rgba(59,130,246,.30);
      filter: saturate(1.08);
      transition: transform .35s ease, box-shadow .35s ease, filter .35s ease;
    }

    @media (prefers-reduced-motion: reduce) {
      .element.is-blinking { animation: none !important; }
      .element.is-selected { transform: scale(1.02); }
    }
  `;
  document.head.appendChild(style);
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"' && quoted && next === '"') {
      field += '"';
      i += 1;
      continue;
    }

    if (c === '"') {
      quoted = !quoted;
      continue;
    }

    if (c === "," && !quoted) {
      row.push(field);
      field = "";
      continue;
    }

    if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && next === "\n") i += 1;
      row.push(field);
      field = "";
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      continue;
    }

    field += c;
  }

  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }

  const headers = rows.shift() || [];
  return rows.map((values) =>
    Object.fromEntries(headers.map((key, i) => [key, values[i] ?? ""]))
  );
}

function fillCard(card, element) {
  card.replaceChildren();

  const number = document.createElement("span");
  number.className = "element-number";
  number.textContent = element.AtomicNumber;

  const symbol = document.createElement("span");
  symbol.className = "element-symbol";
  symbol.textContent = element.Symbol;

  const nameFa = document.createElement("span");
  nameFa.className = "element-name-fa";
  nameFa.lang = "fa";
  nameFa.textContent = element.PersianName || "—";

  const nameEn = document.createElement("span");
  nameEn.className = "element-name-en";
  nameEn.lang = "en";
  nameEn.textContent = element.Name || "—";

  card.append(number, symbol, nameFa, nameEn);
  card.setAttribute("aria-label", `${element.PersianName || element.Name}، ${element.Name}`);
  card.title = `${element.PersianName || element.Name} — ${element.Name}`;
}

function clearSelectedCard() {
  if (selectionTimer) {
    window.clearTimeout(selectionTimer);
    selectionTimer = null;
  }

  document.querySelectorAll(".element.is-selected, .element.is-blinking").forEach((card) => {
    card.classList.remove("is-selected", "is-blinking");
  });

  selectedCard = null;
}

function selectCard(card) {
  clearSelectedCard();
  selectedCard = card;

  card.classList.remove("is-blinking", "is-selected");
  void card.offsetWidth;
  card.classList.add("is-blinking");

  selectionTimer = window.setTimeout(() => {
    if (selectedCard !== card) return;
    card.classList.remove("is-blinking");
    card.classList.add("is-selected");
    selectionTimer = null;
  }, 2600);
}

function setStatus(message) {
  if (loadStatus) loadStatus.textContent = message;
}

async function load() {
  setStatus("در حال بارگذاری اطلاعات عناصر…");
  installSelectionStyles();

  const response = await fetch(DATA_URL);
  if (!response.ok) throw new Error(`Unable to load ${DATA_URL}: ${response.status}`);

  const data = parseCSV(await response.text());
  const elements = new Map(data.map((element) => [String(element.AtomicNumber), element]));
  let populated = 0;

  cards.forEach((card) => {
    const element = elements.get(card.dataset.atomicNumber);
    if (!element) return;

    fillCard(card, element);
    card.addEventListener("click", (event) => {
      event.stopPropagation();
      selectCard(card);
    });
    populated += 1;
  });

  document.addEventListener("click", clearSelectedCard);

  if (populated !== 118 || elements.size !== 118) {
    console.warn(`Expected 118 elements, found ${elements.size}; populated ${populated}.`);
    setStatus("برخی اطلاعات عناصر بارگذاری نشد. لطفاً صفحه را دوباره بارگذاری کنید.");
    return;
  }

  setStatus("اطلاعات ۱۱۸ عنصر با موفقیت بارگذاری شد.");
}

load().catch((error) => {
  console.error(error);
  setStatus("بارگذاری اطلاعات عناصر با خطا مواجه شد. لطفاً صفحه را دوباره بارگذاری کنید.");
});
