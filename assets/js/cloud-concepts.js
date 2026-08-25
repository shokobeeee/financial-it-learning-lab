(function(){
'use strict';

const layers={
  architecture:{icon:'🧭',name:'全体 / Architecture',short:'全体',desc:'CustomerからCloud、CoreまでをEnd-to-Endで見る。Region/AZ、責任分界、DRなど複数レイヤをまたぐ設計軸もここで扱う。'},
  edge:{icon:'🚪',name:'Edge / Entry',short:'入口',desc:'名前解決・入口・振り分け。利用者の要求をCloud内部へ届ける最初の層。'},
  network:{icon:'🌐',name:'Network',short:'Network',desc:'Virtual Network、Subnet、Route、NAT、Firewallなど「どこへ通信できるか」を決める層。'},
  compute:{icon:'🖥️',name:'Compute',short:'Compute',desc:'Applicationや処理を実行する場所。VM、Container、Serverlessなど実行方式がある。'},
  data:{icon:'🗄️',name:'Data',short:'Data',desc:'Database、Object/Block/File Storageなど、業務データを保存・取得する層。'},
  identity:{icon:'🔐',name:'Identity / Security',short:'Identity',desc:'誰が何をできるか、Secret・Key・Certificateをどう守るかを決める横断層。'},
  integration:{icon:'📨',name:'Integration',short:'Integration',desc:'Queue、Event、API Gatewayなど、システム同士を連携する層。'},
  operations:{icon:'📊',name:'Operations / Governance',short:'Operations',desc:'Metrics、Logs、Audit、Backup、IaC、Change、Costなど運用・統制を支える横断層。'},
  hybrid:{icon:'🔗',name:'Hybrid / Core',short:'Hybrid',desc:'Cloudと社内Network、勘定系、Mainframeなどをつなぐ層。'}
};

const models={
  concept:{name:'概念 / 判断軸',desc:'製品サービスそのものではなく、設計や運用を考えるための共通概念。'},
  iaasFoundation:{name:'IaaS基盤',desc:'Network・Subnet・Route等、仮想Infrastructureを自分たちで設計する土台。'},
  iaas:{name:'IaaS寄り',desc:'VM等の基盤を借り、OS・Middleware・Application等を自分たちで多く管理する。'},
  managed:{name:'Managed / PaaS寄り',desc:'基盤運用の一部をProviderへ任せ、Application・Data・設定等に集中する。'},
  serverless:{name:'Serverless / Fully Managed',desc:'Server・OS管理をさらにProviderへ寄せ、Function・Request・Event単位で利用する。'},
  computeControl:{name:'Compute管理 / Orchestration',desc:'VM等の台数・配置・置換・自動復旧を管理する。IaaS/PaaSとは別の分類軸。'},
  control:{name:'Control Plane / 横断',desc:'IAM・Policy・Audit等、複数サービスを横断して管理・統制する。'},
  operations:{name:'Managed Operations',desc:'Monitoring・Backup・Security等の運用機能をサービスとして利用する。'},
  hybrid:{name:'Connectivity / Hybrid',desc:'Cloudと外部Networkを接続する通信・回線サービス。'},
  mixed:{name:'複数モデル',desc:'製品や使い方によりIaaS / Managed / Serverless等の位置づけが変わる。'}
};

const phases=[
  {range:'01–07',title:'まず仕組みをつくる',desc:'Web導線 → Compute → Data → Network → Subnet → Route → Entry'},
  {range:'08–15',title:'安全に・止まりにくくする',desc:'Firewall → Failure Domain → Storage → Managed DB → IAM → Secret/Key → Observe → Backup'},
  {range:'16–19',title:'金融システムとして運用する',desc:'Region/DR → Hybrid → Provider Translation → Change/Governance'},
  {range:'20',title:'War Room',desc:'Impact → Evidence → Safe Recovery → Financial Reconciliation'}
];

const providers={
  common:{name:'Common Concept',icon:'☁️'},
  aws:{name:'AWS',icon:'🟧',extras:['queue','event','private-service-connectivity','container','serverless']},
  gcp:{name:'Google Cloud',icon:'🔵',extras:['event','private-service-connectivity','container','serverless']},
  azure:{name:'Azure',icon:'🔷',extras:['queue','event','private-service-connectivity','container','serverless']},
  oci:{name:'Oracle Cloud Infrastructure (OCI)',icon:'🔴',extras:['queue','event','private-service-connectivity','container','serverless']}
};

const concepts=[
  {key:'web-flow',lab:1,term:'Webサービスの流れ',layer:'architecture',model:'concept',bank:'architecture',plain:'利用者の要求が入口→Application→Dataへ届き、結果が返る一連の流れ。',why:'Cloud以前に「何がどこを通るSystemか」を理解する土台。',products:{aws:'Customer → AWS → App → Data',gcp:'Customer → Google Cloud → App → Data',azure:'Customer → Azure → App → Data',oci:'Customer → OCI → App → Data'},aliases:['customer journey','end-to-end','web service']},
  {key:'compute-vm',lab:2,term:'VM / Compute',layer:'compute',model:'iaas',bank:'compute',plain:'Applicationや処理を動かすための仮想Computer。',why:'「どこでApplicationが動くか」を見る基本。OSやMiddlewareを管理する範囲も大きい。',products:{aws:'Amazon EC2',gcp:'Compute Engine',azure:'Virtual Machines',oci:'OCI Compute'},aliases:['ec2','compute engine','virtual machines','oci compute','vm','server']},
  {key:'persistent-data',lab:3,term:'Database / Persistent Data',layer:'data',model:'mixed',bank:'data',plain:'残高や取引など、消えてはいけない業務Dataを保持する場所。',why:'金融では保存場所だけでなく「どこが正本か」「更新が確定したか」が重要。',products:{aws:'RDS / Aurora / DB on EC2等',gcp:'Cloud SQL / AlloyDB / DB on VM等',azure:'Azure SQL / Managed Instance / DB on VM等',oci:'OCI Database Services / DB on Compute等'},aliases:['database','db','persistent data','authoritative source']},
  {key:'virtual-network',lab:4,term:'Virtual Network',layer:'network',model:'iaasFoundation',bank:'network',plain:'Cloud内に作る「自分たち用の論理Network」。',why:'AppやDBの通信範囲、Address、Route、公開範囲を自分たちの単位で設計するため。',products:{aws:'Amazon VPC',gcp:'VPC',azure:'Virtual Network (VNet)',oci:'Virtual Cloud Network (VCN)'},aliases:['vpc','vnet','vcn','virtual network']},
  {key:'subnet',lab:5,term:'Subnet / Public・Private',layer:'network',model:'iaasFoundation',bank:'network',plain:'Virtual Networkを用途や到達性ごとに小さく分けた区画。',why:'Internetに見せる入口と、App/DBなど直接公開しない内部を分けるため。',products:{aws:'Subnet',gcp:'Subnet',azure:'Subnet',oci:'Subnet'},aliases:['subnet','public subnet','private subnet']},
  {key:'route-nat',lab:6,term:'Route / NAT / Egress',layer:'network',model:'iaasFoundation',bank:'network',plain:'Routeは「どこへ送るか」、NATは内部から外へ出る通信等のAddress変換を担う。',why:'「外へ出られる」と「外から入れる」を分けて理解するため。',products:{aws:'Route Table / Internet Gateway / NAT Gateway',gcp:'Routes / Cloud NAT',azure:'Route Table / UDR / NAT Gateway',oci:'Route Table / Internet Gateway / NAT Gateway'},aliases:['route','routing','nat','egress','igw','nat gateway','cloud nat','udr']},
  {key:'load-balancer',lab:7,term:'Load Balancer / Entry',layer:'edge',model:'managed',bank:'edge',plain:'利用者からの要求を複数の正常なApplicationへ振り分ける入口。',why:'1台へ集中させず、故障したAppへ流さないため。Health Checkの質も重要。',products:{aws:'Elastic Load Balancing (ALB / NLB)',gcp:'Cloud Load Balancing',azure:'Application Gateway / Load Balancer',oci:'OCI Load Balancer'},aliases:['load balancer','alb','nlb','elb','application gateway','cloud load balancing']},
  {key:'firewall',lab:8,term:'Firewall / Security Rule',layer:'network',model:'iaasFoundation',bank:'network',plain:'誰からどのPortへ通信してよいかを絞る仕組み。',why:'不要な到達性を減らし、侵害・誤設定時のBlast Radiusを小さくする。',products:{aws:'Security Group / NACL',gcp:'VPC Firewall Rules',azure:'NSG / Azure Firewall',oci:'NSG / Security Lists'},aliases:['security group','nacl','firewall','nsg','security list']},
  {key:'failure-domain',lab:9,term:'Availability Zone / Failure Domain',layer:'architecture',model:'concept',bank:'architecture',plain:'同じ場所の障害で全部止まらないよう、独立した障害範囲を分ける考え方。',why:'「どこまで一緒に壊れるか」を意識して配置するため。',products:{aws:'Availability Zone',gcp:'Zone',azure:'Availability Zone',oci:'Availability Domain / Fault Domain'},aliases:['az','availability zone','zone','failure domain','availability domain','fault domain']},
  {key:'storage-types',lab:10,term:'Object / Block / File Storage',layer:'data',model:'mixed',bank:'data',plain:'同じ「保存」でも、Object・VM Disk・共有Fileでは読み書き方法が違う。',why:'用途・Access Pattern・復旧要件に合うStorageを選ぶため。',products:{aws:'S3 / EBS / EFS',gcp:'Cloud Storage / Persistent Disk / Filestore',azure:'Blob Storage / Managed Disks / Azure Files',oci:'Object Storage / Block Volume / File Storage'},aliases:['object storage','block storage','file storage','s3','ebs','efs','blob storage','filestore']},
  {key:'managed-db',lab:11,term:'Managed Relational Database',layer:'data',model:'managed',bank:'data',plain:'Database基盤のPatch・HA・Backup等の一部をProviderへ任せるDB Service。',why:'管理を減らせるが、Schema・SQL・権限・Data整合性までProvider任せにはならない。',products:{aws:'Amazon RDS / Aurora',gcp:'Cloud SQL / AlloyDB',azure:'Azure SQL / Managed Instance',oci:'Autonomous Database / Base Database / Exadata Database Service'},aliases:['rds','aurora','cloud sql','alloydb','azure sql','managed instance','autonomous database','exadata']},
  {key:'iam',lab:12,term:'IAM / Identity / Role / Policy',layer:'identity',model:'control',bank:'identity',plain:'「誰が、何に、何をしてよいか」を決める仕組み。',why:'HumanとApplicationのIdentityを分け、過剰権限や侵害時の被害を抑える。',products:{aws:'AWS IAM / IAM Role',gcp:'Cloud IAM / Service Account',azure:'Microsoft Entra ID / Azure RBAC / Managed Identity',oci:'OCI IAM / Dynamic Groups'},aliases:['iam','role','policy','service account','entra','rbac','managed identity','dynamic group']},
  {key:'secret-key-cert',lab:13,term:'Secret / Key / Certificate',layer:'identity',model:'operations',bank:'identity',plain:'Password等のSecret、暗号Key、TLS Certificateを安全に保管・更新する。',why:'コード直書き、期限切れ、Keyの過剰権限を防ぐ。3つは別物だが「秘密情報をどう守るか」の学習単位で並べる。',products:{aws:'Secrets Manager / KMS / ACM',gcp:'Secret Manager / Cloud KMS / Certificate Manager',azure:'Key Vault / Managed HSM',oci:'Vault / Certificates'},aliases:['secret','kms','key vault','acm','certificate','vault','secret manager','managed hsm']},
  {key:'observability',lab:14,term:'Metrics / Logs / Traces / Audit',layer:'operations',model:'operations',bank:'operations',plain:'今どうなっているか・何が起きたか・誰が変えたかをEvidenceとして見る仕組み。',why:'障害時に推測ではなくEvidenceで切り分けるため。',products:{aws:'CloudWatch / CloudTrail',gcp:'Cloud Monitoring / Logging / Audit Logs',azure:'Azure Monitor / Log Analytics / Activity Log',oci:'Monitoring / Logging / Audit'},aliases:['cloudwatch','cloudtrail','monitoring','logging','audit logs','azure monitor','activity log','metrics','logs','traces','audit']},
  {key:'backup-rpo-rto',lab:15,term:'Backup / Restore / RPO / RTO',layer:'operations',model:'operations',bank:'operations',plain:'Dataを戻す仕組みと、許容Data損失・復旧時間の目標。',why:'Backupが「ある」だけでなく、業務が必要時間内に本当にRestoreできることを確認するため。',products:{aws:'AWS Backup / Snapshot / Restore',gcp:'Backup / Snapshot / Restore',azure:'Azure Backup / Restore',oci:'Database / Block Volume Backup / Object Storage'},aliases:['backup','restore','snapshot','rpo','rto','aws backup','azure backup']},
  {key:'region-dr',lab:16,term:'Region / Disaster Recovery',layer:'architecture',model:'concept',bank:'architecture',plain:'1台や1AZを超える大きな障害から別の場所へ復旧する設計。',why:'大規模障害でも重要業務をRTO/RPO内で復旧するため。',products:{aws:'Region / Multi-Region DR',gcp:'Region / Multi-region DR',azure:'Region / Site Recovery',oci:'Region / Cross-region DR'},aliases:['region','dr','disaster recovery','multi-region','site recovery']},
  {key:'hybrid-connectivity',lab:17,term:'Hybrid Connectivity',layer:'hybrid',model:'hybrid',bank:'hybrid',plain:'Cloudと社内Network・勘定系などをVPNや専用接続でつなぐ。',why:'Cloud側が正常でもCoreへの経路が切れれば業務は止まるため、End-to-Endで見る。',products:{aws:'Direct Connect / Site-to-Site VPN',gcp:'Cloud Interconnect / Cloud VPN',azure:'ExpressRoute / VPN Gateway',oci:'FastConnect / Site-to-Site VPN'},aliases:['direct connect','interconnect','expressroute','fastconnect','vpn','hybrid']},
  {key:'provider-mapping',lab:18,term:'Provider Translation',layer:'architecture',model:'concept',bank:'architecture',plain:'共通ConceptをAWS / Google Cloud / Azure / OCIの製品名へ翻訳する考え方。',why:'製品名を丸暗記せず、別Cloudでも同じ役割を見抜くため。',products:{aws:'AWS service names',gcp:'Google Cloud service names',azure:'Azure service names',oci:'OCI service names'},aliases:['mapping','provider translation','conceptual mapping']},
  {key:'iac-change',lab:19,term:'IaC / Change / Governance',layer:'operations',model:'control',bank:'operations',plain:'Infrastructure変更をCode・Review・Policy・Auditで再現可能に管理する。',why:'誰が何を変えたか、戻せるか、差分は何かを説明可能にするため。',products:{aws:'CloudFormation / Organizations / Cost Explorer',gcp:'Terraform / Organization / Project / Billing',azure:'Bicep / Azure Policy / Subscription / Cost Management',oci:'Resource Manager / IAM Policy / Budgets'},aliases:['iac','cloudformation','terraform','bicep','resource manager','policy','change control','finops']},
  {key:'war-room',lab:20,term:'Cloud War Room',layer:'architecture',model:'concept',bank:'architecture',plain:'複数LayerのEvidenceから障害を切り分け、安全に復旧して業務完了まで確認する総合演習。',why:'単一Service名ではなくEnd-to-Endで金融ITを判断するため。',products:{aws:'AWS Financial War Room',gcp:'Google Cloud Financial War Room',azure:'Azure Financial War Room',oci:'OCI context via common model'},aliases:['war room','incident','troubleshooting']},

  {key:'ha-fleet',lab:9,term:'冗長化 / Auto Healing / Fleet',layer:'compute',model:'computeControl',bank:'compute',plain:'同じ役割のComputeを複数台で運用し、故障時の置換や台数調整を行う仕組み。',why:'Failure Domainを分けるだけでなく、各場所へ実際の処理能力を配置・復旧するため。',products:{aws:'EC2 Auto Scaling / Auto Scaling group',gcp:'Managed Instance Group (MIG)',azure:'Virtual Machine Scale Sets',oci:'Instance Pools / Autoscaling'},aliases:['auto scaling','autoscaling','asg','mig','managed instance group','vm scale sets','vmss','instance pools','auto healing']},
  {key:'queue',lab:null,term:'Message Queue',layer:'integration',model:'managed',bank:'integration',plain:'送信側と受信側を時間的に分離し、Messageを一時的にためて処理する。',why:'一時障害や負荷差に強くなる一方、重複・再送・順序・DLQを設計する必要がある。',products:{aws:'Amazon SQS',gcp:'Pub/Sub subscription pattern',azure:'Service Bus Queue',oci:'OCI Queue'},aliases:['queue','sqs','service bus','oci queue','dlq']},
  {key:'event',lab:null,term:'Event / Pub-Sub',layer:'integration',model:'managed',bank:'integration',plain:'出来事を複数Consumerへ配信したり、Eventに応じて処理を動かす。',why:'疎結合にできるが、再送・重複・順序・最終整合性を理解する必要がある。',products:{aws:'SNS / EventBridge',gcp:'Pub/Sub / Eventarc',azure:'Event Grid / Service Bus Topic',oci:'Events / Streaming'},aliases:['eventbridge','sns','pubsub','event grid','eventarc','event']},
  {key:'api-gateway',lab:null,term:'API Gateway / API Management',layer:'integration',model:'managed',bank:'integration',plain:'API入口でRoute、認証、Rate Limit、Policy等を管理する。',why:'Applicationへ直接すべてを公開せず、共通入口・統制を置くため。',products:{aws:'Amazon API Gateway',gcp:'API Gateway / Apigee',azure:'Azure API Management',oci:'OCI API Gateway'},aliases:['api gateway','apigee','api management']},
  {key:'serverless',lab:2,term:'Serverless Compute',layer:'compute',model:'serverless',bank:'compute',plain:'Serverの台数・OS管理を強く意識せず、FunctionやRequest単位で処理を実行する方式。',why:'Event駆動等に向くが、実行時間・State・Cold Start・Provider制約等も考える。',products:{aws:'AWS Lambda',gcp:'Cloud Run / Cloud Run functions',azure:'Azure Functions',oci:'OCI Functions'},aliases:['lambda','cloud run functions','cloud run','azure functions','oci functions','serverless']},
  {key:'container',lab:2,term:'Container Platform',layer:'compute',model:'mixed',bank:'compute',plain:'Applicationと依存物をContainer Imageとしてまとめ、隔離して実行する方式。',why:'再現性や可搬性を高めやすい一方、Kubernetes等では運用複雑性も増える。',products:{aws:'ECS / EKS / Fargate',gcp:'GKE / Cloud Run',azure:'AKS / Container Apps',oci:'OKE / Container Instances'},aliases:['container','ecs','eks','fargate','gke','aks','oke','kubernetes']},
  {key:'private-service-connectivity',lab:null,term:'Private Service Connectivity',layer:'network',model:'managed',bank:'network',plain:'PaaS等へPublic Internetを経由しにくいPrivate pathを作る考え方。',why:'Public exposureを減らせるが、Identity・DNS・Policy設計が不要になるわけではない。',products:{aws:'VPC Endpoint / PrivateLink',gcp:'Private Service Connect',azure:'Private Link / Private Endpoint',oci:'Service Gateway / Private Endpoint patterns'},aliases:['privatelink','private link','private endpoint','private service connect','vpc endpoint']},
  {key:'saas',lab:null,term:'SaaS（利用形態）',layer:'architecture',model:'concept',bank:'architecture',mappingMode:'examples',plain:'ApplicationそのものをServiceとして利用するCloud利用形態。',why:'Infrastructure/Application運用を大きくProviderへ寄せられるが、Data・Identity・設定・契約・Exitの責任は残る。各社例は相互代替ではない。',products:{aws:'用途別SaaS（Serviceごとに異なる）',gcp:'例: Google Workspace等',azure:'例: Microsoft 365等',oci:'例: Oracle Fusion Cloud Applications等'},aliases:['saas','microsoft 365','google workspace']},
  {key:'shared-responsibility',lab:11,term:'Shared Responsibility',layer:'architecture',model:'concept',bank:'architecture',plain:'Provider側と利用者側でSecurity・Operation・Data等の責任を分担する考え方。',why:'Cloudにしたら責任がゼロになる、という誤解を防ぐ。',products:{aws:'AWS Shared Responsibility Model',gcp:'Shared responsibility / shared fate concepts',azure:'Shared responsibility in Azure',oci:'OCI shared security responsibility'},aliases:['shared responsibility','responsibility model']}
];

const labOrder=[
  'web-flow','compute-vm','persistent-data','virtual-network','subnet','route-nat','load-balancer','firewall','failure-domain','storage-types',
  'managed-db','iam','secret-key-cert','observability','backup-rpo-rto','region-dr','hybrid-connectivity','provider-mapping','iac-change','war-room'
];
const byKey=Object.fromEntries(concepts.map(x=>[x.key,x]));

function get(key){return byKey[key]||null}
function product(key,provider){const row=get(key);if(!row)return'';if(!provider||provider==='common')return row.term;return row.products?.[provider]||row.term}
function primary(){return labOrder.map(get)}

window.FIT_CLOUD_CONCEPTS={version:1,layers,models,phases,providers,concepts,labOrder,byKey,get,product,primary};
})();
