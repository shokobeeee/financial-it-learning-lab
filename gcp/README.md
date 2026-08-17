# Google Cloud for Financial IT — Complete Package

## Goal

Google Cloud固有名を、Network / Compute / Data / IAM / Observability / Messaging / Hybridという共通構造へ戻して説明できること。

## 20 Labs

- 01–06: Resource hierarchy/Region/Zone, VPC/Subnet, Firewall/Route/NAT, Compute/LB
- 07–10: Cloud Storage/Persistent Disk/Filestore, Cloud SQL等, IAM/Service Account, KMS/Secret Manager
- 11–14: Cloud DNS, Monitoring/Logging/Audit Logs, Pub/Sub, Cloud Run/GKE等
- 15–20: Interconnect/VPN, Private Service access, Backup/DR, IaC/Change, Cost/Architecture, War Room

## Completion

- Lab01–20を修了
- runtime evidenceとaudit evidenceを使い分ける
- 非同期処理をduplicate / retry / idempotencyと結び付ける
- 進捗キー: `gcp_labXX_complete`

## Field Questions

- Organization/Folder/ProjectとIAM境界はどうなっているか
- VPC route/firewall/NATからbackendまで到達しているか
- Cloud SQL等の正本/replicaとfreshness要件は一致するか
- Monitoring/LoggingとAudit Logsのどれが今回の証拠か
- Interconnect/VPNからCoreまでEnd-to-Endで正常か

Next: **Azure / Financial War Room**
