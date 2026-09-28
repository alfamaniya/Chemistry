export const DATA_URL = "data/PubChemElements_all.csv";
export const ADVANCED_URL = "data/ELEMENTS_118_ADVANCED.csv";
export const VERY_ADVANCED_URL = "data/ELEMENTS_118_VERY_ADVANCED.csv";

export function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  const source = String(text).replace(/^\uFEFF/, "");

  for (let i = 0; i < source.length; i++) {
    const ch = source[i], next = source[i + 1];
    if (ch === '"' && quoted && next === '"') { cell += '"'; i++; continue; }
    if (ch === '"') { quoted = !quoted; continue; }
    if (ch === ',' && !quoted) { row.push(cell); cell = ""; continue; }
    if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && next === "\n") i++;
      row.push(cell); cell = "";
      if (row.some(value => value !== "")) rows.push(row);
      row = [];
      continue;
    }
    cell += ch;
  }

  if (quoted) throw new Error("Malformed CSV: unclosed quoted field");
  if (cell || row.length) {
    row.push(cell);
    if (row.some(value => value !== "")) rows.push(row);
  }

  const headers = (rows.shift() || []).map(header => header.trim());
  if (!headers.length || headers.some(header => !header)) throw new Error("Malformed CSV: missing or empty header");

  const validRows = [];
  let malformedRows = 0;
  rows.forEach(values => {
    if (values.length !== headers.length) { malformedRows++; return; }
    validRows.push(Object.fromEntries(headers.map((header, i) => [header, values[i]])));
  });
  if (malformedRows) console.warn(`Ignored ${malformedRows} malformed CSV row(s)`);
  return validRows;
}

export async function fetchCsv(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch " + url);
  return parseCsv(await response.text());
}

export function normalizeDetailRow(row) {
  return {
    ...row,
    AtomicNumber: row.AtomicNumber ?? row.atomic_number,
    Symbol: row.Symbol ?? row.symbol,
    Name: row.Name ?? row.name,
    AtomicMass: row.AtomicMass ?? row.atomic_mass,
    GroupBlock: row.GroupBlock ?? row.group_block,
    StandardState: row.StandardState ?? row.standard_state,
    ElectronConfiguration: row.ElectronConfiguration ?? row.electron_configuration,
    OxidationStates: row.OxidationStates ?? row.oxidation_states,
    Electronegativity: row.Electronegativity ?? row.electronegativity,
    AtomicRadius: row.AtomicRadius ?? row.atomic_radius_pm,
    IonizationEnergy: row.IonizationEnergy ?? row.ionization_energy_eV,
    ElectronAffinity: row.ElectronAffinity ?? row.electron_affinity_eV,
    MeltingPoint: row.MeltingPoint ?? row.melting_point_K,
    BoilingPoint: row.BoilingPoint ?? row.boiling_point_K,
    Density: row.Density ?? row.density_g_cm3,
    YearDiscovered: row.YearDiscovered ?? row.year_discovered,
    data_status: row.data_status ?? row.dataStatus
  };
}

export async function loadElementData() {
  const [pubchem, advanced, veryAdvanced] = await Promise.all([
    fetchCsv(DATA_URL),
    fetchCsv(ADVANCED_URL),
    fetchCsv(VERY_ADVANCED_URL)
  ]);

  return {
    elements: pubchem.filter(element => element.AtomicNumber),
    advancedElements: advanced.filter(element => element.atomic_number || element.AtomicNumber).map(normalizeDetailRow),
    veryAdvancedElements: veryAdvanced.filter(element => element.atomic_number || element.AtomicNumber).map(normalizeDetailRow)
  };
}
