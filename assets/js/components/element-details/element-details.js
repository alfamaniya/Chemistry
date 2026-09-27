export function mountElementDetailsShell(root) {
  if (!root || root.children.length) return;
  root.innerHTML = `
    <div id="selected-element" class="selected-element-card">
      <div class="empty-state" data-i18n="selectElement">یک عنصر را از جدول انتخاب کنید.</div>
    </div>
    <div id="levels" class="element-levels">
      <article class="detail-level-card">
        <div class="detail-level-header"><h3 data-i18n="beginnerTitle">شناخت بنیادین</h3></div>
        <div id="beginner-info" class="detail-content"><div class="empty-state">—</div></div>
      </article>
      <article class="detail-level-card">
        <div class="detail-level-header"><h3 data-i18n="professionalTitle">تحلیل تخصصی</h3></div>
        <div id="advanced-info" class="detail-content"><div class="empty-state">—</div></div>
      </article>
      <article class="detail-level-card">
        <div class="detail-level-header"><h3 data-i18n="veryAdvancedTitle">ژرف‌کاوی علمی</h3></div>
        <div id="very-advanced-info" class="detail-content"><div class="empty-state">—</div></div>
      </article>
    </div>`;
}

export function createElementDetailsController({getLanguage,translations,valueTranslations,getName}) {
  const selectedElementBox=document.getElementById("selected-element"), beginnerInfo=document.getElementById("beginner-info"), advancedInfo=document.getElementById("advanced-info"), veryAdvancedInfo=document.getElementById("very-advanced-info");
  let elements=[],advancedElements=[],veryAdvancedElements=[];
  const fieldLabels={AtomicNumber:"atomicNumber",Symbol:"symbol",Name:"name",NameFa:"name",AtomicMass:"atomicMass",CPKHexColor:"cpkColor",ElectronConfiguration:"electronConfiguration",Electronegativity:"electronegativity",AtomicRadius:"atomicRadius",IonizationEnergy:"ionizationEnergy",ElectronAffinity:"electronAffinity",OxidationStates:"oxidationStates",StandardState:"standardState",MeltingPoint:"meltingPoint",BoilingPoint:"boilingPoint",Density:"density",GroupBlock:"groupBlock",YearDiscovered:"yearDiscovered",data_status:"dataStatus",dataStatus:"dataStatus"};
  function setData(data){elements=data.elements||[];advancedElements=data.advancedElements||[];veryAdvancedElements=data.veryAdvancedElements||[];}
  function getRowByAtomicNumber(source,atomicNumber){return source.find(row=>Number(row.AtomicNumber||row.atomic_number||row.atomicNumber)===Number(atomicNumber));}
  function isUsable(value){return value!==undefined&&value!==null&&String(value).trim()!=="";}
  function formatValue(value,key){if(!isUsable(value))return "—";const dictionary=valueTranslations[key],language=getLanguage();if(dictionary&&dictionary[language]&&dictionary[language][String(value)]!==undefined)return dictionary[language][String(value)];return String(value);}
  function createDataGrid(data,keys){const language=getLanguage(),t=translations[language],gridNode=document.createElement("div");gridNode.className="data-grid";keys.forEach(key=>{if(!isUsable(data?.[key]))return;const item=document.createElement("div");item.className="data-item";const label=document.createElement("span");label.className="data-label";label.textContent=t[fieldLabels[key]]||key;const value=document.createElement("span");value.className="data-value";value.textContent=formatValue(data[key],key);item.append(label,value);gridNode.appendChild(item);});if(!gridNode.children.length)gridNode.innerHTML='<div class="empty-state">—</div>';return gridNode;}
  function render(atomicNumber){const language=getLanguage(),t=translations[language],beginner=getRowByAtomicNumber(elements,atomicNumber),advanced=getRowByAtomicNumber(advancedElements,atomicNumber),veryAdvanced=getRowByAtomicNumber(veryAdvancedElements,atomicNumber);if(!beginner){selectedElementBox.innerHTML='<div class="empty-state">'+t.selectElement+'</div>';beginnerInfo.innerHTML='<div class="empty-state">—</div>';advancedInfo.innerHTML='<div class="empty-state">—</div>';veryAdvancedInfo.innerHTML='<div class="empty-state">—</div>';return;}selectedElementBox.innerHTML="";const identity=document.createElement("div");identity.className="selected-identity";const symbol=document.createElement("span");symbol.className="selected-symbol";symbol.textContent=beginner.Symbol;const names=document.createElement("div");names.className="selected-names";const title=document.createElement("strong");title.textContent=getName(beginner,language);const subtitle=document.createElement("small");subtitle.textContent=language==="fa"?beginner.Name:beginner.NameFa;names.append(title,subtitle);identity.append(symbol,names);selectedElementBox.appendChild(identity);selectedElementBox.appendChild(createDataGrid(beginner,["AtomicNumber","AtomicMass","GroupBlock","StandardState","ElectronConfiguration","OxidationStates"]));beginnerInfo.innerHTML="";beginnerInfo.appendChild(createDataGrid(beginner,["AtomicNumber","Symbol","AtomicMass","StandardState","GroupBlock","YearDiscovered"]));advancedInfo.innerHTML="";advancedInfo.appendChild(createDataGrid(advanced,["AtomicNumber","Symbol","AtomicMass","GroupBlock","StandardState","ElectronConfiguration","OxidationStates","Electronegativity","AtomicRadius","IonizationEnergy","ElectronAffinity","MeltingPoint","BoilingPoint","Density"]));veryAdvancedInfo.innerHTML="";veryAdvancedInfo.appendChild(createDataGrid(veryAdvanced,["AtomicNumber","Symbol","AtomicMass","GroupBlock","StandardState","ElectronConfiguration","OxidationStates","Electronegativity","AtomicRadius","IonizationEnergy","ElectronAffinity","MeltingPoint","BoilingPoint","Density","YearDiscovered","data_status"]));}
  return {setData,render};
}
