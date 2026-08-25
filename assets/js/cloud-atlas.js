(function(){
'use strict';

const path=(location.pathname||'').toLowerCase();
const moduleId=['cloud','aws','gcp','azure'].find(x=>path.includes('/'+x+'/'))||null;
const R=window.FIT_CLOUD_CONCEPTS;
if(!moduleId||!R)return;

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const providerId=moduleId==='cloud'?'common':moduleId;
const providerName=R.providers[providerId].name;
const rowMap=R.byKey;
const rows=R.concepts;
const primary=R.primary();
let state={tab:'layers',query:'',selected:'virtual-network'};
let lastTrigger=null;

function productFor(row,id=providerId){return id==='common'?row.term:R.product(row.key,id)}
function searchText(row){return [row.term,row.plain,row.why,...Object.values(row.products||{}),...(row.aliases||[])].join(' ').toLowerCase()}
function focusables(root){return [...root.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el=>!el.disabled&&el.offsetParent!==null)}

function launch(){
  if(document.getElementById('cloudAtlasLaunch'))return;
  const top=document.querySelector('.topbar');
  if(top){
    const nav=top.querySelector('.nav');
    const b=document.createElement('button');
    b.type='button';b.className='cloudAtlasTopBtn';b.innerHTML='☁️ Cloud Map';
    b.onclick=()=>openAtlas(null,b);
    if(nav)nav.appendChild(b);else top.appendChild(b);
  }
  const f=document.createElement('button');
  f.id='cloudAtlasLaunch';f.type='button';f.className='cloudAtlasLaunch';f.innerHTML='☁️<span>Cloud Map</span>';
  f.onclick=()=>openAtlas(null,f);document.body.appendChild(f);
}

function overlay(){
  let o=document.getElementById('cloudAtlasOverlay');if(o)return o;
  o=document.createElement('div');o.id='cloudAtlasOverlay';o.className='cloudAtlasOverlay';
  o.innerHTML=`
  <div class="cloudAtlasPanel" role="dialog" aria-modal="true" aria-labelledby="cloudAtlasTitle">
    <header class="cloudAtlasHead"><div><div class="cloudAtlasKicker">CLOUD MAP / CANONICAL REGISTRY v${R.version}</div><h2 id="cloudAtlasTitle">☁️ Cloudを「位置」で理解する</h2><p>用語を <b>何をする？ / どこまで任せる？ / 各社では何て呼ぶ？ / 銀行Systemのどこ？</b> の4軸で整理します。</p></div><button class="cloudAtlasClose" type="button" aria-label="閉じる">×</button></header>
    <div class="cloudAtlasTools"><div class="cloudAtlasTabs" role="tablist" aria-label="Cloud Map表示"><button role="tab" data-tab="layers">🧱 レイヤー</button><button role="tab" data-tab="terms">📖 用語</button><button role="tab" data-tab="mapping">↔ 各社対応</button><button role="tab" data-tab="models">☁️ 提供モデル</button></div><label class="cloudAtlasSearch">🔎<input type="search" placeholder="EC2 / VPC / RDS / IAM / Azure SQL ..." autocomplete="off" aria-label="Cloud用語を検索"></label></div>
    <div class="cloudAtlasBody"><div class="cloudAtlasMain"></div><aside class="cloudAtlasDetail"></aside></div>
    <footer class="cloudAtlasFoot">※ IaaS / PaaS 等は学習上の管理責任の目安。製品間の対応は <b>≒ conceptual mapping</b> であり完全互換ではありません。分類・用語の正本は FIT_CLOUD_CONCEPTS。</footer>
  </div>`;
  document.body.appendChild(o);
  o.querySelector('.cloudAtlasClose').onclick=closeAtlas;
  o.addEventListener('click',e=>{if(e.target===o)closeAtlas()});
  o.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();closeAtlas();return}
    if(e.key!=='Tab')return;
    const items=focusables(o);if(!items.length)return;
    const first=items[0],last=items[items.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  });
  o.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;render()});
  const input=o.querySelector('input');
  input.addEventListener('input',()=>{state.query=input.value.trim().toLowerCase();state.tab='terms';render()});
  return o;
}

function openAtlas(key,trigger){
  const o=overlay();lastTrigger=trigger||document.activeElement;
  if(key&&rowMap[key]){state.selected=key;state.tab='terms';state.query='';const input=o.querySelector('input');if(input)input.value=''}
  o.classList.add('open');document.body.style.overflow='hidden';render();
  requestAnimationFrame(()=>o.querySelector('.cloudAtlasClose')?.focus());
}
function closeAtlas(){
  const o=document.getElementById('cloudAtlasOverlay');if(o)o.classList.remove('open');
  document.body.style.overflow='';
  if(lastTrigger&&typeof lastTrigger.focus==='function')requestAnimationFrame(()=>lastTrigger.focus());
}

