(function(){
'use strict';
const S=window.CLOUD_SPEC;if(!S||!Array.isArray(S.maps))return;
function currentLab(){const m=location.hash.match(/^#lab(\d{1,2})$/i);return m?Number(m[1]):0}
function apply(){
 const id=currentLab();if(!id)return;
 const hero=document.querySelector('.labHero');if(!hero||hero.querySelector('.cloudBuildMap'))return;
 const map=S.maps[id-1];if(!map)return;
 const box=document.createElement('section');box.className='cloudBuildMap';
 box.innerHTML='<div class="cloudBuildHead"><div><span>🏗 いま作っている銀行システム</span><small>Lab '+String(id).padStart(2,'0')+'：図の「NEW / ←」付近だけ見ればOK</small></div><button type="button" class="cloudBuildToggle" aria-expanded="true">図を隠す</button></div><pre></pre>';
 box.querySelector('pre').textContent=map;
 const goal=hero.querySelector('.goal');if(goal)goal.insertAdjacentElement('afterend',box);else hero.appendChild(box);
 const btn=box.querySelector('.cloudBuildToggle'),pre=box.querySelector('pre');
 btn.onclick=()=>{const hide=!pre.hidden;pre.hidden=hide;btn.textContent=hide?'図を表示':'図を隠す';btn.setAttribute('aria-expanded',String(!hide))};
}
apply();
window.addEventListener('hashchange',()=>setTimeout(apply,0));
new MutationObserver(()=>apply()).observe(document.getElementById('app')||document.body,{subtree:true,childList:true});
})();