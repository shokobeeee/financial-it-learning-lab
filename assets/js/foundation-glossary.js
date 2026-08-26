(function(){
'use strict';

const SCRIPT=document.currentScript;
const SCRIPT_URL=SCRIPT&&SCRIPT.src?SCRIPT.src:'';
const LEVEL_KEY='fit_explanation_level_v1';
const FOUNDATION_COMPLETE_KEY='linux_computer_os_foundation_complete';
const FOUNDATION_VIEWED_KEY='linux_computer_os_foundation_viewed';
const LEVELS={
  beginner:{label:'完全未経験',description:'本文はそのまま読め、意味はカード下の用語メモへまとめます。'},
  standard:{label:'標準',description:'専門用語に印だけ付け、hoverや押した時に説明します。'},
  compact:{label:'説明最小',description:'本文への用語補助を隠し、用語帳だけ残します。'}
};
const CATEGORY_LABELS={computer:'コンピュータ',os:'OS / Linux',network:'ネットワーク',software:'Software / 運用',data:'Database',batch:'COBOL / Batch',cloud:'Cloud'};

const TERMS=[
  {id:'hardware',label:'Hardware',aliases:['Hardware','ハードウェア'],plain:'コンピュータ本体の部品',summary:'CPU・Memory・Storage・Network Interfaceなど、実際に計算・保存・通信を行う物理的な部品です。',where:'OSの下にあり、Applicationは通常OSを通して利用します。',without:'計算・保存・通信を実行する土台がありません。',confuse:'OSやApplicationはSoftwareで、Hardwareそのものではありません。',category:'computer',step:1},
  {id:'cpu',label:'CPU',aliases:['CPU'],plain:'計算する場所',summary:'命令を順番に実行し、計算や判断を進める部品です。',where:'Applicationの処理は、OSがCPUを使う時間を割り当てて実行します。',without:'Programの命令を実行できません。',confuse:'CPUは長期保存場所ではありません。',category:'computer',step:1},
  {id:'memory',label:'Memory',aliases:['Memory','メモリ'],plain:'作業中の置き場',summary:'動いているProgramが、いま使うDataや途中結果を一時的に置く場所です。',where:'Processごとに必要量が割り当てられ、OSが管理します。',without:'Programが作業中のDataを保持できません。',confuse:'Storageと違い、通常は電源を切ると内容が消えます。',category:'computer',step:1},
  {id:'storage',label:'Storage',aliases:['Storage','ストレージ'],plain:'電源を切っても残る保存場所',summary:'OS・Program・設定・Data・Logなどを長く保存する場所です。',where:'SSD・HDDやCloud Diskなどが該当します。',without:'OSやFileを再起動後まで残せません。',confuse:'Memoryは作業中の一時置き場、Storageは長期保存場所です。',category:'computer',step:1},
  {id:'os',label:'OS',aliases:['Operating System','OS','オペレーティングシステム'],plain:'Applicationと機械の間を取り仕切る基本Software',summary:'CPU・Memory・Storage・Networkなどを安全に分け、Applicationが使える形にするSoftwareです。',where:'HardwareとApplicationの間にいます。Linux・Windows・macOSなどがOSです。',without:'各ApplicationがHardwareを直接奪い合い、安全に共存しにくくなります。',confuse:'LinuxはOSの一種。nginxやDBMSはOS上で動くApplicationです。',category:'os',step:2},
  {id:'kernel',label:'Kernel',aliases:['Kernel','カーネル'],plain:'OSの司令塔',summary:'OSの中心部分で、CPU・Memory・File・Device・Networkの利用を管理します。',where:'Applicationからの依頼を受け、Hardwareへ安全に橋渡しします。',without:'Applicationごとの資源利用やHardware制御をまとめられません。',confuse:'KernelはLinux全体そのものではなく、OSの中心部分です。',category:'os',step:3},
  {id:'program',label:'Program',aliases:['Program','プログラム'],plain:'保存された手順書',summary:'コンピュータへ何をさせるかを書き、Fileとして保存した命令のまとまりです。',where:'Storageに保存され、起動されるとProcessになります。',without:'実行する処理内容がありません。',confuse:'Programは保存された状態、Processは現在動いている状態です。',category:'os',step:4},
  {id:'process',label:'Process',aliases:['Process','プロセス'],plain:'いま動いているProgram',summary:'Programを起動し、CPU時間・Memory・識別番号などを持って実行している状態です。',where:'nginxを起動すると、nginxのProcessが動きます。',without:'Packageが入っていても、実際の処理は行われません。',confuse:'install済みと実行中は別です。',category:'os',step:4},
  {id:'file',label:'File',aliases:['File','ファイル'],plain:'名前を付けて保存したData',summary:'文章・設定・Program・画像・Logなどを、名前付きで保存した単位です。',where:'Storage上のDirectoryに置かれ、Pathで場所を表します。',without:'Dataや設定を再利用できる形で保存しにくくなります。',confuse:'DirectoryはFileを整理する入れ物です。',category:'os',step:5},
  {id:'directory',label:'Directory',aliases:['Directory','ディレクトリ','Folder','フォルダ'],plain:'Fileをまとめる入れ物',summary:'Fileや別のDirectoryを階層的に整理するための入れ物です。',where:'/var/log や /etc/nginx などがDirectoryです。',without:'多数のFileの場所を整理しにくくなります。',confuse:'Directory自体はApplicationではありません。',category:'os',step:5},
  {id:'path',label:'Path',aliases:['Path','パス'],plain:'FileやDirectoryの住所',summary:'どのDirectoryをたどると目的のFileへ着くかを表す文字列です。',where:'/var/log/nginx/access.log のように表します。',without:'どのFileを操作するか指定できません。',confuse:'URLはWeb上の住所、PathはOS内の場所を表す場合が中心です。',category:'os',step:5},
  {id:'nic',label:'Network Interface / NIC',aliases:['Network Interface','NIC','ネットワークインターフェース'],plain:'通信するための入口',summary:'ComputerをLANや仮想Networkへ接続するための通信口です。',where:'物理LAN CardやVMの仮想NICとして存在します。',without:'NetworkへDataを送受信する入口がありません。',confuse:'NICがあってもIP・Route・DNSが正しいとは限りません。',category:'network',step:6},
  {id:'tcpip',label:'TCP/IP stack',aliases:['TCP/IP stack','TCP-IP stack','TCP/IPスタック'],plain:'通信ルールを処理するOS機能',summary:'IPで宛先を扱い、TCPなどでDataを分割・再送・順序管理する通信機能のまとまりです。',where:'Linux Kernel内のNetwork機能としてApplicationを支えます。',without:'一般的なIP Networkで通信できません。',confuse:'TCP/IP stackがあることと、実際にNetwork設定が正しいことは別です。',category:'network',step:6},
  {id:'ip',label:'IP Address',aliases:['IP Address','IPアドレス'],plain:'Network上の住所',summary:'Network上で送信元・宛先の機械やInterfaceを識別する番号です。',where:'例：192.168.1.20。NICへ設定されます。',without:'IP Network上の送受信先を指定できません。',confuse:'DNS名は人向けの名前、IP Addressは通信で使う住所です。',category:'network',step:6},
  {id:'subnet',label:'Subnet',aliases:['Subnet','サブネット'],plain:'同じ近所として扱う範囲',summary:'IP Addressのうち、どこまでを同じNetworkとして直接通信するかを決める範囲です。',where:'同じSubnetなら通常はRouterを経由せず直接届けます。',without:'宛先が近所か、外部Networkかを判断できません。',confuse:'VPC/VNetはCloud内の大きなNetwork、Subnetはその中の区画です。',category:'network',step:6},
  {id:'default-route',label:'Default Route',aliases:['Default Route','default route','デフォルトルート'],plain:'近所以外へ出る基本の出口',summary:'より具体的な経路がない宛先へ通信するとき、最初に渡すGatewayを決める経路です。',where:'例：default via 192.168.1.1。Internetや別Networkへ出る時に使います。',without:'同じSubnet外へどこから出ればよいか分かりません。',confuse:'Default RouteはInternetそのものではなく、次に渡す基本の出口です。',category:'network',step:6},
  {id:'dns',label:'DNS',aliases:['DNS'],plain:'名前をIP Addressへ変える案内',summary:'example.comのような名前を、通信で使うIP Addressへ変換する仕組みです。',where:'Applicationが名前で接続する前にResolverが問い合わせます。',without:'IPを直接知らないと名前で接続できません。',confuse:'DNSが成功しても、Route・Port・Applicationが正常とは限りません。',category:'network',step:6},
  {id:'port',label:'Port',aliases:['Port','ポート'],plain:'Applicationごとの受付窓口',summary:'同じIP Addressの中で、どのApplicationへDataを渡すかを表す番号です。',where:'HTTPは代表的に80、HTTPSは443、SSHは22を使います。',without:'OSが受信DataをどのApplicationへ渡すか区別できません。',confuse:'物理的なLAN差込口ではなく、通信上の論理的な窓口です。',category:'network',step:7},
  {id:'server',label:'Server',aliases:['Server','サーバー'],plain:'他のComputerからの依頼に答える役割',summary:'ClientからRequestを受け、Dataや処理結果を返すComputerまたはApplicationの役割です。',where:'Web Server、Database Server、SSH Serverなどがあります。',without:'他のComputerへ機能を提供できません。',confuse:'Linuxを入れただけで自動的にWeb Serverになるわけではありません。',category:'software',step:7},
  {id:'service',label:'Service',aliases:['Service','サービス'],plain:'継続して動かす機能',summary:'OSが起動・停止・再起動・状態確認を管理する、長時間動くProgramや機能です。',where:'nginx.service や sshd.service などがあります。',without:'再起動後の自動起動や統一的な運転管理が難しくなります。',confuse:'Serviceという役割と、実体のProcessは関係しますが同じ言葉ではありません。Cloudの「service」はProviderが提供する部品を指し、別の意味です。',category:'software',step:7},
  {id:'systemd',label:'systemd',aliases:['systemd'],plain:'LinuxのService起動を管理する代表的な仕組み',summary:'Linux起動後にServiceを順番に起動し、状態・Log・依存関係を管理する仕組みです。',where:'systemctlやjournalctlから操作・確認します。',without:'Serviceの起動順・再起動・状態確認を統一しにくくなります。',confuse:'systemdはDistribution名ではなく、複数Distributionで使われる管理基盤です。',category:'os',step:8},
  {id:'boot',label:'Boot',aliases:['Boot','ブート','起動'],plain:'電源ONからOSが使えるまで',summary:'Hardware準備、OS読込み、Kernel起動、Service起動を経て利用可能になる一連の流れです。',where:'Firmware → Bootloader → Kernel → systemd → Serviceの順で見ると整理できます。',without:'OSやApplicationを使える状態へ移れません。',confuse:'Applicationの起動だけでなく、Computer全体の起動工程です。',category:'os',step:8},
  {id:'firmware',label:'Firmware / BIOS / UEFI',aliases:['Firmware','BIOS','UEFI','ファームウェア'],plain:'電源直後にHardwareを準備する仕組み',summary:'電源ON直後にCPU・Memory・Deviceを初期確認し、OSを読み込む入口を探します。',where:'Boot工程の最初に動きます。',without:'OSを読み込む前のHardware準備ができません。',confuse:'OSやKernelより前に動く層です。',category:'os',step:8},
  {id:'bootloader',label:'Bootloader',aliases:['Bootloader','Boot Loader','ブートローダー'],plain:'Kernelを読み込む係',summary:'StorageからOSのKernelをMemoryへ読み込み、起動を引き渡すProgramです。',where:'LinuxではGRUBなどが代表例です。',without:'FirmwareからKernelへ起動を引き渡せません。',confuse:'Kernel自身ではなく、Kernelを起動する前段です。',category:'os',step:8},
  {id:'application',label:'Application',aliases:['Application','アプリケーション','App'],plain:'利用者の目的を実現するSoftware',summary:'Web表示・送金処理・検索・帳票作成など、具体的な業務や利用目的を実現します。',where:'OS上でProcessとして動き、File・Network・Database等を使います。',without:'利用者が必要とする具体的な処理を実行できません。',confuse:'OSは土台、Applicationはその上で目的を実現するSoftwareです。',category:'software',step:2},
  {id:'package',label:'Package',aliases:['Package','パッケージ'],plain:'配布しやすくまとめたSoftware一式',summary:'Program本体・設定例・依存情報・Version情報などを、導入しやすい形にまとめた単位です。',where:'nginx packageを入れると実行Fileや設定Directory等が配置されます。',without:'Softwareの導入・更新・削除を再現可能に管理しにくくなります。',confuse:'Packageを入れただけでProcessが必ず動くわけではありません。',category:'software'},
  {id:'package-manager',label:'Package Manager',aliases:['Package Manager','パッケージマネージャー'],plain:'Softwareの導入・更新・削除を管理する道具',summary:'RepositoryからPackageを取得し、依存関係やVersionを管理します。',where:'apt・dnf・zypperなどが代表例です。',without:'Softwareの由来・依存・更新履歴を管理しにくくなります。',confuse:'Package ManagerはnginxなどのApplication本体ではありません。',category:'software'},
  {id:'repository',label:'Repository',aliases:['Repository','リポジトリ'],plain:'Packageの配布元',summary:'PackageとVersion・依存関係等の情報を保管し、Package Managerへ提供する場所です。',where:'Distribution公式やVendorのRepositoryがあります。',without:'信頼できる取得先と更新情報を一元管理しにくくなります。',confuse:'GitHub RepositoryとLinux Package Repositoryは目的が異なります。',category:'software'},
  {id:'firewall',label:'Firewall',aliases:['Firewall','ファイアウォール'],plain:'通信を通す・止める門番',summary:'送信元・宛先・Portなどの条件で、Network通信を許可または拒否します。',where:'Host Firewall、Cloud Security Group、Network Firewallなど複数レイヤーにあります。',without:'不要な相手やPortからの通信まで到達しやすくなります。',confuse:'FirewallはNetworkそのものではなく、通信を制御する部品です。',category:'network'},
  {id:'log',label:'Log',aliases:['Log','ログ','記録'],plain:'何が起きたかの記録',summary:'時刻・処理・Error・利用者・Requestなどを後から確認できるように残した記録です。',where:'Application Log、OS Log、Audit Logなどがあります。',without:'障害時に事実を確認しにくくなります。',confuse:'Logは原因そのものではなく、仮説を確認するEvidenceの一つです。',category:'software'},
  {id:'evidence',label:'Evidence',aliases:['Evidence','エビデンス','証跡'],plain:'判断の根拠にする確認材料',summary:'Log・Metrics・設定差分・件数・金額・顧客導線など、判断を事実で支える材料です。',where:'障害対応では異なるレイヤーのEvidenceを組み合わせます。',without:'推測だけで原因や復旧完了を決めてしまいます。',confuse:'同種Logを大量に集めることと、Evidenceが十分なことは同じではありません。',category:'software'},
  {id:'database',label:'Database',aliases:['Database','データベース'],plain:'整理して保管されるDataの集まり',summary:'検索・更新しやすい形で、口座・顧客・取引などのDataを保持します。',where:'DBMSがDatabaseを管理します。',without:'共有Dataを安全・効率的に扱いにくくなります。',confuse:'DatabaseとDBMSとSQLは別です。',category:'data'},
  {id:'dbms',label:'DBMS',aliases:['DBMS'],plain:'Databaseを安全に管理するSoftware',summary:'SQLの実行、Data保存、Transaction、Lock、Recovery、権限等を管理します。',where:'Db2・Oracle Database・PostgreSQL・SQL Server等が代表例です。',without:'Application側で同時更新や復旧をすべて実装する必要があります。',confuse:'SQLは言語、DBMSはその言語を実行してDataを管理するSoftwareです。',category:'data'},
  {id:'sql',label:'SQL',aliases:['SQL'],plain:'DBMSへ検索・更新を指示する言語',summary:'TableからDataを探す、追加する、更新する、集計するための言語です。',where:'Applicationや人がDBMSへ命令を伝える時に使います。',without:'関係Databaseを標準的な方法で操作しにくくなります。',confuse:'SQL自体がDataを保存するわけではありません。',category:'data'},
  {id:'transaction',label:'Transaction',aliases:['Transaction','トランザクション'],plain:'まとめて成功・失敗させる処理単位',summary:'複数更新を一つのまとまりとして扱い、途中失敗時に中途半端な状態を避けます。',where:'送金の出金・入金などを一つの整合した単位で扱います。',without:'片方だけ更新されるなどData不整合が起きやすくなります。',confuse:'画面の一操作とDatabase Transactionは必ずしも同じ範囲ではありません。',category:'data'},
  {id:'compiler',label:'Compiler',aliases:['Compiler','コンパイラ'],plain:'Source codeを実行できる形へ変換するSoftware',summary:'COBOL等の人が読めるSourceを、対象環境で実行可能な形式へ変換します。',where:'Compile・Linkを経てExecutableやLoad Moduleを作ります。',without:'CPUがSource codeをそのまま実行できません。',confuse:'CompilerとRuntimeは役割が異なります。',category:'batch'},
  {id:'runtime',label:'Runtime',aliases:['Runtime','ランタイム'],plain:'Program実行を支える環境',summary:'Programが動く時に必要なLibrary・Data形式・入出力・Error処理等を提供します。',where:'COBOL Runtimeや言語Runtimeなどがあります。',without:'Compileできても実行時の機能が不足する場合があります。',confuse:'Compilerは変換、Runtimeは実行を支える役割です。',category:'batch'},
  {id:'batch',label:'Batch',aliases:['Batch','バッチ'],plain:'決めた時刻や条件でまとめて動かす処理',summary:'人が一件ずつ操作せず、大量Dataを夜間等にまとめて処理します。',where:'日次締め・利息計算・帳票・連携File作成などで使われます。',without:'大量の定型処理を人手で繰り返すことになります。',confuse:'Batchと即時応答するOnline処理は性質が異なります。',category:'batch'},
  {id:'jcl',label:'JCL',aliases:['JCL'],plain:'z/OSへJobの手順を伝える定義',summary:'どのProgramを、どの順番で、どのDataを使って実行するかを記述します。',where:'JESがJCLを受け付け、z/OS上でJobを実行します。',without:'Mainframe Batchの実行条件やData割当を伝えられません。',confuse:'JCLは実行Engineではなく定義です。',category:'batch'},
  {id:'jes',label:'JES',aliases:['JES'],plain:'JCL Jobを受け付けて実行する基盤',summary:'Jobを受付し、実行順・Spool・Message・出力を管理するz/OSのSubsystemです。',where:'JCLとProgramの実行をつなぎます。',without:'JCL TextだけではJobとして実行されません。',confuse:'Enterprise SchedulerはJES/JCLの外側で依存・営業日等を管理します。',category:'batch'},
  {id:'cloud-resource',label:'Cloud Resource',aliases:['Cloud Resource','クラウドリソース','Resource'],plain:'Cloud事業者側に作るIT部品',summary:'VM・Network・Database・Storage等をProviderの設備上に払い出したものです。',where:'Console・API・CLI・IaCから作成・設定します。',without:'契約やCLIだけあっても、実際に処理する部品は存在しません。',confuse:'Cloud CLIをPCへ入れることと、ResourceをCloud上に作ることは別です。',category:'cloud'},
  {id:'vm',label:'Virtual Machine / VM',aliases:['Virtual Machine','VM','仮想マシン'],plain:'Softwareで作った仮想Computer',summary:'物理ServerのCPU・Memory・Disk等を分け、独立したComputerのように使える実行環境です。',where:'その中へLinux等のGuest OSを入れます。',without:'一台の物理Server上で複数の独立環境を柔軟に動かしにくくなります。',confuse:'VMとContainerは隔離の仕組みが異なります。',category:'cloud'},
  {id:'virtual-network',label:'VPC / VNet',aliases:['VPC','VNet','Virtual Network'],plain:'Cloud内の自分たち用Network',summary:'Cloud上のResourceを配置し、Subnet・Route・Firewall等を管理する論理Networkです。',where:'AWSはVPC、AzureはVNet、OCIはVCN等と呼びます。',without:'Cloud Resourceの通信範囲や分離を整理しにくくなります。',confuse:'Provider名は違っても共通Conceptへ戻して考えます。',category:'cloud'},
  {id:'iam',label:'IAM',aliases:['IAM'],plain:'誰が何を操作できるかを決める仕組み',summary:'人・Application・Serviceへ、必要な操作権限を付与・制限します。',where:'Account・Role・Policy・Service Identity等を管理します。',without:'誰でも強い操作ができる状態になりやすくなります。',confuse:'Network通信許可と、Cloud操作権限は別レイヤーです。',category:'cloud'},
  {id:'api',label:'API',aliases:['API'],plain:'Software同士が依頼をやり取りする窓口',summary:'決められたRequestとResponseの形式で、別Softwareの機能を呼び出します。',where:'Cloud Resource作成や銀行Service連携等で使います。',without:'Software間連携を個別の画面操作や独自Fileだけに頼りやすくなります。',confuse:'APIは画面ではなく、Software向けの接続仕様を指す場合が中心です。',category:'software'},
  {id:'system-resource',label:'リソース（計算資源）',aliases:['リソース'],plain:'CPU・Memory・Diskなど、使える量に限りがあるもの',summary:'Processが動くために消費する、CPU時間・Memory・Disk容量・通信帯域などの総称です。',where:'足りなくなると、処理が遅くなる・止まる・起動できないという形で表面化します。',without:'どのProcessが何をどれだけ使っているかを、数字で説明できません。',confuse:'Cloud Resource（Provider側に作るIT部品）とは別の意味です。',category:'computer'},
  {id:'cloud',label:'Cloud',aliases:['Cloud','クラウド'],plain:'他社の設備を必要な分だけ借りて使う形',summary:'Server・Network・Storageを自社で買わず、Providerの設備上に必要な部品を作って使う形です。',where:'Console・CLI・IaCからProviderへ依頼し、使った分だけ費用がかかります。',without:'必要な構成が揃うまで、機器の購入・設置・配線を自社で行うことになります。',confuse:'Cloudは置き場所と調達方法の話で、動くSoftwareそのものではありません。',category:'cloud'},
  {id:'network',label:'Network',aliases:['Network','ネットワーク'],plain:'機械どうしをつないでDataをやり取りする仕組み',summary:'住所（IP）・経路（Route）・名前解決（DNS）・窓口（Port）が揃って、初めて相手へDataが届きます。',where:'Linux内のTCP/IP機能、社内LAN、Cloud内のVPC/VNetなど、複数の層にまたがります。',without:'別の機械へDataを送れず、1台の中だけで完結します。',confuse:'Networkにつながることと、相手のApplicationが応答することは別です。',category:'network'},
  {id:'data',label:'Data',aliases:['Data','データ'],plain:'処理や保存の対象になる値そのもの',summary:'残高・取引・顧客情報・Logなど、Systemが扱う中身です。Programは手順、Dataは対象です。',where:'Memory上の一時的なDataと、StorageやDatabaseに残るDataは別に扱います。',without:'処理する対象も、残すべき記録もありません。',confuse:'Dataが表示できることと、そのDataが正しい（整合している）ことは別です。',category:'data'},
  {id:'cost',label:'Cost',aliases:['Cost','コスト','課金'],plain:'作った部品に対してかかる費用',summary:'Cloudでは作成したResourceの種類・量・稼働時間・通信量に応じて費用が発生します。',where:'Resourceを作った時点から、削除するまで課金対象になります。',without:'どの部品にいくらかかっているかを、役割と結び付けて判断できません。',confuse:'使っていなくても、作ったまま残っているResourceには費用がかかります。',category:'cloud'},
  {id:'provider',label:'Provider',aliases:['Provider','プロバイダ'],plain:'Cloudの設備を貸す事業者',summary:'Server・Network・Storageなどの設備を自社で持ち、利用者へ必要な分だけ貸し出す会社です。',where:'AWS・Google Cloud・Azure・OCIなどがProviderです。利用者の環境の外側にいます。',without:'Server・Network・DBの基盤を、自分で購入・設置・運用することになります。',confuse:'Providerと契約しただけでは、まだResourceは1つも作られていません。',category:'cloud'},
  {id:'account',label:'Account',aliases:['Account','アカウント'],plain:'Providerを使うための契約の単位',summary:'誰がどのResourceを持ち、誰に課金し、どこまで操作を許すかをまとめる単位です。',where:'AWSはAccount、Google CloudはProject、AzureはSubscription / Resource Groupと呼びます。',without:'ProviderへResourceの作成を依頼できません。',confuse:'Accountがあることと、Resourceが作られていることは別です。',category:'cloud'},
  {id:'provision',label:'provision',aliases:['provision','プロビジョニング'],plain:'Provider側にResourceを作ってもらうこと',summary:'Console・CLI・IaCからProviderへ依頼し、VM・Network・DBなどをCloud側に用意させる操作です。',where:'Cloudの部品を用意する時は、installやdownloadではなくprovisionします。',without:'契約やCLIがあっても、実際に処理・保存・通信を行う部品が存在しません。',confuse:'自分のPCへ何かを入れる操作ではありません。作られた本体はProvider側にあります。',category:'cloud'},
  {id:'install',label:'install',aliases:['install','インストール'],plain:'自分の環境へSoftwareを入れること',summary:'PCやServerの中へProgram・設定・serviceを配置し、その環境で動く状態にする操作です。',where:'Linuxへnginxを入れる、管理端末へCLIを入れる、などがinstallです。',without:'そのSoftwareの機能を、その環境で使えません。',confuse:'installは自分の環境、provisionはProvider側。入る場所が違います。',category:'software'},
  {id:'download',label:'download',aliases:['download','ダウンロード'],plain:'Fileを自分の環境へ持ってくること',summary:'Network越しにFileを取得し、手元のStorageへ保存する操作です。',where:'installの前段として、Packageやinstallerを取得する時に行います。',without:'必要なFileが手元に無いままです。',confuse:'downloadしただけでは、まだinstallも実行もされていません。Cloud service本体はdownloadできません。',category:'software'},
  {id:'cloud-service',label:'Cloud service',aliases:['Cloud service','Cloud Service','Cloudサービス'],plain:'Providerが機能として提供する部品',summary:'Compute・Storage・Database・監視などを、Providerが運用ごと提供する単位です。利用者はAPIで作成・設定します。',where:'Amazon EC2、Cloud SQL、Azure Monitorなどが個々のCloud serviceです。',without:'同じ機能を、自社の設備で用意して運用することになります。',confuse:'OSのService（systemdが管理する常駐Program）とは別の意味です。',category:'cloud'},
  {id:'managed-service',label:'Managed Service',aliases:['Managed Service','Managed service','マネージドサービス'],plain:'運用の一部をProviderが行うservice',summary:'Patch・冗長化・Backupなどの基盤運用をProviderが担当し、利用者はData・設定・権限に集中します。',where:'Managed DatabaseやManaged Kubernetesなどがあります。',without:'同じ運用作業を、自分たちの運用範囲として抱えることになります。',confuse:'Managedでも、Data設計・SQL・権限・整合性の責任は利用者に残ります。',category:'cloud'},
  {id:'region-zone',label:'Region / Zone',aliases:['Region','Zone','リージョン'],plain:'Resourceを置く場所の単位',summary:'Regionは地理的に離れた大きな区分、Zoneはその中で電源や建物を分けた区分です。',where:'同じZoneのResourceは一緒に壊れることがあります。分けて置くと同時停止を避けられます。',without:'どこまでが一緒に壊れる範囲か分からず、冗長化を設計できません。',confuse:'Regionを分けるのとZoneを分けるのとでは、備えられる障害の大きさが違います。',category:'cloud'},
  {id:'console',label:'Console',aliases:['Console','コンソール','操作画面'],plain:'Providerの操作画面',summary:'BrowserからResourceを作成・確認・削除できる画面です。',where:'Console・CLI・IaCは、どれも同じAPIを呼ぶ操作手段です。',without:'画面からResourceを操作できません。',confuse:'Consoleで作ったResourceも、本体はProvider側にあります。',category:'cloud'},
  {id:'common-concept',label:'Common Concept',aliases:['Common Concept','共通Concept'],plain:'製品名に依存しない役割の呼び方',summary:'Providerや製品が変わっても同じ役割を指す、共通の考え方の名前です。',where:'まずCommon Conceptで役割を理解し、その後で各Providerの製品名へ翻訳します。',without:'製品名だけを覚えることになり、Providerが変わると同じ役割だと気づけません。',confuse:'Common Conceptは製品ではないので、作成やinstallの対象ではありません。',category:'cloud'},
  {id:'tool',label:'Tool',aliases:['Tool','ツール'],plain:'対象を操作・管理するための道具Software',summary:'対象そのものではなく、対象を操作・確認・管理するために使うSoftwareです。',where:'CLI、Package Manager、Ansible、監視Agentなどが該当します。',without:'手作業や個別対応が増え、同じ状態を再現しにくくなります。',confuse:'Toolを入れることと、対象の部品を用意することは別です。',category:'software'},
  {id:'system',label:'System',aliases:['System','システム'],plain:'目的を果たすために連携して動く全体',summary:'Application・OS・Network・Databaseなどが組み合わさり、業務を成立させている全体です。',where:'1つの部品だけを見ても、利用者への影響までは判断できません。',without:'部品ごとの状態は見えても、業務が成立しているかを判断できません。',confuse:'System全体の異常と、1部品の異常は同じではありません。',category:'software'},
  {id:'cli',label:'CLI',aliases:['CLI','Command Line Interface'],plain:'文字Commandで操作する道具',summary:'画面のButtonではなく、文字Commandを入力してOS・Software・Cloudを操作します。',where:'Shell、AWS CLI、Azure CLI、gcloud等があります。',without:'自動化や再現可能な操作が難しくなる場面があります。',confuse:'Cloud CLIは操作Toolで、Cloud Resource本体ではありません。',category:'software'}
];

const FOUNDATION_STEPS=[
  {id:1,title:'Computerには何がある？',question:'画面の裏で、どんな部品が働いている？',map:'💻 COMPUTER\n├ 🧠 CPU        計算する\n├ 📝 Memory     作業中だけ置く\n├ 📦 Storage    電源OFFでも残す\n└ 🌐 NIC        他の機械と通信',body:'まずは深い仕組みより、Computerには「計算・一時保存・長期保存・通信」という4つの役割があると捉えます。',terms:['cpu','memory','storage','nic']},
  {id:2,title:'OSは何をしている？',question:'ApplicationがHardwareを直接使わないのはなぜ？',map:'📱 Application A ─┐\n🏦 Application B ─┼→ 🐧 OS → Hardware\n🧾 Application C ─┘\n\nOSが利用順・量・権限を調整',body:'複数ApplicationがCPUやMemoryを直接奪い合うと危険です。OSが間に入り、Hardwareを安全に共有させます。',terms:['application','os','hardware']},
  {id:3,title:'Kernelとは？',question:'OSの中で、実際に資源を管理する中心は？',map:'Application\n    │ 使いたい\n    ▼\n🧠 Kernel / OSの司令塔\n├ CPU時間\n├ Memory\n├ File / Device\n└ Network\n    ▼\nHardware',body:'KernelはApplicationの依頼を受け、CPU・Memory・File・Network等を管理してHardwareへ橋渡しします。',terms:['kernel','cpu','memory','file','tcpip']},
  {id:4,title:'ProgramとProcess',question:'nginxをinstallしただけで、Web Serverは動いている？',map:'📄 nginx Program\nStorageに保存\n      │ 起動\n      ▼\n▶ nginx Process\nCPU・Memoryを使って実行中\n\ninstall済み ≠ 実行中',body:'Programは保存された手順書。Processは、そのProgramを起動して今まさに動かしている状態です。',terms:['program','process','storage']},
  {id:5,title:'File・Directory・Path',question:'設定やLogは、どこにどう保存される？',map:'📦 Storage\n└ /var                 Directory\n   └ /log              Directory\n      └ /nginx\n         └ access.log  File\n\n/var/log/nginx/access.log = Path',body:'Fileは名前付きData、Directoryは整理する入れ物、Pathはその場所を示す住所です。',terms:['file','directory','path','log']},
  {id:6,title:'Networkの住所・近所・出口',question:'example.comへ通信するとき、何を順番に確認する？',map:'名前 example.com\n   │ DNSで変換\n   ▼\nIP Address 203.0.113.10\n   │ 同じSubnet？\n   ├ YES → 直接届ける\n   └ NO  → Default Routeへ渡す\n                 │\n                 ▼\n            別Network / Internet\n\n最後にPortでApplicationを選ぶ',body:'NICとTCP/IP機能があっても、IP・Subnet・Default Route・DNS・Portが正しいとは限りません。役割を一つずつ分けて確認します。',terms:['nic','tcpip','ip','subnet','default-route','dns','port']},
  {id:7,title:'Server・Service・Port',question:'Networkがつながっても、なぜHTTPへ応答しない？',map:'📱 Client Browser\n   │ HTTP :80\n   ▼\n🚪 Port 80 / 受付窓口\n   ▼\n⚙ nginx Process\n   │ systemdが運転管理\n   ▼\n📄 Response + Log\n\nLinuxだけではWeb Server roleは未追加',body:'Serverは依頼に答える役割、Portは受付窓口、Processは実行中の本体、ServiceはOSが継続運転を管理する単位です。',terms:['server','service','port','process','systemd']},
  {id:8,title:'電源ONからOSが動くまで',question:'Computerは、どうやってLinuxを使える状態にする？',map:'🔌 Power ON\n   ↓\n🧩 Firmware / BIOS / UEFI\nHardwareを準備\n   ↓\n📦 Bootloader\nKernelをMemoryへ読む\n   ↓\n🧠 Kernel起動\n   ↓\n⚙ systemdがService起動\n   ↓\n👤 Login / Application利用',body:'入口では順番だけ掴めれば十分です。詳細なFirmwareやMemory管理は、必要になった時に深掘りします。',terms:['boot','firmware','bootloader','kernel','systemd','service']}
];

let level=readStorage(LEVEL_KEY)||'beginner';
if(!LEVELS[level])level='beginner';
let foundationStep=0;
let quizMessage='';
let decorationBusy=false;
let mutationTimer=0;
let pendingRoots=[];

function readStorage(key){try{return localStorage.getItem(key)}catch(e){return null}}
function writeStorage(key,value){try{localStorage.setItem(key,value)}catch(e){}}
function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function ensureCss(){
  if(document.querySelector('link[data-foundation-glossary]'))return;
  const link=document.createElement('link');link.rel='stylesheet';
  link.href=SCRIPT_URL?new URL('../css/foundation-glossary.css?v=1',SCRIPT_URL).href:'../assets/css/foundation-glossary.css?v=1';
  link.dataset.foundationGlossary='1';document.head.appendChild(link);
}
function linuxUrl(){return SCRIPT_URL?new URL('../../linux/#foundation',SCRIPT_URL).href:'../linux/#foundation'}
function isLinuxHome(){return /\/linux\/?(?:index\.html)?$/i.test(location.pathname)}
function currentModule(){const parts=location.pathname.split('/').filter(Boolean);return ['linux','sql','cobol','jcl','cloud','aws','gcp','azure','field-casebook','financial-war-room'].find(function(x){return parts.includes(x)})||'home'}
function termById(id){return TERMS.find(function(t){return t.id===id})||null}
function levelLabel(){return LEVELS[level]?LEVELS[level].label:LEVELS.beginner.label}
function setRootLevel(){document.documentElement.dataset.fitbLevel=level}

function createLauncher(){
  if(document.getElementById('fitbLauncher'))return;
  const b=document.createElement('button');b.type='button';b.id='fitbLauncher';b.className='fitb-launcher';b.dataset.noGlossary='1';b.innerHTML='📖 <span>基本用語</span><small>'+esc(levelLabel())+'</small>';
  b.addEventListener('click',function(){openDrawer()});document.body.appendChild(b);
}
function updateLauncher(){const b=document.getElementById('fitbLauncher');if(b)b.innerHTML='📖 <span>基本用語</span><small>'+esc(levelLabel())+'</small>'}

function drawerHtml(){
  return '<div class="fitb-backdrop" data-fitb-close></div><aside class="fitb-panel" role="dialog" aria-modal="true" aria-labelledby="fitbTitle"><header><div><small>PLAIN LANGUAGE FIRST</small><h2 id="fitbTitle">📖 基本用語と説明レベル</h2></div><button type="button" class="fitb-close" data-fitb-close aria-label="閉じる">×</button></header><section class="fitb-levels"><h3>説明レベル</h3><div>'+Object.keys(LEVELS).map(function(id){return '<button type="button" data-fitb-level="'+id+'"><b>'+esc(LEVELS[id].label)+'</b><span>'+esc(LEVELS[id].description)+'</span></button>'}).join('')+'</div></section><section class="fitb-search"><label for="fitbSearch">用語を検索</label><input id="fitbSearch" type="search" placeholder="例：Kernel、Default Route、DBMS"></section><div class="fitb-drawer-body"><nav class="fitb-term-list" id="fitbTermList"></nav><article class="fitb-term-detail" id="fitbTermDetail"></article></div><footer>専門語を暗記する前に「何の役割か」「無いと何に困るか」を確認します。</footer></aside>';
}
function ensureDrawer(){
  let drawer=document.getElementById('fitbDrawer');if(drawer)return drawer;
  drawer=document.createElement('div');drawer.id='fitbDrawer';drawer.className='fitb-drawer';drawer.hidden=true;drawer.dataset.noGlossary='1';drawer.innerHTML=drawerHtml();document.body.appendChild(drawer);
  drawer.querySelectorAll('[data-fitb-close]').forEach(function(x){x.addEventListener('click',closeDrawer)});
  drawer.querySelectorAll('[data-fitb-level]').forEach(function(x){x.addEventListener('click',function(){setLevel(x.dataset.fitbLevel)})});
  const search=drawer.querySelector('#fitbSearch');search.addEventListener('input',function(){renderTermList(search.value)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!drawer.hidden)closeDrawer()});
  renderTermList('');renderTermDetail('os');syncLevelButtons();return drawer;
}
function syncLevelButtons(){const drawer=document.getElementById('fitbDrawer');if(!drawer)return;drawer.querySelectorAll('[data-fitb-level]').forEach(function(b){b.classList.toggle('active',b.dataset.fitbLevel===level)})}
function renderTermList(query){
  const list=document.getElementById('fitbTermList');if(!list)return;
  const q=String(query||'').trim().toLowerCase();
  const filtered=TERMS.filter(function(t){return !q||[t.label,t.plain,t.summary].join(' ').toLowerCase().includes(q)});
  const groups={};filtered.forEach(function(t){(groups[t.category]||(groups[t.category]=[])).push(t)});
  list.innerHTML=Object.keys(CATEGORY_LABELS).filter(function(c){return groups[c]&&groups[c].length}).map(function(c){return '<section><h3>'+esc(CATEGORY_LABELS[c])+'</h3>'+groups[c].map(function(t){return '<button type="button" data-fitb-open-term="'+t.id+'"><b>'+esc(t.label)+'</b><span>'+esc(t.plain)+'</span></button>'}).join('')+'</section>'}).join('')||'<p class="fitb-empty">該当する用語がありません。</p>';
  list.querySelectorAll('[data-fitb-open-term]').forEach(function(b){b.addEventListener('click',function(){renderTermDetail(b.dataset.fitbOpenTerm)})});
}
function renderTermDetail(id){
  const t=termById(id)||TERMS[0],detail=document.getElementById('fitbTermDetail');if(!detail||!t)return;
  detail.innerHTML='<div class="fitb-detail-kicker">'+esc(CATEGORY_LABELS[t.category]||'基本用語')+'</div><h2>'+esc(t.label)+'</h2><div class="fitb-plain">ひと言：<b>'+esc(t.plain)+'</b></div><p>'+esc(t.summary)+'</p><dl><div><dt>Systemのどこ？</dt><dd>'+esc(t.where)+'</dd></div><div><dt>無いと何に困る？</dt><dd>'+esc(t.without)+'</dd></div><div><dt>混同しやすいこと</dt><dd>'+esc(t.confuse)+'</dd></div></dl>'+(t.step?'<a class="fitb-foundation-link" href="'+esc(linuxUrl())+'" data-fitb-foundation>STEP -2で関係性から見る →</a>':'');
  const link=detail.querySelector('[data-fitb-foundation]');if(link&&isLinuxHome())link.addEventListener('click',function(e){e.preventDefault();closeDrawer();location.hash='foundation';openFoundationAndScroll()});
  document.querySelectorAll('[data-fitb-open-term]').forEach(function(b){b.classList.toggle('active',b.dataset.fitbOpenTerm===t.id)});
}
function openDrawer(id){
  const drawer=ensureDrawer();drawer.hidden=false;document.body.classList.add('fitb-open');
  if(id)renderTermDetail(id);syncLevelButtons();setTimeout(function(){const x=drawer.querySelector('.fitb-close');if(x)x.focus()},0);
}
function closeDrawer(){const drawer=document.getElementById('fitbDrawer');if(drawer)drawer.hidden=true;document.body.classList.remove('fitb-open')}

function setLevel(next){
  if(!LEVELS[next])return;level=next;writeStorage(LEVEL_KEY,next);setRootLevel();updateLauncher();syncLevelButtons();
  if(level==='compact')unwrapTerms(document);else decorateAll();
  renderFoundation(true);
}
function excluded(node){
  const p=node&&node.parentElement;if(!p)return true;
  return !!p.closest('script,style,code,pre,kbd,samp,button,a,input,textarea,select,option,[data-no-glossary],.fitb-drawer,.fitb-launcher,.cosf-foundation,.fitb-gloss,.fitb-tip,.terminal,.mini-console,.diag-console,.mobile-live-terminal-body');
}
function aliasIndex(){
  const out=[];TERMS.forEach(function(t){(t.aliases||[t.label]).forEach(function(a){out.push({term:t,alias:a,lower:a.toLowerCase(),ascii:/^[A-Za-z0-9_ ./+-]+$/.test(a)})})});
  return out.sort(function(a,b){return b.alias.length-a.alias.length});
}
const ALIASES=aliasIndex();
// 短い一般語（Data / Tool / Log 等）は識別子やPathの一部にも一致してしまう。
// www-data の "data"、backup-tool の "tool"、/data の "data" を弾くため、
// 直前は区切り記号も含めて識別子文字を許さない。直後は Console/CLI の '/' を残す。
const ASCII_BEFORE=/[A-Za-z0-9_./-]/,ASCII_AFTER=/[A-Za-z0-9_-]/;
// カタカナ語は語境界が空白で示されないため、隣がカタカナ・長音・漢字なら複合語の一部とみなす。
// これが無いと「データセット」が Data、「未インストール」が install として注釈される。
const JA_ADJACENT=/[\u30A0-\u30FF\u4E00-\u9FFF\u3005]/;
function boundaryOk(text,index,alias){
  const before=text[index-1]||'',after=text[index+alias.alias.length]||'';
  if(!alias.ascii)return !JA_ADJACENT.test(before)&&!JA_ADJACENT.test(after);
  return !ASCII_BEFORE.test(before)&&!ASCII_AFTER.test(after);
}
function findMatch(text,seen){
  const lower=text.toLowerCase();let best=null;
  ALIASES.forEach(function(a){if(seen.has(a.term.id))return;const i=lower.indexOf(a.lower);if(i<0||!boundaryOk(text,i,a))return;if(!best||i<best.index||(i===best.index&&a.alias.length>best.alias.alias.length))best={index:i,alias:a}});
  return best;
}
// 本文へ説明文を割り込ませない。行内は「印の付いた語」のまま、意味はscope単位の用語メモへ集約する。
const GLOSS_SCOPE_SELECTOR='.cr-card,.cosf-foundation,.card,section,article';
const MAX_TERMS_PER_SCOPE=6;
const MAX_TERMS_PER_PASS=40;

// aria-labelはbuttonの読み上げ名を丸ごと置き換えるため、音声でも文中に説明文が割り込む。
// 名前は語そのままにし、意味はaria-describedbyの補足として渡す。
function ensureDesc(term){
  const id='fitb-desc-'+term.id;
  if(document.getElementById(id))return id;
  let host=document.getElementById('fitbDescs');
  if(!host){host=document.createElement('div');host.id='fitbDescs';host.className='fitb-sr';host.dataset.noGlossary='1';document.body.appendChild(host)}
  const span=document.createElement('span');span.id=id;span.textContent=term.label+'：'+term.plain;host.appendChild(span);
  return id;
}
function termButton(term,original){
  const b=document.createElement('button');b.type='button';b.className='fitb-term';b.dataset.fitbTerm=term.id;b.dataset.fitbOriginal=original;
  b.setAttribute('aria-describedby',ensureDesc(term));
  b.textContent=original;return b;
}
// 入れ子のcard/sectionそれぞれに用語メモを付けると、注釈の箱が画面に散らばる。
// 一番外側のcardを1つだけ選び、そこへまとめる。
function glossScope(node){
  const p=node.parentElement;if(!p||!p.closest)return null;
  let el=p.closest(GLOSS_SCOPE_SELECTOR),outer=el;
  while(el&&el.parentElement){el=el.parentElement.closest(GLOSS_SCOPE_SELECTOR);if(el)outer=el}
  return outer;
}
// 同じ語をcardごとに何度も注釈すると、注釈自体がノイズになる。
// 脚注と同じく「1ページにつき最初の1回だけ」印を付け、その語のcardへ意味を置く。
function pageSeenTerms(){
  const seen=new Set();
  document.querySelectorAll('.fitb-term').forEach(function(b){if(b.dataset.fitbTerm)seen.add(b.dataset.fitbTerm)});
  return seen;
}
function scopeState(scope){
  const state={ids:new Set(),terms:[]};
  if(scope&&scope.querySelectorAll)scope.querySelectorAll('.fitb-term').forEach(function(b){
    const t=termById(b.dataset.fitbTerm);if(t&&!state.ids.has(t.id)){state.ids.add(t.id);state.terms.push(t)}
  });
  return state;
}
function renderGloss(scope,terms){
  if(!scope||!scope.matches||!scope.matches(GLOSS_SCOPE_SELECTOR))return;
  let el=null;
  for(let i=0;i<scope.children.length;i++){if(scope.children[i].classList.contains('fitb-gloss')){el=scope.children[i];break}}
  if(!terms.length){if(el)el.remove();return}
  const sig=terms.map(function(t){return t.id}).join(',');
  if(el&&el.dataset.fitbSig===sig)return;
  if(!el){el=document.createElement('div');el.className='fitb-gloss';el.dataset.noGlossary='1';scope.appendChild(el)}
  el.dataset.fitbSig=sig;
  el.innerHTML='<span class="fitb-gloss-label">この画面の用語</span>'+terms.map(function(t){
    return '<button type="button" class="fitb-gloss-item" data-fitb-term="'+esc(t.id)+'"><b>'+esc(t.label)+'</b><span>'+esc(t.plain)+'</span></button>'
  }).join('');
}
function decorateRoot(root){
  if(level==='compact'||!root||decorationBusy)return;decorationBusy=true;
  try{
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];let n;
    while((n=walker.nextNode())){if(nodes.length>=400)break;if(!excluded(n)&&n.nodeValue&&n.nodeValue.trim().length>1)nodes.push(n)}
    const seen=pageSeenTerms(),scopes=new Map();let count=0;
    nodes.forEach(function(node){
      if(count>=MAX_TERMS_PER_PASS||!node.parentNode)return;
      // card内に無いtext nodeも印は付ける。用語メモはcardを持つscopeだけに出す。
      const scope=glossScope(node)||root;
      let state=scopes.get(scope);if(!state){state=scopeState(scope);scopes.set(scope,state)}
      if(state.terms.length>=MAX_TERMS_PER_SCOPE)return;
      const match=findMatch(node.nodeValue,seen);if(!match)return;
      const start=match.index,end=start+match.alias.alias.length,original=node.nodeValue.slice(start,end),frag=document.createDocumentFragment();
      frag.appendChild(document.createTextNode(node.nodeValue.slice(0,start)));
      frag.appendChild(termButton(match.alias.term,original));
      frag.appendChild(document.createTextNode(node.nodeValue.slice(end)));
      node.replaceWith(frag);seen.add(match.alias.term.id);state.ids.add(match.alias.term.id);state.terms.push(match.alias.term);count++
    });
    scopes.forEach(function(state,scope){renderGloss(scope,state.terms)})
  }finally{decorationBusy=false}
}
function decorateAll(){const main=document.querySelector('main');if(main)decorateRoot(main)}
function unwrapTerms(root){
  const r=root||document;
  const marks=r.querySelectorAll('.fitb-term');
  const parents=new Set();
  marks.forEach(function(b){
    if(b.parentNode)parents.add(b.parentNode);
    b.replaceWith(document.createTextNode(b.dataset.fitbOriginal||b.textContent||''))
  });
  // replaceWithだけでは text node が3つに割れたまま残る。
  // 文字列一致で本文を書き換える側（Profile差分等）のために、隣接text nodeを結合して元の1文へ戻す。
  parents.forEach(function(el){if(el.normalize)el.normalize()});
  r.querySelectorAll('.fitb-gloss').forEach(function(g){g.remove()})
}

