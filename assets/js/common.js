(function(){
  function count(prefix,total){let n=0;for(let i=1;i<=total;i++){try{if(localStorage.getItem(prefix+String(i).padStart(2,'0')+'_complete')==='true')n++}catch(e){}}return n}
  const modules=[['linux','linux_lab',20],['cobol','cobol_lab',20],['sql','sql_db_lab',20]];
  modules.forEach(([id,prefix,total])=>{const n=count(prefix,total);const bar=document.querySelector('[data-progress="'+id+'"]');const text=document.querySelector('[data-progress-text="'+id+'"]');if(bar)bar.style.width=(n/total*100)+'%';if(text)text.textContent=n+' / '+total+' COMPLETE';});
})();
