(function(){
'use strict';
const path=(location.pathname||'').toLowerCase();
const moduleId=['cloud','aws','gcp','azure'].find(x=>path.includes('/'+x+'/'))||null;
if(!moduleId)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LAYERS={
  architecture:{icon:'🧭',name:'全体 / Architecture',short:'全体',desc:'CustomerからCloud、CoreまでをEnd-to-Endで見る層。Region/AZや責任分界など、複数レイヤをまたぐ設計軸もここで扱う。',slot:'architecture'},
  edge:{icon:'🚪',name:'Edge / Entry',short:'入口',desc:'名前解決・入口・振り分け。利用者の要求をCloud内部へ届ける最初の層。',slot:'edge'},
  network:{icon:'🌐',name:'Network',short:'Network',desc:'VPC/VNet/VCN、Subnet、Route、NAT、Firewallなど「どこへ通信できるか」を決める層。',slot:'network'},
  compute:{icon:'🖥️',name:'Compute',short:'Compute',desc:'アプリや処理を実行する場所。VM、Container、Serverlessなど実行方式がある。',slot:'compute'},
  data:{icon:'🗄️',name:'Data',short:'Data',desc:'Database、Object/Block/File Storageなど、業務データを保存・取得する層。',slot:'data'},
  identity:{icon:'🔐',name:'Identity / Security',short:'Identity',desc:'誰が何をできるか、秘密・鍵・証明書をどう守るかを決める横断層。',slot:'identity'},
  integration:{icon:'📨',name:'Integration',short:'Integration',desc:'Queue、Event、API Gatewayなど、システム同士を安全に連携する層。',slot:'integration'},
  operations:{icon:'📊',name:'Operations / Governance',short:'Operations',desc:'Metrics、Logs、Audit、Backup、IaC、Change、Costなど運用・統制を支える横断層。',slot:'operations'},
  hybrid:{icon:'🔗',name:'Hybrid / Core',short:'Hybrid',desc:'Cloudと社内Network、勘定系、Mainframeなどをつなぐ層。',slot:'hybrid'}
};
const MODELS={
  concept:{name:'概念 / 判断軸',desc:'製品サービスではなく、設計や運用を考えるための共通概念。'},
  iaasFoundation:{name:'IaaS基盤',desc:'Network・Subnet・Route等、仮想インフラを自分たちで設計する土台。'},
  iaas:{name:'IaaS寄り',desc:'VM等の基盤を借り、OS・Middleware・Application等を自分たちで多く管理する。'},
  managed:{name:'Managed / PaaS寄り',desc:'基盤運用の一部をCloud側へ任せ、Application・Data・設定等に集中する。'},
  serverless:{name:'Serverless / Fully Managed',desc:'Server管理をさらにCloud側へ寄せ、実行・Event・Request単位で使う。'},
  control:{name:'Control Plane / 横断',desc:'IAM・Policy・Audit等、複数サービスを横断して管理・統制する。'},
  operations:{name:'Managed Operations',desc:'監視・Backup・Security等、運用機能をサービスとして利用する。'},
  hybrid:{name:'Connectivity / Hybrid',desc:'Cloudと外部Networkを接続するための通信・回線サービス。'},
  mixed:{name:'複数モデル',desc:'製品や使い方によってIaaS/PaaS/Managed等の位置づけが変わる。'}
};
const rows=[
 {key:'web-flow',term:'Webサービスの流れ',layer:'architecture',model:'concept',plain:'利用者の要求が、入口→アプリ→データへ届き、結果が返る一連の流れ。',why:'Cloud以前に、何がどこを通るシステムなのかを理解する土台。',bank:'architecture',lab:1,products:{aws:'Customer → AWS → App → Data',gcp:'Customer → Google Cloud → App → Data',azure:'Customer → Azure → App → Data',oci:'Customer → OCI → App → Data'},aliases:['customer journey','end-to-end','web service']},
 {key:'compute-vm',term:'VM / Compute',layer:'compute',model:'iaas',plain:'アプリや処理を動かすための仮想コンピュータ。',why:'「どこでApplicationが動いているか」を見る基本。OSやMiddlewareを自分で管理する範囲も大きい。',bank:'compute',lab:2,products:{aws:'Amazon EC2',gcp:'Compute Engine',azure:'Virtual Machines',oci:'OCI Compute'},aliases:['ec2','compute engine','virtual machines','oci compute','vm','server']},
 {key:'database',term:'Database / Persistent Data',layer:'data',model:'mixed',plain:'残高や取引など、消えてはいけない業務データを保持する場所。',why:'金融では「保存場所」だけでなく、どこが正本か・更新が確定したかが重要。',bank:'data',lab:3,products:{aws:'RDS / Aurora / DB on EC2',gcp:'Cloud SQL / AlloyDB / DB on VM',azure:'Azure SQL / Managed Instance / DB on VM',oci:'OCI Database Services / DB on Compute'},aliases:['database','db','rds','aurora','cloud sql','alloydb','azure sql','autonomous database']},
 {key:'virtual-network',term:'Virtual Network',layer:'network',model:'iaasFoundation',plain:'Cloud内に作る「自分たち用の論理Network」。',why:'AppやDBの通信範囲、Address、Route、公開範囲を自分たちの単位で設計するため。',bank:'network',lab:4,products:{aws:'Amazon VPC',gcp:'VPC',azure:'Virtual Network (VNet)',oci:'Virtual Cloud Network (VCN)'},aliases:['vpc','vnet','vcn','virtual network']},
 {key:'subnet',term:'Subnet / Public・Private',layer:'network',model:'iaasFoundation',plain:'Virtual Networkの中を、用途や到達性ごとに小さく分けた区画。',why:'Internetに見せる入口と、App/DBなど内部だけに置くものを分離するため。',bank:'network',lab:5,products:{aws:'Subnet',gcp:'Subnet',azure:'Subnet',oci:'Subnet'},aliases:['subnet','public subnet','private subnet']},
 {key:'route-nat',term:'Route / NAT / Egress',layer:'network',model:'iaasFoundation',plain:'Routeは「どこへ送るか」、NATは内部から外へ出る通信などのAddress変換を担う。',why:'「外へ出られる」と「外から入れる」を分けて理解するため。',bank:'network',lab:6,products:{aws:'Route Table / IGW / NAT Gateway',gcp:'Routes / Cloud NAT',azure:'Route Table / UDR / NAT Gateway',oci:'Route Table / Internet Gateway / NAT Gateway'},aliases:['route','routing','nat','egress','igw','nat gateway','cloud nat','udr']},
 {key:'load-balancer',term:'Load Balancer / Entry',layer:'edge',model:'managed',plain:'利用者からの要求を、複数の正常なApplicationへ振り分ける入口。',why:'1台へ集中させず、故障したAppへ流さないため。Health Checkの質も重要。',bank:'edge',lab:7,products:{aws:'Elastic Load Balancing (ALB / NLB)',gcp:'Cloud Load Balancing',azure:'Application Gateway / Load Balancer',oci:'OCI Load Balancer'},aliases:['load balancer','alb','nlb','elb','application gateway','cloud load balancing']},
 {key:'firewall',term:'Firewall / Security Rule',layer:'network',model:'iaasFoundation',plain:'誰からどのPortへ通信してよいかを絞る仕組み。',why:'Network上で不要な到達性を減らし、侵害・誤設定時のBlast Radiusを小さくする。',bank:'network',lab:8,products:{aws:'Security Group / NACL',gcp:'VPC Firewall Rules',azure:'NSG / Azure Firewall',oci:'NSG / Security Lists'},aliases:['security group','nacl','firewall','nsg','security list']},
 {key:'az-ha',term:'Availability Zone / HA',layer:'architecture',model:'concept',plain:'同じ場所の障害で全部止まらないよう、独立した障害範囲へ分ける考え方。',why:'Server1台・建屋1か所の故障をサービス全停止にしないため。',bank:'architecture',lab:9,products:{aws:'Availability Zone / Auto Scaling',gcp:'Zone / Managed Instance Group',azure:'Availability Zone / VM Scale Sets',oci:'Availability Domain / Fault Domain'},aliases:['az','availability zone','zone','ha','high availability','availability domain','fault domain']},
 {key:'object-storage',term:'Object Storage',layer:'data',model:'managed',plain:'FileをObjectとして保存するCloud Storage。Backup・Archive・大量データ保管などに向く。',why:'VM Diskとは使い方が違うため、アクセス方法と復旧要件で選ぶ。',bank:'data',lab:10,products:{aws:'Amazon S3',gcp:'Cloud Storage',azure:'Blob Storage',oci:'Object Storage'},aliases:['s3','cloud storage','blob storage','object storage']},
 {key:'block-storage',term:'Block Storage',layer:'data',model:'iaas',plain:'VMからDiskのように使うBlock単位のStorage。',why:'OS DiskやDatabase用Volumeなど、低レベルなDisk用途で使う。',bank:'data',lab:10,products:{aws:'Amazon EBS',gcp:'Persistent Disk',azure:'Managed Disks',oci:'Block Volume'},aliases:['ebs','persistent disk','managed disks','block volume']},
 {key:'file-storage',term:'File Storage',layer:'data',model:'managed',plain:'複数のServerからDirectory/Fileとして共有しやすいStorage。',why:'ObjectやBlockとはアクセス方法が違うため、共有File Systemが必要なときに使う。',bank:'data',lab:10,products:{aws:'Amazon EFS',gcp:'Filestore',azure:'Azure Files',oci:'File Storage'},aliases:['efs','filestore','azure files','file storage']},
 {key:'managed-db',term:'Managed Relational Database',layer:'data',model:'managed',plain:'Database基盤のPatch・HA・Backup等の一部をCloud側へ任せるDBサービス。',why:'管理を減らせるが、Schema・SQL・権限・Data整合性までCloud任せにはならない。',bank:'data',lab:11,products:{aws:'Amazon RDS / Aurora',gcp:'Cloud SQL / AlloyDB',azure:'Azure SQL / Managed Instance',oci:'Autonomous Database / Base DB / Exadata Database Service'},aliases:['rds','aurora','cloud sql','alloydb','azure sql','managed instance','autonomous database','exadata']},
 {key:'iam',term:'IAM / Identity / Role / Policy',layer:'identity',model:'control',plain:'「誰が、何に、何をしてよいか」を決める仕組み。HumanとApplicationのIdentityも分ける。',why:'全員Administratorのような過剰権限を避け、侵害・誤操作時の被害を抑える。',bank:'identity',lab:12,products:{aws:'AWS IAM / IAM Role',gcp:'Cloud IAM / Service Account',azure:'Microsoft Entra ID / Azure RBAC / Managed Identity',oci:'OCI IAM / Dynamic Groups'},aliases:['iam','role','policy','service account','entra','rbac','managed identity','dynamic group']},
 {key:'secret-key-cert',term:'Secret / Key / Certificate',layer:'identity',model:'operations',plain:'Password等のSecret、暗号鍵、TLS証明書を安全に保管・更新する仕組み。',why:'コードへの直書きや期限切れ、鍵の過剰権限を防ぐ。',bank:'identity',lab:13,products:{aws:'Secrets Manager / KMS / ACM',gcp:'Secret Manager / Cloud KMS / Certificate Manager',azure:'Key Vault / Managed HSM',oci:'Vault / Certificates'},aliases:['secret','kms','key vault','acm','certificate','vault','secret manager','managed hsm']},
 {key:'observability',term:'Metrics / Logs / Traces / Audit',layer:'operations',model:'operations',plain:'今どうなっているか・何が起きたか・誰が変えたかを証拠として見る仕組み。',why:'障害時に「推測」ではなくEvidenceで切り分けるため。',bank:'operations',lab:14,products:{aws:'CloudWatch / CloudTrail',gcp:'Cloud Monitoring / Logging / Audit Logs',azure:'Azure Monitor / Log Analytics / Activity Log',oci:'Monitoring / Logging / Audit'},aliases:['cloudwatch','cloudtrail','monitoring','logging','audit logs','azure monitor','activity log','metrics','logs','traces','audit']},
 {key:'backup',term:'Backup / Restore',layer:'operations',model:'operations',plain:'Dataが消えた・壊れたときに、以前の状態へ戻せるようにする仕組み。',why:'Backupが「ある」だけでなく、必要時間内に本当にRestoreできることが重要。',bank:'operations',lab:15,products:{aws:'AWS Backup / Snapshot / Restore',gcp:'Backup / Snapshot / Restore',azure:'Azure Backup / Restore',oci:'Database / Block Volume Backup / Object Storage'},aliases:['backup','restore','snapshot','aws backup','azure backup']},
 {key:'rpo-rto',term:'RPO / RTO',layer:'operations',model:'concept',plain:'RPOは許容するData損失、RTOは許容する復旧時間の目標。',why:'Backup頻度やDR構成を「なんとなく」ではなく業務要件から決めるため。',bank:'operations',lab:15,products:{aws:'Business requirement → AWS recovery design',gcp:'Business requirement → GCP recovery design',azure:'Business requirement → Azure recovery design',oci:'Business requirement → OCI recovery design'},aliases:['rpo','rto','recovery point objective','recovery time objective']},
 {key:'region-dr',term:'Region / Disaster Recovery',layer:'architecture',model:'concept',plain:'1台や1AZではなく、より大きな障害から別の場所へ復旧する設計。',why:'大規模障害でも重要業務を復旧できるようにする。切替後はData照合も必要。',bank:'architecture',lab:16,products:{aws:'Region / Multi-Region DR',gcp:'Region / Multi-region DR',azure:'Region / Site Recovery',oci:'Region / Cross-region DR'},aliases:['region','dr','disaster recovery','multi-region','site recovery']},
 {key:'vpn',term:'VPN',layer:'hybrid',model:'hybrid',plain:'Internet等の共有Network上に暗号化された論理Tunnelを作って拠点同士を接続する。',why:'Cloudと社内Networkを比較的素早く接続したり、専用線のBackupとして使う。',bank:'hybrid',lab:17,products:{aws:'Site-to-Site VPN',gcp:'Cloud VPN',azure:'VPN Gateway',oci:'Site-to-Site VPN'},aliases:['vpn','site-to-site vpn','cloud vpn','vpn gateway']},
 {key:'dedicated-link',term:'Dedicated Cloud Connectivity',layer:'hybrid',model:'hybrid',plain:'Cloudと社内Networkを専用・閉域系の接続でつなぐサービス。',why:'安定した帯域・経路・Security要件があるHybrid構成で使う。',bank:'hybrid',lab:17,products:{aws:'Direct Connect',gcp:'Cloud Interconnect',azure:'ExpressRoute',oci:'FastConnect'},aliases:['direct connect','interconnect','expressroute','fastconnect','dedicated connection']},
 {key:'provider-mapping',term:'Provider Translation',layer:'architecture',model:'concept',plain:'共通概念をAWS / Google Cloud / Azure / OCIの製品名へ翻訳する考え方。',why:'製品名を丸暗記せず、別Cloudでも同じ構造を見抜くため。',bank:'architecture',lab:18,products:{aws:'AWS service names',gcp:'Google Cloud service names',azure:'Azure service names',oci:'OCI service names'},aliases:['mapping','provider translation','conceptual mapping']},
 {key:'iac-change',term:'IaC / Change / Governance',layer:'operations',model:'control',plain:'Infrastructure変更をCode・Review・Policy・Auditで再現可能に管理する考え方。',why:'誰が何を変えたか、戻せるか、差分は何かを説明できるようにする。',bank:'operations',lab:19,products:{aws:'CloudFormation / Organizations / Cost Explorer',gcp:'Terraform / Organization / Project / Billing',azure:'Bicep / Azure Policy / Subscription / Cost Management',oci:'Resource Manager / IAM Policy / Budgets'},aliases:['iac','cloudformation','terraform','bicep','resource manager','policy','change control','finops']},
 {key:'queue',term:'Message Queue',layer:'integration',model:'managed',plain:'送信側と受信側を時間的に分離し、Messageを一時的にためて処理する仕組み。',why:'一時障害や負荷差に強くなる一方、重複・再送・順序・DLQを設計する必要がある。',bank:'integration',lab:null,products:{aws:'Amazon SQS',gcp:'Pub/Sub subscription pattern',azure:'Service Bus Queue',oci:'OCI Queue'},aliases:['queue','sqs','service bus','oci queue','dlq']},
 {key:'event',term:'Event / Pub-Sub',layer:'integration',model:'managed',plain:'出来事を複数のConsumerへ配信したり、Eventに応じて処理を動かす仕組み。',why:'疎結合にできるが、再送・重複・順序・最終整合性を理解する必要がある。',bank:'integration',lab:null,products:{aws:'SNS / EventBridge',gcp:'Pub/Sub / Eventarc',azure:'Event Grid / Service Bus Topic',oci:'Events / Streaming'},aliases:['eventbridge','sns','pubsub','event grid','eventarc','event']},
 {key:'api-gateway',term:'API Gateway / API Management',layer:'integration',model:'managed',plain:'APIの入口でRoute、認証、Rate Limit、Policy等を管理する仕組み。',why:'Applicationへ直接すべてを公開せず、共通の入口・統制を置ける。',bank:'integration',lab:null,products:{aws:'Amazon API Gateway',gcp:'API Gateway / Apigee',azure:'Azure API Management',oci:'OCI API Gateway'},aliases:['api gateway','apigee','api management']},
 {key:'serverless',term:'Serverless Compute',layer:'compute',model:'serverless',plain:'Serverの台数・OS管理を強く意識せず、FunctionやRequest単位で処理を実行する方式。',why:'小さな処理やEvent駆動に向くが、実行時間・State・Cold Start・Vendor制約等も考える。',bank:'compute',lab:null,products:{aws:'AWS Lambda',gcp:'Cloud Run / Cloud Run functions',azure:'Azure Functions',oci:'OCI Functions'},aliases:['lambda','cloud run functions','cloud run','azure functions','oci functions','serverless']},
 {key:'container',term:'Container Platform',layer:'compute',model:'mixed',plain:'Applicationと依存物をContainer Imageとしてまとめ、隔離して実行する方式。',why:'再現性や可搬性を高めやすい一方、Kubernetes等を使うと運用複雑性も増える。',bank:'compute',lab:null,products:{aws:'ECS / EKS / Fargate',gcp:'GKE / Cloud Run',azure:'AKS / Container Apps',oci:'OKE / Container Instances'},aliases:['container','ecs','eks','fargate','gke','aks','oke','kubernetes']},
 {key:'saas',term:'SaaS',layer:'architecture',model:'concept',plain:'ApplicationそのものをServiceとして利用するCloud利用形態。',why:'自分でServerやApplicationを作らず使える一方、Data・Identity・設定・契約・Exit等の責任は残る。',bank:'architecture',lab:null,products:{aws:'例: Amazon QuickSight等（用途別SaaS）',gcp:'Google Workspaceなど',azure:'Microsoft 365など',oci:'Oracle Fusion Cloud Applicationsなど'},aliases:['saas','microsoft 365','google workspace']},
 {key:'shared-responsibility',term:'Shared Responsibility',layer:'architecture',model:'concept',plain:'Cloud側と利用者側で、Security・Operation・Data等の責任を分担する考え方。',why:'Cloudにしたら責任がゼロになる、という誤解を防ぐ。',bank:'architecture',lab:11,products:{aws:'AWS Shared Responsibility Model',gcp:'Shared responsibility / shared fate concepts',azure:'Shared responsibility in Azure',oci:'OCI shared security responsibility'},aliases:['shared responsibility','responsibility model']},
 {key:'war-room',term:'Cloud War Room',layer:'architecture',model:'concept',plain:'複数レイヤのEvidenceから障害を切り分け、安全に復旧して業務完了まで確認する総合演習。',why:'単一サービス名ではなく、End-to-Endで金融ITを判断するため。',bank:'architecture',lab:20,products:{aws:'AWS Financial War Room',gcp:'Google Cloud Financial War Room',azure:'Azure Financial War Room',oci:'OCI context via common model'},aliases:['war room','incident','troubleshooting']}
];
const LAB_META=[
 {key:'web-flow',label:'Webサービス全体'}, {key:'compute-vm',label:'Applicationを動かす'}, {key:'database',label:'Dataを置く'}, {key:'virtual-network',label:'自分たちのNetwork'},
 {key:'subnet',label:'Public / Private'}, {key:'route-nat',label:'Route / NAT'}, {key:'load-balancer',label:'入口 / Load Balancer'}, {key:'firewall',label:'通信を絞る'},
 {key:'az-ha',label:'1台壊れても止めない'}, {key:'object-storage',label:'Storageを使い分ける'}, {key:'managed-db',label:'Managed DB'}, {key:'iam',label:'誰が何を操作できる？'},
 {key:'secret-key-cert',label:'Secret / Key / Certificate'}, {key:'observability',label:'壊れたことを知る'}, {key:'backup',label:'Dataを戻す'}, {key:'region-dr',label:'大きな障害 / DR'},
 {key:'dedicated-link',label:'銀行内Systemと接続'}, {key:'provider-mapping',label:'各Cloudへ翻訳'}, {key:'iac-change',label:'Change / Governance'}, {key:'war-room',label:'War Room'}
];
const rowMap=Object.fromEntries(rows.map(r=>[r.key,r]));
const providerName={cloud:'Common Concept',aws:'AWS',gcp:'Google Cloud',azure:'Azure'}[moduleId];
let state={tab:'layers',query:'',selected:'virtual-network'};
function productFor(row,id=moduleId){if(id==='cloud')return row.term;return row.products[id]||row.term}
function searchText(row){return [row.term,row.plain,row.why,...Object.values(row.products||{}),...(row.aliases||[])].join(' ').toLowerCase()}
function launch(){
 if(document.getElementById('cloudAtlasLaunch'))return;
 const top=document.querySelector('.topbar');
 if(top){let nav=top.querySelector('.nav');const b=document.createElement('button');b.type='button';b.className='cloudAtlasTopBtn';b.innerHTML='☁️ Cloud Map';b.onclick=()=>openAtlas();if(nav)nav.appendChild(b);else top.appendChild(b)}
 const f=document.createElement('button');f.id='cloudAtlasLaunch';f.type='button';f.className='cloudAtlasLaunch';f.innerHTML='☁️<span>Cloud Map</span>';f.onclick=()=>openAtlas();document.body.appendChild(f);
}
function overlay(){
 let o=document.getElementById('cloudAtlasOverlay');if(o)return o;
 o=document.createElement('div');o.id='cloudAtlasOverlay';o.className='cloudAtlasOverlay';o.innerHTML=`
 <div class="cloudAtlasPanel" role="dialog" aria-modal="true" aria-label="Cloud Map / 用語辞典">
  <header class="cloudAtlasHead"><div><div class="cloudAtlasKicker">CLOUD MAP / ZERO-BASE GLOSSARY</div><h2>☁️ Cloudを「位置」で理解する</h2><p>用語を <b>何をする？ / どこまで任せる？ / 各社では何て呼ぶ？ / 銀行Systemのどこ？</b> の4軸で整理します。</p></div><button class="cloudAtlasClose" type="button" aria-label="閉じる">×</button></header>
  <div class="cloudAtlasTools"><div class="cloudAtlasTabs"><button data-tab="layers">🧱 レイヤー</button><button data-tab="terms">📖 用語</button><button data-tab="mapping">↔ 各社対応</button><button data-tab="models">☁️ 提供モデル</button></div><label class="cloudAtlasSearch">🔎<input type="search" placeholder="EC2 / VPC / RDS / IAM / Azure SQL ..." autocomplete="off"></label></div>
  <div class="cloudAtlasBody"><div class="cloudAtlasMain"></div><aside class="cloudAtlasDetail"></aside></div>
  <footer class="cloudAtlasFoot">※ IaaS / PaaS 等は学習上の「管理責任の目安」。製品によって境界は異なり、完全な1:1分類ではありません。Provider間の対応も「≒ 概念上の対応」です。</footer>
 </div>`;
 document.body.appendChild(o);
 o.querySelector('.cloudAtlasClose').onclick=closeAtlas;o.addEventListener('click',e=>{if(e.target===o)closeAtlas()});
 o.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;render()});
 const input=o.querySelector('input');input.addEventListener('input',()=>{state.query=input.value.trim().toLowerCase();state.tab='terms';render()});
 return o;
}
function openAtlas(key){const o=overlay();if(key&&rowMap[key]){state.selected=key;state.tab='terms'}o.classList.add('open');document.body.style.overflow='hidden';render()}
function closeAtlas(){const o=document.getElementById('cloudAtlasOverlay');if(o)o.classList.remove('open');document.body.style.overflow=''}
function bankDiagram(row){
 const active=row.bank;
 const core=[['edge','🚪 Entry'],['network','🌐 Network'],['compute','🖥 App / Compute'],['data','🗄 Data'],['hybrid','🔗 Core']];
 const main=core.map(([k,t])=>`<div class="bankNode ${active===k?'active':''}">${t}</div>`).join('<div class="bankArrow">→</div>');
 return `<div class="bankMap"><div class="bankCustomer">📱 Customer</div><div class="bankArrow">→</div>${main}<div class="bankSide"><div class="bankNode side ${active==='identity'?'active':''}">🔐 Identity / Security</div><div class="bankNode side ${active==='integration'?'active':''}">📨 Integration</div><div class="bankNode side ${active==='operations'?'active':''}">📊 Operations</div><div class="bankNode side ${active==='architecture'?'active':''}">🧭 Architecture</div></div></div>`
}
function detail(row){
 const d=overlay().querySelector('.cloudAtlasDetail');const layer=LAYERS[row.layer],model=MODELS[row.model];
 d.innerHTML=`<div class="atlasTermHead"><div class="atlasTermIcon">${layer.icon}</div><div><span>${esc(layer.name)}</span><h3>${esc(row.term)}</h3></div></div>
 <p class="atlasPlain"><b>ひと言：</b>${esc(row.plain)}</p><p class="atlasWhy"><b>なぜ必要？</b>${esc(row.why)}</p>
 <div class="axisGrid"><div><small>① 何をする？</small><b>${layer.icon} ${esc(layer.name)}</b><span>${esc(layer.desc)}</span></div><div><small>② どこまで任せる？</small><b>${esc(model.name)}</b><span>${esc(model.desc)}</span></div></div>
 <div class="mappingDetail"><small>③ 各社では何て呼ぶ？</small><table><tr><th>AWS</th><td>${esc(row.products.aws||'-')}</td></tr><tr><th>Google Cloud</th><td>${esc(row.products.gcp||'-')}</td></tr><tr><th>Azure</th><td>${esc(row.products.azure||'-')}</td></tr><tr><th>OCI</th><td>${esc(row.products.oci||'-')}</td></tr></table></div>
 <div class="bankWhere"><small>④ 銀行Systemのどこ？</small>${bankDiagram(row)}</div>
 ${row.lab?`<a class="atlasLabLink" href="#lab${String(row.lab).padStart(2,'0')}" data-close-atlas>この教材：Lab ${String(row.lab).padStart(2,'0')}へ →</a>`:''}`;
 d.querySelectorAll('[data-close-atlas]').forEach(a=>a.onclick=()=>closeAtlas());
}
function termCard(row){const l=LAYERS[row.layer];return `<button class="atlasTermCard ${state.selected===row.key?'selected':''}" data-term="${row.key}"><span class="atlasLayerDot">${l.icon}</span><span><b>${esc(row.term)}</b><small>${esc(l.short)} · ${esc(MODELS[row.model].name)}</small></span><em>${esc(productFor(row))}</em></button>`}
function renderLayers(main){
 main.innerHTML='<div class="atlasLayerGrid">'+Object.entries(LAYERS).map(([id,l])=>{const rs=rows.filter(r=>r.layer===id).slice(0,7);return `<section class="atlasLayerCard"><header><span>${l.icon}</span><div><h3>${esc(l.name)}</h3><p>${esc(l.desc)}</p></div></header><div class="atlasLayerTerms">${rs.map(r=>`<button data-term="${r.key}">${esc(r.term)}</button>`).join('')}</div></section>`}).join('')+'</div>'
}
function renderTerms(main){const filtered=rows.filter(r=>!state.query||searchText(r).includes(state.query));main.innerHTML=`<div class="atlasListHead"><b>${state.query?'検索結果':'Cloud用語辞典'}</b><span>${filtered.length} terms</span></div><div class="atlasTermList">${filtered.map(termCard).join('')}</div>`}
function renderMapping(main){const rs=rows.filter(r=>r.products&&r.key!=='web-flow');main.innerHTML=`<div class="atlasMappingWrap"><table class="atlasMappingTable"><thead><tr><th>レイヤー</th><th>共通概念</th><th>AWS</th><th>Google Cloud</th><th>Azure</th><th>OCI</th><th>提供モデル</th></tr></thead><tbody>${rs.map(r=>`<tr data-term="${r.key}"><td>${LAYERS[r.layer].icon} ${esc(LAYERS[r.layer].short)}</td><td><b>${esc(r.term)}</b></td><td>${esc(r.products.aws||'-')}</td><td>${esc(r.products.gcp||'-')}</td><td>${esc(r.products.azure||'-')}</td><td>${esc(r.products.oci||'-')}</td><td>${esc(MODELS[r.model].name)}</td></tr>`).join('')}</tbody></table></div>`}
function renderModels(main){
 const examples={iaas:'EC2 / Compute Engine / Azure VM / OCI Compute',managed:'RDS / Cloud SQL / Azure SQL / Autonomous Database',serverless:'Lambda / Cloud Run・Functions / Azure Functions / OCI Functions',saas:'Microsoft 365 / Google Workspace等',control:'IAM / Policy / Audit / Key管理',iaasFoundation:'VPC / VNet / VCN / Subnet / Route'};
 main.innerHTML=`<div class="modelIntro"><h3>「どこまでCloud側へ任せるか」で見る</h3><p>IaaS→PaaS→Serverless/SaaSになるほど、一般にServer・OS等を自分で管理する範囲は減ります。ただし<b>Data・Identity・設定・業務責任はゼロになりません。</b></p></div><div class="modelLadder"><div class="modelScale">自分で管理する範囲 多い ↑</div>${['iaasFoundation','iaas','managed','serverless'].map(k=>`<div class="modelStep"><b>${esc(MODELS[k].name)}</b><span>${esc(MODELS[k].desc)}</span><em>${esc(examples[k]||'')}</em></div>`).join('')}<div class="modelStep saas"><b>SaaS</b><span>ApplicationそのものをServiceとして利用する。Infrastructure/Application運用は大きくCloud側へ寄る。</span><em>${esc(examples.saas)}</em></div><div class="modelScale">↓ Cloud側へ任せる範囲 多い</div></div><div class="modelCross"><h3>横断Control Plane</h3><p>${esc(MODELS.control.desc)}</p><b>${esc(examples.control)}</b></div>`
}
function bindTerms(main){main.querySelectorAll('[data-term]').forEach(el=>{el.onclick=()=>{state.selected=el.dataset.term;detail(rowMap[state.selected]);main.querySelectorAll('.selected').forEach(x=>x.classList.remove('selected'));if(el.classList.contains('atlasTermCard'))el.classList.add('selected')}})}
function render(){const o=overlay(),main=o.querySelector('.cloudAtlasMain');o.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===state.tab));if(state.tab==='layers')renderLayers(main);else if(state.tab==='terms')renderTerms(main);else if(state.tab==='mapping')renderMapping(main);else renderModels(main);bindTerms(main);detail(rowMap[state.selected]||rows[0])}
function currentLab(){const m=(location.hash||'').match(/^#lab(\d{1,2})/i);return m?Number(m[1]):0}
function injectLabStrip(){
 const id=currentLab();if(!id)return;const hero=document.querySelector('.labHero');if(!hero)return;const meta=LAB_META[id-1],row=rowMap[meta?.key];if(!row)return;
 let s=hero.querySelector('.cloudAtlasLabStrip');if(s&&s.dataset.lab===String(id))return;if(!s){s=document.createElement('section');s.className='cloudAtlasLabStrip';const goal=hero.querySelector('.goal');if(goal)goal.insertAdjacentElement('afterend',s);else hero.appendChild(s)}s.dataset.lab=String(id);
 const layer=LAYERS[row.layer],model=MODELS[row.model],product=productFor(row);s.innerHTML=`<div class="labStripLabel">🧭 今回の位置</div><div class="labStripItems"><span><small>レイヤー</small><b>${layer.icon} ${esc(layer.name)}</b></span><span><small>提供モデル</small><b>${esc(model.name)}</b></span><span><small>${esc(providerName)}</small><b>${esc(product)}</b></span></div><button type="button">詳しく見る →</button>`;s.querySelector('button').onclick=()=>openAtlas(row.key)
}
function init(){launch();injectLabStrip();window.addEventListener('hashchange',()=>setTimeout(injectLabStrip,0));new MutationObserver(()=>injectLabStrip()).observe(document.getElementById('app')||document.body,{subtree:true,childList:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();