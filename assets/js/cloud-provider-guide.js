(function(){
'use strict';

const path=(location.pathname||'').toLowerCase();
const moduleId=['cloud','aws','gcp','azure'].find(x=>path.includes('/'+x+'/'))||null;
const R=window.FIT_CLOUD_CONCEPTS;
if(!moduleId||!R)return;

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const providerId=moduleId==='cloud'?'common':moduleId;
const P=R.providers[providerId];
const product=key=>R.product(key,providerId);

function patch(){
  const o=document.getElementById('modulePackageOverlay');
  if(!o||o.dataset.cloudRegistryAligned==='1')return;
  o.dataset.cloudRegistryAligned='1';

  const phases=o.querySelector('.pkg-phases');
  if(phases){
    phases.innerHTML=R.phases.map(x=>'<div class="pkg-phase"><div class="pkg-range">'+esc(x.range)+'</div><div><b>'+esc(x.title)+'</b><span>'+esc(x.desc)+'</span></div></div>').join('');
  }

  const terms=o.querySelector('.pkg-terms');
  if(terms){
    terms.innerHTML=R.primary().map(row=>'<tr><td>'+esc(row.term)+'</td><td>'+esc(row.plain)+'</td></tr>').join('');
  }

  const grid=o.querySelector('.pkg-grid');
  if(!grid)return;

  const registry=document.createElement('div');
  registry.className='pkg-card fit-cloud-registry-card';
  registry.innerHTML='<h3>☁️ Canonical Cloud Concept Registry</h3><p>このGuide・Cloud Map・Provider教材は、同じ20 Conceptsを正本として参照します。<b>意味 → レイヤー → '+esc(P.name)+'名</b> の順で見ればOKです。</p><div class="pkg-next"><button type="button" data-open-cloud-map>☁️ Cloud Mapを開く</button></div>';
  const mapBtn=registry.querySelector('[data-open-cloud-map]');
  if(mapBtn)mapBtn.onclick=()=>{o.classList.remove('open');setTimeout(()=>document.querySelector('.cloudAtlasTopBtn,.cloudAtlasLaunch')?.click(),0)};
  grid.insertBefore(registry,grid.firstChild);

  if(moduleId!=='cloud'){
    const same=document.createElement('div');
    same.className='pkg-card fit-cloud-same-lab-card';
    same.innerHTML='<h3>🔁 Cloud Fundamentalsと同じLab番号</h3><p>新しい20概念ではありません。Lab01〜20の役割はCloud Fundamentalsと同じで、'+esc(P.name)+'の代表実装へ翻訳します。迷ったら同じLab番号へ戻ります。</p><div class="pkg-next"><a class="primary" href="../cloud/">☁️ Cloud Fundamentalsへ戻る</a></div>';
    grid.insertBefore(same,registry.nextSibling);

    const extras=(P.extras||[]).map(k=>R.get(k)).filter(Boolean);
    if(extras.length){
      const extra=document.createElement('div');
      extra.className='pkg-card fit-cloud-extra-card';
      extra.innerHTML='<h3>🧩 '+esc(P.name)+'で追加で知っておくもの</h3>'+extras.map(row=>'<div class="pkg-question"><b>'+esc(row.term)+' — '+esc(product(row.key))+'</b><br>'+esc(row.plain)+'</div>').join('')+'<p style="margin-top:9px">20 Labsの主導線を崩さないため独立Labにはしていません。必要な案件ではCloud Map / Context / 公式資料で深掘りします。</p>';
      grid.appendChild(extra);
    }
  }
}

patch();
new MutationObserver(patch).observe(document.body,{subtree:true,childList:true});
})();
