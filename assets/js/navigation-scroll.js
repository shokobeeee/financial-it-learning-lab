(function(){
'use strict';
const FLAG='fit_scroll_top_next';
const ROUTE_HASH=/^#(?:home|stage0|lab\d{1,2}|preview\d{1,2}|case\d{1,2})$/i;
let scheduled=false;

function scrollTopAfterRender(){
  if(scheduled)return;
  scheduled=true;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    scheduled=false;
    window.scrollTo({top:0,left:0,behavior:'auto'});
  }));
}
function setNextFlag(){try{sessionStorage.setItem(FLAG,'1')}catch(e){}}
function clearNextFlag(){try{sessionStorage.removeItem(FLAG)}catch(e){}}
function consumeNextFlag(){
  try{
    if(sessionStorage.getItem(FLAG)==='1'){
      sessionStorage.removeItem(FLAG);
      scrollTopAfterRender();
      return true;
    }
  }catch(e){}
  return false;
}

// Same-page hash routers do not reset scroll position by themselves.
window.addEventListener('hashchange',()=>{
  if(ROUTE_HASH.test(location.hash)){
    clearNextFlag();
    scrollTopAfterRender();
  }
});

// For navigation to another HTML page, remember that the destination should start at the top.
document.addEventListener('click',event=>{
  const a=event.target.closest?.('a[href]');
  if(!a||event.defaultPrevented||a.hasAttribute('download'))return;
  if(a.target&&a.target!=='_self')return;
  let url;
  try{url=new URL(a.href,location.href)}catch(e){return}
  if(url.origin!==location.origin)return;
  const sameDocument=url.pathname===location.pathname&&url.search===location.search;
  if(sameDocument){
    if(ROUTE_HASH.test(url.hash))setNextFlag();
    return;
  }
  setNextFlag();
},true);

// Consume cross-page navigation intent. The immediate call also covers scripts loaded
// dynamically after the browser's normal pageshow event (Linux integration bridge).
window.addEventListener('pageshow',consumeNextFlag);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',consumeNextFlag,{once:true});
else consumeNextFlag();
})();
