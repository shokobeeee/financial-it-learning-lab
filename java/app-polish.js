(function(){
'use strict';
const A=window.JAVA_APP;
if(!A)return;

const JOURNEY_ALIASES={
  client:['client','customer','channel','browser','producer'],
  edge:['edge','http','api','gateway','load-balancer','identity','authn'],
  app:['app','application','request','controller','service','business','validation','error','security','authz','resource','config','artifact','source','build'],
  runtime:['runtime','jvm','thread','process','java-process','web-server','linux','platform','image','heap','gc','observe'],
  data:['data','database','db','repository','datasource','driver','pool','connection-pool','transaction','secret'],
  queue:['queue','mq','messaging','consumer','producer','async']
};

let previousHash=location.hash;
let polishQueued=false;

function currentLab(){
  const match=location.hash.match(/^#lab(\d{1,2})$/i);
  return match?A.LABS.find(l=>l.id===Number(match[1])):null;
}

function isActive(canonical,values){
  const aliases=JOURNEY_ALIASES[canonical]||[canonical];
  return values.some(value=>aliases.some(alias=>value===alias||value.includes(alias)));
}

function polishJourney(){
  const lab=currentLab(),journey=document.querySelector('.j-journey');
  if(!lab||!journey)return;
  const values=(lab.journey||[]).map(x=>String(x).toLowerCase());
  [...journey.querySelectorAll('.j-journey-node')].forEach((node,index)=>{
    const canonical=['client','edge','app','runtime','data','queue'][index];
    const active=isActive(canonical,values);
    node.classList.toggle('active',active);
    const state=node.querySelector('span'),label=active?'今回の焦点':'Context';
    if(state&&state.textContent!==label)state.textContent=label;
  });
}

function addWarRoomRetry(){
  if(!/^#lab20$/i.test(location.hash))return;
  const result=[...document.querySelectorAll('.j-card')].find(card=>/REVIEW REQUIRED/.test(card.textContent));
  if(!result||result.querySelector('[data-retry-java-war]'))return;
  const button=document.createElement('button');
  button.type='button';button.className='j-secondary';button.dataset.retryJavaWar='1';
  button.textContent='↻ Evidenceを見直して再挑戦';
  button.addEventListener('click',()=>location.reload());
  result.appendChild(button);
}

function guardDuplicateNavigation(){
  const scripts=[...document.querySelectorAll('script[src*="navigation-scroll.js"]')];
  scripts.forEach((script,index)=>{if(index===0&&!script.dataset.fitNavScroll)script.dataset.fitNavScroll='1'});
}

function polish(){polishQueued=false;polishJourney();addWarRoomRetry();guardDuplicateNavigation()}
function schedule(){if(polishQueued)return;polishQueued=true;requestAnimationFrame(polish)}

new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
window.addEventListener('hashchange',()=>{
  const next=location.hash;
  if(/^#lab20$/i.test(next)&&!/^#lab20$/i.test(previousHash))requestAnimationFrame(addWarRoomRetry);
  previousHash=next;
  schedule();
});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
})();
