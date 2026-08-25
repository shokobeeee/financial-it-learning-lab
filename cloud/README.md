# Cloud Fundamentals — Complete Package

## Goal

クラウド用語を先に覚えるのではなく、**残高照会をする小さな銀行Webサービスをゼロから組み立てながら**、なぜNetwork / Compute / Database / IAM / Backup等が必要なのかを理解する。

Cloud系の分類・Provider mappingの正本は **`assets/js/cloud-concepts.js`**。

## Zero Base Learning Model

```text
何もない
  ↓
Webサービスには何が必要？
  ↓
🖥 処理する場所
🗄 データを保存する場所
🌐 利用者とつなぐ通信
  ↓
☁️ それらをCloudで借りる
  ↓
困る → 部品を足す → 名前を知る → 確認する
```

VPC / IAM / AZ / KMS 等はStep 0では暗記させない。必要になったLabで初めて名前を付ける。

## 20 Labs — 銀行Webシステムを育てる

### 01–07 まず仕組みをつくる

1. Webサービスはどう動く？
2. クラウドにアプリを置く — VM / Compute
3. データを置く — Persistent Data / 正本
4. 自分たちのネットワークを作る — Virtual Network
5. 公開する場所と隠す場所を分ける — Subnet
6. 外へ出る / 外から入る — Route / NAT
7. 入口を1つにする — Load Balancer / Health Check

### 08–15 安全に・止まりにくくする

8. 誰が通信できるかを絞る — Firewall
9. 同じ場所の障害で全部止めない — Availability Zone / Failure Domain
   - Auto Scaling / MIG / VM Scale Sets等の**台数・自動復旧はCompute管理という別の分類軸**。
10. データの置き場所を使い分ける — Object / Block / File
11. DB運用の一部をCloudに任せる — Managed DB / Shared Responsibility
12. 誰が何を操作できるか — IAM
13. パスワード・鍵・証明書を守る — Secret / KMS / Certificate
14. 壊れたことを知る — Metrics / Logs / Traces / Audit
15. データを戻せるようにする — Backup / Restore / RPO / RTO

### 16–20 金融システムとして運用する

16. Region規模の障害に備える — DR
17. 銀行の社内システムとつなぐ — Hybrid / VPN / Dedicated Link
18. 同じ仕組みをAWS / Google Cloud / Azure / OCIへ翻訳
19. 金融で使う前に運用を決める — IaC / Change / Audit / FinOps / Third Party
20. Cloud War Room

各Labでは **「🏗 いま作っている銀行システム」** と **「🧭 今回の位置」** を表示し、今回増えた部品と所属レイヤーを確認する。

## Canonical Lab + Provider Adapter

```text
Cloud Fundamentals canonical 20 Labs
  ↓
Cloud Concept Registry
  ↓
AWS / Google Cloud / Azure Adapter
```

3 Provider教材は別々の20概念を持たない。同じLab番号・同じConcept順を使い、製品名だけを翻訳する。

## Provider Translation Profiles

`☁️ Cloud Map` / `🧭 Context` で共通Conceptをproviderへ翻訳する。

- Common Concept — default
- AWS
- Google Cloud
- Microsoft Azure
- Oracle Cloud Infrastructure (OCI)

例:

- Virtual Network ≒ VPC / VNet / VCN
- Managed relational DB ≒ RDS/Aurora / Cloud SQL/AlloyDB / Azure SQL / OCI Database services
- Private dedicated connection ≒ Direct Connect / Interconnect / ExpressRoute / FastConnect

`≒` は概念上の対応であり、機能・制約・SLA・運用方法が同一という意味ではない。

## Completion

- Lab01–20を修了
- Customer → Internet → Cloud → App → Database → Core の経路を図で説明できる
- 専門用語を「何の問題を解決する部品か」で説明できる
- Common Conceptから複数providerへ翻訳し、1:1同一視しない
- Failure Domain / Compute管理 / Service Model等の分類軸を混ぜない
- 技術復旧後に顧客導線・件数・金額・正本まで照合する
- 進捗キー: `cloud_labXX_complete`

Next: **AWS / Google Cloud / Azure**