// hover / focus の即時説明。行の高さも折り返しも変えない位置固定のtooltip。
function ensureTip(){
  let tip=document.getElementById('fitbTip');if(tip)return tip;
  tip=document.createElement('div');tip.id='fitbTip';tip.className='fitb-tip';tip.hidden=true;tip.dataset.noGlossary='1';tip.setAttribute('role','tooltip');
  document.body.appendChild(tip);return tip;
}
function showTip(btn){
  const t=termById(btn.dataset.fitbTerm);if(!t)return;
  const tip=ensureTip();tip.innerHTML='<b>'+esc(t.label)+'</b><span>'+esc(t.plain)+'</span>';tip.hidden=false;
  const r=btn.getBoundingClientRect(),w=tip.offsetWidth,h=tip.offsetHeight;
  let left=r.left+r.width/2-w/2;left=Math.max(8,Math.min(left,window.innerWidth-w-8));
  let top=r.top-h-8;if(top<8)top=r.bottom+8;
  tip.style.left=left+'px';tip.style.top=top+'px'
}
function hideTip(){const tip=document.getElementById('fitbTip');if(tip)tip.hidden=true}
function bindTip(){
  document.addEventListener('mouseover',function(e){const b=e.target.closest&&e.target.closest('.fitb-term');if(b)showTip(b)});
  document.addEventListener('mouseout',function(e){if(e.target.closest&&e.target.closest('.fitb-term'))hideTip()});
  document.addEventListener('focusin',function(e){const b=e.target.closest&&e.target.closest('.fitb-term');if(b)showTip(b)});
  document.addEventListener('focusout',hideTip);
  window.addEventListener('scroll',hideTip,{passive:true});
  window.addEventListener('resize',hideTip)
}

