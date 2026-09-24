const DATA_URL = "data/PubChemElements_all.csv";
const cards = [...document.querySelectorAll(".element")];
const loadStatus = document.querySelector("#load-status");

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

function setText(element, selector, value, fallback = "—") {
  const node = element.querySelector(selector);
  node.textContent = value || fallback;
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

function blink(card) {
  card.classList.remove("is-blinking");
  void card.offsetWidth;
  card.classList.add("is-blinking");
}

function setStatus(message) {
  if (loadStatus) loadStatus.textContent = message;
}

async function load() {
  setStatus("در حال بارگذاری اطلاعات عناصر…");

  const response = await fetch(DATA_URL);
  if (!response.ok) throw new Error(`Unable to load ${DATA_URL}: ${response.status}`);

  const data = parseCSV(await response.text());
  const elements = new Map(data.map((element) => [String(element.AtomicNumber), element]));

  let populated = 0;

  cards.forEach((card) => {
    const element = elements.get(card.dataset.atomicNumber);
    if (!element) return;

    fillCard(card, element);
    card.addEventListener("click", () => blink(card), { passive: true });
    populated += 1;
  });

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
