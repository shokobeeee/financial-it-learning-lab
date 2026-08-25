(function(){
'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function caseId(){const m=location.hash.match(/#case(\d{1,2})/i);return m?Number(m[1]):0}
function render(){
  const id=caseId(),items=window.FIELD_CASE_SOURCE_SUPPLEMENTS?.[id]||[];
  const primary=document.querySelector('.fgSources')?.closest('.fgCard');
  if(!primary||!items.length)return;
  if(document.getElementById('fgSupplementSources'))return;
  const sec=document.createElement('section');
  sec.className='fgCard';sec.id='fgSupplementSources';
  sec.innerHTML=`<div class="fgKicker">TECHNICAL COMPANION READING</div><h2>📚 理解を深めるZenn・技術記事</h2><p class="fgMuted">ここは事故の一次Sourceではありません。Resultで確認した事実を、技術概念・実装・復旧・設計判断まで掘り下げるための補助教材です。</p><div class="fgSources">${items.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer"><span>${esc(s.kind)} / ${esc(s.date)}</span><b>${esc(s.title)}</b><small>${esc(s.publisher)}</small><p class="fgMuted small">${esc(s.why)}</p></a>`).join('')}</div>`;
  primary.insertAdjacentElement('afterend',sec);
}
new MutationObserver(()=>setTimeout(render,0)).observe(document.body,{subtree:true,childList:true});
window.addEventListener('hashchange',()=>setTimeout(render,0));
setTimeout(render,0);
})();
