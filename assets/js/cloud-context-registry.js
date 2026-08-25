(function(){
'use strict';

const R=window.FIT_CLOUD_CONCEPTS;
if(!R)return;

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const matrixKeys=['virtual-network','compute-vm','managed-db','iam','secret-key-cert','observability','hybrid-connectivity'];

function registryCloudObject(){
  const map={};
  for(const id of ['common','aws','gcp','azure','oci']){
    const p=R.providers[id];
    map[id]={
      name:p.name,
      chip:p.icon,
      network:R.product('virtual-network',id),
      compute:R.product('compute-vm',id),
      database:R.product('managed-db',id),
      object:R.product('storage-types',id),
      iam:R.product('iam',id),
      key:R.product('secret-key-cert',id),
      observe:R.product('observability',id),
      hybrid:R.product('hybrid-connectivity',id)
    };
  }
  return map;
}

function matrix(){
  return '<table class="fit-context-matrix"><tr><th>Concept</th><th>AWS</th><th>Google Cloud</th><th>Azure</th><th>OCI</th></tr>'+matrixKeys.map(key=>{
    const row=R.get(key);
    return '<tr><td>'+esc(row.term)+'</td><td>'+esc(R.product(key,'aws'))+'</td><td>'+esc(R.product(key,'gcp'))+'</td><td>'+esc(R.product(key,'azure'))+'</td><td>'+esc(R.product(key,'oci'))+'</td></tr>';
  }).join('')+'</table>';
}

function patchDialog(){
  const dlg=document.querySelector('.fit-context-dialog');
  if(!dlg)return;
  const h=[...dlg.querySelectorAll('.fit-context-card h3')].find(x=>/Cross-provider conceptual map/i.test(x.textContent||''));
  if(!h)return;
  const card=h.closest('.fit-context-card');
  if(!card||card.dataset.cloudRegistry==='1')return;
  card.dataset.cloudRegistry='1';
  card.innerHTML='<h3>Cross-provider conceptual map <span class="fit-scope-chip concept">Canonical Registry v'+R.version+'</span></h3>'+matrix()+'<p>表示は <b>assets/js/cloud-concepts.js</b> の正本から生成。Provider間は完全互換ではなく <b>≒ conceptual mapping</b> です。</p>';
}

function syncPublicApi(){
  if(!window.FITContext)return;
  window.FITContext.cloud=registryCloudObject();
  window.FITContext.cloudRegistry=R;
}

syncPublicApi();
patchDialog();

document.addEventListener('click',e=>{
  if(e.target.closest?.('.fit-context-open,.fit-profile-strip button'))setTimeout(()=>{syncPublicApi();patchDialog()},0);
},true);

new MutationObserver(()=>{syncPublicApi();patchDialog()}).observe(document.body,{subtree:true,childList:true});
})();