function bankDiagram(row){
  const active=row.bank;
  const core=[['edge','🚪 Entry'],['network','🌐 Network'],['compute','🖥 App / Compute'],['data','🗄 Data'],['hybrid','🔗 Core']];
  const main=core.map(([k,t])=>`<div class="bankNode ${active===k?'active':''}">${t}</div>`).join('<div class="bankArrow">→</div>');
  return `<div class="bankMap"><div class="bankCustomer">📱 Customer</div><div class="bankArrow">→</div>${main}<div class="bankSide"><div class="bankNode side ${active==='identity'?'active':''}">🔐 Identity / Security</div><div class="bankNode side ${active==='integration'?'active':''}">📨 Integration</div><div class="bankNode side ${active==='operations'?'active':''}">📊 Operations</div><div class="bankNode side ${active==='architecture'?'active':''}">🧭 Architecture</div></div></div>`;
}

function detail(row){
  const d=overlay().querySelector('.cloudAtlasDetail');
  const layer=R.layers[row.layer],model=R.models[row.model];
  const mappingTitle=row.mappingMode==='examples'?'③ Provider別の例（相互代替ではない）':'③ 各社では何て呼ぶ？';
  d.innerHTML=`<div class="atlasTermHead"><div class="atlasTermIcon">${layer.icon}</div><div><span>${esc(layer.name)}</span><h3>${esc(row.term)}</h3></div></div>
    <p class="atlasPlain"><b>ひと言：</b>${esc(row.plain)}</p><p class="atlasWhy"><b>なぜ必要？</b>${esc(row.why)}</p>
    <div class="axisGrid"><div><small>① 何をする？</small><b>${layer.icon} ${esc(layer.name)}</b><span>${esc(layer.desc)}</span></div><div><small>② どこまで任せる？</small><b>${esc(model.name)}</b><span>${esc(model.desc)}</span></div></div>
    <div class="mappingDetail"><small>${esc(mappingTitle)}</small><table><tr><th>AWS</th><td>${esc(row.products?.aws||'-')}</td></tr><tr><th>Google Cloud</th><td>${esc(row.products?.gcp||'-')}</td></tr><tr><th>Azure</th><td>${esc(row.products?.azure||'-')}</td></tr><tr><th>OCI</th><td>${esc(row.products?.oci||'-')}</td></tr></table></div>
    <div class="bankWhere"><small>④ 銀行Systemのどこ？</small>${bankDiagram(row)}</div>
    ${row.lab?`<a class="atlasLabLink" href="#lab${String(row.lab).padStart(2,'0')}" data-close-atlas>この教材：Lab ${String(row.lab).padStart(2,'0')}へ →</a>`:''}`;
  d.querySelectorAll('[data-close-atlas]').forEach(a=>a.onclick=()=>closeAtlas());
}

