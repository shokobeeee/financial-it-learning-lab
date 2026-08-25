(function(){
  function loadNavigationScroll(){if(document.querySelector('script[data-fit-nav-scroll]'))return;const s=document.createElement('script');s.src='assets/js/navigation-scroll.js?v=1';s.dataset.fitNavScroll='1';document.body.appendChild(s)}
  loadNavigationScroll();
  function count(prefix,total){let n=0;for(let i=1;i<=total;i++){try{if(localStorage.getItem(prefix+String(i).padStart(2,'0')+'_complete')==='true'||localStorage.getItem(prefix+i+'_complete')==='true')n++}catch(e){}}return n}
  const modules=[
    ['linux','linux_lab',20],['cobol','cobol_lab',20],['sql','sql_db_lab',20],['jcl','jcl_batch_lab',20],
    ['cloud','cloud_lab',20],['aws','aws_lab',20],['gcp','gcp_lab',20],['azure','azure_lab',20]
  ];
  let totalDone=0;
  modules.forEach(([id,prefix,total])=>{const n=count(prefix,total);totalDone+=n;const bar=document.querySelector('[data-progress="'+id+'"]');const text=document.querySelector('[data-progress-text="'+id+'"]');if(bar)bar.style.width=(n/total*100)+'%';if(text)text.textContent=n+' / '+total+' COMPLETE';});
  const t=document.querySelector('[data-total-complete]');if(t)t.textContent=totalDone;
  const tb=document.querySelector('[data-total-progress]');if(tb)tb.style.width=(totalDone/160*100)+'%';
  let war=0;for(let i=1;i<=12;i++){try{const r=JSON.parse(localStorage.getItem('financial_warroom_'+i+'_result')||'null');if(r&&r.passed)war++}catch(e){}}
  const wb=document.querySelector('[data-progress="war"]');const wt=document.querySelector('[data-progress-text="war"]');if(wb)wb.style.width=(war/12*100)+'%';if(wt)wt.textContent=war+' / 12 SIGN-OFF';
  const wp=document.querySelector('[data-war-passed]');if(wp)wp.textContent=war;
})();
