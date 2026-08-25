# Cloud Map / Canonical Cloud Concept Registry

Cloud系教材では、サービス名を単独で暗記せず、必ず次の4軸で位置づける。

**Source of Truth:** `assets/js/cloud-concepts.js`

Cloud Fundamentals / AWS / Google Cloud / Azure / Cloud Map / Package Guideは、このregistryの20 ConceptsとProvider mappingを共通利用する。

## 1. 何をする？ — Functional Layer

- 全体 / Architecture — End-to-End、Region/AZ、責任分界、DR等
- Edge / Entry — Load Balancer、API入口、名前解決等
- Network — VPC/VNet/VCN、Subnet、Route、NAT、Firewall
- Compute — VM、Container、Serverless
- Data — Database、Object/Block/File Storage
- Identity / Security — IAM、Role、Secret、Key、Certificate
- Integration — Queue、Event、API Gateway
- Operations / Governance — Metrics、Logs、Audit、Backup、IaC、Change、Cost
- Hybrid / Core — VPN、専用接続、On-prem/Core/Mainframe接続

## 2. どこまでProvider側へ任せる？ — Service / Operating Model

学習上の目安として以下を使う。

- IaaS基盤 — VPC/VNet/VCN、Subnet、Route等
- IaaS寄り — EC2 / Compute Engine / Azure VM / OCI Compute等
- Managed / PaaS寄り — RDS / Cloud SQL / Azure SQL / Autonomous Database等
- Serverless / Fully Managed — Lambda / Cloud Run / Azure Functions / OCI Functions等
- **Compute管理 / Orchestration** — Auto Scaling group / MIG / VM Scale Sets / Instance Pools等
- Control Plane / 横断 — IAM、Policy、Audit、IaC等
- Managed Operations — Monitoring、Backup、Secret/Key management等
- SaaS — ApplicationそのものをServiceとして利用

これは資格試験用の厳密な公式分類表ではない。実際の責任境界は各サービスの最新仕様・契約・構成によって異なる。

### 分類軸を混ぜない代表例

```text
Availability Zone / Zone
  = Failure Domain（どこまで一緒に壊れるか）

Auto Scaling / MIG / VM Scale Sets
  = Compute管理 / Orchestration（台数・配置・置換・自動復旧）
```

同じ「止めない設計」で一緒に使うことはあるが、同じ分類ではない。

## 3. 各Providerでは何て呼ぶ？ — Product Mapping

例:

| 共通Concept | AWS | Google Cloud | Azure | OCI |
|---|---|---|---|---|
| VM / Compute | EC2 | Compute Engine | Virtual Machines | OCI Compute |
| Virtual Network | VPC | VPC | VNet | VCN |
| Failure Domain | Availability Zone | Zone | Availability Zone | Availability / Fault Domain |
| Compute管理 | EC2 Auto Scaling | Managed Instance Group | VM Scale Sets | Instance Pools / Autoscaling |
| Managed RDB | RDS / Aurora | Cloud SQL / AlloyDB | Azure SQL / Managed Instance | Autonomous / Base / Exadata Database Service |
| Object/Block/File | S3 / EBS / EFS | Cloud Storage / Persistent Disk / Filestore | Blob / Managed Disks / Azure Files | Object / Block / File Storage |
| Identity | IAM / IAM Role | IAM / Service Account | Entra ID / RBAC / Managed Identity | OCI IAM / Dynamic Groups |
| Dedicated Connectivity | Direct Connect | Cloud Interconnect | ExpressRoute | FastConnect |

Provider間は `=` ではなく **`≒ conceptual mapping`** として扱う。

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

## 20-Lab canonical order

```text
01 Web service flow
02 VM / Compute
03 Persistent Data / Authoritative Source
04 Virtual Network
05 Subnet / Public-Private
06 Route / NAT / Egress
07 Load Balancer / Entry
08 Firewall / Security Rule
09 Failure Domain
10 Object / Block / File Storage
11 Managed Relational Database
12 IAM / Identity / Role / Policy
13 Secret / Key / Certificate
14 Metrics / Logs / Traces / Audit
15 Backup / Restore / RPO / RTO
16 Region / DR
17 Hybrid Connectivity
18 Provider Translation
19 IaC / Change / Governance
20 Cloud War Room
```

AWS / Google Cloud / Azureはこの順番を変えず、Provider Adapterで製品名を重ねる。

## Runtime architecture

```text
Cloud Fundamentals:
  spec.js
    ↓
  cloud-concepts.js       ← taxonomy / provider mapping SoT
    ↓
  zero-base.js            ← canonical 20-Lab pedagogy
    ↓
  cloud-lab-engine.js

Provider packages:
  provider spec.js
    ↓
  cloud-concepts.js       ← same SoT
    ↓
  cloud/zero-base.js      ← same canonical pedagogy
    ↓
  cloud-provider-aligned.js
    ↓
  cloud-lab-engine.js
```

`cloud-provider-aligned.js` はConceptを新規定義せず、canonical topicへProvider名を重ねるAdapterとして扱う。

## UI rule

Cloud Fundamentals / AWS / Google Cloud / Azureでは常に `☁️ Cloud Map` を利用できるようにする。

Lab画面では少なくとも次を常時表示する。

1. 今回のFunctional Layer
2. Service / Operating Model
3. 現在のProviderでの代表的な呼び名
4. Cloud Mapへの詳細導線

用語検索はProvider固有名でもCommon Conceptでも成立させる。例: `EC2` を検索すると `VM / Compute` へ到達する。

Package GuideのRoadmap / Glossaryも同じregistryから描画する。

## Beginner rule

未知の用語が出たときに、学習者へ別ページのREADMEや公式Docsを探させない。

まず教材内で

`ひと言の意味 → レイヤー → 提供モデル → Provider対応 → 銀行System上の位置`

を確認できること。その後に必要なら公式Docsへ進む。
