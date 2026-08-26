(function(){
'use strict';
let queued=false;
function patchSqlNextPath(){
  if(!/\/sql\/?(?:index\.html)?$/i.test(location.pathname))return;
  document.querySelectorAll('a[href="../cobol/"],a[href$="/cobol/"]').forEach(link=>{
    const context=(link.textContent+' '+(link.parentElement?.textContent||'')).toLowerCase();
    if(!/(next|次は|次へ|続ける)/.test(context))return;
    link.href='../java/';
    link.textContent=link.textContent.replace(/COBOL\s*\/\s*Business Systems/gi,'Enterprise Application / Java').replace(/COBOL/gi,'Enterprise Application / Java');
  });
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;patchSqlNextPath()})}
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
})();
