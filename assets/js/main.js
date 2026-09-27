(() => {
  "use strict";
  const DATA_URL = "data/PubChemElements_all.csv";
  const grid = document.getElementById("periodic-table-grid");
  const status = document.getElementById("table-status");

  const positions = new Map([
    [1,[1,1]],[2,[1,18]],[3,[2,1]],[4,[2,2]],[5,[2,13]],[6,[2,14]],[7,[2,15]],[8,[2,16]],[9,[2,17]],[10,[2,18]],
    [11,[3,1]],[12,[3,2]],[13,[3,13]],[14,[3,14]],[15,[3,15]],[16,[3,16]],[17,[3,17]],[18,[3,18]],
    [19,[4,1]],[20,[4,2]],[21,[4,3]],[22,[4,4]],[23,[4,5]],[24,[4,6]],[25,[4,7]],[26,[4,8]],[27,[4,9]],[28,[4,10]],[29,[4,11]],[30,[4,12]],[31,[4,13]],[32,[4,14]],[33,[4,15]],[34,[4,16]],[35,[4,17]],[36,[4,18]],
    [37,[5,1]],[38,[5,2]],[39,[5,3]],[40,[5,4]],[41,[5,5]],[42,[5,6]],[43,[5,7]],[44,[5,8]],[45,[5,9]],[46,[5,10]],[47,[5,11]],[48,[5,12]],[49,[5,13]],[50,[5,14]],[51,[5,15]],[52,[5,16]],[53,[5,17]],[54,[5,18]],
    [55,[6,1]],[56,[6,2]],[72,[6,4]],[73,[6,5]],[74,[6,6]],[75,[6,7]],[76,[6,8]],[77,[6,9]],[78,[6,10]],[79,[6,11]],[80,[6,12]],[81,[6,13]],[82,[6,14]],[83,[6,15]],[84,[6,16]],[85,[6,17]],[86,[6,18]],
    [87,[7,1]],[88,[7,2]],[104,[7,4]],[105,[7,5]],[106,[7,6]],[107,[7,7]],[108,[7,8]],[109,[7,9]],[110,[7,10]],[111,[7,11]],[112,[7,12]],[113,[7,13]],[114,[7,14]],[115,[7,15]],[116,[7,16]],[117,[7,17]],[118,[7,18]]
  ]);

  function parseCsv(text) {
    const rows=[]; let row=[], cell="", quoted=false;
    for(let i=0;i<text.length;i++){
      const ch=text[i], next=text[i+1];
      if(ch===""" && quoted && next==="""){cell+=""";i++;continue}
      if(ch==="""){quoted=!quoted;continue}
      if(ch==="," && !quoted){row.push(cell);cell="";continue}
      if((ch==="\n" || ch==="\r") && !quoted){
        if(ch==="\r" && next==="\n")i++;
        row.push(cell);cell="";
        if(row.some(v=>v!==""))rows.push(row);
        row=[];continue;
      }
      cell+=ch;
    }
    if(cell || row.length){row.push(cell);rows.push(row)}
    const headers=rows.shift();
    return rows.map(values=>Object.fromEntries(headers.map((h,i)=>[h,values[i]??""])));
  }

  function card(element){
    const el=document.createElement("button");
    el.className="element"; el.type="button"; el.dataset.type=element.GroupBlock||"";
    el.setAttribute("aria-label", element.Name+"، عدد اتمی "+element.AtomicNumber);
    const n=document.createElement("span"); n.className="element-number"; n.textContent=element.AtomicNumber;
    const s=document.createElement("span"); s.className="element-symbol"; s.textContent=element.Symbol;
    const name=document.createElement("span"); name.className="element-name"; name.textContent=element.Name;
    el.append(n,s,name);
    el.addEventListener("click",()=>{status.textContent=element.Name+" ("+element.Symbol+") — عدد اتمی "+element.AtomicNumber+" — "+(element.GroupBlock||"دسته‌بندی نامشخص")});
    return el;
  }

  function fRow(elements,label,start,end){
    const row=document.createElement("div"); row.className="f-row";
    const title=document.createElement("span"); title.className="f-label"; title.textContent=label; row.appendChild(title);
    elements.filter(e=>{const n=Number(e.AtomicNumber);return n>=start&&n<=end}).forEach(e=>row.appendChild(card(e)));
    return row;
  }

  async function load(){
    try{
      const response=await fetch(DATA_URL);
      if(!response.ok)throw new Error("fetch failed");
      const elements=parseCsv(await response.text()).filter(e=>e.AtomicNumber);
      grid.innerHTML="";
      elements.forEach(e=>{
        const p=positions.get(Number(e.AtomicNumber)); if(!p)return;
        e._row=p[0];e._col=p[1];
        const el=card(e);el.style.gridColumn=e._col;el.style.gridRow=e._row;grid.appendChild(el);
      });
      const f=document.createElement("div");f.className="f-block";
      f.append(fRow(elements,"لانتانیدها",57,71),fRow(elements,"اکتینیدها",89,103));
      grid.parentElement.appendChild(f);
      status.textContent=elements.length+" عنصر از منبع داده بارگذاری شد.";
    }catch(e){
      grid.innerHTML='<div class="loading">بارگذاری داده‌ها انجام نشد. صفحه را از طریق یک وب‌سرور محلی اجرا کنید.</div>';
      status.textContent="منبع داده: "+DATA_URL;
    }
  }
  load();
})();