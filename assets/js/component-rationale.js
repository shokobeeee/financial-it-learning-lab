(function(){
'use strict';

function ensureCss(){
  if(document.querySelector('link[data-component-rationale]'))return;
  const l=document.createElement('link');l.rel='stylesheet';l.href='../assets/css/component-rationale.css?v=2';l.dataset.componentRationale='1';document.head.appendChild(l);
}
ensureCss();

const MODULE_IDS=['linux','sql','cobol','jcl','cloud','aws','gcp','azure'];
const ORIGINS={
  builtin:['OS / Platformに含まれる','最初から使える土台。ただし環境設定や起動状態は別に確認する。'],
  configured:['既存機能を設定・有効化','新しい製品を入れるより、すでにある機能の許可・設定・起動を行う。'],
  package:['Packageとして追加','Repository等からSoftwareを導入し、file・設定・service・log等を増やす。'],
  deployment:['Self-managed Package / Managed Service','自分でDBMS等をinstall・運用する形と、Providerへ基盤運用の一部を任せる形がある。'],
  runtime:['Compiler / Runtimeを追加','Source codeを実行可能な形へ変換・実行するための環境を用意する。'],
  mixed:['OS機能 + 管理Tool','土台の機能はOS側にあり、操作しやすくするToolやdaemonを追加・設定する。'],
  provisioned:['Cloud上にResourceを作成','PCへ本体をdownloadするのではなく、Provider APIでResourceを払い出す。CLI/SDKは操作用Tool。'],
  external:['別Platformで提供','いま見ているOSへinstallするのではなく、Mainframe・Scheduler・Managed service等の別基盤が提供する。'],
  client:['操作する側へToolを追加','対象Serverではなく、管理端末・Control nodeへCLI/Agent/自動化Toolを置く。'],
  placement:['Providerが用意した区分から選ぶ','新しくResourceを作るのではなく、既にある区分のどこへ置くかを決める。']
};

const HOME={
  sql:{
    title:'SQLを書く前に、なぜDBMSが必要？',
    summary:'CSVや通常fileにもデータは保存できます。ただし、同時利用・安全な更新・検索・Lock・監査をApplicationだけで実装するのは重い。そこでDBMSという管理Softwareを使います。',
    origin:'deployment',component:'DBMS',role:'Dataを安全に管理するSoftware',
    baseline:'Fileへ値を書けば保存自体はできる。ただしSQLという言語だけでは、保存も同時更新も復旧も動かない。',
    problem:'多数の利用者が同時に残高を読み書きすると、途中失敗や競合でDataの整合性が崩れてしまう。',
    capability:'Table・Query・Transaction・同時実行制御（Lock / MVCC）・Recovery・Auditをまとめて管理できること。',
    choice:'教材ではDb2を基準として学び、Oracle / PostgreSQL / SQL Serverへ概念を翻訳する。',
    before:'Application + file。検索・同時更新・復旧のルールをApplication側がすべて抱える。',
    after:'DBMS service + Table + Transaction log + Lock + Audit。',
    alternatives:['IBM Db2','Oracle Database','PostgreSQL','Microsoft SQL Server','CloudのManaged DB'],
    evidence:['DBMS process/service','接続先・Port','Table/Catalog','Transaction/Lock','Audit/Log'],
    boundary:'SQLは言語、Databaseはデータの集合・仕組み、DBMSはそれを管理するSoftware。3つは同じではありません。'
  },
  cobol:{
    title:'COBOLのSourceを書いたら、そのまま動く？',
    summary:'COBOLは業務処理を書く言語です。Source fileをCPUが直接実行するわけではないので、実環境ではCompilerとRuntime、さらにFile・DB・CICS等の周辺基盤が必要です。',
    origin:'runtime',component:'COBOL Compiler / Runtime',role:'Sourceを実行可能にする環境',
    baseline:'COBOL Sourceは人が読める業務ルールのText。まだ実行できるProgramではない。',
    problem:'READ・IF・計算・WRITEと書いても、Sourceのままでは対象Platform上で1行も実行されない。',
    capability:'Compile / Link / Runtime / 外部I-Oを通じて、SourceをProgramとして動かせること。',
    choice:'IBM Enterprise COBOL、GnuCOBOL、Pro*COBOL等は実行文脈が異なる。教材では概念を先に学ぶ。',
    before:'Source codeだけ。CPU・OSはCOBOL文を直接実行しない。',
    after:'Compiler output + Runtime + File/DB/CICS接続。',
    alternatives:['IBM Enterprise COBOL','GnuCOBOL','Oracle Pro*COBOL context'],
    evidence:['Compiler message','Load module / executable','RETURN-CODE','FILE STATUS','SQLCODE / CICS response'],
    boundary:'COBOLは業務処理を書く言語、Mainframe（z/OS）はそれが動く実行環境、JCLはその環境へ実行を頼む定義、Db2はDataを預ける外部基盤、CICSはOnline要求を受ける外部基盤。5つとも別の層のものです。'
  },
  jcl:{
    title:'JCLを書けば、どのPCでもBatchが動く？',
    summary:'JCLは「何を、どの順番で、どのDataを使って動かすか」をz/OS側へ伝えるJob定義です。JCL自身が実行Engineではなく、JES・Program・Dataset等のPlatformが必要です。',
    origin:'external',component:'z/OS / JES / Enterprise Scheduler',role:'Jobを受付・実行・順序制御するPlatform',
    baseline:'JCLはTextとして書ける。ただしJCL自身には、JOBを受け付けて実行する仕組みが無い。',
    problem:'多数のProgramを毎日、依存関係・入力・出力・戻り値の通りに動かしたくても、JCLを書くだけでは誰も実行してくれない。',
    capability:'JESがJob投入を受け付けてSpoolへ記録し、z/OS側がStep実行とDataset割当を行い、その外側でJob間の依存や営業日を管理できること。',
    choice:'JESはz/OS内、Control-M / JP1 / IBM Z Workload Scheduler等は外側のScheduler層。',
    before:'JCL Text + Program名。実行主体とData割当がない。',
    after:'Schedulerが投入するJCLをJESが受け付け、z/OSがStepを実行してDataset/DBを更新する。その間の記録はJESがSpoolへ残し続ける。',
    alternatives:['JES + JCL（定義と実行基盤。必ずセット）','上位のジョブスケジューラ：Control-M','同：JP1/AJS3','同：IBM Z Workload Scheduler'],
    evidence:['JOB ID','JES Spool','STEP RC / ABEND','Dataset状態','Scheduler依存'],
    boundary:'JCLをUbuntuへinstallする、という理解ではありません。JCLはz/OS Jobの定義で、JES等がそれを扱います。'
  },
  cloud:{
    title:'Cloudの部品は、PCへdownloadして使うの？',
    summary:'多くのCloud service本体はPCへinstallしません。Console・API・CLIからProviderへ依頼し、Network・VM・DB等のResourceをCloud側に作ります。',
    origin:'provisioned',component:'Cloud Resource',role:'Providerの設備上に払い出すIT部品',
    baseline:'Cloud account/project/subscriptionはある。ただしVM・Network・DB等のResourceはまだ1つも存在しない。',
    problem:'契約とAccountがあっても、VM・Network・DB等のResourceが無ければ、処理も保存も通信も行われない。',
    capability:'Provider APIでCompute・Network・Data・Security等を作成・設定・廃止できること。',
    choice:'Cloud Fundamentalsでは共通Conceptを先に理解し、そのあとAWS/GCP/Azureの名前へ翻訳する。',
    before:'契約と操作画面だけ。実際に処理・保存・通信を行うResourceはまだ無い。',
    after:'Resource ID・Network配置・IAM・Log・課金対象がCloud側に生まれる。',
    alternatives:['Consoleから作成','CLI/SDKから作成','IaCから作成','Managed serviceを利用'],
    evidence:['Resource ID / state','Network placement','IAM policy','Metrics / Logs','Billing / Audit'],
    boundary:'CLIをdownloadすることと、Cloud service本体を作ることは別です。CLIは操作用のTool、Resource本体はProvider側にあります。'
  },
  aws:null,gcp:null,azure:null
};

const PROVIDERS={
  aws:{name:'AWS',account:'AWS Account',services:{2:'Amazon EC2',3:'Amazon EBS（Instanceに付けるDisk）',4:'Amazon VPC',5:'Subnet',6:'Route Table / IGW / NAT Gateway',7:'Elastic Load Balancing',8:'Security Group / NACL',9:'Availability Zone',10:'S3 / EBS / EFS',11:'Amazon RDS / Aurora',12:'AWS IAM / IAM Role',13:'Secrets Manager / KMS / ACM',14:'CloudWatch / CloudTrail',15:'AWS Backup / Snapshot',16:'別RegionへのReplication / Route 53 Failover',17:'Direct Connect / Site-to-Site VPN',18:'Provider mapping',19:'CloudFormation / Organizations',20:'AWS War Room'}},
  gcp:{name:'Google Cloud',account:'Project',services:{2:'Compute Engine',3:'Persistent Disk（Instanceに付けるDisk）',4:'VPC',5:'Subnet',6:'Routes / Cloud NAT',7:'Cloud Load Balancing',8:'VPC Firewall',9:'Zone',10:'Cloud Storage / Persistent Disk / Filestore',11:'Cloud SQL / AlloyDB',12:'IAM / Service Account',13:'Secret Manager / Cloud KMS / Certificate Manager',14:'Cloud Monitoring / Cloud Logging / Audit Logs',15:'Backup and DR / Snapshot',16:'別RegionへのReplication / Cloud DNS Failover',17:'Cloud Interconnect / Cloud VPN',18:'Provider mapping',19:'Terraform / Organization Policy',20:'Google Cloud War Room'}},
  azure:{name:'Azure',account:'Subscription / Resource Group',services:{2:'Azure Virtual Machines',3:'Managed Disks（Instanceに付けるDisk）',4:'Virtual Network',5:'Subnet',6:'Route Table / NAT Gateway',7:'Azure Load Balancer / Application Gateway',8:'Network Security Group',9:'Availability Zone',10:'Blob Storage / Managed Disks / Azure Files',11:'Azure SQL / Managed Instance',12:'Microsoft Entra ID / Azure RBAC / Managed Identity',13:'Key Vault / Managed Certificate',14:'Azure Monitor / Activity Log',15:'Azure Backup / Snapshot',16:'Azure Site Recovery / geo冗長Replication',17:'ExpressRoute / VPN Gateway',18:'Provider mapping',19:'Bicep / ARM / Azure Policy',20:'Azure War Room'}}
};

for(const id of ['aws','gcp','azure']){
  const p=PROVIDERS[id];
  HOME[id]={
    title:`${p.name}のserviceは、どこへinstallされる？`,
    summary:`${p.name}の代表serviceは、基本的に自分のPCへ本体をdownloadしません。${p.account}の中へResourceをprovisionし、Console・CLI・IaC等から制御します。`,
    origin:'provisioned',component:`${p.name} Resource`,role:'Provider側に作成するManaged / IaaS部品',
    baseline:`${p.account}はある。ただし対象Resourceはまだ無く、CLIが入っていてもResource本体があるとは限らない。`,
    problem:'共通Conceptを理解しても、Provider上の実際のserviceにしなければ、処理も保存も通信も行われない。',
    capability:'APIでResourceを作成し、Network・IAM・Log・課金・Life cycleを管理できること。',
    choice:`共通Conceptを${p.name}の代表serviceへ翻訳する。Provider間で完全に同一ではない。`,
    before:`${p.account}だけ。処理・保存・通信を行うResourceはまだ無い。`,
    after:'Resource ID・配置・権限・Log・CostがProvider側に生まれる。',
    alternatives:['Web Console','CLI / SDK','Infrastructure as Code','Managed service'],
    evidence:['Resource state','Region / Zone / Network','IAM / Role','Metrics / Logs','Audit / Billing'],
    boundary:`${p.name} CLIは操作するClient Tool。${p.name} service本体と同じものではありません。`
  };
}

function e(component,role,origin,baseline,problem,capability,choice,before,after,alternatives,evidence,boundary){
  return{component,role,origin,baseline,problem,capability,choice,before,after,alternatives,evidence,boundary,title:`なぜ ${component} が必要？`,summary:boundary};
}

const LAB={
  linux:{
    1:e('nginx','HTTP Requestを受けるWeb Server Application','package','Ubuntu/LinuxにはNetwork stack・IP・Route・DNSの機能がある。多くの環境ではDHCP等で外へ通信できるが、HTTPを受け取るProgramはまだ無い。','別PCのBrowserからこのLinuxへアクセスしても、TCP 80で待ち受けるApplicationがいないため接続できない。','HTTPをlistenしてResponseを返し、設定・Access Log・Error Logを残せること。','nginxはLinux必須Softwareではない。インターネットバンキングの入口のように、Web / Port / Process / Service / Logを一つにつなげて学べるので今回選ぶ。','Ubuntu + IP + Default Route + DNS。外へ通信できても、Port 80はLISTENしていない。','nginx package + config + systemd unit + process + TCP 80 listener + access/error log。',['Apache HTTP Server','Application自身のHTTP server','Python http.server（学習用）','Container上のWeb server'],['package状態','systemctl status nginx','ss -lntp / Port 80','curl / Browser response','access.log / error.log'],'nginxは、LinuxをNetworkへつなぐために入れるものではありません。すでにつながっているLinuxへ「Webからの依頼に答える」という役割を1つ足すために入れます。土台であるLinuxというOS、そこへ足すWeb Serverという役割の名、その役割を実際に担う製品であるnginx。この3つは別の層の話です。'),
    2:e('Host Firewall','Hostへ届く通信を許可・拒否するControl','mixed','Network設定が整っていれば通信は成立しうる。Firewallが無いからNetworkにつながらない、という順序ではない。','Serverを公開すると、許可したい相手だけでなく、すべての相手・Portから無制限に到達できてしまう。','Kernelのpacket filtering機能と、ufw / firewalld等の管理Toolで通信Ruleを制御できること。','教材ではDebian系ufw、RHEL系firewalldをProfileで分ける。','通信可能だが、Host側の許可Ruleが整理されていない。','Firewall Rule + default policy + audit可能な変更。',['nftables / iptables','ufw','firewalld','Cloud Security Group（別レイヤー）'],['Rule一覧','default policy','packet counter / log','外部からの接続試験'],'FirewallはNetworkそのものではなく、Network通信を制御する部品です。Host FirewallとCloud Security Groupも別レイヤー。'),
    3:e('Network設定 / Resolver','IP通信と名前解決を成立させるOS機能','mixed','Linux KernelにはTCP/IP stackがある。ただしNIC・IP・Route・DNSの設定が正しいとは限らない。','IP・Route・DNSのどれかが欠けていると、宛先へ届かない、または名前をIPへ解決できない。','NIC・IP Address・Default Route・DNS Resolverを構成し、疎通と名前解決を確認できること。','Ubuntu等ではDHCPにより自動設定されることが多いが、VM/Router/DHCP/DNSが成立していることが前提。','OSを入れただけ。Network機能はあるが、接続先環境は未確認。','IP・Route・Resolver設定が入り、疎通と名前解決を検証できる。',['DHCP','Static IP','NetworkManager','Netplan + systemd-networkd'],['ip addr','ip route','getent / resolvectl','ping / curl'],'「Ubuntuを入れた＝必ずInternet接続済み」ではありません。OSの機能と、環境側の接続設定を分けます。'),
    4:e('OpenSSH Server','Network越しにShellへloginするdaemon','package','IP疎通はできている。ただしRemote Shellを受け付けるProgramはまだ動いていない。','管理者が別端末からLinuxを操作しようとしても、Remote loginを受け付けるdaemonが無ければ入れない。金融の本番環境では、さらに踏み台経由・作業申請・操作Log取得が前提になる。','TCP 22等で待ち受け、認証したうえでShell sessionを作れること。','OpenSSHは代表的な実装。ClientとServerは役割が別。実務では直接SSHではなく、踏み台と特権ID管理（PAM）を通すのが普通。','Network疎通のみ。Remote loginのlistener・認証入口は無い。','sshd service + host key + auth config + login log。',['Console直接操作','OpenSSH','Bastion / Session Manager系','特権ID管理（PAM）経由'],['sshd status','LISTEN Port','auth log','session / key fingerprint'],'SSHはNetworkそのものではなく、Network上でRemote loginを提供するApplication protocolです。'),
    9:e('Package Manager','Softwareの取得・導入・更新を管理するTool','builtin','OSには基本のCommandが入っている。ただし業務で使うApplicationがすべて揃っているわけではない。','手作業でfileを置くと、そのSoftwareの由来・version・依存関係・消し方が誰にも分からなくなる。','Repository metadataを使い、packageのinstall/update/removeと履歴を管理できること。','Debian系はapt/dpkg、RHEL系はdnf/rpm。操作目的は似ても実装は同一ではない。','目的Software・依存file・package記録が無い。','package DBへ記録され、file・依存関係・versionが管理される。',['apt / dpkg','dnf / rpm','vendor installer','container image'],['package list','repository source','installed files','version / update history'],'Package ManagerはApplicationそのものではなく、ApplicationをLinuxへ持ち込む管理レイヤーです。'),
    12:e('cron / systemd timer','時刻・間隔で処理を起動するScheduler機能','configured','Commandは手動で実行できる。ただし毎日・毎時の起動は、人が行う前提のままになっている。','Backupや集計を人が手で起動していると、実行忘れ・実行者による差・記録漏れが起きる。','Command・時刻・実行User・LogをOS側のSchedulerへ登録し、決めた時刻に再現できること。','まずOS標準のcron / systemd timerで仕組みを押さえる。Enterprise Schedulerは別レイヤーとして後で扱う。','手動Commandのみ。忘れ・実行者差・記録漏れがある。','Schedule定義 + 実行履歴 + retry/monitor対象。',['cron','systemd timer','Enterprise Scheduler'],['schedule定義','実行User','last/next run','stdout/stderr / journal'],'Schedulerは処理内容を作るSoftwareではなく、「いつ・誰が・何を起動するか」を制御します。'),
    13:e('Backup Tool / Storage','壊れる前の状態を別の場所へ保持する仕組み','mixed','DataはDisk上にある。ただし誤削除・故障・暗号化・上書きから自動で戻る仕組みは無い。','本番Dataが1本しか無いと、誤削除・故障・暗号化が起きた時点で戻す先が残らない。','copy/snapshot/archiveと保存先・世代・restore手順を組み合わせ、必要な時点へ必要な時間内に戻せること。','Tool選定より先に、別媒体・世代・restore testまで含めて設計するため、この単位で扱う。','正本Dataのみ。壊れれば戻せない。','独立Backup + retention + restore evidence。',['tar / rsync','filesystem snapshot','Cloud backup','DB native backup'],['Backup size/date','保存先の独立性','checksum','restore test'],'Backup Softwareを入れたことではなく、実際に戻せることが価値です。'),
    14:e('Container Runtime','ApplicationをImageから隔離実行するRuntime','package','Linux上でApplicationを直接install・設定する方法は使える。Containerは必須ではない。','HostへApplicationを直接installすると、依存関係と設定がHost全体へ広がり、同じ環境を再現しにくい。','Imageを取得し、namespace/cgroup等でprocessを隔離して実行できること。','Docker / Podman等はContainer Runtime/管理Tool。ContainerはVMではない。','HostへApplicationを直接install。依存・配置がHostへ広がる。','Image + Container process + Network/Volume設定。',['Docker','Podman','containerd / orchestration','直接install'],['image digest','container process','port mapping','volume / log'],'Container RuntimeはLinuxをNetworkへつなぐToolではなく、Applicationの配布・実行方法を変える追加部品です。'),
    15:e('TLS / Certificate Tooling','HTTP通信を暗号化し相手を確認する仕組み','mixed','HTTPのlistenerは動いている。ただし通信内容は平文で、相手が本物かも確認できない。','平文のままでは、Password・個人情報・取引情報を盗聴や改ざんから守れない。','Certificate / Private Key / TLS protocolをWeb Serverへ設定し、暗号化と相手確認を行えること。','OpenSSLは鍵・証明書・接続確認等のTool。TLS service本体はWeb Server等が提供する。','HTTP listenerのみ。平文通信。','HTTPS listener + certificate chain + key + expiry/log。',['OpenSSL','ACME client','Cloud certificate service','Web server built-in TLS'],['certificate subject/SAN','expiry','chain','TLS handshake','HTTPS access log'],'OpenSSLを入れた＝HTTPSになる、ではありません。CertificateをWeb Serverへ正しく設定し、listenerと期限を確認します。'),
    16:e('Monitoring Agent / Exporter','状態を継続収集し異常を通知する部品','package','手動Commandで現在値は見られる。ただし過去の推移・通知・相関は残らない。','継続的な記録が無いと、障害の前後にCPU・Memory・Disk・Latencyがどう動いたかを後から追えない。','Metrics / Log / alertを収集基盤へ送り、時系列のEvidenceとして残せること。','収集方式はAgent / agentless / Cloud nativeと複数ある。先に「何をEvidenceとして残すか」から決める。','人が見た瞬間の状態だけ。','時系列Metrics + Alert + Dashboard + retention。',['node exporter','Cloud agent','SNMP','agentless check'],['agent status','scrape/ingest success','metric freshness','alert history'],'MonitoringはSystemを直すSoftwareではなく、何が起きたかをEvidenceに変えるSoftwareです。'),
    17:e('Ansible','複数Hostへ設定を再現するControl Tool','client','SSHで1台ずつ設定することはできる。ただし同じ作業を人が繰り返す前提になっている。','台数が増えるほど手作業では設定差分や作業漏れが生まれ、同じ状態を再現できない。','Control nodeからSSH等で接続し、Inventory/Playbookに基づいて同じ状態を繰り返し適用できること。','Ansibleは通常Control nodeへ入れる。管理対象へ巨大な常駐serverを入れる考え方とは異なる。','各Hostを手作業で変更。誰が何をしたか散らばる。','Inventory + Playbook + execution result + idempotent change。',['Ansible','Shell script','Puppet/Chef','Cloud IaC'],['inventory','playbook diff','changed/ok/failed','target state'],'Ansibleは対象Applicationではなく、変更を配る側のToolです。「どこへinstallするか」も役割で変わります。'),
    18:e('Hypervisor / Cloud Compute','Linuxが動く仮想Hardware・Provider基盤','external','Linuxは物理ServerでもVMでも動く。ただしGuest OS側からHypervisor/Cloud Control Planeは管理できない。','Guest Linuxの中からは、Hardwareの割り当てやVMの作成・停止・snapshotを制御できない。','HypervisorやCloud ProviderがvCPU/Memory/Disk/NICを払い出し、VMのLife cycleを制御できること。','Guest LinuxとHypervisor/Cloudを別レイヤーとして扱い、どちら側の操作かを区別できるようにする。','物理または既存Guest OSだけを見る。','外側のVM/Cloud resource + Guest Linux。',['KVM/VMware等','Cloud VM','bare metal'],['VM state','host/resource allocation','virtual NIC/disk','Guest OS evidence'],'Guest LinuxへCloudをinstallするのではありません。LinuxはCloud/Hypervisorから提供されたCompute上で動きます。'),
    19:e('Hardening Control','不要な機能・権限・公開範囲を減らす設定群','mixed','OSの初期状態は汎用性を優先した設定。組織のrisk許容度に合わせて絞り込まれてはいない。','初期設定のままでは、使っていないservice・過剰な権限・不要な公開Portが攻撃面として残る。','設定変更・package更新・audit・scannerを組み合わせ、必要最小限の状態を保てること。','単一の「Hardening Software」を入れて終わりにしない。金融では基準はFISC安全対策基準や自社の統一基準で、例外は申請と期限付き承認が要る。','汎用初期設定。','承認済みbaseline + exception + evidence + rollback。',['OS baseline','FISC安全対策基準 / 自社統一基準','CIS等のbenchmark','scanner','EDR / audit tool'],['enabled services','open ports','permissions','patch level','audit evidence'],'Hardeningは製品導入より、必要性・例外・影響・継続確認を含む運用です。')
  },
  sql:{
    1:e('DBMS','Table・SQL・Transactionを実行するData管理Software','deployment','SQL文は書ける。ただし、それを解釈する実行EngineもDataの保存先もまだ無い。','顧客・口座・取引をfileだけで扱うと、検索も同時更新も復旧も自分で作ることになる。','SQLの解析・Data保存・Transaction・同時実行制御・Recovery（取消と復旧）を提供できること。','教材はBrowser内simulationで、実機DBをinstallしない。Db2の文脈を基準に概念を学ぶ。','Application + fileだけ。','DBMS + Database + Table + Log。',['Db2','Oracle','PostgreSQL','SQL Server','Managed DB'],['service/process','connection','catalog/table','transaction log','audit'],'SQLを覚える前に、SQLを実行してDataを守るDBMSが必要です。'),
    17:e('DB Driver / Precompiler','COBOL等のApplicationからDBMSへ接続する境界','runtime','COBOLとDBMSは別Software。同じ環境にあっても、互いを自動では認識しない。','接続の仕組みが無いと、Programの中にSQLを書いてもDBMSへは1件も届かない。','接続境界を作り、結果・SQLCODE・Transactionを扱えること。Embedded SQLではPrecompileでDBRMを出し、BINDでPackage/Planを作って初めて実行できる。','接続方法は製品・言語・Runtimeで異なる。ODBC/JDBCはBINDを伴わないので、Embedded SQLとは工程が違う。','ProgramとDBが別々に存在。','Connection設定 + Precompile出力（修正Source・DBRM） + Compile/Link（Load Module） + BIND（Package/Plan） + SQL response。',['Embedded SQL','ODBC/JDBC','Native client','API経由'],['connection config','SQLCODE（-805はBIND漏れ、-818は世代ずれ）','Package名 / Collection ID / BIND日時','client library version','DB session'],'ApplicationとDBMSの間にも接続Software/Runtime境界があります。'),
    19:e('DB Monitor / Catalog View','DBMS内部状態をEvidenceとして見る機能','mixed','Table上のDataは見える。ただしLock・wait・plan・session・auditの状態までは見えない。','内部状態が見えないと、遅い・止まるという症状の原因を推測でしか語れない。','製品固有のmonitor view/catalog/logから、内部状態をEvidenceとして取り出せること。','代表Evidenceは製品ごとに異なるため、自分が使う製品のmonitor viewから確認する。','症状とSQL結果だけ。','Session/Lock/Plan/Audit等の内部Evidence。',['Db2 monitor','Oracle dynamic performance view','PostgreSQL statistics view','SQL Server DMV'],['session','lock/wait','execution plan','audit/log'],'Monitor機能はDBMSとは別製品の場合も組込みの場合もあるため、製品Contextを確認します。')
  },
  cobol:{
    1:e('COBOL Compiler / Runtime','COBOL Sourceを実行Programへ変える環境','runtime','Source fileは人が読むためのText。CPUはこの形のままでは実行できない。','Sourceを書いただけでは、その業務ルールは1件のDataも処理しない。','Compile/Linkを経て、対象Platform上のRuntimeで実行できること。','教材は構文とData flowのsimulation。実環境ではCompiler/Runtimeが必要。','Source codeのみ。','Executable/Load module + Runtime + execution evidence。',['IBM Enterprise COBOL','GnuCOBOL','Pro*COBOL context'],['compile message','executable/load module','runtime error','RETURN-CODE'],'COBOLを学ぶことと、Compiler製品をinstallすることは別です。'),
    11:e('File Runtime / Dataset','Recordを永続的にREAD/WRITEするI-O境界','external','Working-Storageの値はProgramが終わると消え、次の処理へは残らない。','Program内の変数だけでは、大量Recordを読み込むことも、結果を次処理へ渡すこともできない。件数と金額合計を次処理や他Systemと突合できなければ、1件でもずれた時に止められない。','OS/File systemやz/OS DatasetとRuntimeが、RecordのREAD/WRITEを提供できること。','Sequential FileはCOBOL文法だけで完結せず、実File/Dataset割当が必要。','Program内の一時Data。','File/Dataset + record layout + FILE STATUS。',['Sequential File','VSAM','Database','Message/API'],['record count','FILE STATUS','file allocation','checksum/control total'],'COBOLのFD/READ/WRITEは、外側のFile/Datasetがあって初めて実Dataを扱います。'),
    17:e('JCL / JES','COBOL Batchを起動しDataを割り当てる外部Platform','external','COBOL Programは用意できている。ただし、いつ・どの入力で動かすかは決まっていない。','Program単体では実行条件が決まらず、夜間BatchとしてDatasetと結び付けて回せない。','JCLで実行条件を定義し、JESがJobを受付・実行・出力管理できること。','COBOL側にJCLを組み込むのではなく、別レイヤーの部品として連携させる形を学ぶ。','Program単体。','JOB/STEP/DD + Program + Dataset + Spool。',['JCL/JES','Enterprise Scheduler','Open system scheduler'],['JOB ID','STEP RC','DD allocation','Spool'],'COBOLとJCLは近くで使われても、言語と実行制御という別の役割です。'),
    18:e('Db2 / CICS','Data管理・Online Transactionを担う外部基盤','external','COBOLだけでも計算はできる。ただし共有Data・Online要求・Transaction管理は別の能力。','COBOL単体では、口座DataをDBで共有することも、ATM/窓口のOnline要求を受け付けることもできない。','Db2がDataの永続化を、CICSがOnline要求の受付とUOW（Unit of Work）の同期点管理を担えること。','COMMITの主語は実行環境で変わる。Batchでは COBOL 側の EXEC SQL COMMIT、CICS 配下では EXEC CICS SYNCPOINT。','COBOL Program単体。','COBOL + Db2/CICS session + response code。',['File処理','Db2','Oracle','CICS/API platform'],['SQLCODE','CICS response','commit boundary','session/log'],'COBOL Programの中にはDb2やCICSへの命令が並びますが、処理するのは別のSoftwareで、責任の持ち場も別です。')
  },
  jcl:{
    1:e('JES','Jobの投入を受け付け、順番待ちとSpoolを管理するz/OS subsystem','external','JCLはTextとして書ける。ただし、それを受け付けて実行する主体はまだ無い。','JCLを書いてもJOBを受け付ける仕組みが無ければ、実行もされず結果も残らない。','JobをJESが受け付けて順番待ちへ入れ、Initiator配下のz/OSがStepを実行し、その記録をSpoolから追えること。','教材ではJCL/JESの関係をsimulationする。UbuntuへJCLをinstallする話ではない。','JCL Textのみ。','JOB ID + Step execution + Spool。',['JES + JCL（z/OSのJob実行）','Open system batch','上位のジョブスケジューラ（Control-M / JP1/AJS3 等）'],['JOB ID','JES message','Spool','RC/ABEND'],'JCLは定義、JESは実行基盤。役割を分けます。'),
    7:e('JES Spool','Job message・SYSOUT・結果を保持する出力管理','external','Programは終了する。ただし、その途中で何が起きたかは画面に残らない。','出力が保持されないと、JOB/STEPのmessage・output・RCを後から確認できない。','実行結果をSpoolへ保持し、後から検索して確認できること。','運用でまず見るのはJES Spool。Application Logとは別物なので、先にSpoolの位置づけを押さえる。','画面に出ない実行結果。','JOB単位のSYSOUT/message/RC。',['JES Spool','File log','Central log platform'],['JESMSGLG','JESJCL','JESYSMSG','SYSOUT'],'SpoolはJCLへ追加installするToolではなく、JESが提供する運用機能です。'),
    15:e('Sort / Utility Program','汎用処理を再利用するSystem Utility','external','sortやcopyは毎回COBOLで書くこともできる。ただし定型処理の重複実装が増えていく。','同じSort/Copy/Transformを各Jobで作り直すと、品質も性能もJobごとにばらつく。','DFSORT等のUtility ProgramをJCLのEXECから呼び出し、定型処理を再利用できること。','JCL自身がDataをsortするのではない。JCLはUtilityを起動する。','JCL定義だけ。','Utility Program + SYSIN control + input/output Dataset。',['DFSORT','ICETOOL','COBOL Program','Open system sort'],['Utility RC','SYSOUT','input/output count','control statement'],'JCLは「何を動かすか」を指定し、実処理はProgram/Utilityが行います。'),
    17:e('Enterprise Scheduler','Job間の依存・営業日カレンダー・オンライン開店時刻を全体管理する外側の層','external','JCLは1 JobのStepを表せる。ただし企業全体のJob network・営業日・待合せまでは表せない。','JCL単位の定義しか無いと、数百・数千Jobの依存と営業日を人手で管理することになる。夜間Batchがオンライン開店時刻までに終わらなければ、ATMやインターネットバンキングが開かない。','Job network・calendar・依存・alert・rerunを、JES/JCLの外側で全体管理できること。','製品名より先にScheduler層とJCL層の違いを扱う。層を混ぜないことが判断の前提になる。','個別JCLはあるが、全体依存が人手。','Job network + calendar + dependency + alert。',['Control-M','JP1/AJS3','IBM Z Workload Scheduler','Cloud scheduler'],['predecessor/successor','calendar','release/rerun state','deadline'],'Schedulerを入れる理由はJCL構文を実行するためではなく、業務全体の順序と時刻を管理するためです。')
  }
};

const CLOUD_META={
  1:['System Flow','利用者の要求がどの部品を通るかという全体像','builtin','部品を1つずつ足す前に、Customer→App→Dataという処理の流れを先に決めるためです。','流れが決まっていないと、どの部品がなぜ必要なのかを説明できず、部品選びが場当たりになる。','利用者の要求が、どの部品を、どの順で通るのかを1本の線として書き出せること。',['Customer→App→Dataの経路図','部品ごとの担当と責任範囲','入口と出口の件数','業務が完了したかの確認']],
  2:['Compute','Applicationを実行する場所','provisioned','Programを動かすCPU・Memory・OS環境を、Provider側に用意するためです。','実行する場所が無ければ、Application codeがあっても処理は1件も動かない。','Programを載せるCPU・Memory・OSを必要な性能で確保し、起動・停止・増減できること。',['Instanceの起動状態と台数','CPU/Memory使用率','配置先のZone','起動・停止・作り直しの履歴']],
  3:['Persistent Data','状態をApplicationの外へ預ける置き場所','provisioned','Applicationが停止・再起動しても、残高や取引履歴を残すためです。ここでは「どこに持たせるか」を決め、保存の型はLab10、DBの運用分担はLab11で扱います。','Memory上のDataはProcessやVMが止まると消え、残高や取引履歴を復元できない。','書き込んだDataを、Applicationが止まっても保持し、あとから同じ内容で読み出せること。',['書き込みが確定したか','どこが正本のDataか','容量と伸び方','再起動後に同じ値が読めるか']],
  4:['Virtual Network','Cloud内の論理的な通信範囲','provisioned','App・DBを自分たちの通信範囲として分離し、経路と許可を管理するためです。','通信範囲が定義されていないと、どこまでが自社の範囲で、誰と通信してよいかを制御できない。','自分たちのResourceだけが属する通信範囲を作り、出入りできる相手を決められること。',['Networkの範囲とアドレス帯','所属しているResource一覧','対向との接続状態','範囲をまたぐ通信の可否']],
  5:['Subnet','公開範囲と内部範囲を分ける区画','provisioned','外部へ公開する入口と、隠しておきたいDBを別々の区画へ置き分けるためです。','入口とDBが同じ区画にあると、公開したい部品と隠したい部品を同じ条件で扱うことになる。','公開する区画と内部だけの区画を分け、どちらにResourceを置くか選べること。',['区画ごとの公開/非公開','各Resourceがどの区画にいるか','外部から到達できるIPの有無','区画とZoneの対応']],
  6:['Route / NAT','通信の向きと経路を決める部品','provisioned','外へ出る通信と、外から入る通信を別々の経路として設計するためです。','経路を決めないと、内部Serverから外部へSoftware更新を取りに行けない。かといって外向きの経路と外からの入口を取り違えると、公開するつもりのないServerが外から届く場所に出てしまう。','内部から外部への経路を用意し、外部から内部への到達可否は別に決められること。',['経路表の内容','外向き通信の出口','外から到達できる入口の有無','通信できた/できない実測']],
  7:['Load Balancer','一つの入口から複数のAppへ振り分ける部品','provisioned','利用者にServerを選ばせず、健全な宛先だけへRequestを届けるためです。','入口が1台のServerに固定されていると、その1台が止まった時点でServiceも止まり、増設もできない。','1つの宛先で受けたRequestを応答できるApp群へ振り分け、落ちた宛先を自動で外せること。',['正常と判定された宛先の数','宛先ごとの振り分け実績','health checkの失敗履歴','切り離しにかかった時間']],
  8:['Firewall Control','誰からどのPortへ通信できるかを決めるControl','provisioned','Networkを作った後に、許可する通信だけを明示的に決めるためです。','Networkを作っただけでは許可条件が決まらず、必要な通信と不要な通信を区別できない。','送信元・宛先・Portの組み合わせで、通してよい通信だけを許可できること。',['許可Ruleの一覧','拒否されたPacketの記録','使われていないRule','外部からの接続試験']],
  9:['Failure Domain','一緒に壊れる範囲を分けて配置する仕組み','placement','1か所の障害で全Appが同時に止まらないよう、配置を分けるためです。Providerの区分は、小さい順に Zone（電源や建物の単位）＜ Region（地理的に離れた単位）で、Zoneを分ければ建物レベル、Regionを分ければ地域レベルの障害に備えられます。','同じ電源・同じ建物（＝同じZone）へ全Appを置くと、その1か所が壊れただけでService全体が止まる。Zoneを分けても片側に1台ずつでは、片系停止時に残る処理能力は半分になる。','一緒に停止する範囲を把握し、同じApp群を別々のZoneへ分けたうえで、片側が止まっても業務が回る台数を各Zoneへ置けること。',['Zoneごとの稼働台数','片側停止時に残る処理能力','Subnet/DB/LBのZone配置','Zone障害を想定した切替試験']],
  10:['Storage Service','Object/Block/Fileを用途で使い分ける保存部品','provisioned','Lab03で決めた「外へ預ける」置き場所にも型があり、用途ごとに読み書き方法・共有範囲・耐久性が違うためです。','保存先を1種類に決め打ちすると、共有できない・費用が合わない・性能が足りない、のどれかが起きる。','Object・Block・Fileという読み書きの型を選び、用途に合う耐久性と共有範囲を指定できること。',['Object/Block/Fileのどれか','耐久性と冗長化の設定','同時に読み書きできる範囲','保存容量と費用の推移']],
  11:['Managed Database','DB基盤の運用をProviderと分担するData管理service','provisioned','Patch・HA・Backupといった基盤運用の一部をProviderへ任せ、Data設計とSQLに集中するためです。','自前でDB Serverを運用すると、Patch・冗長化・Backupまで自分たちの運用範囲として抱えることになる。','DBのPatch・冗長化・Backupを任せたうえで、Schema・SQL・権限は自分で設計できること。',['フェイルオーバーの履歴と接続断時間','メンテナンス時間帯の設定','自動更新の対象と範囲','Backup保持期間とPITRの範囲']],
  12:['IAM','誰が何を操作できるかを定義するControl Plane','provisioned','人とApplicationへ、必要な操作だけを許可するためです。','全員と全Applicationが同じ強い権限を持つと、誤操作や漏えいの影響が全Resourceへ広がる。','人とApplicationごとに、どのResourceへどの操作を許すかを定義し、あとから取り消せること。',['誰にどの権限が付いているか','使われていない権限','権限を付与した申請と承認の記録','操作の実行履歴']],
  13:['Secret / Key / Certificate','秘密情報を保管・利用・更新するservice','provisioned','PasswordやKeyをCodeから切り離し、更新と利用履歴を管理するためです。','CodeへPasswordやKeyを直書きすると、共有・更新・失効のたびにCodeそのものを直すことになる。','PasswordやKeyをCodeの外へ保管し、利用の可否・更新・失効を管理できること。',['Secretの保管場所と参照方法','Keyの有効期限と更新履歴','Certificateの期限','Codeへの直書きが無いこと']],
  14:['Observability','Metrics/Logs/Trace/Auditを集めるservice','provisioned','障害時に何が起きたかを、推測ではなくEvidenceで確認するためです。','記録が残っていないと、障害の原因も影響範囲も、担当者の記憶と推測でしか語れない。','Metrics・Log・Traceを継続して集め、障害の前後を時刻順に突き合わせられること。',['Metricsが欠測なく届いているか','障害前後のLogが時刻順に追えるか','監査証跡の保存期間','Alertの発報と対応の記録']],
  15:['Backup / Restore','必要な時点のDataへ戻す仕組み','provisioned','誤削除や破損が起きても、必要な時点のDataへ戻せるようにするためです。','本番Dataが1本しか無い状態では、誤削除・破損・暗号化が起きた時点で戻す手段が残らない。','正本とは別の場所へ世代を残し、指定した時点の状態へ実際に戻せること。',['Backupの取得日時と世代','保存先が本番と別に分かれているか','リストア試験の実施記録','目標時間内に戻せたかの実測']],
  16:['Multi-Region DR','Region規模の障害時に別Regionへ業務を切り替える構成','provisioned','1つのRegionが使えなくなっても、業務を継続できるようにするためです。Lab09のZone分けが建物レベルの備えなのに対し、こちらは地域レベルの備えです。','Zoneを分ける冗長化はRegion内が前提で、Region全体が停止する障害では切り替え先が残らない。','別Regionへ復旧先を用意し、RTO（何時間で復旧するか）とRPO（どこまでのDataを守るか）を決めたうえで、実際に切り替えられること。',['RTO/RPOの目標値','複製の遅れ（同期か非同期か）','切替手順と判断権限','切替訓練の実施記録']],
  17:['Hybrid Connectivity','Cloudと社内/Core systemをつなぐ経路','provisioned','Cloud上のAppと社内のCore systemを、1つの業務の流れとしてつなぐためです。','Cloud内だけが正常でも、社内のCore systemへ届かなければ業務は完結しない。','Cloudと社内Networkの間に、必要な帯域と経路で通信できる専用の道を作れること。',['BGP peerの状態','広報・受信している経路','2回線の物理経路が分かれているか','遅延・帯域の実測と切替試験']],
  18:['Provider Mapping','製品名と共通Conceptの対応関係','builtin','製品名が変わっても、同じ役割の部品として理解し直せるようにするためです。','製品名だけを覚えると、Providerが変わった途端に同じ役割の部品だと気づけない。','製品名を見たときに、それが担う役割へ戻して、他Providerの同じ役割と並べられること。',['共通Conceptと製品名の対応表','役割が同じでも違う点','Provider間で移せない前提','用語の言い換え履歴']],
  19:['IaC / Governance Tool','変更をCode・Review・Auditへ載せる仕組み','client','構成変更を、差分・承認・履歴が残る形で行うためです。','Consoleの手作業だけでは、誰がいつ何を変えたのかを追えず、元へ戻すことも難しい。','構成をCodeとして書き、差分の確認・承認・適用・巻き戻しを記録付きで行えること。',['Codeの差分','適用前のplanと適用結果','誰がいつ承認したか','巻き戻せる直前の版']],
  20:['War Room','複数部品のEvidenceを突き合わせて切り分ける手順','builtin','個々の部品ではなく、System全体をEvidenceで切り分ける練習をするためです。','部品ごとの知識があっても、障害時にどの部品からどの順で確認するかが決まらない。','複数のEvidenceを突き合わせ、どこまで壊れているか・何から確認するかを順に決められること。',['どの部品まで壊れているか','Evidenceの取得時刻の並び','業務影響の件数と金額','復旧したと判断した根拠']]
};

function conceptEntry(common,role,origin,why,choice,problem,capability,evidence){
  if(origin==='builtin'){
    return{
      title:`なぜ ${common} を学ぶ？`,summary:why,component:common,role,origin,
      baseline:'System部品そのものは既にある。ただし、役割・経路・確認順序はまだ整理されていない。',
      problem,
      capability,
      choice,
      before:'部品名と症状がばらばらに見え、どこから確認すればよいか決められない。',
      after:`${common}という共通Conceptで全体を整理でき、関連するEvidenceへ進める。`,
      alternatives:['製品名だけ暗記する','共通Conceptへ戻して比較する','System図で位置を確認する'],
      evidence,
      boundary:'このLabは新しいResourceをdownload/provisionするLabではなく、既存部品を構造化して判断するLabです。'
    };
  }
  if(origin==='placement'){
    return{
      title:`なぜ ${common} が必要？`,summary:why,component:common,role,origin,
      baseline:'Resourceは作れる。ただし、それをどこへ置くかは指定しなければ寄ってしまう。',
      problem,
      capability,
      choice,
      before:'置き場所を意識せずResourceを作っており、どこまでが一緒に止まるか説明できない。',
      after:`${common}を分けて配置し、片側が止まったときに残る処理能力を数えられる。`,
      alternatives:['1か所へまとめる','複数のZoneへ分ける','複数のRegionへ分ける','Managed serviceの冗長化に任せる'],
      evidence,
      boundary:`${common}はProviderが用意した区分で、利用者が作るものではありません。Resourceをどの区分へ置くかを選びます。`
    };
  }
  if(origin==='client'){
    return{
      title:`なぜ ${common} が必要？`,summary:why,component:common,role,origin,
      baseline:'Cloud Resourceは既にある。ただし変更はConsoleの手作業に依存し、差分・Review・Rollbackを追う仕組みが無い。',
      problem,
      capability,
      choice,
      before:'変更は手作業。Resource本体はProvider側にあり、変更の定義と記録は各担当者へ散らばっている。',
      after:'Code/Template + Review + execution plan + Provider Resource + Audit。',
      alternatives:['Web Console','Provider CLI/SDK','Terraform/Bicep/CloudFormation等','Policy/Governance service'],
      evidence,
      boundary:'IaC/CLI Toolを管理端末へinstallすることと、Cloud Resource本体をProvider側へprovisionすることは別です。'
    };
  }
  return{
    title:`なぜ ${common} が必要？`,summary:why,component:common,role,origin,
    baseline:'Cloud契約とAccountはある。ただし、この役割を担うResourceはまだ1つも作られていない。',
    problem,
    capability,
    choice,
    before:'この役割を担う部品がSystem図に無い。必要になっても、その場の手作業でしのぐことになる。',
    after:`${common}という役割がSystemへ加わり、状態・権限・Log・Costを管理できる。`,
    alternatives:['自社設備で実装','Cloud IaaSで構成','Managed serviceを利用','複数Providerの代表実装'],
    evidence,
    boundary:'Cloud service本体はPCへdownloadするのではなく、Provider側へprovisionします。Console/CLIはそのための操作手段です。'
  };
}

function cloudEntry(module,lab){
  const m=CLOUD_META[lab];if(!m)return null;
  const [common,role,origin,why,problem,capability,evidence]=m;
  if(module==='cloud')return conceptEntry(common,role,origin,why,'まず製品名を出さずCommon Conceptとして理解し、そのあとAWS/GCP/Azure/OCIの名前へ翻訳する。',problem,capability,evidence);
  const p=PROVIDERS[module];if(!p)return null;
  const service=p.services[lab]||common;
  if(origin==='builtin'){
    return conceptEntry(service,role,origin,why,`${p.name}の名前を覚えた後も、共通Conceptへ戻して他Providerと比較できるようにする。`,problem,capability,evidence);
  }
  if(origin==='placement'){
    return conceptEntry(service,role,origin,why,`${p.name}では${service}という名前の区分になる。Resourceをどの${service}へ置くかで、一緒に止まる範囲が決まる。`,problem,capability,evidence);
  }
  if(origin==='client'){
    return conceptEntry(service,role,origin,why,`${service}等を管理側のToolとして使い、${p.name}の構成変更をCode・Review・Auditへ載せる。`,problem,capability,evidence);
  }
  return{
    title:`なぜ ${service} が必要？`,
    summary:service===common
      ?`Cloud Fundamentalsで学んだ「${common}」は、${p.name}でも同じ名前で呼ばれます。`
      :`Cloud Fundamentalsで学んだ「${common}」を、${p.name}で実現する代表serviceです。`,
    component:service,role,origin,
    baseline:`${p.account}はある。ただし、この役割を担うResourceはまだprovisionされていない。`,
    problem,
    capability,
    choice:service===common
      ?`${p.name}では共通Conceptと同じ名前を使う。名前が同じでも、他Providerの同種serviceと中身が完全に同じとは限らない。`
      :`${service}を代表例として使う。他Providerの同種serviceと完全に同じではない。`,
    before:'Console/CLIは使えても、この役割を担うResource本体はまだ無い。',
    after:`${service}のResource + Resource ID + 配置先のRegion/Zone/Network + 操作権限 + Log/Cost。`,
    alternatives:['Consoleでprovision','CLI/SDKでprovision','IaCでprovision','別service/別Provider'],
    evidence,
    boundary:`${p.name} CLIをinstallすることと、${service}を作ることは別です。CLIは操作用Tool、Resource本体はProvider側です。`
  };
}

function moduleId(){const parts=location.pathname.split('/').filter(Boolean);return MODULE_IDS.find(x=>parts.includes(x))||null}
function labId(module){
  if(module==='linux'){const m=location.pathname.match(/lab(\d{1,2})/i);return m?Number(m[1]):0}
  const m=location.hash.match(/^#lab(\d{1,2})/i);return m?Number(m[1]):0
}
function entryFor(module,lab){
  if(!lab)return HOME[module]||null;
  if(['cloud','aws','gcp','azure'].includes(module))return cloudEntry(module,lab);
  return LAB[module]?.[lab]||null;
}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function list(items){return (items||[]).map(x=>`<li>${esc(x)}</li>`).join('')}
function originBadge(origin){const o=ORIGINS[origin]||ORIGINS.mixed;return `<span class="cr-badge"><strong>由来</strong> ${esc(o[0])}</span>`}
function expandedByDefault(module,lab){
  if(!lab)return true;
  if(module==='linux')return [1,2,3,4,9].includes(lab);
  if(['sql','cobol','jcl'].includes(module))return lab===1;
  if(module==='cloud')return lab<=7;
  if(['aws','gcp','azure'].includes(module))return [1,2,4,11,19].includes(lab);
  return false;
}
// BEFORE/AFTERの多くは「A + B + C。」という部品の列挙で、日本語の文ではない。
// 文のふりをさせず、部品は部品として並べる。
function stateHtml(cls,kicker,label,text){
  const t=String(text==null?'':text),cut=t.indexOf('。');
  const head=cut>=0?t.slice(0,cut):t,note=cut>=0?t.slice(cut+1).trim():'';
  const items=head.split(' + ').map(function(v){return v.trim()}).filter(Boolean);
  const body=items.length>1
    ? '<ul class="cr-parts">'+items.map(function(v){return '<li>'+esc(v)+'</li>'}).join('')+'</ul>'+(note?'<span>'+esc(note)+'</span>':'')
    : '<span>'+esc(t)+'</span>';
  return '<div class="cr-state '+cls+'"><small>'+esc(kicker)+'</small><b>'+esc(label)+'</b>'+body+'</div>';
}
function rationaleBody(x){
  const o=ORIGINS[x.origin]||ORIGINS.mixed;
  return `<div class="cr-flow">
      <div class="cr-step"><small>01 もともと何がある？</small><b>Before the component</b><span>${esc(x.baseline)}</span></div>
      <div class="cr-step"><small>02 無いと何に困る？</small><b>Problem</b><span>${esc(x.problem)}</span></div>
      <div class="cr-step"><small>03 どんな機能が必要？</small><b>Capability</b><span>${esc(x.capability)}</span></div>
      <div class="cr-step"><small>04 なぜこれを選ぶ？</small><b>${esc(x.component)}</b><span>${esc(x.choice)}</span></div>
    </div>
    <div class="cr-before-after">${stateHtml('before','BEFORE','追加前',x.before)}<div class="cr-arrow">→</div>${stateHtml('after','AFTER','追加・設定後',x.after)}</div>
    <div class="cr-observe">${(x.evidence||[]).map(v=>`<span>👀 ${esc(v)}</span>`).join('')}</div>
    <details class="cr-details"><summary>選択肢と「どこから来るか」を見る</summary><div class="cr-details-grid"><div><b>他の選択肢</b><ul>${list(x.alternatives)}</ul></div><div><b>${esc(o[0])}</b><p>${esc(o[1])}</p><div class="cr-sim-note">このサイトはBrowser内Learning Simulatorです。実機へSoftware/Cloud Resourceを自動導入しません。本番では対象環境・version・権限・承認・Runbookを確認します。</div></div></div></details>`;
}

function genericHtml(module,lab,x){
  const expanded=expandedByDefault(module,lab),body=rationaleBody(x);
  return `<section class="cr-card ${expanded?'':'cr-card-compact'}" id="componentRationalePanel" data-cr-key="${esc(module+':'+lab)}">
    <div class="cr-head"><div><div class="cr-kicker">NEED BEFORE TOOL / COMPONENT ORIGIN</div><h2>${esc(x.title)}</h2>${x.summary&&x.summary!==x.boundary?`<p class="cr-summary">${esc(x.summary)}</p>`:''}</div><div class="cr-badges">${originBadge(x.origin)}<span class="cr-badge"><strong>役割</strong> ${esc(x.role)}</span></div></div>
    <div class="cr-boundary">${esc(x.boundary)}</div>
    ${expanded?body:`<details class="cr-details cr-primary-details"><summary>必要になった理由を4ステップで見る</summary>${body}</details>`}
  </section>`;
}

const LINUX_STAGES=[
  {map:'🐧 Ubuntu / Linux\n├ Kernel・Process・File\n├ TCP/IP stack\n└ Network設定は環境次第\n\nnginx: まだ無い',console:'STEP 1 / OSを入れた\n\n✅ Linux OSは起動\n✅ Network機能はOSにある\n⚠ NIC・DHCP・Route・DNSは環境次第\n❌ HTTPを待ち受けるnginxはまだ無い'},
  {map:'📱 Browser       🐧 Ubuntu\n                  ├ IP: 192.168.1.20\nInternet/LAN  →   ├ default route\n                  └ DNS resolver\n\n外へ通信: できる\nPort 80: LISTENなし',console:'STEP 2 / Networkを確認\n\n$ ip addr      → IPあり\n$ ip route     → default routeあり\n$ getent hosts → 名前解決OK\n\nここまでnginxは不要です。'},
  {map:'📱 Browser\n   │ HTTP :80\n   ▼\n🐧 Ubuntu\n   └ ❌ 受け取るProcessなし\n\nResult: connection refused / timeout',console:'STEP 3 / BrowserからこのLinuxへアクセス\n\nNetwork経路はあっても、Port 80で待つProgramがいません。\n\n「Networkにつながる」\n≠「Web Serverとして応答できる」'},
  {map:'📱 Browser\n   │ HTTP :80\n   ▼\n🚪 TCP 80 LISTEN\n   ▼\n⚙ nginx process\n   ▼\n📄 Web response + access/error log',console:'STEP 4 / nginxを追加\n\nPackage → config → service → process → port → response → log\n\nnginxはLinux必須ではなく、Web Serverという役割を追加するApplicationです。'}
];

function linuxHomeHtml(){
  return `<section class="cr-card cr-linux-intro" id="componentRationalePanel" data-cr-key="linux:0">
    <div class="cr-head"><div><div class="cr-kicker">LEARNING STEP -1 / BEFORE NGINX</div><h2>Ubuntuを入れた直後、どこまでできる？</h2><p class="cr-summary">Ubuntu/Linuxを入れたからnginxが必要になるわけではありません。まず、OS・Network接続・Server役割・Applicationを分けます。</p></div><div class="cr-badges"><span class="cr-badge"><strong>本質</strong> OS ≠ Server role ≠ Product</span></div></div>
    <div class="cr-boundary">Ubuntuを入れただけではWeb Serverにはなりません。一方、nginxが無くても、NIC・DHCP・Route・DNS等が成立すればNetwork通信はできます。</div>
    <div class="cr-linux-question"><div class="yes"><b>✅ OSにある土台</b><span>Kernel、Process、File、TCP/IP stack、Networkを設定・確認する機能。</span></div><div class="no"><b>❌ 自動では増えない役割</b><span>Web Server、Database、業務Application。必要になった時にSoftwareやServiceを追加します。</span></div></div>
    <div class="cr-linux-controls">${LINUX_STAGES.map((s,i)=>`<button data-cr-linux-step="${i}" class="${i===0?'active':''}">${i+1}. ${['OSを入れる','Network確認','Browserで試す','nginxを足す'][i]}</button>`).join('')}</div>
    <div class="cr-linux-stage"><div class="cr-system-map" id="crLinuxMap" aria-live="polite">${esc(LINUX_STAGES[0].map)}</div><div class="cr-console" id="crLinuxConsole" aria-live="polite">${esc(LINUX_STAGES[0].console)}</div></div>
    <div class="cr-keyline"><div><b>Linux / Ubuntu</b><span>OSという土台</span></div><div><b>Web Server</b><span>System上の役割</span></div><div><b>nginx</b><span>その役割を実現するApplicationの1つ</span></div></div>
    <details class="cr-details"><summary>Softwareは全部「downloadして入れるもの」？</summary><div class="cr-origin-legend"><div><b>OSに含まれる</b><span>Kernel / Process / TCP-IP stack等</span></div><div><b>設定して使う</b><span>Network / Firewall / Scheduler等</span></div><div><b>Packageを追加</b><span>nginx / Ansible / Container Runtime等</span></div><div><b>別Platformで提供</b><span>JES / CICS / Enterprise Scheduler等</span></div><div><b>Cloudにprovision</b><span>EC2 / VPC / Managed DB等</span></div><div><b>操作端末へTool</b><span>CLI / SDK / IaC / Control Tool等</span></div></div></details>
  </section>`;
}

function findAnchor(module,lab){
  if(!lab){
    if(module==='linux')return document.querySelector('.fit-linux-zero')||document.querySelector('.hero');
    return document.querySelector('.card.hero,.hero,.vlHomeGuide,.stage0-entry');
  }
  if(module==='linux')return document.querySelector('.intro')||document.querySelector('main .card')||document.querySelector('main');
  return document.querySelector('.vlLabHero,.labHero,.lab-hero,.card.labHero,.card.lab-hero')||document.querySelector('#app > section');
}

function bindLinux(){
  document.querySelectorAll('[data-cr-linux-step]').forEach(b=>b.addEventListener('click',()=>{
    const i=Number(b.dataset.crLinuxStep),s=LINUX_STAGES[i];if(!s)return;
    document.querySelectorAll('[data-cr-linux-step]').forEach(x=>x.classList.toggle('active',x===b));
    const map=document.getElementById('crLinuxMap'),con=document.getElementById('crLinuxConsole');
    if(map)map.textContent=s.map;if(con)con.textContent=s.console;
  }));
}

let scheduled=false;
function render(){
  scheduled=false;
  const module=moduleId();if(!module)return;
  const lab=labId(module),key=module+':'+lab;
  const existing=document.getElementById('componentRationalePanel');
  if(existing?.dataset.crKey===key)return;
  if(existing)existing.remove();
  const anchor=findAnchor(module,lab);if(!anchor)return;
  const x=entryFor(module,lab);if(!x&&!(module==='linux'&&!lab))return;
  const wrap=document.createElement('div');
  wrap.innerHTML=module==='linux'&&!lab?linuxHomeHtml():genericHtml(module,lab,x);
  const panel=wrap.firstElementChild;if(!panel)return;
  anchor.insertAdjacentElement('afterend',panel);
  if(module==='linux'&&!lab)bindLinux();
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>requestAnimationFrame(render))}

window.addEventListener('hashchange',schedule);
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();

window.FIT_COMPONENT_RATIONALE={ORIGINS,HOME,LAB,CLOUD_META,PROVIDERS,entryFor};
})();
