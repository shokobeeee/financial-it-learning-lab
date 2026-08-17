(function(){
'use strict';
if(!/\/(cobol|jcl|cloud|aws|gcp|azure|financial-war-room)\//i.test(location.pathname))return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PATTERNS=[
  {re:/\bIBM\s*MQ\b|\bMQ\b|QUEUE MANAGER|MQI/i,label:'🔌 IBM MQ / Messaging',kind:'product'},
  {re:/\bKAFKA\b|EVENT STREAM|STREAMING/i,label:'🌊 Event Streaming',kind:'concept'},
  {re:/\bHULFT\b|MANAGED FILE TRANSFER|\bMFT\b|\bSFTP\b/i,label:'📦 File Transfer / MFT',kind:'boundary'},
  {re:/API GATEWAY|APIGEE|API MANAGEMENT/i,label:'🚪 API Management / Gateway',kind:'boundary'}
];
function decorate(root){(root||document).querySelectorAll?.('pre,.terminal,.choice,.action,.actionBtn,.evidenceBtn,.verifyBtn').forEach(el=>{
  const t=el.textContent||'',hits=PATTERNS.filter(p=>p.re.test(t));if(!hits.length||el.querySelector(':scope > .fit-integration-scopes'))return;
  const s=document.createElement('span');s.className='fit-scope-row fit-integration-scopes';s.innerHTML=hits.map(h=>'<span class="fit-scope-chip '+h.kind+'">'+esc(h.label)+'</span>').join('');if(el.matches('button,.choice,.action,.actionBtn,.evidenceBtn,.verifyBtn'))el.appendChild(s);else el.insertAdjacentElement('beforebegin',s);
 });}
function addCard(){const dlg=document.querySelector('.fit-context-dialog');if(!dlg||dlg.querySelector('.fit-integration-card'))return;const grid=dlg.querySelector('.fit-context-grid');if(!grid)return;const d=document.createElement('div');d.className='fit-context-card fit-integration-card';d.style.gridColumn='1/-1';d.innerHTML='<h3>🔌 Enterprise Integration / Middleware</h3><table class="fit-context-matrix"><tr><th>Pattern</th><th>代表的な文脈</th><th>見るEvidence</th></tr><tr><td>Queue messaging</td><td>IBM MQ / cloud queue services</td><td>queue depth, oldest message, consumer, DLQ, duplicate/retry</td></tr><tr><td>Event streaming</td><td>Apache Kafka / provider streaming services</td><td>consumer lag, partition/offset, retention, retry</td></tr><tr><td>Managed file transfer</td><td>HULFT / SFTP等</td><td>send/receive result, file count/size/checksum, retry, downstream receive</td></tr><tr><td>API management</td><td>API Gateway / Apigee / Azure API Management / OCI API Gateway等</td><td>route, auth, policy, rate limit, backend response, audit</td></tr></table><p>これらは<b>相互代替の同一製品群ではありません</b>。同期API・message queue・event stream・file transferという連携パターンを分け、金融取引では重複・順序・再送・正本・end-to-end照合まで確認します。</p>';grid.appendChild(d)}
decorate(document);addCard();new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes||[])if(n.nodeType===1)decorate(n);addCard()}).observe(document.body,{subtree:true,childList:true});
})();
