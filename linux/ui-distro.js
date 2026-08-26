(function(){
'use strict';
var KEY='linux_kiban_distro';
var PROFILES={
  rhel:{id:'rhel',label:'RHEL / Rocky / AlmaLinux',short:'RHEL系',family:'RPM Enterprise Linux',purpose:'金融・Enterpriseの基準Profile',pkg:'dnf / rpm',pkgCmd:'dnf',fw:'firewalld',security:'SELinux',kernel:'RHEL compatible',init:'systemd',chip:'🔵',commandProfile:'rpm',recommended:true,note:'教材の標準Profile。Rocky / AlmaLinuxはRHEL系操作の学習には使えるが、RHEL Subscription・Vendor Support・製品Certificationまで同一ではありません。'},
  ubuntu:{id:'ubuntu',label:'Ubuntu LTS / Debian',short:'Ubuntu系',family:'Debian family',purpose:'Cloud / Digital / OpenStack / Kubernetes',pkg:'apt / dpkg',pkgCmd:'apt',fw:'ufw / nftables',security:'AppArmor',kernel:'Ubuntu generic kernel',init:'systemd',chip:'🟠',commandProfile:'canonical',recommended:false,note:'Cloud Nativeや新規Digital基盤でも重要なProfile。Linux共通Conceptは同じで、Package・Firewall・Security管理の実装が変わります。'},
  sles:{id:'sles',label:'SUSE Linux Enterprise Server',short:'SLES',family:'SUSE family',purpose:'SAP / IBM Z / Mixed Enterprise',pkg:'zypper / rpm',pkgCmd:'zypper',fw:'firewalld / nftables',security:'AppArmor',kernel:'SUSE kernel',init:'systemd',chip:'🟢',commandProfile:'sles',recommended:false,note:'SAPやIBM Z/LinuxONE等の文脈で遭遇するProfile。Repository ModuleやFirewall構成は環境ごとに確認します。'},
  oracle:{id:'oracle',label:'Oracle Linux',short:'Oracle Linux',family:'RHEL compatible family',purpose:'Oracle Database / Exadata / OCI',pkg:'dnf / rpm',pkgCmd:'dnf',fw:'firewalld',security:'SELinux',kernel:'UEK / RHCK',init:'systemd',chip:'🔴',commandProfile:'rpm',recommended:false,note:'Oracle Workloadの文脈で重要なProfile。RHEL系に近い操作でも、Kernel・Support・Certificationの境界を確認します。'}
};
var ALIASES={debian:'ubuntu'};
var selected='';
try{selected=localStorage.getItem(KEY)||'';if(ALIASES[selected]){selected=ALIASES[selected];localStorage.setItem(KEY,selected)}}catch(e){}
var profile=PROFILES[selected]||null;

function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function clean(s){return String(s||'').replace(/^\s*\$\s*/,'').trim()}
function selectProfile(id){if(!PROFILES[id])return;try{localStorage.setItem(KEY,id)}catch(e){}location.reload()}

function rpmForward(input){
  var s=String(input||'');
  var rules=[
    [/sudo apt install -y ([a-z0-9_.+:-]+)/gi,'sudo dnf install -y $1'],
    [/sudo apt install ([a-z0-9_.+:-]+)/gi,'sudo dnf install $1'],
    [/\bapt install -y ([a-z0-9_.+:-]+)/gi,'dnf install -y $1'],
    [/\bapt install ([a-z0-9_.+:-]+)/gi,'dnf install $1'],
    [/sudo apt full-upgrade\b/gi,'sudo dnf upgrade'],[/sudo apt upgrade\b/gi,'sudo dnf upgrade'],
    [/\bapt full-upgrade\b/gi,'dnf upgrade'],[/\bapt upgrade\b/gi,'dnf upgrade'],
    [/sudo apt update\b/gi,'sudo dnf makecache'],[/\bapt update\b/gi,'dnf makecache'],
    [/\bapt list --upgradable\b/gi,'dnf check-update'],
    [/sudo apt purge ([a-z0-9_.+:-]+)/gi,'sudo dnf remove $1'],[/\bapt purge ([a-z0-9_.+:-]+)/gi,'dnf remove $1'],
    [/sudo apt remove ([a-z0-9_.+:-]+)/gi,'sudo dnf remove $1'],[/\bapt remove ([a-z0-9_.+:-]+)/gi,'dnf remove $1'],
    [/sudo apt autoremove\b/gi,'sudo dnf autoremove'],[/\bapt autoremove\b/gi,'dnf autoremove'],
    [/\bapt clean\b/gi,'dnf clean all'],
    [/\bapt-cache policy ([a-z0-9_.+:-]+)/gi,'dnf info $1'],[/\bapt list -a ([a-z0-9_.+:-]+)/gi,'dnf --showduplicates list $1'],
    [/\bapt-mark hold ([a-z0-9_.+:-]+)/gi,'dnf versionlock add $1'],[/\bapt-mark unhold ([a-z0-9_.+:-]+)/gi,'dnf versionlock delete $1'],
    [/\bapt-cache depends ([a-z0-9_.+:-]+)/gi,'dnf repoquery --requires $1'],
    [/\bapt --fix-broken install\b/gi,'dnf check  # APTの完全同等ではなく整合性確認'],
    [/\bdpkg -l\b/gi,'rpm -qa'],[/\bdpkg -L ([a-z0-9_.+:-]+)/gi,'rpm -ql $1'],[/\bdpkg -S ([^\s]+)/gi,'rpm -qf $1'],
    [/sudo dpkg --unpack broken-package\.deb/gi,'sudo rpm -ivh --nodeps broken-package.rpm  # simulation'],
    [/sudo apt-key del DEADBEEF/gi,'sudo rpm -e gpg-pubkey-deadbeef  # simulation'],
    [/sudo flock \/var\/lib\/dpkg\/lock-frontend sleep 60/gi,'sudo flock /var/run/dnf.pid sleep 60  # simulation'],
    [/sudo pkill -f "flock \/var\/lib\/dpkg\/lock-frontend"/gi,'sudo pkill -f "flock /var/run/dnf.pid"  # simulation'],
    [/sudo ufw allow (80|443)\/tcp/gi,'sudo firewall-cmd --permanent --add-port=$1/tcp && sudo firewall-cmd --reload'],
    [/\bufw allow (80|443)\/tcp/gi,'firewall-cmd --permanent --add-port=$1/tcp && firewall-cmd --reload'],
    [/sudo ufw deny (80|443)\/tcp/gi,'sudo firewall-cmd --permanent --remove-port=$1/tcp && sudo firewall-cmd --reload'],
    [/\bufw deny (80|443)\/tcp/gi,'firewall-cmd --permanent --remove-port=$1/tcp && firewall-cmd --reload'],
    [/sudo ufw status verbose\b/gi,'sudo firewall-cmd --list-all'],[/sudo ufw status\b/gi,'sudo firewall-cmd --list-all'],
    [/\bufw status verbose\b/gi,'firewall-cmd --list-all'],[/\bufw status\b/gi,'firewall-cmd --list-all'],
    [/sudo ufw disable\b/gi,'sudo systemctl stop firewalld'],[/\bufw disable\b/gi,'systemctl stop firewalld'],
    [/sudo ufw enable\b/gi,'sudo systemctl start firewalld'],[/\bufw enable\b/gi,'systemctl start firewalld']
  ];
  rules.forEach(function(r){s=s.replace(r[0],r[1])});return s;
}

function slesForward(input){
  var s=String(input||'');
  var rules=[
    [/sudo apt install -y ([a-z0-9_.+:-]+)/gi,'sudo zypper --non-interactive install $1'],
    [/sudo apt install ([a-z0-9_.+:-]+)/gi,'sudo zypper install $1'],
    [/\bapt install -y ([a-z0-9_.+:-]+)/gi,'zypper --non-interactive install $1'],
    [/\bapt install ([a-z0-9_.+:-]+)/gi,'zypper install $1'],
    [/sudo apt update\b/gi,'sudo zypper refresh'],[/\bapt update\b/gi,'zypper refresh'],
    [/sudo apt full-upgrade\b/gi,'sudo zypper update'],[/sudo apt upgrade\b/gi,'sudo zypper update'],
    [/\bapt full-upgrade\b/gi,'zypper update'],[/\bapt upgrade\b/gi,'zypper update'],
    [/\bapt list --upgradable\b/gi,'zypper list-updates'],
    [/sudo apt purge ([a-z0-9_.+:-]+)/gi,'sudo zypper remove $1'],[/\bapt purge ([a-z0-9_.+:-]+)/gi,'zypper remove $1'],
    [/sudo apt remove ([a-z0-9_.+:-]+)/gi,'sudo zypper remove $1'],[/\bapt remove ([a-z0-9_.+:-]+)/gi,'zypper remove $1'],
    [/sudo apt autoremove\b/gi,'sudo zypper packages --unneeded  # review before removal'],[/\bapt autoremove\b/gi,'zypper packages --unneeded  # review before removal'],
    [/\bapt clean\b/gi,'zypper clean --all'],
    [/\bapt-cache policy ([a-z0-9_.+:-]+)/gi,'zypper info $1'],[/\bapt list -a ([a-z0-9_.+:-]+)/gi,'zypper search -s $1'],
    [/\bapt-mark hold ([a-z0-9_.+:-]+)/gi,'zypper addlock $1'],[/\bapt-mark unhold ([a-z0-9_.+:-]+)/gi,'zypper removelock $1'],
    [/\bapt-cache depends ([a-z0-9_.+:-]+)/gi,'zypper info --requires $1'],
    [/\bapt --fix-broken install\b/gi,'zypper verify'],
    [/\bdpkg -l\b/gi,'rpm -qa'],[/\bdpkg -L ([a-z0-9_.+:-]+)/gi,'rpm -ql $1'],[/\bdpkg -S ([^\s]+)/gi,'rpm -qf $1'],
    [/sudo dpkg --unpack broken-package\.deb/gi,'sudo rpm -ivh --nodeps broken-package.rpm  # simulation'],
    [/sudo ufw allow (80|443)\/tcp/gi,'sudo firewall-cmd --permanent --add-port=$1/tcp && sudo firewall-cmd --reload'],
    [/\bufw allow (80|443)\/tcp/gi,'firewall-cmd --permanent --add-port=$1/tcp && firewall-cmd --reload'],
    [/sudo ufw deny (80|443)\/tcp/gi,'sudo firewall-cmd --permanent --remove-port=$1/tcp && sudo firewall-cmd --reload'],
    [/\bufw deny (80|443)\/tcp/gi,'firewall-cmd --permanent --remove-port=$1/tcp && firewall-cmd --reload'],
    [/sudo ufw status verbose\b/gi,'sudo firewall-cmd --list-all'],[/sudo ufw status\b/gi,'sudo firewall-cmd --list-all'],
    [/\bufw status verbose\b/gi,'firewall-cmd --list-all'],[/\bufw status\b/gi,'firewall-cmd --list-all'],
    [/sudo ufw disable\b/gi,'sudo systemctl stop firewalld'],[/\bufw disable\b/gi,'systemctl stop firewalld'],
    [/sudo ufw enable\b/gi,'sudo systemctl start firewalld'],[/\bufw enable\b/gi,'systemctl start firewalld']
  ];rules.forEach(function(r){s=s.replace(r[0],r[1])});return s;
}

function missionText(){var n=document.querySelector('.mobile-learning-task strong');return n?(n.textContent||''):''}
function firewallReverse(s){
  var m;
  if(/^sudo\s+firewall-cmd\s+--list-all$/i.test(s))return'sudo ufw status verbose';
  if(/^firewall-cmd\s+--list-all$/i.test(s))return'ufw status verbose';
  if(/^sudo\s+systemctl\s+stop\s+firewalld$/i.test(s))return'sudo ufw disable';
  if(/^systemctl\s+stop\s+firewalld$/i.test(s))return'ufw disable';
  if(/^sudo\s+systemctl\s+start\s+firewalld$/i.test(s))return'sudo ufw enable';
  if(/^systemctl\s+start\s+firewalld$/i.test(s))return'ufw enable';
  if((m=s.match(/^sudo\s+firewall-cmd\s+--permanent\s+--add-port=(80|443)\/tcp\s*&&\s*sudo\s+firewall-cmd\s+--reload$/i)))return'sudo ufw allow '+m[1]+'/tcp';
  if((m=s.match(/^firewall-cmd\s+--permanent\s+--add-port=(80|443)\/tcp\s*&&\s*firewall-cmd\s+--reload$/i)))return'ufw allow '+m[1]+'/tcp';
  if((m=s.match(/^sudo\s+firewall-cmd\s+--permanent\s+--remove-port=(80|443)\/tcp\s*&&\s*sudo\s+firewall-cmd\s+--reload$/i)))return'sudo ufw deny '+m[1]+'/tcp';
  if((m=s.match(/^firewall-cmd\s+--permanent\s+--remove-port=(80|443)\/tcp\s*&&\s*firewall-cmd\s+--reload$/i)))return'ufw deny '+m[1]+'/tcp';
  return'';
}
function rpmReverse(input){
  var s=clean(input).replace(/\s+#.*$/,'').trim(),m,fw=firewallReverse(s);if(fw)return fw;
  if((m=s.match(/^sudo\s+dnf\s+install\s+(-y\s+)?([a-z0-9_.+:-]+)$/i)))return'sudo apt install '+(m[1]?'-y ':'')+m[2];
  if((m=s.match(/^dnf\s+install\s+(-y\s+)?([a-z0-9_.+:-]+)$/i)))return'apt install '+(m[1]?'-y ':'')+m[2];
  if(/^sudo\s+dnf\s+makecache$/i.test(s))return'sudo apt update';if(/^dnf\s+makecache$/i.test(s))return'apt update';
  if(/^dnf\s+check-update$/i.test(s))return'apt list --upgradable';
  if(/^sudo\s+dnf\s+upgrade(?:\s+-y)?$/i.test(s))return'sudo apt upgrade';if(/^dnf\s+upgrade(?:\s+-y)?$/i.test(s))return'apt upgrade';
  if((m=s.match(/^(sudo\s+)?dnf\s+remove\s+([a-z0-9_.+:-]+)$/i))){var purge=/purge|設定.*削除|設定込み/i.test(missionText());return(m[1]?'sudo ':'')+'apt '+(purge?'purge ':'remove ')+m[2]}
  if(/^sudo\s+dnf\s+autoremove$/i.test(s))return'sudo apt autoremove';if(/^dnf\s+autoremove$/i.test(s))return'apt autoremove';
  if(/^sudo\s+rpm\s+-ivh\s+--nodeps\s+broken-package\.rpm$/i.test(s))return'sudo dpkg --unpack broken-package.deb';
  if(/^sudo\s+rpm\s+-e\s+gpg-pubkey-deadbeef$/i.test(s))return'sudo apt-key del DEADBEEF';
  if(/^sudo\s+flock\s+\/var\/run\/dnf\.pid\s+sleep\s+60$/i.test(s))return'sudo flock /var/lib/dpkg/lock-frontend sleep 60';
  if(/^sudo\s+pkill\s+-f\s+"flock \/var\/run\/dnf\.pid"$/i.test(s))return'sudo pkill -f "flock /var/lib/dpkg/lock-frontend"';
  if(/^sudo\s+dnf\s+check$/i.test(s))return'sudo apt --fix-broken install';return input;
}
function slesReverse(input){
  var s=clean(input).replace(/\s+#.*$/,'').trim(),m,fw=firewallReverse(s);if(fw)return fw;
  if((m=s.match(/^sudo\s+zypper\s+--non-interactive\s+install\s+([a-z0-9_.+:-]+)$/i)))return'sudo apt install -y '+m[1];
  if((m=s.match(/^zypper\s+--non-interactive\s+install\s+([a-z0-9_.+:-]+)$/i)))return'apt install -y '+m[1];
  if((m=s.match(/^(sudo\s+)?zypper\s+install\s+([a-z0-9_.+:-]+)$/i)))return(m[1]?'sudo ':'')+'apt install '+m[2];
  if(/^sudo\s+zypper\s+refresh$/i.test(s))return'sudo apt update';if(/^zypper\s+refresh$/i.test(s))return'apt update';
  if(/^sudo\s+zypper\s+update$/i.test(s))return'sudo apt upgrade';if(/^zypper\s+update$/i.test(s))return'apt upgrade';
  if(/^zypper\s+list-updates$/i.test(s))return'apt list --upgradable';
  if((m=s.match(/^(sudo\s+)?zypper\s+remove\s+([a-z0-9_.+:-]+)$/i))){var purge=/purge|設定.*削除|設定込み/i.test(missionText());return(m[1]?'sudo ':'')+'apt '+(purge?'purge ':'remove ')+m[2]}
  if(/^zypper\s+verify$/i.test(s)||/^sudo\s+zypper\s+verify$/i.test(s))return'sudo apt --fix-broken install';
  if((m=s.match(/^(sudo\s+)?zypper\s+addlock\s+([a-z0-9_.+:-]+)$/i)))return(m[1]?'sudo ':'')+'apt-mark hold '+m[2];
  if((m=s.match(/^(sudo\s+)?zypper\s+removelock\s+([a-z0-9_.+:-]+)$/i)))return(m[1]?'sudo ':'')+'apt-mark unhold '+m[2];return input;
}
function adapt(s){if(!profile)return String(s||'');if(profile.commandProfile==='rpm')return rpmForward(s);if(profile.commandProfile==='sles')return slesForward(s);return String(s||'')}
function canonicalize(s){if(!profile)return s;if(profile.commandProfile==='rpm')return rpmReverse(s);if(profile.commandProfile==='sles')return slesReverse(s);return s}

function profileCard(p){return '<button class="linux-distro-card '+p.id+(p.recommended?' recommended':'')+'" data-distro="'+p.id+'"><div class="linux-distro-card-head"><strong>'+p.chip+' '+esc(p.label)+'</strong>'+(p.recommended?'<span>教材標準</span>':'')+'</div><span class="family">'+esc(p.purpose)+'</span><div class="linux-distro-stack"><span>Package <code>'+esc(p.pkg)+'</code></span><span>Firewall <code>'+esc(p.fw)+'</code></span><span>Security <code>'+esc(p.security)+'</code></span><span>Service <code>'+esc(p.init)+'</code></span></div><small>'+esc(p.note)+'</small></button>'}
function openModal(force){
  var old=document.querySelector('.linux-distro-modal');if(old)old.remove();var modal=document.createElement('div');modal.className='linux-distro-modal';
  modal.innerHTML='<div class="linux-distro-dialog" role="dialog" aria-modal="true" aria-label="金融IT Linux Profileの選択"><div class="linux-distro-kicker">COMMON LINUX → DISTRIBUTION PROFILE</div><h2>🐧 学習するLinux Profileを選択</h2><p>Kernel・Process・File・TCP/IP等の共通Conceptを学びながら、Package・Firewall・Security管理の違いをProfileで翻訳します。迷ったら教材標準のRHEL系を選びます。</p><div class="linux-distro-cards">'+['rhel','ubuntu','sles','oracle'].map(function(id){return profileCard(PROFILES[id])}).join('')+'</div><div class="linux-distro-help"><b>なぜRHEL系を教材標準にする？</b><br>市場シェアを断定するためではなく、Enterprise Support・長期運用・Vendor Certificationを意識する基準点として採用します。Ubuntu / SLES / Oracle Linuxも重要な比較Profileです。<br><br><b>境界</b>：Parrot OSはSecurity学習向けで、金融業務Serverの標準Profileとして扱いません。実機の種類は <code>cat /etc/os-release</code> で確認します。<br>※ このサイトはBrowser内Simulatorです。代表Commandへ表示・入力判定を翻訳します。</div>'+(force?'':'<button class="linux-distro-close" type="button">閉じる</button>')+'</div>';
  document.body.appendChild(modal);modal.querySelectorAll('[data-distro]').forEach(function(b){b.addEventListener('click',function(){selectProfile(b.dataset.distro)})});var close=modal.querySelector('.linux-distro-close');if(close)close.onclick=function(){modal.remove()};
}
window.LinuxLabDistro={get:function(){return profile},profiles:PROFILES,adaptCommand:adapt,canonicalizeInput:canonicalize,openSelector:openModal,select:selectProfile,key:KEY};

function addBar(){
  if(!profile||document.querySelector('.linux-distro-bar'))return;var bar=document.createElement('div');bar.className='linux-distro-bar';
  bar.innerHTML='<div class="linux-distro-current"><strong>'+profile.chip+' '+esc(profile.short)+(profile.recommended?' <em>教材標準</em>':'')+'</strong><span>'+esc(profile.purpose)+' ｜ Package: <code>'+esc(profile.pkg)+'</code> / Firewall: <code>'+esc(profile.fw)+'</code> / Security: <code>'+esc(profile.security)+'</code></span></div><button type="button" class="linux-distro-change">Profile変更</button>';
  var main=document.querySelector('main');if(main)main.insertAdjacentElement('beforebegin',bar);else document.body.insertBefore(bar,document.body.firstChild);bar.querySelector('button').onclick=function(){openModal(false)};
}
function isCommandElement(el){return el&&el.matches&&el.matches('code,pre,.terminal,.mini-console,.diag-console,.incident-shell-history,.mobile-live-terminal-body,.mobile-command-choices button,.incident-command-choice,button[data-cmd],button[data-action],button[data-diag]')}
function transformElement(el){
  if(!profile||profile.commandProfile==='canonical'||!el)return;if(el.nodeType===3){var p=el.parentElement;if(!p||!isCommandElement(p))return;var n=adapt(el.nodeValue);if(n!==el.nodeValue)el.nodeValue=n;return}if(el.nodeType!==1||!isCommandElement(el))return;var w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),n;while((n=w.nextNode())){var t=adapt(n.nodeValue);if(t!==n.nodeValue)n.nodeValue=t}
}
function transformCommands(root){if(!profile||profile.commandProfile==='canonical')return;if(root&&root.nodeType===1&&isCommandElement(root))transformElement(root);(root||document).querySelectorAll&& (root||document).querySelectorAll('code,pre,.terminal,.mini-console,.diag-console,.incident-shell-history,.mobile-live-terminal-body,.mobile-command-choices button,.incident-command-choice,button[data-cmd],button[data-action],button[data-diag]').forEach(transformElement)}
function scopeFor(cmd){
  var s=clean(cmd).replace(/^sudo\s+/,'').toLowerCase(),first=(s.match(/^([a-z0-9_.+\/-]+)/)||[])[1]||'';
  if(first==='zypper')return['sles','🟢 SLES / SUSE系'];
  if(first==='dnf'||first==='yum')return[profile&&profile.id==='oracle'?'oracle':'rhel',profile&&profile.id==='oracle'?'🔴 Oracle Linux / RPM系':'🔵 RHEL / Rocky / Alma系'];
  if(first==='rpm')return['rpm','🔷 RPM系で広く利用'];
  if(/^(apt|apt-get|apt-key|dpkg|ufw)$/.test(first))return['ubuntu','🟠 Ubuntu / Debian系'];
  if(/^(getenforce|semanage|restorecon|ausearch)$/.test(first))return['selinux','🛡 SELinux'];
  if(/^(aa-status|apparmor_status)$/.test(first))return['apparmor','🛡 AppArmor'];
  if(first==='firewall-cmd')return['firewalld','🔥 firewalld'];
  if(/^(systemctl|journalctl|systemd-analyze|loginctl|timedatectl)$/.test(first))return['systemd','⚙ systemd'];
  if(first==='nginx')return['nginx','🟣 nginx固有'];
  if(/^(docker|podman|ansible|ansible-playbook|ansible-inventory|promtool|openssl|cloud-init|virsh|aws|grub-reboot|nft)$/.test(first))return['special','🟣 Tool / 環境依存'];return['common','🟢 Linux共通Concept'];
}
function chip(cmd){var x=scopeFor(cmd);return'<span class="linux-scope-chip '+x[0]+'">'+x[1]+'</span>'}
function latest(text){var a=String(text||'').split(/\r?\n/);for(var i=a.length-1;i>=0;i--){var m=a[i].trim().match(/^\$\s+(.+)$/);if(m)return m[1]}return''}
function retag(){
  document.querySelectorAll('.mobile-command-choices button').forEach(function(b){var c=b.querySelector('code');if(!c)return;var wrap=b.querySelector('.command-scope-badges');if(!wrap){wrap=document.createElement('span');wrap.className='command-scope-badges';b.appendChild(wrap)}wrap.innerHTML=chip(c.textContent)});
  document.querySelectorAll('.incident-command-choice').forEach(function(b){var c=b.querySelector('code');if(!c)return;var spans=[].slice.call(b.children).filter(function(x){return x.tagName==='SPAN'});if(spans[0])spans[0].innerHTML=chip(c.textContent)});
  document.querySelectorAll('.incident-command-feedback').forEach(function(f){var c=f.querySelector('code'),s=f.querySelector('.linux-scope-chip');if(c&&s){var x=scopeFor(c.textContent);s.className='linux-scope-chip '+x[0];s.textContent=x[1]}});
  var live=document.querySelector('.mobile-live-terminal'),bar=live&&live.querySelector('.mobile-live-command-scope'),body=live&&live.querySelector('.mobile-live-terminal-body');if(bar&&body){var cmd=adapt(latest(body.textContent));if(cmd)bar.innerHTML='<div class="mobile-live-command-scope-top"><span class="mobile-live-command-scope-label">このCommandは</span>'+chip(cmd)+'</div><code>$ '+esc(cmd)+'</code>'}
  var legend=document.querySelector('.linux-scope-legend');if(legend&&profile&&!legend.querySelector('.linux-scope-chip.profile-current')){var x=document.createElement('span');x.className='linux-scope-chip profile-current '+profile.id;x.textContent=profile.chip+' '+profile.short+' Profile';var strong=legend.querySelector('strong');if(strong)strong.insertAdjacentElement('afterend',x)}
}
function contextMessage(){
  var command=profile.commandProfile==='rpm'?'dnf / rpm / firewalld':profile.commandProfile==='sles'?'zypper / rpm / firewalld':'apt / dpkg / ufw';
  return '<strong>'+profile.chip+' '+esc(profile.label)+' Profileで演習中</strong> — 代表Commandは <code>'+esc(command)+'</code> へ翻訳します。Security基盤は <code>'+esc(profile.security)+'</code>。<div class="linux-distro-warning">⚠ 教材のCommandはSimulationです。Repository・Version・Support・権限・変更承認を確認せず本番へコピーしないでください。</div>';
}
function pageContext(){
  if(!profile)return;document.body.classList.add('distro-'+profile.id);var m=location.pathname.match(/lab(\d{2})/i),lab=m?Number(m[1]):0;
  if((lab===1||lab===2||lab===3||lab===9)&&!document.querySelector('.linux-distro-context')){var h=document.querySelector('h1');if(h){var n=document.createElement('div');n.className='linux-distro-context';n.innerHTML=contextMessage();h.insertAdjacentElement('afterend',n)}}
  if(lab===9&&profile.commandProfile!=='canonical'){
    var title=profile.commandProfile==='sles'?'Zypper / RPM / Repository':'DNF / RPM / Repository';document.title=document.title.replace(/APT \/ Package \/ Repository/i,title);
    document.querySelectorAll('h1,.lab-title,.series-nav strong,.series-nav span.current').forEach(function(el){el.textContent=el.textContent.replace(/APT\s*\/\s*Package\s*\/\s*Repository/gi,title).replace(/APT\s*\/\s*Package/gi,title.split(' / Repository')[0])});
    document.querySelectorAll('h2').forEach(function(h){if(/\bAPT\b|\bdpkg\b|APT Lock|UFW/i.test(h.textContent)&&!h.querySelector('.linux-distro-reference')){var s=document.createElement('span');s.className='linux-distro-reference';s.textContent='Ubuntu/Debian正本の比較';h.appendChild(s)}})
  }
  if(lab===2&&profile.commandProfile!=='canonical')document.querySelectorAll('h2').forEach(function(h){if(/UFW/i.test(h.textContent)&&!h.querySelector('.linux-distro-reference')){var s=document.createElement('span');s.className='linux-distro-reference';s.textContent='Ubuntu/Debian正本の比較';h.appendChild(s)}})
}
function rewriteInputBeforeSubmit(target){if(!profile||profile.commandProfile==='canonical')return;var input=null;if(target&&target.matches&&target.matches('.mobile-engineer-prompt input,.incident-shell-prompt input'))input=target;else if(target&&target.closest){var p=target.closest('.mobile-engineer-prompt,.incident-shell-prompt');input=p&&p.querySelector('input')}if(!input||!input.value.trim())return;var canon=canonicalize(input.value);if(canon!==input.value){input.dataset.distroOriginal=input.value;input.value=canon}}
document.addEventListener('click',function(e){if(e.target.closest('.mobile-engineer-prompt button,.incident-shell-prompt button'))rewriteInputBeforeSubmit(e.target)},true);document.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.matches('.mobile-engineer-prompt input,.incident-shell-prompt input'))rewriteInputBeforeSubmit(e.target)},true);
function apply(root){pageContext();transformCommands(root||document);retag()}
if(!profile){openModal(true)}else{addBar();apply(document)}
var queued=false;new MutationObserver(function(ms){if(!profile)return;ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1||n.nodeType===3)transformCommands(n.nodeType===1?n:n.parentElement)});if(m.type==='characterData')transformElement(m.target)});if(!queued){queued=true;requestAnimationFrame(function(){queued=false;retag()})}}).observe(document.body,{subtree:true,childList:true,characterData:true});
})();
