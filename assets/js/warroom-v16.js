(function(){
'use strict';
if(!location.pathname.toLowerCase().includes('/financial-war-room/'))return;

function primaryLayer(text){
 const u=String(text||'').toUpperCase();
 if(/JES|JCL|S0C7|BATCH|DATASET|CHECKPOINT|STEP0\d|STEP\d|JOB\b/.test(u))return['core','🏦 Core / Batch'];
 if(/REPLICA|DATABASE|\bDB\b|LOCK|LEDGER|COMMIT|SQL|AUTHORITATIVE|BALANCE/.test(u))return['data','💾 Data / Ledger'];
 if(/QUEUE|CONSUMER|DLQ|INGEST|PUBLISH|EVENT|BACKLOG/.test(u))return['async','📨 Async / Ingest'];
 if(/DNS|RESOLVER|ROUTE|NETWORK|PACKET|LINK|BGP|VPN|DIRECT CONNECT|INTERCONNECT|EXPRESSROUTE|FASTCONNECT/.test(u))return['network','🌐 Network / Hybrid'];
 if(/WAF|IAM|CREDENTIAL|CERTIFICATE|TLS|KEY|SECRET|AUTH/.test(u))return['security','🛡 Identity / Security'];
 if(/RELEASE|BACKEND|APP|HEALTH|CPU|MEMORY|PROCESS|CONTAINER|VM\b/.test(u))return['app','🖥 App / Compute'];
 if(/CHANGE|AUDIT|CONTROL|CONFIG|POLICY/.test(u))return['control','🧾 Control / Change'];
 if(/CUSTOMER|BUSINESS|IMPACT|COUNT|AMOUNT|DEBIT|CREDIT|RECONCIL|DUPLICATE/.test(u))return['business','✅ Business / Reconcile'];
 return['observe','📊 Observe / Other'];
}
function caseId(){const m=location.hash.match(/case(\d+)/i);return m?Number(m[1]):0}
function usedEvidence(){return [...document.querySelectorAll('.evidenceBtn.used,.evidenceBtn:disabled')].filter(b=>b.classList.contains('used')).map(b=>({button:b,layer:primaryLayer(b.textContent)}))}
function gateCard(){return [...document.querySelectorAll('.card')].find(c=>/Primary cause/i.test(c.querySelector('h2')?.textContent||''))||null}
function render(){
 const root=document.getElementById('lockRoot'),card=gateCard();if(!card||!root)return;
 const used=usedEvidence(),map=new Map;used.forEach(x=>map.set(x.layer[0],x.layer[1]));const min=caseId()===12?3:2,ready=map.size>=min;
 let gate=card.querySelector('.fit-evidence-gate');if(!gate){gate=document.createElement('div');gate.className='fit-evidence-gate';card.insertBefore(gate,card.firstChild)}
 gate.classList.toggle('ready',ready);
 gate.innerHTML='<div class="fit-evidence-gate-top"><span>🧾 Evidence Diversity Gate</span><strong>'+map.size+' / '+min+' layers</strong></div><div class="fit-evidence-layers">'+([...map.values()].map(x=>'<span class="fit-scope-chip evidence">'+x+'</span>').join('')||'<span class="fit-profile-note">まだEvidenceを取得していません。</span>')+'</div><div class="fit-profile-note" style="margin-top:6px">'+(ready?'✅ 異なるレイヤーのEvidenceが揃いました。Causeを確定できます。':'同じ種類のログを増やすだけではCause確定不可。別レイヤーのEvidenceを追加してください。')+'</div>';
 if(!ready){root.disabled=true;root.classList.add('incident-answer-locked');root.title='異なるEvidenceレイヤーを'+min+'つ以上集めてから原因判断を確定';}
}
function guard(e){const b=e.target.closest?.('#lockRoot');if(!b)return;const layers=new Set(usedEvidence().map(x=>x.layer[0])),min=caseId()===12?3:2;if(layers.size<min){e.preventDefault();e.stopImmediatePropagation();window.FITContext?.showCoach?.('原因を当てる前にEvidenceの種類を増やします。同じレイヤーのログを複数読むのではなく、Network / App / Data / Core / Controlなど別の観点を取りにいきましょう。')}}

document.addEventListener('click',guard,true);
new MutationObserver(()=>setTimeout(render,0)).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','disabled']});
setTimeout(render,0);
})();