function readViewed(){try{return new Set(JSON.parse(readStorage(FOUNDATION_VIEWED_KEY)||'[]'))}catch(e){return new Set()}}
function saveViewed(set){writeStorage(FOUNDATION_VIEWED_KEY,JSON.stringify(Array.from(set).sort(function(a,b){return a-b})))}
function foundationComplete(){return readStorage(FOUNDATION_COMPLETE_KEY)==='true'}
function termLink(id){const t=termById(id);return t?'<button type="button" class="cosf-term" data-fitb-term="'+t.id+'">'+esc(t.label)+'<small>'+esc(t.plain)+'</small></button>':''}
function foundationHtml(){
  const viewed=readViewed(),complete=foundationComplete();
  const shouldOpen=location.hash==='#foundation'||(level==='beginner'&&!complete);const step=FOUNDATION_STEPS[foundationStep]||FOUNDATION_STEPS[0];
  return '<section class="cosf-foundation" id="computerOsFoundationPanel" data-no-glossary="1"><div class="cosf-head"><div><div class="cosf-kicker">LEARNING STEP -2 / 10–15 MIN</div><h2>ComputerとOSは、どう動いている？</h2><p>Kernel・Process・Default Routeという言葉を使う前に、普通の言葉で関係性をつかみます。</p></div><div class="cosf-head-actions"><span class="cosf-level">説明：'+esc(levelLabel())+'</span><span class="cosf-complete '+(complete?'done':'')+'">'+(complete?'✓ Foundation修了':'基礎から開始')+'</span><button type="button" data-cosf-glossary>📖 用語帳</button></div></div><details class="cosf-details" '+(shouldOpen?'open':'')+'><summary><span>Computer・OS・Networkの超入門を'+(shouldOpen?'閉じる':'開く')+'</span><small>分かる人は閉じたまま、または「説明最小」にできます。</small></summary><div class="cosf-inside"><div class="cosf-principle"><b>表示ルール</b><span>普通の言葉 → 専門用語 → System上の位置、の順で説明します。深い内部実装は必要になってから開きます。</span></div><div class="cosf-progress"><div><b>'+viewed.size+' / '+FOUNDATION_STEPS.length+'</b><span>STEP VIEWED</span></div><div class="cosf-progress-bar"><i style="width:'+(viewed.size/FOUNDATION_STEPS.length*100)+'%"></i></div></div><nav class="cosf-step-nav">'+FOUNDATION_STEPS.map(function(s,i){return '<button type="button" data-cosf-step="'+i+'" class="'+(i===foundationStep?'active ':'')+(viewed.has(s.id)?'viewed':'')+'"><small>'+String(s.id).padStart(2,'0')+'</small><span>'+esc(s.title)+'</span></button>'}).join('')+'</nav><section class="cosf-stage"><div class="cosf-stage-copy"><div class="cosf-stage-number">STEP '+String(step.id).padStart(2,'0')+'</div><h3>'+esc(step.title)+'</h3><p class="cosf-question">❓ '+esc(step.question)+'</p><p>'+esc(step.body)+'</p><div class="cosf-terms">'+step.terms.map(termLink).join('')+'</div></div><pre class="cosf-map" aria-live="polite">'+esc(step.map)+'</pre></section>'+foundationQuiz(viewed,complete)+'<div class="cosf-next"><button type="button" data-cosf-next>次：金融ITのLinux Profileへ ↓</button><span>STEP -1でRHEL系・Ubuntu・SLES・Oracle Linuxの違いを見ます。</span></div></div></details></section>';
}
function foundationQuiz(viewed,complete){
  if(complete)return '<section class="cosf-quiz passed"><div><small>30-SECOND CHECK</small><h3>✅ 基本関係を確認できました</h3><p>Lab中に分からない用語が出たら、右上の「基本用語」からいつでも戻れます。</p></div></section>';
  if(viewed.size<FOUNDATION_STEPS.length)return '<section class="cosf-quiz locked"><div><small>30-SECOND CHECK</small><h3>8 STEPを一度ずつ見てから確認</h3><p>残り '+(FOUNDATION_STEPS.length-viewed.size)+' STEP。暗記ではなく、図の関係が分かれば十分です。</p></div></section>';
  return '<section class="cosf-quiz"><div><small>30-SECOND CHECK</small><h3>3問だけ確認</h3><p>正解できなくても、該当STEPへ戻ればOK。</p></div><div class="cosf-quiz-grid"><label>Programを起動して、いま動いている状態は？<select data-cosf-q="q1"><option value="">選択</option><option value="file">File</option><option value="process">Process</option><option value="route">Route</option></select></label><label>同じNetwork外へ出る基本の出口は？<select data-cosf-q="q2"><option value="">選択</option><option value="dns">DNS</option><option value="route">Default Route</option><option value="port">Port</option></select></label><label>nginxは何のために追加する？<select data-cosf-q="q3"><option value="">選択</option><option value="network">LinuxをNetworkへ接続する</option><option value="nginx">Web Server役割を実現する</option><option value="kernel">Kernelを起動する</option></select></label></div><button type="button" class="cosf-check" data-cosf-check>回答を確認</button>'+(quizMessage?'<p class="cosf-feedback">'+esc(quizMessage)+'</p>':'')+'</section>';
}
function findFoundationAnchor(){return document.getElementById('componentRationalePanel')||document.querySelector('.fit-linux-zero')||document.querySelector('.hero')}
function renderFoundation(force){
  if(!isLinuxHome())return;
  const forced=document.querySelector('.linux-distro-modal');if(forced&&window.LinuxLabDistro&&window.LinuxLabDistro.get&&!window.LinuxLabDistro.get())forced.remove();
  const old=document.getElementById('computerOsFoundationPanel');if(old&&!force)return;if(old)old.remove();
  const anchor=findFoundationAnchor();if(!anchor)return;const wrap=document.createElement('div');wrap.innerHTML=foundationHtml();const panel=wrap.firstElementChild;
  if(anchor.id==='componentRationalePanel')anchor.insertAdjacentElement('beforebegin',panel);else anchor.insertAdjacentElement('afterend',panel);bindFoundation(panel);
}
function bindFoundation(panel){
  panel.querySelectorAll('[data-cosf-step]').forEach(function(b){b.addEventListener('click',function(){foundationStep=Number(b.dataset.cosfStep)||0;const viewed=readViewed();viewed.add(FOUNDATION_STEPS[foundationStep].id);saveViewed(viewed);renderFoundation(true);const p=document.getElementById('computerOsFoundationPanel');if(p){const d=p.querySelector('.cosf-details');if(d)d.open=true;p.scrollIntoView({block:'start'})}})});
  panel.querySelector('[data-cosf-glossary]')?.addEventListener('click',function(){openDrawer()});
  panel.querySelectorAll('[data-fitb-term]').forEach(function(b){b.addEventListener('click',function(){openDrawer(b.dataset.fitbTerm)})});
  panel.querySelector('[data-cosf-check]')?.addEventListener('click',function(){const values={};panel.querySelectorAll('[data-cosf-q]').forEach(function(s){values[s.dataset.cosfQ]=s.value});const score=(values.q1==='process'?1:0)+(values.q2==='route'?1:0)+(values.q3==='nginx'?1:0);if(score===3){writeStorage(FOUNDATION_COMPLETE_KEY,'true');quizMessage='3問正解。専門語を、役割と関係性から説明できています。'}else{quizMessage=score+' / 3。Process・Default Route・nginxの役割を該当STEPで見直そう。'}renderFoundation(true)});
  panel.querySelector('[data-cosf-next]')?.addEventListener('click',function(){const target=document.getElementById('componentRationalePanel');if(target)target.scrollIntoView({behavior:'smooth',block:'start'});if(window.LinuxLabDistro&&window.LinuxLabDistro.get&&!window.LinuxLabDistro.get()&&window.LinuxLabDistro.openSelector)setTimeout(function(){window.LinuxLabDistro.openSelector(false)},350)});
}
function openFoundationAndScroll(){renderFoundation(true);setTimeout(function(){const p=document.getElementById('computerOsFoundationPanel');if(!p)return;const d=p.querySelector('.cosf-details');if(d)d.open=true;p.scrollIntoView({behavior:'smooth',block:'start'})},60)}

