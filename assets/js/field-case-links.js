(function(){
'use strict';
const MODULES=['linux','sql','cobol','jcl','cloud','aws','gcp','azure'];
const MAP={
  linux:[[[1,5],[4,9]],[[6,10],[1,3]],[[11,15],[5,7]],[[16,20],[1,4,6,9]]],
  sql:[[[1,8],[2,8]],[[9,15],[2,3,7]],[[16,20],[2,3,7,10]]],
  cobol:[[[1,10],[8,7]],[[11,15],[7,8]],[[16,20],[7,8,10]]],
  jcl:[[[1,7],[7,8]],[[8,13],[7,10]],[[14,20],[7,8,10]]],
  cloud:[[[1,7],[4,5,9]],[[8,15],[1,3,6]],[[16,20],[4,5,6,9,10]]],
  aws:[[[1,7],[4,5]],[[8,15],[1,6]],[[16,20],[4,6,9,10]]],
  gcp:[[[1,7],[4,5]],[[8,15],[1,6]],[[16,20],[4,6,9,10]]],
  azure:[[[1,7],[4,5]],[[8,15],[1,6]],[[16,20],[4,6,9,10]]]
};
function moduleId(){const parts=location.pathname.split('/').filter(Boolean);return MODULES.find(x=>parts.includes(x))||null}
function labId(module){
  if(module==='linux'){const m=location.pathname.match(/lab(\d{1,2})/i);return m?Number(m[1]):0}
  const m=location.hash.match(/^#lab(\d{1,2})/i);return m?Number(m[1]):0
}
function caseIds(module,lab){
  const rows=MAP[module]||[];
  if(!lab)return [...new Set(rows.flatMap(x=>x[1]))].slice(-3);
  const hit=rows.find(x=>lab>=x[0][0]&&lab<=x[0][1]);
  return (hit?.[1]||[]).slice(0,2);
}
function loadCss(){
  if(document.querySelector('link[data-field-links]'))return;
  const l=document.createElement('link');l.rel='stylesheet';l.href='../assets/css/field-case-links.css?v=1';l.dataset.fieldLinks='1';document.head.appendChild(l);
}
function render(){
  const module=moduleId();if(!module||!window.FIELD_CASES)return;
  const lab=labId(module),ids=caseIds(module,lab),cases=ids.map(id=>window.FIELD_CASES.find(x=>x.id===id)).filter(Boolean);
  let panel=document.getElementById('fieldCaseLinkPanel');
  if(!panel){panel=document.createElement('section');panel.id='fieldCaseLinkPanel';panel.className='field-link-panel';const main=document.querySelector('main')||document.body;main.appendChild(panel)}
  panel.innerHTML=`<div class="field-link-head"><div><span>🚨 WAR ROOM LINK</span><h2>${lab?'このLabの知識が効く事故':'この教材を実戦で使う'}</h2></div><a href="../field-casebook/">10 Cases →</a></div>
    <p class="field-link-note">${lab?`Lab ${String(lab).padStart(2,'0')}の知識を、公開報告ベースの事件で使ってみます。Caseカードでは症状だけを示し、原因・推奨Evidence・復習Labは答え合わせ後に開示します。`:'20 Labsの途中でも覗けます。Case結果から、必要なLabへ戻れる設計です。'}</p>
    <div class="field-link-grid">${cases.map(c=>`<a href="../field-casebook/#preview${String(c.id).padStart(2,'0')}"><small>CASE ${String(c.id).padStart(2,'0')} / ${c.difficulty}</small><b>${c.title}</b><span>${c.subtitle}</span></a>`).join('')}</div>`;
}
function ensureData(){
  loadCss();
  if(window.FIELD_CASES&&window.FIELD_CASES.length){render();return}
  if(document.querySelector('script[data-field-cases]'))return;
  const files=['cases.js','cases-1.js','cases-2.js','cases-3.js','cases-4.js','cases-5.js'];
  let i=0;
  const next=()=>{if(i>=files.length){render();return}const s=document.createElement('script');s.src='../field-casebook/'+files[i++]+'?v=1';s.dataset.fieldCases='1';s.onload=next;document.body.appendChild(s)};
  next();
}
window.addEventListener('hashchange',()=>setTimeout(render,0));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureData);else ensureData();
})();