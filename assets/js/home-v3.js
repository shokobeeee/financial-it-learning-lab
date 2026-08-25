(function(){
'use strict';
const modules=[
  {id:'linux',prefix:'linux_lab',total:20,title:'Linux / Infrastructure',short:'Linux',href:'linux/',note:'まずは基盤の見方から。DNS・Port・Process・Logを順番に追います。'},
  {id:'sql',prefix:'sql_db_lab',total:20,title:'SQL / Database',short:'SQL / DB',href:'sql/',note:'次はデータ。正本・Transaction・Lock・照合を理解します。'},
  {id:'cobol',prefix:'cobol_lab',total:20,title:'COBOL / Business Systems',short:'COBOL',href:'cobol/',note:'業務データがどんなルールで処理されるかをコードから追います。'},
  {id:'jcl',prefix:'jcl_batch_lab',total:20,title:'JCL / Batch Operations',short:'JCL / Batch',href:'jcl/',note:'夜間バッチをJOB・STEP・再実行・後続処理まで含めて理解します。'},
  {id:'cloud',prefix:'cloud_lab',total:20,title:'Cloud Fundamentals',short:'Cloud基礎',href:'cloud/',note:'AWSなどの製品名より先に、Network・Compute・Data・IAMの共通構造を掴みます。'},
  {id:'aws',prefix:'aws_lab',total:20,title:'AWS for Financial IT',short:'AWS',href:'aws/',note:'Cloud共通概念をAWSのサービスへ翻訳します。'},
  {id:'gcp',prefix:'gcp_lab',total:20,title:'Google Cloud for Financial IT',short:'Google Cloud',href:'gcp/',note:'Cloud共通概念をGoogle Cloudのサービスへ翻訳します。'},
  {id:'azure',prefix:'azure_lab',total:20,title:'Azure for Financial IT',short:'Azure',href:'azure/',note:'Cloud共通概念をAzureのサービスへ翻訳します。'}
];
function safeGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
function isDone(prefix,i){return safeGet(prefix+String(i).padStart(2,'0')+'_complete')==='true'||safeGet(prefix+i+'_complete')==='true'}
function progress(m){let done=0,first=1;for(let i=1;i<=m.total;i++){if(isDone(m.prefix,i))done++;else if(first===1&&done===i-1)first=i}if(done===m.total)first=m.total;return{done,first}}
function warProgress(){let done=0,first=1;for(let i=1;i<=12;i++){let pass=false;try{const r=JSON.parse(safeGet('financial_warroom_'+i+'_result')||'null');pass=!!(r&&r.passed)}catch(e){}if(pass)done++;else if(first===1&&done===i-1)first=i}if(done===12)first=12;return{done,first}}
const states=modules.map(m=>({...m,...progress(m)}));
const war=warProgress();
const totalDone=states.reduce((a,m)=>a+m.done,0);
const next=states.find(m=>m.done<m.total);
const title=document.querySelector('[data-next-title]');
const note=document.querySelector('[data-next-note]');
const cta=document.querySelector('[data-next-link]');
const ctaText=document.querySelector('[data-next-link-text]');
if(next){
  if(title)title.textContent=(next.done>0?'続き：':'次は：')+next.title;
  if(note)note.textContent=next.note;
  let href=next.href;
  if(next.id!=='linux')href+='#lab'+String(next.first).padStart(2,'0');
  if(cta)cta.href=href;
  if(ctaText)ctaText.textContent=next.done>0?'続きを開く':'ここから始める';
}else if(war.done<12){
  if(title)title.textContent='仕上げ：Financial War Room';
  if(note)note.textContent='160 Labsの知識を使って、金融IT障害を横断的に切り分けます。まずCaseの状況を確認してから挑戦します。';
  if(cta)cta.href='financial-war-room/#preview'+String(war.first).padStart(2,'0');
  if(ctaText)ctaText.textContent=war.done>0?'次のCaseの状況を見る':'War Roomを覗いてみる';
}else{
  if(title)title.textContent='全カリキュラム修了 🎉';
  if(note)note.textContent='必要な教材やWar Roomへ戻って、弱いレイヤを復習できます。';
  if(cta)cta.href='financial-war-room/';
  if(ctaText)ctaText.textContent='War Roomを復習する';
}
const count=document.querySelector('[data-home-total]');if(count)count.textContent=totalDone;
const bar=document.querySelector('[data-home-total-progress]');if(bar)bar.style.width=(totalDone/160*100)+'%';
const percent=document.querySelector('[data-home-percent]');if(percent)percent.textContent=Math.round(totalDone/160*100)+'%';
states.forEach(m=>{
  const card=document.querySelector('[data-module-card="'+m.id+'"]');
  const state=document.querySelector('[data-module-state="'+m.id+'"]');
  if(card){card.classList.toggle('is-complete',m.done===m.total);card.classList.toggle('is-current',!!next&&next.id===m.id)}
  if(state)state.textContent=m.done===m.total?'修了':m.done>0?'学習中':'未着手';
});
const warCard=document.querySelector('[data-module-card="war"]');const warState=document.querySelector('[data-module-state="war"]');
if(warCard){warCard.classList.toggle('is-complete',war.done===12);warCard.classList.toggle('is-current',!next&&war.done<12)}
if(warState)warState.textContent=war.done===12?'修了':war.done>0?'挑戦中':'未挑戦';
const routeMap=[
  {id:'foundation',done:states.slice(0,2).every(x=>x.done===20),current:!!next&&['linux','sql'].includes(next.id)},
  {id:'core',done:states.slice(2,4).every(x=>x.done===20),current:!!next&&['cobol','jcl'].includes(next.id)},
  {id:'cloud',done:states[4].done===20,current:!!next&&next.id==='cloud'},
  {id:'providers',done:states.slice(5,8).every(x=>x.done===20),current:!!next&&['aws','gcp','azure'].includes(next.id)},
  {id:'war',done:war.done===12,current:!next&&war.done<12},
  {id:'finish',done:!next&&war.done===12,current:false}
];
routeMap.forEach(x=>{const el=document.querySelector('[data-route-step="'+x.id+'"]');if(el){el.classList.toggle('is-complete',x.done);el.classList.toggle('is-current',x.current)}});
})();
