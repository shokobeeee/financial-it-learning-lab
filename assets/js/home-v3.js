(function(){
'use strict';
const TOTAL_LABS=180;
const modules=[
  {id:'linux',prefix:'linux_lab',total:20,title:'Linux / Infrastructure',href:'linux/',note:'コンピュータ・OS・Networkの基本から始め、LinuxのProcess・Port・Logへ進みます。'},
  {id:'sql',prefix:'sql_db_lab',total:20,title:'SQL / Database',href:'sql/',note:'次はData。正本・Transaction・同時実行制御・照合を理解します。'},
  {id:'java',prefix:'java_app_lab',total:20,title:'Enterprise Application / Java',href:'java/',note:'HTTP RequestをJava/JVMで処理し、Database・Messaging・Releaseへつなぎます。'},
  {id:'cobol',prefix:'cobol_lab',total:20,title:'COBOL / Business Systems',href:'cobol/',note:'業務DataがどんなRuleで処理されるかをCodeから追います。'},
  {id:'jcl',prefix:'jcl_batch_lab',total:20,title:'JCL / Batch Operations',href:'jcl/',note:'夜間BatchをJOB・STEP・再実行・後続処理まで含めて理解します。'},
  {id:'cloud',prefix:'cloud_lab',total:20,title:'Cloud Fundamentals',href:'cloud/',note:'Provider製品名より先に、Network・Compute・Data・IAMの共通構造を掴みます。'},
  {id:'aws',prefix:'aws_lab',total:20,title:'AWS for Financial IT',href:'aws/',note:'Cloud共通概念をAWSのServiceへ翻訳します。'},
  {id:'gcp',prefix:'gcp_lab',total:20,title:'Google Cloud for Financial IT',href:'gcp/',note:'Cloud共通概念をGoogle CloudのServiceへ翻訳します。'},
  {id:'azure',prefix:'azure_lab',total:20,title:'Azure for Financial IT',href:'azure/',note:'Cloud共通概念をAzureのServiceへ翻訳します。'}
];
function safeGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
function isDone(prefix,i){return safeGet(prefix+String(i).padStart(2,'0')+'_complete')==='true'||safeGet(prefix+i+'_complete')==='true'}
function progress(m){let done=0,first=1;for(let i=1;i<=m.total;i++){if(isDone(m.prefix,i))done++;else if(first===1&&done===i-1)first=i}if(done===m.total)first=m.total;return{done,first}}
function resultProgress(prefix,total){let done=0,first=1;for(let i=1;i<=total;i++){let pass=false;try{const r=JSON.parse(safeGet(prefix+i+'_result')||'null');pass=!!(r&&r.passed)}catch(e){}if(pass)done++;else if(first===1&&done===i-1)first=i}if(done===total)first=total;return{done,first,total}}
const states=modules.map(m=>({...m,...progress(m)}));
const field=resultProgress('field_case_',10),war=resultProgress('financial_warroom_',12);
const totalDone=states.reduce((a,m)=>a+m.done,0),next=states.find(m=>m.done<m.total);
const title=document.querySelector('[data-next-title]'),note=document.querySelector('[data-next-note]'),cta=document.querySelector('[data-next-link]'),ctaText=document.querySelector('[data-next-link-text]');
if(next){if(title)title.textContent=(next.done>0?'続き：':'次は：')+next.title;if(note)note.textContent=next.note;let href=next.href;if(next.id!=='linux')href+='#lab'+String(next.first).padStart(2,'0');if(cta)cta.href=href;if(ctaText)ctaText.textContent=next.done>0?'続きを開く':'ここから始める'}
else if(field.done<10){if(title)title.textContent='実戦準備：Field Incident Gate';if(note)note.textContent='180 Labsの知識を、公開報告・技術記事・新聞記事を基に再構成した10事件で使います。';if(cta)cta.href='field-casebook/#preview'+String(field.first).padStart(2,'0');if(ctaText)ctaText.textContent=field.done>0?'次の公開事例を見る':'10事件へ挑む'}
else if(war.done<12){if(title)title.textContent='最終戦：Financial War Room';if(note)note.textContent='公開事例で鍛えた推理を、金融IT向け12事件の自由捜査で仕上げます。';if(cta)cta.href='financial-war-room/#preview'+String(war.first).padStart(2,'0');if(ctaText)ctaText.textContent=war.done>0?'次のWar Roomへ':'最終戦へ進む'}
else{if(title)title.textContent='全カリキュラム修了 🎉';if(note)note.textContent='教材・公開事例・War Roomへ戻り、弱いLayerを復習できます。';if(cta)cta.href='field-casebook/';if(ctaText)ctaText.textContent='公開事例を復習する'}
const count=document.querySelector('[data-home-total]');if(count)count.textContent=totalDone;const bar=document.querySelector('[data-home-total-progress]');if(bar)bar.style.width=(totalDone/TOTAL_LABS*100)+'%';const percent=document.querySelector('[data-home-percent]');if(percent)percent.textContent=Math.round(totalDone/TOTAL_LABS*100)+'%';
function paint(id,done,total,current,completeText,activeText,idleText){const card=document.querySelector('[data-module-card="'+id+'"]'),state=document.querySelector('[data-module-state="'+id+'"]'),p=document.querySelector('[data-progress="'+id+'"]'),t=document.querySelector('[data-progress-text="'+id+'"]');if(card){card.classList.toggle('is-complete',done===total);card.classList.toggle('is-current',!!current)}if(state)state.textContent=done===total?completeText:done>0?activeText:idleText;if(p)p.style.width=(done/total*100)+'%';if(t)t.textContent=done+' / '+total}
states.forEach(m=>paint(m.id,m.done,m.total,!!next&&next.id===m.id,'修了','学習中','未着手'));paint('field',field.done,10,!next&&field.done<10,'修了','挑戦中','未挑戦');paint('war',war.done,12,!next&&field.done===10&&war.done<12,'修了','挑戦中','未挑戦');
const by=id=>states.find(x=>x.id===id);
const routeMap=[
  {id:'foundation',done:by('linux').done===20,current:!!next&&next.id==='linux'},
  {id:'data',done:by('sql').done===20,current:!!next&&next.id==='sql'},
  {id:'application',done:by('java').done===20,current:!!next&&next.id==='java'},
  {id:'core',done:['cobol','jcl'].every(id=>by(id).done===20),current:!!next&&['cobol','jcl'].includes(next.id)},
  {id:'cloud',done:['cloud','aws','gcp','azure'].every(id=>by(id).done===20),current:!!next&&['cloud','aws','gcp','azure'].includes(next.id)},
  {id:'field',done:field.done===10,current:!next&&field.done<10},
  {id:'war',done:war.done===12,current:!next&&field.done===10&&war.done<12},
  {id:'finish',done:!next&&field.done===10&&war.done===12,current:false}
];
routeMap.forEach(x=>{const el=document.querySelector('[data-route-step="'+x.id+'"]');if(el){el.classList.toggle('is-complete',x.done);el.classList.toggle('is-current',x.current)}});
})();