function termCard(row){
  const l=R.layers[row.layer];
  return `<button class="atlasTermCard ${state.selected===row.key?'selected':''}" data-term="${row.key}"><span class="atlasLayerDot">${l.icon}</span><span><b>${esc(row.term)}</b><small>${esc(l.short)} · ${esc(R.models[row.model].name)}</small></span><em>${esc(productFor(row))}</em></button>`;
}
function renderLayers(main){
  main.innerHTML='<div class="atlasLayerGrid">'+Object.entries(R.layers).map(([id,l])=>{const rs=rows.filter(r=>r.layer===id);return `<section class="atlasLayerCard"><header><span>${l.icon}</span><div><h3>${esc(l.name)}</h3><p>${esc(l.desc)}</p></div></header><div class="atlasLayerTerms">${rs.map(r=>`<button data-term="${r.key}">${esc(r.term)}</button>`).join('')}</div></section>`}).join('')+'</div>';
}
function renderTerms(main){
  const filtered=rows.filter(r=>!state.query||searchText(r).includes(state.query));
  main.innerHTML=`<div class="atlasListHead"><b>${state.query?'検索結果':'Cloud用語辞典'}</b><span>${filtered.length} terms</span></div><div class="atlasTermList">${filtered.map(termCard).join('')}</div>`;
}
function renderMapping(main){
  const rs=rows.filter(r=>r.products&&r.key!=='web-flow'&&r.mappingMode!=='examples');
  main.innerHTML=`<div class="atlasMappingWrap"><table class="atlasMappingTable"><thead><tr><th>レイヤー</th><th>共通Concept</th><th>AWS</th><th>Google Cloud</th><th>Azure</th><th>OCI</th><th>提供モデル</th></tr></thead><tbody>${rs.map(r=>`<tr data-term="${r.key}"><td>${R.layers[r.layer].icon} ${esc(R.layers[r.layer].short)}</td><td><b>${esc(r.term)}</b></td><td>${esc(r.products.aws||'-')}</td><td>${esc(r.products.gcp||'-')}</td><td>${esc(r.products.azure||'-')}</td><td>${esc(r.products.oci||'-')}</td><td>${esc(R.models[r.model].name)}</td></tr>`).join('')}</tbody></table></div>`;
}
function renderModels(main){
  const examples={iaasFoundation:'VPC / VNet / VCN / Subnet / Route',iaas:'EC2 / Compute Engine / Azure VM / OCI Compute',managed:'RDS / Cloud SQL / Azure SQL / Autonomous Database',serverless:'Lambda / Cloud Run / Azure Functions / OCI Functions',computeControl:'ASG / MIG / VM Scale Sets / Instance Pools',control:'IAM / Policy / Audit / IaC'};
  const order=['iaasFoundation','iaas','managed','serverless','computeControl'];
  main.innerHTML=`<div class="modelIntro"><h3>「どこまでProvider側へ任せるか」で見る</h3><p>IaaS→Managed/PaaS→Serverlessになるほど一般にServer・OS等を自分で管理する範囲は減ります。ただし<b>Data・Identity・設定・業務責任はゼロになりません。</b></p></div><div class="modelLadder">${order.map(k=>`<div class="modelStep"><b>${esc(R.models[k].name)}</b><span>${esc(R.models[k].desc)}</span><em>${esc(examples[k]||'')}</em></div>`).join('')}<div class="modelStep saas"><b>SaaS</b><span>ApplicationそのものをServiceとして利用する。各社のSaaS例は用途が異なり相互代替ではありません。</span><em>Microsoft 365 / Google Workspace / Oracle Fusion Cloud Applications等</em></div></div><div class="modelCross"><h3>分類軸を混ぜない</h3><p>Availability ZoneはFailure Domain、Auto Scaling / MIG / VM Scale SetsはCompute管理。似た場面で使っても同じ分類ではありません。</p></div>`;
}
function bindTerms(main){
  main.querySelectorAll('[data-term]').forEach(el=>{el.onclick=()=>{state.selected=el.dataset.term;detail(rowMap[state.selected]);main.querySelectorAll('.selected').forEach(x=>x.classList.remove('selected'));if(el.classList.contains('atlasTermCard'))el.classList.add('selected')}});
}
function render(){
  const o=overlay(),main=o.querySelector('.cloudAtlasMain');
  o.querySelectorAll('[data-tab]').forEach(b=>{const active=b.dataset.tab===state.tab;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));b.setAttribute('tabindex',active?'0':'-1')});
  if(state.tab==='layers')renderLayers(main);else if(state.tab==='terms')renderTerms(main);else if(state.tab==='mapping')renderMapping(main);else renderModels(main);
  bindTerms(main);detail(rowMap[state.selected]||rows[0]);
}

function currentLab(){const m=(location.hash||'').match(/^#lab(\d{1,2})/i);return m?Number(m[1]):0}
function injectLabStrip(){
  const id=currentLab();if(!id)return;
  const hero=document.querySelector('.labHero');if(!hero)return;
  const row=primary[id-1];if(!row)return;
  let s=hero.querySelector('.cloudAtlasLabStrip');if(s&&s.dataset.lab===String(id))return;
  if(!s){s=document.createElement('section');s.className='cloudAtlasLabStrip';const goal=hero.querySelector('.goal');if(goal)goal.insertAdjacentElement('afterend',s);else hero.appendChild(s)}
  s.dataset.lab=String(id);
  const layer=R.layers[row.layer],model=R.models[row.model],product=productFor(row);
  s.innerHTML=`<div class="labStripLabel">🧭 今回の位置</div><div class="labStripItems"><span><small>レイヤー</small><b>${layer.icon} ${esc(layer.name)}</b></span><span><small>提供モデル</small><b>${esc(model.name)}</b></span><span><small>${esc(providerName)}</small><b>${esc(product)}</b></span></div><button type="button">詳しく見る →</button>`;
  const btn=s.querySelector('button');btn.onclick=()=>openAtlas(row.key,btn);
}
function init(){
  launch();injectLabStrip();
  window.addEventListener('hashchange',()=>setTimeout(injectLabStrip,0));
  new MutationObserver(()=>injectLabStrip()).observe(document.getElementById('app')||document.body,{subtree:true,childList:true});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