function handleTermClick(e){const b=e.target.closest('[data-fitb-term]');if(!b)return;e.preventDefault();hideTip();openDrawer(b.dataset.fitbTerm)}
function observe(){
  const observer=new MutationObserver(function(records){
    if(isLinuxHome())renderFoundation(false);
    if(level==='compact'||decorationBusy)return;
    // debounceでtimerを張り直すと、先に届いたbatchのaddedNodesが捨てられる。
    // 遅れて差し込まれるcard（component rationale等）が注釈されない原因になるため、対象を貯めてから処理する。
    records.forEach(function(r){r.addedNodes.forEach(function(n){
      if(n.nodeType===1&&!n.closest?.('.fitb-drawer,.cosf-foundation'))pendingRoots.push(n);
      else if(n.nodeType===3&&n.parentElement)pendingRoots.push(n.parentElement)
    })});
    if(!pendingRoots.length)return;
    clearTimeout(mutationTimer);
    mutationTimer=setTimeout(function(){
      const roots=pendingRoots;pendingRoots=[];
      roots.forEach(function(n){if(n.isConnected)decorateRoot(n)})
    },80)
  });
  observer.observe(document.body,{childList:true,subtree:true});
}
function init(){
  ensureCss();setRootLevel();createLauncher();ensureDrawer();document.addEventListener('click',handleTermClick);bindTip();renderFoundation(false);if(level!=='compact')decorateAll();observe();
  window.addEventListener('hashchange',function(){if(location.hash==='#foundation')openFoundationAndScroll()});if(location.hash==='#foundation')openFoundationAndScroll();
  window.FIT_FOUNDATION_GLOSSARY={terms:TERMS,levels:LEVELS,getLevel:function(){return level},setLevel:setLevel,open:openDrawer,unwrap:unwrapTerms,foundationComplete:foundationComplete};
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
