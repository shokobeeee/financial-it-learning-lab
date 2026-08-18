(function(){
'use strict';
const S=window.CLOUD_SPEC;if(!S)return;
const T=(group,title,subtitle,goal,scope,principle,q,correct,w1,w2,explain)=>[group,title,subtitle,goal,scope,principle,q,correct,w1,w2,explain];
S.kicker='CLOUD FUNDAMENTALS 01–20 / ZERO BASE';
S.hero='クラウドを、<br>ゼロから組み立てて理解する。';
S.description='残高照会をする小さな銀行Webサービスを、何もない状態から20 Labsで育てます。専門用語は先に暗記せず、「困る → 部品を足す → 名前を知る」の順で学びます。';
S.finish='Customer → Internet → Cloud → App → Database → Core の流れを図で説明し、止めない・守る・監視する・戻すために何が必要かを自分の言葉で説明できる。';
S.chips=['コンピュータ','ネットワーク','データ','権限','監視','復旧'];
S.outcomes=['Webサービスの流れ','Compute','Database','Virtual Network','Subnet','Route / NAT','Load Balancer','Firewall','AZ / HA','Storage','Managed DB','IAM','Secret / Key','Observability','Backup','RPO / RTO','Region / DR','Hybrid','Provider Translation','War Room'];
S.groups=['まず仕組みをつくる','安全に・止まりにくくする','金融システムとして運用する'];
S.stage={
 title:'クラウドって、そもそも何？',
 intro:'Webサービスを動かすには、アプリを動かすコンピュータ、通信するネットワーク、データを保存する場所が必要です。それを自分で全部買って持つ代わりに、必要なIT部品を事業者から借りて組み合わせて使うのがクラウドです。',
 nodes:[['🖥 コンピュータ','アプリを動かす','部品'],['🗄 データ','情報を保存する','保存'],['🌐 ネットワーク','利用者とつなぐ','接続'],['☁️ クラウド','IT部品を借りて使う','借りる'],['🏦 銀行Web','部品を組み合わせる','完成形']],
 initialConsole:'①から順に押してみよう。ここでは VPC / IAM / AZ などの専門用語はまだ覚えなくてOKです。',
 console:[
  '🖥 まず必要なのは「処理するコンピュータ」\n\nお客さんが「残高を見たい」と送った要求を、銀行アプリが受け取って処理します。アプリはどこかのコンピュータ上で動きます。',
  '🗄 次に「データを保存する場所」が必要\n\n口座番号、残高、取引履歴など。アプリだけあっても、残高データがなければ100,000円とは返せません。',
  '🌐 利用者とアプリをネットワークでつなぐ\n\n📱 お客さん → Internet → 🖥 アプリ → 🗄 データ\n\nまずはこの流れがWebサービスの基本です。',
  '☁️ クラウドでは、コンピュータ・ネットワーク・保存場所などを必要な分だけ借りて使えます。\n\nAWS / Google Cloud / Azure / OCI は、こうしたIT部品を提供する事業者・サービス群です。',
  '🏦 今回の20 Labsでは「残高照会をする銀行Webサービス」を少しずつ育てます。\n\n最初はAppとDatabaseだけ。そこから「外に丸見えで困る」「1台壊れたら困る」「誰でも操作できたら困る」を解決しながら、VPC / IAM / AZなどの名前を後から知ります。'
 ],
 roles:[['最初に覚えること','<b>クラウド = IT部品を借りて組み合わせる場所</b>くらいでOK。'],['まだ覚えなくていい','VPC / IAM / AZ / KMSは、<b>必要になったLabで初めて名前を付けます</b>。'],['今回つくるもの','<b>残高照会をする小さな銀行Webサービス</b>。Labが進むたびに構成図が育ちます。'],['学び方','<b>困る → 部品を足す → 名前を知る → 確認する</b>。用語暗記から始めません。']]
};
S.topics=[
T('まず仕組みをつくる','Webサービスはどう動く？','お客さんの操作が、アプリとデータまで届く流れを見る。','Customer → Application → Database → Response の基本の流れを説明できる。',['customer request','application','database','response'],'customer request → application → database → response の順で処理を追う','残高照会で最低限必要な流れは？','利用者の要求をアプリが処理し、DBを読み、結果を返す','まずVPCとIAMだけ作ればよい','DatabaseだけあればApplicationは不要','クラウド以前に、Webサービスは「要求を受ける → 処理する → データを読む → 返す」で動きます。'),
T('まず仕組みをつくる','クラウドにアプリを置く','アプリが動くコンピュータを用意する。','Computeが「アプリを実行する場所」だと説明できる。',['compute','application','runtime','capacity'],'アプリを実行するComputeを、必要な性能と運用方法で選ぶ','Computeは何のために使う？','アプリや処理を実行する','DBの行を自動で正しくする','IAMの代わりに権限を管理する','VM・Container・Serverlessなど名前は違っても、まず「処理をどこで動かすか」の話です。'),
T('まず仕組みをつくる','データを置く','残高を保存する場所を用意する。','アプリとDatabaseの役割を分けて説明できる。',['database','persistent data','authoritative source','backup'],'業務データを永続化し、どこが正本かを明確にする','残高データについて最初に決めるべきことは？','どこが正本か','アプリサーバーの壁紙','Region名の文字数','金融では「どこに保存するか」だけでなく「どれが正しい正本か」が重要です。'),
T('まず仕組みをつくる','自分たちのネットワークを作る','AppとDBを、クラウド内の自分たちの範囲に入れる。','Virtual Networkを「クラウド内の自分たち用ネットワーク境界」として説明できる。',['virtual network','CIDR','private boundary','routing'],'クラウド内に論理ネットワーク境界を作り、アドレスと到達経路を設計する','Virtual Networkを作る主目的は？','自分たちの通信範囲と経路を設計する','SQLを速くする','ファイル名を短くする','AWSではVPC、AzureではVNet、OCIではVCN。まずは「自分たちのネットワークを作る」と理解すればOKです。'),
T('まず仕組みをつくる','公開する場所と隠す場所を分ける','入口と内部処理・DBを同じ場所に置かない。','Public / Privateを名前ではなく「どこから到達できるか」で説明できる。',['subnet','public','private','database'],'公開が必要な入口と、直接公開しないApp/Databaseを分ける','金融DBの基本配置として妥当なのは？','Internetから直接触れない内部側に置く','必ずInternetへ直接公開する','全Portを0.0.0.0/0へ開く','Public/Privateという名前より、実際のRouteと通信許可で判断します。'),
T('まず仕組みをつくる','外へ出る／外から入る','通信の向きを分けて考える。','RouteとNAT/Egress、Inboundの違いを説明できる。',['route','NAT','egress','inbound'],'どこへ送るかをRouteで決め、内部からの外向き通信と外部からの着信を分ける','NATの代表的な使い方は？','内部側から必要な外向き通信を行う','DB認証を代替する','すべての着信を許可する','「外へ出られる」と「外から入ってこられる」は別の話です。'),
T('まず仕組みをつくる','入口を1つにする','複数のAppへ要求を振り分ける。','Load BalancerとHealth Checkの役割を説明できる。',['load balancer','backend','health check','timeout'],'入口で複数Backendへ振り分け、業務を表すHealth Checkを使う','Load BalancerがGreenでも障害が起こる理由は？','Health Checkが実際の業務処理を十分に確認していないことがある','Load Balancerは必ずDBを書き換えるから','IPアドレスが長いから','入口が正常でも、AppやDBまで含む実業務が正常とは限りません。'),
T('安全に・止まりにくくする','誰が通信できるかを絞る','必要な相手・Portだけ通信を許す。','Firewall / Security Ruleを「通信の許可条件」として説明できる。',['firewall','security rule','source','port'],'必要なsource / destination / portだけ許可し、公開範囲を最小化する','DB通信で基本的に避けるべき設定は？','誰からでも全Port接続できる状態','Appから必要Portだけ許可する','管理経路を限定する','Firewallは認証の代わりではありません。Network到達性とIdentity権限は別レイヤです。'),
T('安全に・止まりにくくする','1台壊れても止めない','同じ役割を複数の障害範囲に置く。','AZ/Zoneを「障害範囲を分ける単位」として説明できる。',['availability zone','redundancy','failure domain','health'],'重要な処理を独立したfailure domainへ分散し、片方の故障で全停止しないようにする','AZ/Zoneを分ける主目的は？','同じ場所の障害で全部止まるのを避ける','SQL文を短くする','IAM Roleを減らす','AZは「速い場所」ではなく、まず障害範囲を分けるための考え方です。'),
T('安全に・止まりにくくする','データの置き場所を使い分ける','Object / Block / Fileを用途で選ぶ。','保存方式をアクセス方法と復旧要件で選べる。',['object','block','file','access pattern'],'backup/archive・VM disk・shared fileを用途に合うstorage typeへ分ける','ストレージを選ぶ主な軸は？','どう読み書きするかと復旧要件','全部Object Storageにする','価格だけで決める','同じ「保存」でも、VMのDisk、共有File、バックアップ用Objectでは使い方が違います。'),
T('安全に・止まりにくくする','DB運用の一部をクラウドに任せる','DBサーバー管理の一部をサービス側に任せる。','Managed DBとShared Responsibilityを自然に説明できる。',['managed DB','provider responsibility','customer responsibility','data integrity'],'基盤運用の一部をProviderへ任せても、データ・権限・SQL・整合性の責任は自組織に残る','Managed DBにしても自分たちに残る責任は？','データモデル・権限・SQL・業務整合性','何も残らない','クラウド会社の社内人事だけ','ここで初めてShared Responsibilityを覚えればOK。「任せた部分」と「自分たちに残る部分」を分ける考え方です。'),
T('安全に・止まりにくくする','誰が何を操作できるか','人・アプリ・運用者の権限を分ける。','IAMを「誰が何をしてよいか」を決める仕組みとして説明できる。',['identity','role','policy','least privilege'],'人とアプリのIdentityを分け、必要最小限のRole / Policyだけ与える','アプリに管理者権限を与えない理由は？','侵害や誤操作時の被害範囲を狭める','CPUを速くする','DNSを短くする','IAMという単語より先に「誰が何をできる？」と考えると理解しやすくなります。'),
T('安全に・止まりにくくする','パスワード・鍵・証明書を守る','秘密情報をコードへ埋め込まない。','Secret / Key / Certificateの役割と更新を説明できる。',['secret','KMS','certificate','rotation'],'secretを集中管理し、暗号鍵・証明書のaccess / rotation / expiryを運用する','証明書運用で見落とすと突然停止につながるものは？','有効期限と更新経路','CPU世代','テーブル名','暗号化をONにするだけでは足りません。鍵・Secret・Certificateを誰が使い、いつ更新するかまで運用です。'),
T('安全に・止まりにくくする','壊れたことを知る','状態を数値・記録・経路で観測する。','Metrics / Logs / Traces / Auditの違いを説明できる。',['metrics','logs','traces','audit'],'症状を見るMetrics、出来事を見るLogs、処理経路を見るTraces、変更証跡を見るAuditを使い分ける','設定を誰が変更したか確認したいとき特に重要なのは？','Audit / control-plane log','CPU metricだけ','Object Storage名','「監視」を一括りにせず、何を証明したいかでEvidenceを選びます。'),
T('安全に・止まりにくくする','データを戻せるようにする','消えた・壊れたに備えて復旧する。','Backup / Restore / RPO / RTOを業務要件と結び付けられる。',['backup','restore','RPO','RTO'],'許容データ損失RPOと許容復旧時間RTOからbackup / restore testを設計する','バックアップがあるだけでは不十分な理由は？','実際に必要時間内で戻せるか確認が必要','ファイル名が長いから','IAMが使えないから','Backupは「取れた」ではなく「戻せた」まで確認して初めて意味があります。'),
T('金融システムとして運用する','場所ごとの大きな障害に備える','1台ではなく、Region規模の停止を考える。','HAとDR、Regionの違いを説明できる。',['region','DR','failover','reconciliation'],'通常の冗長化と大規模障害向けDRを分け、切替後は業務データを再照合する','DR切替後に必要なのは？','技術復旧に加え、件数・金額・正本の再照合','DNSが変われば必ず完了','RC=0だけ確認','HAは日常的な故障耐性、DRはより大きな障害からの復旧。想定障害・コスト・データ整合性が違います。'),
T('金融システムとして運用する','銀行の社内システムとつなぐ','Cloudだけで完結しない経路を追う。','Hybrid接続をCloud ↔ On-prem/Coreの一つの経路として説明できる。',['hybrid','VPN','dedicated connection','routing'],'CloudとOn-prem/Coreを冗長なVPN/専用線等で結び、Route/DNS/監視をEnd-to-Endで確認する','Cloud側がGreenなのに業務が止まる理由としてあり得るのは？','CoreまでのHybrid経路が壊れている','CloudならOn-premは関係ない','DB名が短い','金融ITではCloudが正常でも、勘定系などCoreとの接続が切れれば業務は止まります。'),
T('金融システムとして運用する','同じ仕組みを各クラウドの名前に翻訳する','共通概念をAWS / Google Cloud / Azure / OCIへ対応付ける。','製品名を共通概念へ戻して比較できる。',['common concept','AWS / GCP / Azure / OCI','service mapping','responsibility'],'まずcommon conceptを説明し、その後に各Providerのサービス名へ翻訳する','AWSのVPCとAzureのVNetを覚えるとき大事なのは？','まず共通のVirtual Network概念へ戻す','名前が違うので完全に無関係と考える','すべて同一製品として扱う','製品間は「=」ではなく「同じ目的を見る概念上の対応」として扱います。'),
T('金融システムとして運用する','金融で使う前に運用を決める','作って終わりではなく、変更・監査・コスト・外部依存を管理する。','IaC / Change / Audit / FinOps / Third Partyを運用判断として説明できる。',['change control','IaC','audit trail','cost / third party'],'再現可能な変更・承認・証跡・コスト・third-party dependencyを運用設計へ入れる','本番Cloud変更で重要なのは？','誰が何を変え、戻し方と証跡があること','Consoleで直接変えれば記録不要','コストだけ見ればよい','金融では「作れる」より「安全に変更し、説明し、戻せる」ことが重要です。'),
T('金融システムとして運用する','Cloud War Room','これまで作った銀行Webサービスの障害を横断して切り分ける。','Impact → Evidence → Cause → Safe Recovery → Business Verifyで対応できる。',['impact','evidence','safe recovery','reconcile'],'顧客影響を固定し、複数レイヤのEvidenceから原因を絞り、安全に復旧して金融データまで再照合する','復旧完了の判断として最も妥当なのは？','技術状態と顧客導線・件数・金額等の業務整合性を確認する','エラー表示が消えたら終了','原因未確認で全部再起動する','Cloud War Roomでは製品名当てではなく、どの層をどのEvidenceで確認するかを使います。')
];
S.maps=[
`📱 Customer\n   ↓\n🌐 Network\n   ↓\n🖥 Application  ← 処理する\n   ↓\n🗄 Database     ← 保存する\n   ↓\n✅ Response`,
`📱 Customer\n   ↓\n🌐 Internet\n   ↓\n☁️ Cloud\n   └ 🖥 Compute / App  ← NEW`,
`📱 Customer\n   ↓\n☁️ Cloud\n   ├ 🖥 App\n   └ 🗄 Database      ← NEW\n       └ 残高データ`,
`📱 Customer\n   ↓\n🌐 Internet\n   ↓\n☁️ Cloud\n   └ 🔒 Virtual Network  ← NEW\n      ├ 🖥 App\n      └ 🗄 DB`,
`☁️ Cloud / Virtual Network\n├ 🌐 Public area      ← 入口側\n└ 🔒 Private area     ← NEW\n   ├ 🖥 App\n   └ 🗄 DB`,
`🌐 Internet\n   ↓ inbound\n☁️ Virtual Network\n   ├ Route\n   ├ 🖥 App ── egress → NAT → Internet  ← NEW\n   └ 🗄 DB`,
`📱 Customer\n   ↓\n⚖ Load Balancer  ← NEW\n   ├→ 🖥 App A\n   └→ 🖥 App B\n        ↓\n       🗄 DB`,
`📱 Customer\n   ↓\n🛡 Firewall / Security Rule  ← NEW\n   ↓\n⚖ Load Balancer → 🖥 App → 🗄 DB`,
`☁️ Region\n├ 🧱 Zone A: ⚖ LB → 🖥 App A\n└ 🧱 Zone B:      → 🖥 App B   ← NEW\n                     ↓\n                    🗄 DB`,
`☁️ Cloud\n├ 🖥 App ── Block Storage\n├ 📁 Shared File Storage       ← NEW\n├ 🪣 Object Storage            ← NEW\n└ 🗄 Database`,
`☁️ Cloud\n├ 🖥 App\n└ 🗄 Managed Database  ← NEW\n   Provider: 基盤運用の一部\n   Customer: schema / SQL / data / access`,
`👤 Human Admin ─┐\n                  ├→ 🔐 IAM / Role / Policy  ← NEW\n🤖 Application ───┘\n                         ↓\n                    ☁️ Cloud resources`,
`🤖 App\n ↓ uses\n🔑 Secret / Key / Certificate  ← NEW\n ↓\n☁️ Service / 🗄 DB\n   ↻ rotation / expiry`,
`📱 Customer → ☁️ Cloud → 🖥 App → 🗄 DB\n               │\n               ├ 📊 Metrics\n               ├ 📝 Logs\n               ├ 🧵 Traces\n               └ 🧾 Audit        ← NEW`,
`☁️ Cloud\n├ 🖥 App\n├ 🗄 DB\n└ 💾 Backup  ← NEW\n   ↳ Restore Test\n   ↳ RPO / RTO`,
`🌏 Region A  ← usually active\n   └ 🏦 Banking Web\n        │\n        └── DR / Failover ──→ 🌏 Region B  ← NEW\n                              └ Reconcile after switch`,
`📱 Customer\n   ↓\n☁️ Cloud\n   ├ 🖥 App\n   └ 🗄 Cloud DB\n        ↓\n🔗 VPN / Dedicated Connection  ← NEW\n        ↓\n🏢 On-prem / Core / Mainframe`,
`同じ概念を製品名へ翻訳  ← NEW\n\nVirtual Network\n├ AWS    → VPC\n├ GCP    → VPC\n├ Azure  → VNet\n└ OCI    → VCN\n\n※「=」ではなく概念上の対応`,
`🏦 Banking Cloud System\n├ 🧱 Architecture\n├ 🧾 Audit Trail     ← NEW\n├ 🧰 IaC / Change   ← NEW\n├ 💰 Cost / FinOps  ← NEW\n└ 🤝 Third Party    ← NEW`,
`🚨 Cloud War Room\n\n📱 Customer\n ↓\n🌐 Edge / Network\n ↓\n🖥 App / Compute\n ↓\n🗄 Data / Queue\n ↓\n🔗 Core / On-prem\n\nImpact → Evidence → Safe Recovery → Reconcile`
];
})();