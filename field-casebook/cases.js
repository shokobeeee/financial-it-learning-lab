window.FIELD_CASES=[];
if(typeof document!=='undefined'){
  (function(){
    if(document.querySelector('script[data-fit-nav-scroll]'))return;
    const s=document.createElement('script');
    s.src='../assets/js/navigation-scroll.js?v=1';
    s.dataset.fitNavScroll='1';
    document.body.appendChild(s);
  })();
}
