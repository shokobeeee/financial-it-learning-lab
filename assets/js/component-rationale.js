(function(){
'use strict';

const MODULE_IDS=['linux','sql','cobol','jcl','cloud','aws','gcp','azure'];
const ORIGINS={
  builtin:['OS / Platformに含まれる','最初から使える土台。ただし環境設定や起動状態は別に確認する。'],
  configured:['既存機能を設定・有効化','新しい製品を入れるより、すでにある機能の許可・設定・起動を行う。'],
  package:['Packageとして追加','Repository等からSoftwareを導入し、file・設定・service・log等を増やす。'],
  runtime:['Compiler / Runtimeを追加','Source codeを実行可能な形へ変換・実行するための環境を用意する。'],
  mixed:['OS機能 + 管理Tool','土台の機能はOS側にあり、操作しやすくするToolやdaemonを追加・設定する。'],
  provisioned:['Cloud上にResourceを作成','PCへ本体をdownloadするのではなく、Provider APIでResourceを払い出す。CLI/SDKは操作用Tool。'],
  external:['別Platformで提供','いま見ているOSへinstallするのではなく、Mainframe・Scheduler・Managed service等の別基盤が提供する。'],
  client:['操作する側へToolを追加','対象Serverではなく、管理端末・Control nodeへCLI/Agent/自動化Toolを置く。']
};

const HOME={
  sql:{
    title:'SQLを書く前に、なぜDBMSが必要？',
    summary:'CSVや通常fileにもデータは保存できます。ただし、同時利用・安全な更新・検索・Lock・監査をApplicationだけで実装するのは重い。そこでDBMSという管理Softwareを使います。',
    origin:'mixed',component:'DBMS',role:'Dataを安全に管理するSoftware',
    baseline:'Fileへ値を書けば保存自体はできる。SQLという言語だけでは、保存・同時更新・復旧は動かない。',
    problem:'多数の利用者が同時に残高を読み書きし、途中失敗や競合があっても整合性を守りたい。',
    capability:'Table・Query・Transaction・Lock・Recovery・Auditをまとめて管理する能力。',
    choice:'教材ではDb2寄りを正本にし、Oracle / PostgreSQL / SQL Serverへ概念翻訳する。',
    before:'Application + file。検索・同時更新・復旧ルールをApplication側が抱える。',
    after:'DBMS service + Table + Transaction log + Lock + Audit。',
    alternatives:['IBM Db2','Oracle Database','PostgreSQL','Microsoft SQL Server','CloudのManaged DB'],
    evidence:['DBMS process/service','接続先・Port','Table/Catalog','Transaction/Lock','Audit/Log'],
    boundary:'SQLは言語、Databaseはデータの集合・仕組み、DBMSはそれを管理するSoftware。3つは同じではありません。'
  },
  cobol:{
    title:'COBOLのSourceを書いたら、そのまま動く？',
    summary:'COBOLは業務処理を書く言語です。Source fileをCPUが直接実行するわけではないので、実環境ではCompilerとRuntime、さらにFile・DB・CICS等の周辺基盤が必要です。',
    origin:'runtime',component:'COBOL Compiler / Runtime',role:'Sourceを実行可能にする環境',
    baseline:'COBOL Sourceは人が読める業務ルール。まだ実行Programではない。',
    problem:'READ・IF・計算・WRITEとして書いた処理を、対象Platform上で実行したい。',
    capability:'Compile / Link / Runtime / 外部I-Oを通じ、SourceをProgramとして動かす。',
    choice:'IBM Enterprise COBOL、GnuCOBOL、Pro*COBOL等は実行文脈が異なる。教材では概念を先に学ぶ。',
    before:'Source codeだけ。CPU・OSはCOBOL文を直接実行しない。',
    after:'Compiler output + Runtime + File/DB/CICS接続。',
    alternatives:['IBM Enterprise COBOL','GnuCOBOL','Oracle Pro*COBOL context'],
    evidence:['Compiler message','Load module / executable','RETURN-CODE','FILE STATUS','SQLCODE / CICS response'],
    boundary:'COBOL ≠ Mainframe ≠ JCL ≠ Db2 ≠ CICS。言語・実行環境・外部基盤を分けます。'
  },
  jcl:{
    title:'JCLを書けば、どのPCでもBatchが動く？',
    summary:'JCLは「何を、どの順番で、どのDataを使って動かすか」をz/OS側へ伝えるJob定義です。JCL自身が実行Engineではなく、JES・Program・Dataset等のPlatformが必要です。',
    origin:'external',component:'z/OS / JES / Enterprise Scheduler',role:'Jobを受付・実行・順序制御するPlatform',
    baseline:'JCLはTextとして書けるが、それだけではJOBを受付・実行する仕組みがない。',
    problem:'多数のProgramを毎日、依存関係・入力・出力・戻り値に従って正確に動かしたい。',
    capability:'Job受付、Step実行、Data割当、Spool、依存・営業日・再実行を管理する。',
    choice:'JESはz/OS内、Control-M / JP1 / IBM Z Workload Scheduler等は外側のScheduler層。',
    before:'JCL Text + Program名。実行主体とData割当がない。',
    after:'Scheduler → JES → JCL → Program/Utility → Dataset/DB → Spool。',
    alternatives:['JES + JCL','Control-M','JP1/AJS3','IBM Z Workload Scheduler'],
    evidence:['JOB ID','JES Spool','STEP RC / ABEND','Dataset状態','Scheduler依存'],
    boundary:'JCLをUbuntuへinstallする、という理解ではありません。JCLはz/OS Jobの定義で、JES等がそれを扱います。'
  },
  cloud:{
    title:'Cloudの部品は、PCへdownloadして使うの？',
    summary:'多くのCloud service本体はPCへinstallしません。Console・API・CLIからProviderへ依頼し、Network・VM・DB等のResourceをCloud側に作ります。',
    origin:'provisioned',component:'Cloud Resource',role:'Providerの設備上に払い出すIT部品',
    baseline:'Cloud account/project/subscriptionはあるが、まだVM・Network・DB等のResourceは存在しない。',
    problem:'自社でServer・Network・DB基盤を購入・設置せず、必要な構成を用意したい。',
    capability:'Provider APIでCompute・Network・Data・Security等を作成・設定・廃止する。',
    choice:'Cloud Fundamentalsでは共通Conceptを先に理解し、その後AWS/GCP/Azure名へ翻訳する。',
    before:'操作画面/契約だけ。実際に処理するResourceはまだ無い。',
    after:'Resource ID・Network配置・IAM・Log・課金対象がCloud側に生まれる。',
    alternatives:['Consoleから作成','CLI/SDKから作成','IaCから作成','Managed serviceを利用'],
    evidence:['Resource ID / state','Network placement','IAM policy','Metrics / Logs','Billing / Audit'],
    boundary:'CLIをdownloadすることと、Cloud service本体を作ることは別です。CLIは操作用、Resource本体はProvider側にあります。'
  },
  aws:null,gcp:null,azure:null
};

const PROVIDERS={
  aws:{name:'AWS',account:'AWS Account',services:{2:'Amazon EC2',3:'Amazon EBS / S3 / RDS等',4:'Amazon VPC',5:'Subnet',6:'Route Table / IGW / NAT Gateway',7:'Elastic Load Balancing',8:'Security Group / NACL',9:'Availability Zone',10:'S3 / EBS / EFS',11:'Amazon RDS / Aurora',12:'AWS IAM / IAM Role',13:'Secrets Manager / KMS / ACM',14:'CloudWatch / CloudTrail',15:'AWS Backup / Snapshot',16:'Multi-Region構成',17:'Direct Connect / Site-to-Site VPN',18:'Provider mapping',19:'CloudFormation / Organizations',20:'AWS War Room'}},
  gcp:{name:'Google Cloud',account:'Project',services:{2:'Compute Engine',3:'Persistent Disk / Cloud Storage / Cloud SQL等',4:'VPC',5:'Subnet',6:'Routes / Cloud NAT',7:'Cloud Load Balancing',8:'VPC Firewall',9:'Zone',10:'Cloud Storage / Persistent Disk / Filestore',11:'Cloud SQL / AlloyDB',12:'IAM / Service Account',13:'Secret Manager / Cloud KMS / Certificate Manager',14:'Cloud Monitoring / Cloud Logging / Audit Logs',15:'Backup and DR / Snapshot',16:'Multi-Region構成',17:'Cloud Interconnect / Cloud VPN',18:'Provider mapping',19:'Terraform / Organization Policy',20:'Google Cloud War Room'}},
  azure:{name:'Azure',account:'Subscription / Resource Group',services:{2:'Azure Virtual Machines',3:'Managed Disks / Blob / Azure SQL等',4:'Virtual Network',5:'Subnet',6:'Route Table / NAT Gateway',7:'Azure Load Balancer / Application Gateway',8:'Network Security Group',9:'Availability Zone',10:'Blob Storage / Managed Disks / Azure Files',11:'Azure SQL / Managed Instance',12:'Microsoft Entra ID / Azure RBAC / Managed Identity',13:'Key Vault / Managed Certificate',14:'Azure Monitor / Activity Log',15:'Azure Backup / Snapshot',16:'Paired Region / DR構成',17:'ExpressRoute / VPN Gateway',18:'Provider mapping',19:'Bicep / ARM / Azure Policy',20:'Azure War Room'}}
};

for(const id of ['aws','gcp','azure']){
  const p=PROVIDERS[id];
  HOME[id]={
    title:`${p.name}のserviceは、どこへinstallされる？`,
    summary:`${p.name}の代表serviceは、基本的に自分のPCへ本体をdownloadしません。${p.account}の中へResourceをprovisionし、Console・CLI・IaC等から制御します。`,
    origin:'provisioned',component:`${p.name} Resource`,role:'Provider側に作成するManaged / IaaS部品',
    baseline:`${p.account}はあるが、対象Resourceはまだ無い。CLIが入っていてもResource本体があるとは限らない。`,
    problem:'Cloud Fundamentalsで学んだ共通部品を、実際のProvider serviceとして用意したい。',
    capability:'APIでResourceを作成し、Network・IAM・Log・課金・Life cycleを管理する。',
    choice:`共通Conceptを${p.name}の代表serviceへ翻訳する。Provider間は完全に同一ではない。`,
    before:'Account / Project / Subscriptionだけ。処理・保存・通信を行うResourceはまだ無い。',
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
    1:e('nginx','HTTP Requestを受けるWeb Server Application','package','Ubuntu/LinuxにはNetwork stack・IP・Route・DNS機能がある。多くの環境ではDHCP等で外へ通信できるが、HTTPを受けるProgramは別。','別PCのBrowserからこのLinuxへWeb Requestを送りたいが、TCP 80で待ち受けるApplicationがいない。','HTTPをlistenし、RequestへResponseを返し、設定・Access Log・Error Logを持つWeb Server。','nginxはLinux必須Softwareではない。Web / Port / Process / Service / Logを一つにつなげて学びやすく、実務でも代表的なので今回選ぶ。','Ubuntu + IP + Default Route + DNS。外へ通信できても、Port 80はLISTENしていない。','nginx package + config + systemd unit + process + TCP 80 listener + access/error log。',['Apache HTTP Server','Application自身のHTTP server','Python http.server（学習用）','Container上のWeb server'],['package状態','systemctl status nginx','ss -lntp / Port 80','curl / Browser response','access.log / error.log'],'nginxはNetwork接続のためではなく、Linuxへ「Web Serverという役割」を追加するために入れます。Linux OS ≠ Web Server role ≠ nginx。'),
    2:e('Host Firewall','Hostへ届く通信を許可・拒否するControl','mixed','Network stackがあれば通信は成立しうる。Firewallが無いからNetworkにつながらない、という順序ではない。','Serverとして公開した後、すべての相手・Portから無制限に到達できる状態は避けたい。','Kernelのpacket filtering機能と、ufw / firewalld等の管理Toolで通信Ruleを制御する。','教材ではDebian系ufw、RHEL系firewalldをProfileで分ける。',['通信可能だが、Host側の許可Ruleが整理されていない。'],['Firewall Rule + default policy + audit可能な変更。'],['nftables / iptables','ufw','firewalld','Cloud Security Group（別レイヤー）'],['Rule一覧','default policy','packet counter / log','外部からの接続試験'],'FirewallはNetworkそのものではなく、Network通信を制御する部品です。Host FirewallとCloud Security Groupも別レイヤー。'),
    3:e('Network設定 / Resolver','IP通信と名前解決を成立させるOS機能','mixed','Linux KernelにはTCP/IP stackがあるが、NIC・IP・Route・DNS設定が正しいとは限らない。','宛先へ届くか、名前をIPへ解決できるかを確認したい。','NIC、IP Address、Default Route、DNS Resolverを構成・確認する。','Ubuntu等ではDHCPにより自動設定されることが多いが、VM/Router/DHCP/DNSが成立していることが前提。','OSを入れただけ。Network機能はあるが、接続先環境は未確認。','IP・Route・Resolver設定が入り、疎通と名前解決を検証できる。',['DHCP','Static IP','NetworkManager','Netplan + systemd-networkd'],['ip addr','ip route','getent / resolvectl','ping / curl'],'「Ubuntuを入れた＝必ずInternet接続済み」ではありません。OSの機能と、環境側の接続設定を分けます。'),
    4:e('OpenSSH Server','Network越しにShellへloginするdaemon','package','IP疎通ができても、Remote Shellを受け付けるProgramが無ければloginできない。','管理者が別端末から安全にLinuxを操作したい。','sshdがTCP 22等で待ち受け、認証後にShell sessionを作る。','OpenSSHは代表的な実装。ClientとServerは役割が別。','Network疎通のみ。Remote loginのlistener・認証入口は無い。','sshd service + host key + auth config + login log。',['Console直接操作','OpenSSH','Bastion / Session Manager系'],['sshd status','LISTEN Port','auth log','session / key fingerprint'],'SSHはNetworkそのものではなく、Network上でRemote loginを提供するApplication protocolです。'),
    9:e('Package Manager','Softwareの取得・導入・更新を管理するTool','builtin','OSだけで必要な全Applicationが入っているわけではない。手作業でfileを置くと依存・更新・削除が追いにくい。','nginx等のSoftwareを、由来・version・依存関係付きで安全に追加したい。','Repository metadataを使い、packageのinstall/update/removeと履歴を管理する。','Debian系はapt/dpkg、RHEL系はdnf/rpm。操作目的は似ても実装は同一ではない。','目的Software・依存file・package記録が無い。','package DBへ記録され、file・依存関係・versionが管理される。',['apt / dpkg','dnf / rpm','vendor installer','container image'],['package list','repository source','installed files','version / update history'],'Package ManagerはApplicationそのものではなく、ApplicationをLinuxへ持ち込む管理レイヤーです。'),
    12:e('cron / systemd timer','時刻・間隔で処理を起動するScheduler機能','configured','Commandは手動で実行できるが、毎日・毎時の運用を人が押し続けるのは現実的でない。','Backupや集計等を決めた時刻に再現可能な形で動かしたい。','OS側のSchedulerへCommand・時刻・実行User・Logを登録する。','cronとsystemd timerは別実装。Enterprise Schedulerとも別レイヤー。','手動Commandのみ。忘れ・実行者差・記録漏れがある。','Schedule定義 + 実行履歴 + retry/monitor対象。',['cron','systemd timer','Enterprise Scheduler'],['schedule定義','実行User','last/next run','stdout/stderr / journal'],'Schedulerは処理内容を作るSoftwareではなく、「いつ・誰が・何を起動するか」を制御します。'),
    13:e('Backup Tool / Storage','壊れる前の状態を別の場所へ保持する仕組み','mixed','DataはDiskにあるが、誤削除・故障・暗号化・上書きから自動で戻るわけではない。','必要な時点へ、必要時間内に復元したい。','copy/snapshot/archiveと、保存先・世代・restore手順を組み合わせる。','tar/rsync等のToolだけでなく、別媒体・世代・restore testが必要。','正本Dataのみ。壊れれば戻せない。','独立Backup + retention + restore evidence。',['tar / rsync','filesystem snapshot','Cloud backup','DB native backup'],['Backup size/date','保存先の独立性','checksum','restore test'],'Backup Softwareを入れたことではなく、実際に戻せることが価値です。'),
    14:e('Container Runtime','ApplicationをImageから隔離実行するRuntime','package','Linux上でApplicationを直接install・設定する方法もある。Containerは必須ではない。','Applicationと依存関係を再現可能な単位で配布・隔離したい。','Imageを取得し、namespace/cgroup等を使ってprocessを隔離実行する。','Docker / Podman等はContainer Runtime/管理Tool。ContainerはVMではない。','HostへApplicationを直接install。依存・配置がHostへ広がる。','Image + Container process + Network/Volume設定。',['Docker','Podman','containerd / orchestration','直接install'],['image digest','container process','port mapping','volume / log'],'Container RuntimeはLinuxをNetworkへつなぐToolではなく、Applicationの配布・実行方法を変える追加部品です。'),
    15:e('TLS / Certificate Tooling','HTTP通信を暗号化し相手を確認する仕組み','mixed','HTTPは動いても、通信内容と相手確認は保護されない。','Password・個人情報・取引情報を盗聴・改ざんから守りたい。','Certificate / Private Key / TLS protocolをWeb Serverへ設定する。','OpenSSLは鍵・証明書・接続確認等のTool。TLS service本体はWeb Server等が提供する。','HTTP listenerのみ。平文通信。','HTTPS listener + certificate chain + key + expiry/log。',['OpenSSL','ACME client','Cloud certificate service','Web server built-in TLS'],['certificate subject/SAN','expiry','chain','TLS handshake','HTTPS access log'],'OpenSSLを入れた＝HTTPSになる、ではありません。CertificateをWeb Serverへ正しく設定し、listenerと期限を確認します。'),
    16:e('Monitoring Agent / Exporter','状態を継続収集し異常を通知する部品','package','手動Commandで現在値は見られるが、過去推移・通知・相関は残らない。','障害が起きる前後のCPU・Memory・Disk・Process・Latencyを継続観測したい。','Metrics / Log / alertを収集基盤へ送る。','Agent方式、agentless方式、Cloud native monitoring等がある。','人が見た瞬間の状態だけ。','時系列Metrics + Alert + Dashboard + retention。',['node exporter','Cloud agent','SNMP','agentless check'],['agent status','scrape/ingest success','metric freshness','alert history'],'MonitoringはSystemを直すSoftwareではなく、何が起きたかをEvidenceに変えるSoftwareです。'),
    17:e('Ansible','複数Hostへ設定を再現するControl Tool','client','1台なら手作業できるが、台数が増えると差分・漏れ・再現性が問題になる。','同じ望ましい状態を複数Hostへ繰り返し適用したい。','Control nodeからSSH等で接続し、Inventory/Playbookに基づき設定する。','Ansibleは通常Control nodeへ入れる。管理対象へ巨大な常駐serverを入れる考え方とは異なる。','各Hostを手作業で変更。誰が何をしたか散らばる。','Inventory + Playbook + execution result + idempotent change。',['Ansible','Shell script','Puppet/Chef','Cloud IaC'],['inventory','playbook diff','changed/ok/failed','target state'],'Ansibleは対象Applicationではなく、変更を配る側のToolです。「どこへinstallするか」も役割で変わります。'),
    18:e('Hypervisor / Cloud Compute','Linuxが動く仮想Hardware・Provider基盤','external','Linuxは物理ServerでもVMでも動く。Guest OSだけではHypervisor/Cloud Control Planeを管理しない。','Hardwareを分割・払い出し、VMの作成・停止・snapshot等を外側から制御したい。','HypervisorまたはCloud ProviderがvCPU/Memory/Disk/NICを提供する。','Guest LinuxとHypervisor/Cloudは別レイヤー。','物理または既存Guest OSだけを見る。','外側のVM/Cloud resource + Guest Linux。',['KVM/VMware等','Cloud VM','bare metal'],['VM state','host/resource allocation','virtual NIC/disk','Guest OS evidence'],'Guest LinuxへCloudをinstallするのではありません。LinuxはCloud/Hypervisorから提供されたCompute上で動きます。'),
    19:e('Hardening Control','不要な機能・権限・公開範囲を減らす設定群','mixed','初期状態は汎用性を優先し、組織のrisk許容度に最適化されているとは限らない。','攻撃面を減らし、必要最小限の権限・service・通信へ絞りたい。','設定変更、package更新、audit、scanner等を組み合わせる。','単一の「Hardening Software」を入れれば完了ではない。','汎用初期設定。','承認済みbaseline + exception + evidence + rollback。',['OS baseline','CIS等のbenchmark','scanner','EDR / audit tool'],['enabled services','open ports','permissions','patch level','audit evidence'],'Hardeningは製品導入より、必要性・例外・影響・継続確認を含む運用です。')
  },
  sql:{
    1:e('DBMS','Table・SQL・Transactionを実行するData管理Software','mixed','SQL文だけでは保存先も実行Engineもない。','顧客・口座・取引を検索し、安全に更新したい。','SQL解析、Data保存、Transaction、Lock、Recoveryを提供する。','教材はBrowser内simulationで、実機DBをinstallしない。Db2文脈を正本に概念を学ぶ。','Application + fileだけ。','DBMS + Database + Table + Log。',['Db2','Oracle','PostgreSQL','SQL Server','Managed DB'],['service/process','connection','catalog/table','transaction log','audit'],'SQLを覚える前に、SQLを実行してDataを守るDBMSが必要です。'),
    17:e('DB Driver / Precompiler','COBOL等のApplicationからDBMSへ接続する境界','runtime','COBOLとDBMSは別Softwareで、互いを自動理解しない。','Program内からSQLを実行し、結果・SQLCODE・Transactionを扱いたい。','Driver / Client library / Embedded SQL precompile等で接続境界を作る。','製品・言語・Runtimeにより方法は異なる。','ProgramとDBが別々に存在。','Connection設定 + generated code/library + SQL response。',['Embedded SQL','ODBC/JDBC','Native client','API経由'],['connection config','SQLCODE','client library version','DB session'],'ApplicationとDBMSの間にも接続Software/Runtime境界があります。'),
    19:e('DB Monitor / Catalog View','DBMS内部状態をEvidenceとして見る機能','mixed','Dataが見えるだけでは、Lock・wait・plan・session・auditは分からない。','性能・競合・障害を推測ではなくDBMS Evidenceで確認したい。','製品固有のmonitor view/catalog/logを使う。','Db2/Oracle/PostgreSQL/SQL Serverで代表Evidenceは異なる。','症状とSQL結果だけ。','Session/Lock/Plan/Audit等の内部Evidence。',['Db2 monitor','Oracle dynamic performance view','PostgreSQL statistics view','SQL Server DMV'],['session','lock/wait','execution plan','audit/log'],'Monitor機能はDBMSとは別製品の場合も組込みの場合もあるため、製品Contextを確認します。')
  },
  cobol:{
    1:e('COBOL Compiler / Runtime','COBOL Sourceを実行Programへ変える環境','runtime','Source fileはTextであり、CPUが直接実行できない。','業務ルールを実際の処理として動かしたい。','Compile/Linkし、対象Platform上でRuntimeを通じて実行する。','教材は構文とData flowのsimulation。実環境ではCompiler/Runtimeが必要。','Source codeのみ。','Executable/Load module + Runtime + execution evidence。',['IBM Enterprise COBOL','GnuCOBOL','Pro*COBOL context'],['compile message','executable/load module','runtime error','RETURN-CODE'],'COBOLを学ぶことと、Compiler製品をinstallすることは別です。'),
    11:e('File Runtime / Dataset','Recordを永続的にREAD/WRITEするI-O境界','external','Working-Storageの値はProgram終了後に残らない。','大量Recordを入力し、結果を次処理へ渡したい。','OS/File systemまたはz/OS DatasetとRuntimeがI-Oを提供する。','Sequential FileはCOBOL文法だけで完結せず、実File/Dataset割当が必要。','Program内の一時Data。','File/Dataset + record layout + FILE STATUS。',['Sequential File','VSAM','Database','Message/API'],['record count','FILE STATUS','file allocation','checksum/control total'],'COBOLのFD/READ/WRITEは、外側のFile/Datasetがあって初めて実Dataを扱います。'),
    17:e('JCL / JES','COBOL Batchを起動しDataを割り当てる外部Platform','external','COBOL Programは存在しても、いつ・どの入力で動かすかは決まらない。','夜間BatchとしてProgramとDatasetを結び付けたい。','JCLが実行条件を定義し、JESがJobを受付・出力管理する。','COBOL SourceへJCLをinstallするのではなく、別レイヤーで連携する。','Program単体。','JOB/STEP/DD + Program + Dataset + Spool。',['JCL/JES','Enterprise Scheduler','Open system scheduler'],['JOB ID','STEP RC','DD allocation','Spool'],'COBOLとJCLは近くで使われても、言語と実行制御という別の役割です。'),
    18:e('Db2 / CICS','Data管理・Online Transactionを担う外部基盤','external','COBOLだけでも計算はできるが、共有Data・Online要求・Transaction管理は別の能力。','口座DataをDBへ保存し、ATM/窓口のOnline transactionを処理したい。','Db2がData/Transaction、CICSがOnline transaction実行文脈を提供する。','EXEC SQL / EXEC CICSは外部基盤との境界。','COBOL Program単体。','COBOL + Db2/CICS session + response code。',['File処理','Db2','Oracle','CICS/API platform'],['SQLCODE','CICS response','commit boundary','session/log'],'COBOL文の中に見えても、Db2/CICSは別Software・別責務です。')
  },
  jcl:{
    1:e('JES','JCLを受付・実行・Spool管理するz/OS subsystem','external','JCL Textだけでは実行されない。','JOBを投入し、ProgramとDataを結び付け、結果を残したい。','JESがJobを受付し、z/OS上でStep実行と出力管理を行う。','教材ではJCL/JESの関係をsimulationする。UbuntuへJCLをinstallする話ではない。','JCL Textのみ。','JOB ID + Step execution + Spool。',['JES2/JES3文脈','Open system batch','Enterprise Scheduler'],['JOB ID','JES message','Spool','RC/ABEND'],'JCLは定義、JESは実行基盤。役割を分けます。'),
    6:e('JES Spool','Job message・SYSOUT・結果を保持する出力管理','external','Programが終了しても、何が起きたかを人が確認できなければ運用できない。','JOB/STEPのmessage・output・RCを後から追いたい。','JESがSpoolへ出力を保持・検索可能にする。','Spoolは単なるApplication Logと同じではない。','画面に出ない実行結果。','JOB単位のSYSOUT/message/RC。',['JES Spool','File log','Central log platform'],['JESMSGLG','JESJCL','JESYSMSG','SYSOUT'],'SpoolはJCLへ追加installするToolではなく、JESが提供する運用機能です。'),
    14:e('Sort / Utility Program','汎用処理を再利用するSystem Utility','external','毎回COBOLでsort/copyを作ることもできるが、定型処理を重複実装したくない。','大量DataのSort/Copy/Transformを標準化したい。','DFSORT等のUtility ProgramをJCLのEXECから呼び出す。','JCL自身がDataをsortするのではない。JCLはUtilityを起動する。','JCL定義だけ。','Utility Program + SYSIN control + input/output Dataset。',['DFSORT','ICETOOL','COBOL Program','Open system sort'],['Utility RC','SYSOUT','input/output count','control statement'],'JCLは「何を動かすか」を指定し、実処理はProgram/Utilityが行います。'),
    16:e('Enterprise Scheduler','Job依存・営業日・締切を全体管理する外側の層','external','JCLは1 JobのStepを表せても、企業全体のJob network・営業日・待合せは別問題。','数百/数千Jobの依存・calendar・alert・rerunを管理したい。','Control-M / JP1 / IBM Z Workload Scheduler等がJES/JCLの外側をorchestrateする。','製品名は違っても、Scheduler層とJCL層を混ぜない。','個別JCLはあるが、全体依存が人手。','Job network + calendar + dependency + alert。',['Control-M','JP1/AJS3','IBM Z Workload Scheduler','Cloud scheduler'],['predecessor/successor','calendar','release/rerun state','deadline'],'Schedulerを入れる理由はJCL構文を実行するためではなく、業務全体の順序と時刻を管理するためです。')
  }
};

const CLOUD_META={
  1:['System Flow','利用者要求を処理経路へつなぐ設計図','builtin','部品を追加する前に、Customer→App→Dataの流れを定義する。'],
  2:['Compute','Applicationを実行する場所','provisioned','Programを動かすCPU/Memory/OS環境をProvider側へ作る。'],
  3:['Persistent Data','消えてはいけないDataの置き場所','provisioned','ApplicationのMemoryだけでは残高を保持できない。'],
  4:['Virtual Network','Cloud内の論理的な通信範囲','provisioned','App/DBを自分たちのNetworkとして分離・管理する。'],
  5:['Subnet','公開範囲・内部範囲を分ける区画','provisioned','入口とDBを同じ公開範囲へ置かない。'],
  6:['Route / NAT','通信の向きと経路を定める部品','provisioned','外へ出る通信と外から入る通信を分ける。'],
  7:['Load Balancer','一つの入口から複数Appへ振り分ける部品','provisioned','利用者へServer選択をさせず、健全な宛先へ送る。'],
  8:['Firewall Control','誰からどのPortへ通信できるかを制御','provisioned','Networkを作っただけでは通信許可は決まらない。'],
  9:['Failure Domain','一緒に壊れる範囲を分ける配置','provisioned','1か所の故障で全Appが止まらないようにする。'],
  10:['Storage Service','Object/Block/Fileを用途で使い分ける保存部品','provisioned','読み書き方法・共有方法・耐久性が用途で違う。'],
  11:['Managed Database','DB基盤運用の一部をProviderへ任せるservice','provisioned','Patch/HA/Backupの一部を任せつつData/SQL責任は残す。'],
  12:['IAM','誰が何を操作できるかを定義するControl Plane','provisioned','人とApplicationへ同じ強権限を持たせない。'],
  13:['Secret / Key / Certificate','秘密情報を保管・利用・更新するservice','provisioned','CodeへPasswordやKeyを直書きしない。'],
  14:['Observability','Metrics/Logs/Trace/Auditを集めるservice','provisioned','壊れた時に何が起きたかをEvidenceで見られるようにする。'],
  15:['Backup / Restore','必要時点へDataを戻す仕組み','provisioned','Backup作成だけでなくrestore可能性を持つ。'],
  16:['DR Resource','Region規模障害で切り替える構成','provisioned','通常冗長化より大きな障害へ備える。'],
  17:['Hybrid Connectivity','Cloudと社内/Coreをつなぐ経路','provisioned','Cloud内だけ正常でも業務が完結しない。'],
  18:['Provider Mapping','共通Conceptを各Provider名へ翻訳する知識','builtin','製品名が変わっても役割へ戻れるようにする。'],
  19:['IaC / Governance Tool','変更をCode・Review・Auditへ載せるControl Tool','client','Console手作業だけでは差分・承認・rollbackが追いにくい。'],
  20:['War Room','複数部品をEvidenceで横断判断する演習','builtin','新しいSoftwareを入れるLabではなく、既存部品を統合して判断する。']
};

function cloudEntry(module,lab){
  const m=CLOUD_META[lab];if(!m)return null;
  const [common,role,origin,why]=m;
  if(module==='cloud'){
    return{
      title:`なぜ ${common} が必要？`,summary:why,component:common,role,origin,
      baseline:'Cloud契約・Accountだけでは、この役割を担うResourceはまだ存在しない。',
      problem:why,
      capability:`${role}をCloud上で実現する。`,
      choice:'まず製品名を出さずCommon Conceptとして理解し、その後AWS/GCP/Azure/OCIへ翻訳する。',
      before:'必要な役割がSystem図に無い、または人手・自前運用へ依存。',
      after:`${common}という役割がSystemへ追加され、状態・権限・Log・Costを管理できる。`,
      alternatives:['自社設備で実装','Cloud IaaSで構成','Managed serviceを利用','複数Providerの代表実装'],
      evidence:['Resource/設定の存在','配置・接続関係','IAM/責任分界','Metrics/Logs','削除/rollback方法'],
      boundary:'Cloud service本体はPCへdownloadするのではなく、Provider側へprovisionします。Console/CLIは操作手段です。'
    };
  }
  const p=PROVIDERS[module];if(!p)return null;
  const service=p.services[lab]||common;
  return{
    title:`なぜ ${service} が必要？`,summary:`Cloud Fundamentalsの「${common}」を${p.name}で実現する代表serviceです。`,component:service,role,origin,
    baseline:`${p.account}はあるが、この役割のResourceはまだprovisionされていない。`,
    problem:why,
    capability:`${common}の役割を${p.name}上で提供する。`,
    choice:`${service}を代表例として使う。別Providerのserviceと完全に同一ではない。`,
    before:'Console/CLIがあってもResource本体は無い。',
    after:`${service} Resource + ID + Region/Zone/Network + IAM + Log/Cost。`,
    alternatives:['Consoleでprovision','CLI/SDKでprovision','IaCでprovision','別service/別Provider'],
    evidence:['Resource state/ID','Network/Region配置','IAM/Policy','Metrics/Logs','Audit/Billing'],
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

function genericHtml(module,lab,x){
  const o=ORIGINS[x.origin]||ORIGINS.mixed;
  return `<section class="cr-card" id="componentRationalePanel" data-cr-key="${esc(module+':'+lab)}">
    <div class="cr-head"><div><div class="cr-kicker">NEED BEFORE TOOL / COMPONENT ORIGIN</div><h2>${esc(x.title)}</h2><p class="cr-summary">${esc(x.summary)}</p></div><div class="cr-badges">${originBadge(x.origin)}<span class="cr-badge"><strong>役割</strong> ${esc(x.role)}</span></div></div>
    <div class="cr-boundary">${esc(x.boundary)}</div>
    <div class="cr-flow">
      <div class="cr-step"><small>01 もともと何がある？</small><b>Before the component</b><span>${esc(x.baseline)}</span></div>
      <div class="cr-step"><small>02 何に困る？</small><b>Problem</b><span>${esc(x.problem)}</span></div>
      <div class="cr-step"><small>03 何の機能が必要？</small><b>Capability</b><span>${esc(x.capability)}</span></div>
      <div class="cr-step"><small>04 なぜ今回これ？</small><b>${esc(x.component)}</b><span>${esc(x.choice)}</span></div>
    </div>
    <div class="cr-before-after"><div class="cr-state before"><small>BEFORE</small><b>追加前</b><span>${esc(x.before)}</span></div><div class="cr-arrow">→</div><div class="cr-state after"><small>AFTER</small><b>追加・設定後</b><span>${esc(x.after)}</span></div></div>
    <div class="cr-observe">${(x.evidence||[]).map(v=>`<span>👀 ${esc(v)}</span>`).join('')}</div>
    <details class="cr-details"><summary>選択肢と「どこから来るか」を見る</summary><div class="cr-details-grid"><div><b>他の選択肢</b><ul>${list(x.alternatives)}</ul></div><div><b>${esc(o[0])}</b><p>${esc(o[1])}</p><div class="cr-sim-note">このサイトはBrowser内Learning Simulatorです。実機へSoftware/Cloud Resourceを自動導入しません。本番では対象環境・version・権限・承認・Runbookを確認します。</div></div></div></details>
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
    <div class="cr-linux-stage"><div class="cr-system-map" id="crLinuxMap">${esc(LINUX_STAGES[0].map)}</div><div class="cr-console" id="crLinuxConsole">${esc(LINUX_STAGES[0].console)}</div></div>
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
