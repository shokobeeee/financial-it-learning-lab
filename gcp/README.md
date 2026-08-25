# Google Cloud for Financial IT — Cloud Fundamentals Translation Package

## Goal

Cloud Fundamentalsで作った同じ銀行Webを、**同じLab番号・同じConcept順**でGoogle Cloudへ翻訳する。

正本は `assets/js/cloud-concepts.js`。Google Cloud固有名を新しい20概念として覚えない。

```text
共通Concept             → Google Cloudの代表実装
VM / Compute            → Compute Engine
Virtual Network         → VPC
Managed Relational DB   → Cloud SQL / AlloyDB
Identity                → Cloud IAM / Service Account
Observe / Audit         → Monitoring / Logging / Audit Logs
Hybrid                  → Cloud Interconnect / Cloud VPN
```

Provider間は `=` ではなく **`≒ conceptual mapping`**。

## Learning Step 0

**「Cloud Fundamentalsで作った銀行Webを、Google Cloudでは何と呼ぶ？」**から始める。

Provider教材は `Cloud Fundamentals canonical topics → Cloud Concept Registry → Google Cloud Adapter` の順で描画する。

## 20 Labs — Cloud Fundamentalsと番号を揃える

- 01 Webサービスの流れ
- 02 VM / Compute — Compute Engine
- 03 Persistent Data / 正本 — Cloud SQL / AlloyDB / DB on VM等、要件で選ぶ
- 04 Virtual Network — VPC
- 05 Public / Private — Subnet
- 06 Route / NAT — Routes / Cloud NAT
- 07 Entry / Load Balancer — Cloud Load Balancing
- 08 Firewall — VPC Firewall Rules
- 09 Failure Domain — Zone
  - Computeの台数・自動復旧は **Managed Instance Group (MIG)**。Zoneとは別分類。
- 10 Storage — Cloud Storage / Persistent Disk / Filestore
- 11 Managed DB — Cloud SQL / AlloyDB
- 12 IAM — Cloud IAM / Service Account
- 13 Secret / Key / Certificate — Secret Manager / Cloud KMS / Certificate Manager
- 14 Observability — Cloud Monitoring / Logging / Audit Logs
- 15 Backup / RPO / RTO — Backup / Snapshot / Restore
- 16 Region / DR — Region / Multi-region DR
- 17 Hybrid — Cloud Interconnect / Cloud VPN
- 18 Provider Translation
- 19 Change / Governance — Terraform / Organization / Project / Billing
- 20 Google Cloud Financial War Room

## Provider Extras

- Pub/Sub / Eventarc — Event / Pub-Sub
- Private Service Connect — Private Service Connectivity
- GKE / Cloud Run — Container / Serverless等の実行方式

## Completion

Google Cloud名を共通Conceptへ戻し、共通Conceptを代表サービスへ翻訳できること。Google Cloud側だけでなくCore・顧客導線・金融Dataまで確認する。

Next: **Azure / Financial War Room**
