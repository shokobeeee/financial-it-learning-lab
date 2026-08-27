(function(){
'use strict';
var ORDER=['rhel','ubuntu','sles','oracle'];
function ensureCss(){if(document.querySelector('link[data-financial-linux-profiles]'))return;var l=document.createElement('link');l.rel='stylesheet';l.href='./ui-financial-profiles.css?v=1';l.dataset.financialLinuxProfiles='1';document.head.appendChild(l)}
function api(){return window.LinuxLabDistro||null}
function profiles(){return api()&&api().profiles||{}}
function current(){var a=api(),p=a&&a.get&&a.get();return p||profiles().rhel||null}
function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function installCommand(p){if(!p)return'sudo dnf install -y nginx';if(p.commandProfile==='sles')return'sudo zypper --non-interactive install nginx';if(p.commandProfile==='canonical')return'sudo apt install -y nginx';return'sudo dnf install -y nginx'}
function packageQuery(p){if(!p)return'dnf info nginx';if(p.commandProfile==='sles')return'zypper info nginx';if(p.commandProfile==='canonical')return'apt-cache policy nginx';return'dnf info nginx'}
function firewallCheck(p){if(!p)return'firewall-cmd --list-all';if(p.commandProfile==='canonical')return'ufw status verbose';return'firewall-cmd --list-all'}
function securityCheck(p){if(!p)return'getenforce';return p.security==='AppArmor'?'aa-status':'getenforce'}
function profileCards(active){
  var ps=profiles();return ORDER.map(function(id){var p=ps[id];if(!p)return'';return '<button type="button" class="flp-profile-card '+id+(p.id===active.id?' current':'')+(p.recommended?' recommended':'')+'" data-flp-profile="'+p.id+'"><div class="flp-profile-top"><strong>'+p.chip+' '+esc(p.label)+'</strong>'+(p.recommended?'<span>教材標準</span>':'')+'</div><b>'+esc(p.purpose)+'</b><div><span>Package</span><code>'+esc(p.pkg)+'</code></div><div><span>Firewall</span><code>'+esc(p.fw)+'</code></div><div><span>Security</span><code>'+esc(p.security)+'</code></div><small>'+esc(p.note)+'</small></button>'}).join('')
}
function stages(p){
  var name=p?p.label:'RHEL / Rocky / AlmaLinux',short=p?p.short:'RHEL系',install=installCommand(p);
  return [
    {map:'COMMON LINUX\n├ Kernel\n├ Process\n├ File / Permission\n├ TCP/IP stack\n└ systemd / Log\n\nPROFILE: '+short+'\n├ Package: '+(p?p.pkg:'dnf / rpm')+'\n├ Firewall: '+(p?p.fw:'firewalld')+'\n└ Security: '+(p?p.security:'SELinux'),console:'STEP 1 / Linux共通とProfile差分を分ける\n\n✅ Kernel・Process・File・TCP/IPは共通Concept\n✅ '+name+'を現在のProfileとして選択\n⚠ Package / Firewall / Security / Support境界はDistributionごとに確認'},
    {map:'📱 Client        🐧 '+short+'\n                  ├ IP Address\nNetwork / LAN  →  ├ Default Route\n                  └ DNS Resolver\n\n外向き通信: 条件が成立すれば可能\nTCP 80: LISTENなし',console:'STEP 2 / Networkを確認\n\n$ ip addr\n$ ip route\n$ getent hosts example.com\n\nLinuxを入れたことと、NIC・DHCP・Route・DNSが正しいことは別。\nここまでnginxは不要です。'},
    {map:'📱 Browser\n   │ HTTP :80\n   ▼\n🐧 '+short+'\n   └ ❌ HTTPを受けるProcessなし\n\nNetwork pathがあっても\nWeb Server roleはまだ無い',console:'STEP 3 / Browserから試す\n\n$ curl http://server\n→ connection refused / timeout\n\n「Networkにつながる」\n≠「Web Serverとして応答できる」'},
    {map:'📱 Browser\n   │ HTTP :80\n   ▼\n🚪 TCP 80 LISTEN\n   ▼\n⚙ nginx process\n   ▼\n📄 Response + access/error log',console:'STEP 4 / Web Server roleを追加\n\n$ '+install+'\n$ systemctl status nginx\n$ ss -lntp\n$ curl http://localhost\n\nnginxはLinux必須ではなく、Web Server役割を実現するApplicationの1つ。'}
  ]
}
function homeHtml(p){
  var ss=stages(p);
  return '<div class="flp-home" data-flp-current="'+esc(p.id)+'"><div class="cr-head"><div><div class="cr-kicker">LEARNING STEP -1 / FINANCIAL LINUX PROFILE</div><h2>金融ITのLinuxは、1種類ではない</h2><p class="cr-summary">最初にLinux共通Conceptを押さえ、その後でDistribution固有の操作へ翻訳します。本教材ではEnterprise運用の基準点としてRHEL系を標準Profileにし、Ubuntu LTS・SLES・Oracle Linuxを比較します。</p></div><div class="cr-badges"><span class="cr-badge"><strong>現在</strong> '+p.chip+' '+esc(p.short)+'</span><span class="cr-badge"><strong>本質</strong> Common Linux ≠ Distribution差分</span></div></div><div class="cr-boundary">「金融でRHELが何％」と市場シェアを断定する設計ではありません。Support・Lifecycle・Vendor Certificationを意識するEnterprise Linuxの学習基準としてRHEL系を置き、案件ごとに実際のOS・Version・契約・製品認証を確認します。</div><div class="flp-common-diff"><div><small>COMMON LINUX</small><h3>Distributionが変わっても追うもの</h3><p>Kernel / Process / File / Permission / TCP-IP / Port / systemd / Log / Evidence</p></div><div><small>PROFILE DIFFERENCE</small><h3>環境ごとに翻訳するもの</h3><p>Package Manager / Firewall / MAC Security / Kernel flavor / Support / Lifecycle / Certification</p></div></div><div class="flp-profile-grid">'+profileCards(p)+'</div><section class="flp-selected"><div><small>SELECTED PROFILE</small><h3>'+p.chip+' '+esc(p.label)+'</h3><p>'+esc(p.purpose)+'。代表操作を <code>'+esc(p.pkg)+'</code> / <code>'+esc(p.fw)+'</code> / <code>'+esc(p.security)+'</code> に合わせます。</p></div><button type="button" data-flp-open-selector>Profileを選び直す</button></section><div class="flp-stage-buttons">'+ss.map(function(s,i){return'<button type="button" data-flp-stage="'+i+'" class="'+(i===0?'active':'')+'">'+(i+1)+'. '+['共通と差分','Network確認','HTTPで試す','nginxを追加'][i]+'</button>'}).join('')+'</div><div class="flp-stage"><div class="flp-map" id="flpMap" aria-live="polite">'+esc(ss[0].map)+'</div><div class="flp-console" id="flpConsole" aria-live="polite">'+esc(ss[0].console)+'</div></div><div class="cr-keyline"><div><b>'+esc(p.short)+'</b><span>選択中のDistribution Profile</span></div><div><b>Web Server</b><span>System上の役割</span></div><div><b>nginx</b><span>役割を実現するProductの1つ</span></div></div><div class="flp-parrot"><b>🛡 Parrot OSはどこ？</b><span>Security / Forensics学習に向くDistributionで、金融業務Serverの標準Profileとしては扱いません。手元の学習端末と、案件先のProduction Linuxを分けて考えます。</span></div><details class="cr-details"><summary>4 Profileをどう使い分ける？</summary><div class="flp-compare"><div><b>🔵 RHEL系</b><span>Enterprise基準。Rocky/Almaは操作学習に有効だがRHELの契約・Support・Certificationそのものではない。</span></div><div><b>🟠 Ubuntu LTS</b><span>Cloud / Digital / OpenStack / Kubernetes等の文脈で重要。</span></div><div><b>🟢 SLES</b><span>SAP / IBM Z / Mixed Enterprise等の文脈で重要。</span></div><div><b>🔴 Oracle Linux</b><span>Oracle Database / Exadata / OCI等の文脈で重要。UEK/RHCK等のKernel差も確認。</span></div></div></details></div>'
}
function labFocus(lab,p){
  var map={
    1:['Web Serverという共通役割',installCommand(p),'Packageを入れる前に、HTTP listenerが必要な理由を確認'],
    2:['Host Firewallという通信Control',firewallCheck(p),'Host Firewall・Cloud Security Group・Networkそのものを混同しない'],
    3:['IP / Route / DNSというLinux共通Concept','ip addr / ip route / getent','設定Toolは環境差、確認したい事実は共通'],
    4:['Remote Shellという役割',(p.commandProfile==='canonical'?'sudo apt install -y openssh-server':p.commandProfile==='sles'?'sudo zypper --non-interactive install openssh':'sudo dnf install -y openssh-server'),'SSH Client・sshd Server・Networkを分ける'],
    9:['Package管理というレイヤー',packageQuery(p),'apt / dnf / zypperは目的が近くても完全同一ではない'],
    10:['Boot / Kernelという共通Concept',p.kernel,'Oracle LinuxのUEK/RHCK等、Kernel flavorもProfile差分'],
    14:['Container Runtimeという追加部品',p.commandProfile==='canonical'?'apt / Docker / containerd':p.commandProfile==='sles'?'zypper / Podman・Docker等':'dnf / Podman・Docker等','ContainerはLinux必須ではなくApplication実行方式の選択'],
    19:['Hardeningという運用Control',securityCheck(p),'単一Tool導入ではなく、baseline・例外・Evidenceを継続管理']
  };return map[lab]||['Linux共通Concept',p.pkg+' / '+p.fw+' / '+p.security,'共通の目的を確認してからProfile固有Commandへ翻訳']
}
function replaceText(root,p){
  var replacements=[
    ['Ubuntu/Linuxには',p.label+'を含むLinuxには'],
    ['Ubuntu + IP + Default Route + DNS',p.short+' + IP + Default Route + DNS'],
    ['Ubuntu等ではDHCPにより','Linux環境ではDHCPにより'],
    ['「Ubuntuを入れた＝必ずInternet接続済み」','「Linuxを入れた＝必ずInternet接続済み」'],
    ['教材ではDebian系ufw、RHEL系firewalldをProfileで分ける。','選択中のProfileでは '+p.fw+' を代表例として扱い、他Distributionと比較する。'],
    ['Debian系はapt/dpkg、RHEL系はdnf/rpm。操作目的は似ても実装は同一ではない。','選択中は '+p.pkg+'。Ubuntu / RHEL / SLES / Oracle Linuxで操作目的が近くても、Repository・Option・Support境界は同一ではない。']
  ];
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),n;while((n=w.nextNode())){var text=n.nodeValue;replacements.forEach(function(r){text=text.split(r[0]).join(r[1])});n.nodeValue=text}
  // BEFORE/AFTERは部品ごとのchipへ分かれており、1つのtext nodeには部品名しか入らない。
  // 上の文字列一致では届かないため、Distribution名だけのchipを個別に置き換える。
  if(root.querySelectorAll)root.querySelectorAll('.cr-parts li').forEach(function(li){
    if(li.textContent.trim()==='Ubuntu')li.textContent=p.short
  });
}
function renderLab(panel,p,lab){
  if(panel.dataset.flpProfile===p.id)return;panel.dataset.flpProfile=p.id;
  // 用語注釈がtext nodeを分割していると、下のreplaceTextの文字列一致が外れてProfile差分が反映されない。
  // 先に注釈を外してから置換し、再注釈は用語側のobserverへ任せる。
  try{if(window.FIT_FOUNDATION_GLOSSARY&&window.FIT_FOUNDATION_GLOSSARY.unwrap)window.FIT_FOUNDATION_GLOSSARY.unwrap(panel)}catch(e){}
  replaceText(panel,p);
  // unwrap→normalize でtext nodeを差し戻すと observer の addedNodes には現れないため、
  // 置換が済んだこの時点で明示的に再注釈させる。
  try{if(window.FIT_FOUNDATION_GLOSSARY&&window.FIT_FOUNDATION_GLOSSARY.decorate)window.FIT_FOUNDATION_GLOSSARY.decorate(panel)}catch(e){}var old=panel.querySelector('.flp-lab-context');if(old)old.remove();var f=labFocus(lab,p),box=document.createElement('div');box.className='flp-lab-context';box.innerHTML='<div><small>COMMON ROLE</small><b>'+esc(f[0])+'</b></div><div><small>'+esc(p.short)+' IMPLEMENTATION</small><code>'+esc(f[1])+'</code></div><div><small>DO NOT MIX</small><span>'+esc(f[2])+'</span></div>';var head=panel.querySelector('.cr-head');if(head)head.insertAdjacentElement('afterend',box);else panel.insertBefore(box,panel.firstChild)
}
function bindHome(panel,p){
  var ss=stages(p);panel.querySelectorAll('[data-flp-stage]').forEach(function(b){b.onclick=function(){var i=Number(b.dataset.flpStage),s=ss[i];if(!s)return;panel.querySelectorAll('[data-flp-stage]').forEach(function(x){x.classList.toggle('active',x===b)});var map=panel.querySelector('#flpMap'),con=panel.querySelector('#flpConsole');if(map)map.textContent=s.map;if(con)con.textContent=s.console}});
  panel.querySelectorAll('button[data-flp-profile]').forEach(function(b){b.onclick=function(e){e.stopPropagation();api().select(b.dataset.flpProfile)}});var change=panel.querySelector('[data-flp-open-selector]');if(change)change.onclick=function(e){e.stopPropagation();api().openSelector(false)}
}
var busy=false;
function render(){
  if(busy)return;var p=current(),panel=document.getElementById('componentRationalePanel');if(!p||!panel)return;var key=panel.dataset.crKey||'';if(key==='linux:0'){
    if(panel.dataset.flpProfile===p.id&&panel.querySelector('.flp-home'))return;busy=true;panel.innerHTML=homeHtml(p);panel.dataset.flpRendered='1';panel.dataset.flpProfile=p.id;bindHome(panel,p);busy=false;return
  }
  var m=key.match(/^linux:(\d+)$/);if(m)renderLab(panel,p,Number(m[1]));
}
function schedule(){requestAnimationFrame(function(){requestAnimationFrame(render)})}
ensureCss();new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});window.addEventListener('hashchange',schedule);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
window.FIT_FINANCIAL_LINUX_PROFILES={order:ORDER,current:current,stages:stages};
})();
