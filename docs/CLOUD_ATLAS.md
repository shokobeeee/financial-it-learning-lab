# Cloud Map / Terminology Atlas

Cloud系教材では、サービス名を単独で暗記せず、必ず次の4軸で位置づける。

## 1. 何をする？ — Functional Layer

- 全体 / Architecture — End-to-End、Region/AZ、責任分界、DR等
- Edge / Entry — DNS、Load Balancer、API入口
- Network — VPC/VNet/VCN、Subnet、Route、NAT、Firewall
- Compute — VM、Container、Serverless
- Data — Database、Object/Block/File Storage
- Identity / Security — IAM、Role、Secret、Key、Certificate
- Integration — Queue、Event、API Gateway
- Operations / Governance — Metrics、Logs、Audit、Backup、IaC、Change、Cost
- Hybrid / Core — VPN、専用接続、On-prem/Core/Mainframe接続

## 2. どこまでCloud側へ任せる？ — Service / Operating Model

学習上の目安として以下を使う。

- IaaS基盤 — VPC/VNet/VCN、Subnet、Route等
- IaaS寄り — EC2 / Compute Engine / Azure VM / OCI Compute等
- Managed / PaaS寄り — RDS / Cloud SQL / Azure SQL / Autonomous Database等
- Serverless / Fully Managed — Lambda / Cloud Run functions / Azure Functions / OCI Functions等
- Control Plane / 横断 — IAM、Policy、Audit等
- Managed Operations — Monitoring、Backup、Secret/Key management等
- SaaS — ApplicationそのものをServiceとして利用

これは資格試験用の厳密な公式分類表ではない。実際の責任境界は各サービスの最新仕様・契約・構成によって異なる。

## 3. 各Providerでは何て呼ぶ？ — Product Mapping

例:

| 共通概念 | AWS | Google Cloud | Azure | OCI |
|---|---|---|---|---|
| VM / Compute | EC2 | Compute Engine | Virtual Machines | OCI Compute |
| Virtual Network | VPC | VPC | VNet | VCN |
| Managed RDB | RDS / Aurora | Cloud SQL / AlloyDB | Azure SQL / Managed Instance | Autonomous / Base / Exadata Database Service |
| Object Storage | S3 | Cloud Storage | Blob Storage | Object Storage |
| Identity | IAM / IAM Role | IAM / Service Account | Entra ID / RBAC / Managed Identity | OCI IAM / Dynamic Groups |
| Dedicated Connectivity | Direct Connect | Cloud Interconnect | ExpressRoute | FastConnect |

Provider間は `=` ではなく `≒ conceptual mapping` として扱う。

## 4. 銀行Systemのどこ？ — Banking System Position

基本の導線:

```text
Customer
  ↓
Entry / Edge
  ↓
Network
  ↓
App / Compute
  ↓
Data
  ↓
Hybrid / Core / Mainframe
```

Identity / Security、Integration、Operations / Governanceはこの導線を横断する。

## UI rule

Cloud Fundamentals / AWS / Google Cloud / Azureでは常に `☁️ Cloud Map` を利用できるようにする。

Lab画面では少なくとも次を常時表示する。

1. 今回のFunctional Layer
2. Service / Operating Model
3. 現在のProviderでの代表的な呼び名
4. Cloud Mapへの詳細導線

用語検索はProvider固有名でもCommon Conceptでも成立させる。例: `EC2` を検索すると `VM / Compute` へ到達する。

## Beginner rule

未知の用語が出たときに、学習者へ別ページのREADMEや公式Docsを探させない。

まず教材内で

`ひと言の意味 → レイヤー → 提供モデル → Provider対応 → 銀行System上の位置`

を確認できること。その後に必要なら公式Docsへ進む。
