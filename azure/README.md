# Azure for Financial IT — Cloud Fundamentals Translation Package

## Goal

Cloud Fundamentalsで作った同じ銀行Webを、**同じLab番号・同じConcept順**でAzureへ翻訳する。

正本は `assets/js/cloud-concepts.js`。Azure固有名を新しい20概念として覚えない。

```text
共通Concept             → Azureの代表実装
VM / Compute            → Virtual Machines
Virtual Network         → Virtual Network (VNet)
Managed Relational DB   → Azure SQL / Managed Instance
Identity                → Microsoft Entra ID / Azure RBAC / Managed Identity
Observe / Audit         → Azure Monitor / Log Analytics / Activity Log
Hybrid                  → ExpressRoute / VPN Gateway
```

Provider間は `=` ではなく **`≒ conceptual mapping`**。

## Learning Step 0

**「Cloud Fundamentalsで作った銀行Webを、Azureでは何と呼ぶ？」**から始める。

Provider教材は `Cloud Fundamentals canonical topics → Cloud Concept Registry → Azure Adapter` の順で描画する。

## 20 Labs — Cloud Fundamentalsと番号を揃える

- 01 Webサービスの流れ
- 02 VM / Compute — Virtual Machines
- 03 Persistent Data / 正本 — Azure SQL / Managed Instance / DB on VM等、要件で選ぶ
- 04 Virtual Network — Virtual Network (VNet)
- 05 Public / Private — Subnet
- 06 Route / NAT — Route Table / UDR / NAT Gateway
- 07 Entry / Load Balancer — Application Gateway / Load Balancer
- 08 Firewall — NSG / Azure Firewall
- 09 Failure Domain — Availability Zone
  - Computeの台数・自動復旧は **Virtual Machine Scale Sets**。Availability Zoneとは別分類。
- 10 Storage — Blob Storage / Managed Disks / Azure Files
- 11 Managed DB — Azure SQL / Managed Instance
- 12 IAM — Microsoft Entra ID / Azure RBAC / Managed Identity
- 13 Secret / Key / Certificate — Key Vault / Managed HSM
- 14 Observability — Azure Monitor / Log Analytics / Activity Log
- 15 Backup / RPO / RTO — Azure Backup / Restore
- 16 Region / DR — Region / Site Recovery
- 17 Hybrid — ExpressRoute / VPN Gateway
- 18 Provider Translation
- 19 Change / Governance — Bicep / Azure Policy / Subscription / Cost Management
- 20 Azure Financial War Room

## Provider Extras

- Service Bus / Event Grid — Queue / Event連携
- Private Link / Private Endpoint — Private Service Connectivity
- AKS / Container Apps / Functions — Container / Serverless等の実行方式

## Completion

Azure名を共通Conceptへ戻し、共通Conceptを代表Azureサービスへ翻訳できること。Azure側だけでなくCore・顧客導線・金融Dataまで確認する。

Next: **Financial War Room**
