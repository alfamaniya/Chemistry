import { getName, translations } from "../../core/i18n.js";

export function mountPeriodicTableShell(root) {
  if (!root || root.children.length) return;
  root.innerHTML = `
    <div class="section-heading">
      <div>
        <h2 data-i18n="periodicTitle">جدول تناوبی</h2>
        <p data-i18n="periodicSubtitle">چیدمان ۱۸ گروهی بر اساس مرجع جدول تناوبی</p>
      </div>
    </div>
    <div class="table-theme-control">
      <label for="table-theme-select" data-i18n="themeSelectLabel">دسته‌بندی رنگ جدول</label>
      <select id="table-theme-select" aria-describedby="table-theme-description"></select>
      <p id="table-theme-description" class="table-theme-description" data-i18n="themeSelectDescription">یکی از ۱۴ دسته‌بندی PDF یا حالت «بدون دسته‌بندی» را انتخاب کنید.</p>
    </div>
    <div class="table-shell">
      <div id="periodic-table-grid" class="periodic-grid" aria-label="جدول تناوبی عناصر / Periodic table">
        <div class="loading" data-i18n="loading">در حال بارگذاری عناصر…</div>
      </div>
      <div id="f-block" class="f-block" aria-label="لانتانیدها و اکتینیدها / Lanthanides and Actinides"></div>
      <div id="table-status" class="table-status" aria-live="polite"></div>
    </div>`;
}

const positions = new Map([
  [1,[1,1]],[2,[1,18]],[3,[2,1]],[4,[2,2]],[5,[2,13]],[6,[2,14]],[7,[2,15]],[8,[2,16]],[9,[2,17]],[10,[2,18]],
  [11,[3,1]],[12,[3,2]],[13,[3,13]],[14,[3,14]],[15,[3,15]],[16,[3,16]],[17,[3,17]],[18,[3,18]],
  [19,[4,1]],[20,[4,2]],[21,[4,3]],[22,[4,4]],[23,[4,5]],[24,[4,6]],[25,[4,7]],[26,[4,8]],[27,[4,9]],[28,[4,10]],[29,[4,11]],[30,[4,12]],[31,[4,13]],[32,[4,14]],[33,[4,15]],[34,[4,16]],[35,[4,17]],[36,[4,18]],
  [37,[5,1]],[38,[5,2]],[39,[5,3]],[40,[5,4]],[41,[5,5]],[42,[5,6]],[43,[5,7]],[44,[5,8]],[45,[5,9]],[46,[5,10]],[47,[5,11]],[48,[5,12]],[49,[5,13]],[50,[5,14]],[51,[5,15]],[52,[5,16]],[53,[5,17]],[54,[5,18]],
  [55,[6,1]],[56,[6,2]],[72,[6,4]],[73,[6,5]],[74,[6,6]],[75,[6,7]],[76,[6,8]],[77,[6,9]],[78,[6,10]],[79,[6,11]],[80,[6,12]],[81,[6,13]],[82,[6,14]],[83,[6,15]],[84,[6,16]],[85,[6,17]],[86,[6,18]],
  [87,[7,1]],[88,[7,2]],[104,[7,4]],[105,[7,5]],[106,[7,6]],[107,[7,7]],[108,[7,8]],[109,[7,9]],[110,[7,10]],[111,[7,11]],[112,[7,12]],[113,[7,13]],[114,[7,14]],[115,[7,15]],[116,[7,16]],[117,[7,17]],[118,[7,18]]
]);

export function mountPeriodicTable({
  grid = document.getElementById("periodic-table-grid"),
  fBlock = document.getElementById("f-block"),
  status = document.getElementById("table-status"),
  getLanguage = () => document.documentElement.lang === "en" ? "en" : "fa",
  onElementSelected = () => {}
} = {}) {
  let elements = [];
  let selectedAtomicNumber = null;

  function createElementCard(element) {
    const language = getLanguage();
    const card = document.createElement("button");
    card.className = "element";
    card.type = "button";
    card.dataset.type = element.GroupBlock || "";
    card.dataset.atomicNumber = element.AtomicNumber;
    card.setAttribute("aria-label", getName(element, language) + ", " + translations[language].elementDetails + " " + element.AtomicNumber);

    const number = document.createElement("span");
    number.className = "element-number";
    number.textContent = element.AtomicNumber;
    const symbol = document.createElement("span");
    symbol.className = "element-symbol";
    symbol.textContent = element.Symbol;
    const name = document.createElement("span");
    name.className = "element-name";
    name.textContent = getName(element, language);
    card.append(number, symbol, name);

    card.addEventListener("animationend", event => {
      if (event.animationName === "chemistry-element-selection") card.classList.remove("selected-flash");
    });

    card.addEventListener("click", () => {
      selectedAtomicNumber = Number(element.AtomicNumber);
      document.querySelectorAll(".element.selected, .element.selected-flash").forEach(node => {
        node.classList.remove("selected", "selected-flash");
      });
      void card.offsetWidth;
      card.classList.add("selected", "selected-flash");
      onElementSelected(selectedAtomicNumber);
    });

    return card;
  }

  function createFRow(source, start, end) {
    const row = document.createElement("div");
    row.className = "f-row";
    for (let i = 0; i < 2; i++) {
      const spacer = document.createElement("span");
      spacer.className = "f-spacer";
      row.appendChild(spacer);
    }
    source.filter(element => {
      const number = Number(element.AtomicNumber);
      return number >= start && number <= end;
    }).forEach(element => row.appendChild(createElementCard(element)));
    const finalSpacer = document.createElement("span");
    finalSpacer.className = "f-spacer";
    row.appendChild(finalSpacer);
    return row;
  }

  function updateStatus() {
    if (!status) return;
    const t = translations[getLanguage()];
    status.textContent = elements.length ? t.elementsLoaded.replace("{count}", String(elements.length)) : t.noElementsLoaded;
  }

  function render(nextElements = elements) {
    elements = nextElements;
    grid.innerHTML = "";
    fBlock.innerHTML = "";
    elements.forEach(element => {
      const position = positions.get(Number(element.AtomicNumber));
      if (!position) return;
      const card = createElementCard(element);
      if (selectedAtomicNumber === Number(element.AtomicNumber)) card.classList.add("selected");
      card.style.gridColumn = position[1];
      card.style.gridRow = position[0];
      grid.appendChild(card);
    });
    fBlock.append(createFRow(elements, 57, 71), createFRow(elements, 89, 103));
    updateStatus();
  }

  function setSelectedAtomicNumber(atomicNumber) {
    selectedAtomicNumber = atomicNumber === null ? null : Number(atomicNumber);
  }

  return { render, setSelectedAtomicNumber };
}
