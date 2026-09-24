const PERSIAN_NAMES = ["","هیدروژن","هلیوم","لیتیوم","بریلیم","بور","کربن","نیتروژن","اکسیژن","فلوئور","نئون","سدیم","منیزیم","آلومینیوم","سیلیسیم","فسفر","گوگرد","کلر","آرگون","پتاسیم","کلسیم","اسکاندیم","تیتانیم","وانادیم","کروم","منگنز","آهن","کبالت","نیکل","مس","روی","گالیم","ژرمانیم","آرسنیک","سلنیوم","برم","کریپتون","روبیدیم","استرانسیم","ایتریم","زیرکونیم","نیوبیوم","مولیبدن","تکنسیم","روتنیم","رودیم","پالادیم","نقره","کادمیم","ایندیم","قلع","آنتیموان","تلوریم","ید","زنون","سزیم","باریم","لانتان","سریم","پرازئودیمیم","نئودیمیم","پرومتیوم","ساماریم","یوروپیم","گادولینیم","تربیوم","دیسپروزیم","هولمیم","اربیم","تولیم","ایتربیم","لوتتیم","هافنیم","تانتال","تنگستن","رنیوم","اسمیم","ایریدیم","پلاتین","طلا","جیوه","تالیم","سرب","بیسموت","پولونیم","آستاتین","رادون","فرانسیم","رادیم","اکتینیم","توریم","پروتاکتینیم","اورانیم","نپتونیم","پلوتونیم","آمریسیم","کوریوم","برکلیم","کالیفرنیم","اینشتینیم","فرمیم","مندلیفیم","نوبلیم","لارنسیم","رادرفوردیم","دوبنیم","سیبورگیم","بوهریم","هاسیم","مایتنریم","دارمشتادیم","رونتگنیم","کوپرنیسیم","نیهونیم","فلروویم","موسکوویم","لیورموریم","تنسین","اوگانسون"];

const CATEGORY_SETS = {
  alkali: new Set([3, 11, 19, 37, 55, 87]),
  alkalineEarth: new Set([4, 12, 20, 38, 56, 88]),
  transition: new Set([
    ...Array.from({ length: 10 }, (_, i) => i + 21),
    ...Array.from({ length: 10 }, (_, i) => i + 39),
    ...Array.from({ length: 9 }, (_, i) => i + 72),
    ...Array.from({ length: 9 }, (_, i) => i + 104)
  ]),
  postTransition: new Set([13, 31, 49, 50, 81, 82, 83, 84, 113, 114, 115, 116]),
  metalloid: new Set([5, 14, 32, 33, 51, 52]),
  halogen: new Set([9, 17, 35, 53, 85, 117]),
  nobleGas: new Set([2, 10, 18, 36, 54, 86, 118]),
  lanthanide: new Set(Array.from({ length: 15 }, (_, i) => i + 57)),
  actinide: new Set(Array.from({ length: 15 }, (_, i) => i + 89))
};

function getCategory(atomicNumber) {
  for (const [category, numbers] of Object.entries(CATEGORY_SETS)) {
    if (numbers.has(atomicNumber)) return category;
  }
  return "nonmetal";
}

function findSection(node, heading) {
  if (!node || typeof node !== "object") return null;
  if (node.TOCHeading === heading && Array.isArray(node.Information)) return node;

  for (const value of Object.values(node)) {
    const result = findSection(value, heading);
    if (result) return result;
  }
  return null;
}

function getFirstString(section) {
  const item = section?.Information?.find((entry) =>
    entry?.Value?.StringWithMarkup?.some((markup) => typeof markup?.String === "string")
  );

  return item?.Value?.StringWithMarkup?.find(
    (markup) => typeof markup?.String === "string"
  )?.String ?? "";
}

function renderElementCard(card, data) {
  const record = data?.Record;
  const atomicNumber = Number(record?.RecordNumber || card.dataset.element);
  const englishName = record?.RecordTitle || getFirstString(findSection(record, "Element Name"));
  const symbol = getFirstString(findSection(record, "Element Symbol"));
  const persianName = PERSIAN_NAMES[atomicNumber] || "";

  card.classList.add(getCategory(atomicNumber));
  card.setAttribute("aria-label", `${persianName} (${englishName})`);
  card.innerHTML = `
    <span class="atomic-number">${atomicNumber}</span>
    <span class="element-symbol">${symbol}</span>
    <span class="element-name-fa" dir="rtl">${persianName}</span>
    <span class="element-name-en">${englishName}</span>
  `;
}

async function loadElement(card) {
  const atomicNumber = Number(card.dataset.element);
  const filename = `ELEMENT_ATOMIC NUMBER_${atomicNumber}.json`;
  const url = `data/elements/${encodeURIComponent(filename)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    renderElementCard(card, data);
  } catch (error) {
    card.classList.add("data-error");
    card.textContent = atomicNumber;
    console.error(`Failed to load element ${atomicNumber}:`, error);
  }
}

document.querySelectorAll(".element-block").forEach(loadElement);
