# Google Cloud for Financial IT — Complete Package

## Goal

Google Cloud固有名を、Network / Compute / Data / IAM / Observability / Messaging / Hybridという共通構造へ戻して説明できること。

## Context Model

このPackageはGoogle Cloud固有。ただし **🧭 Context** ではCommon Conceptを正面に置き、AWS / Azure / OCIとの `≒ conceptual mapping` を確認できる。

- VPC ≒ virtual network concept
- Cloud SQL / AlloyDB ≒ managed relational database concept
- Cloud Interconnect ≒ dedicated hybrid connectivity concept
- Cloud Audit Logs ≒ control-plane/audit evidence concept

製品差分は残し、サービス名の置換表としては扱わない。

## 20 Labs

- 01–06: Resource hierarchy/Region/Zone, VPC/Subnet, Firewall/Route/NAT, Compute/LB
- 07–10: Cloud Storage/Persistent Disk/Filestore, Cloud SQL等, IAM/Service Account, KMS/Secret Manager
- 11–14: Cloud DNS, Monitoring/Logging/Audit Logs, Pub/Sub, Cloud Run/GKE等
- 15–20: Interconnect/VPN, Private Service access, Backup/DR, IaC/Change, Cost/Architecture, War Room

## Completion

- Lab01–20を修了
- runtime evidenceとaudit evidenceを使い分ける
- Scope BadgeでNetwork / Compute / Data / Identity / Observe / Async / Hybridを分離
- 非同期処理をduplicate / retry / idempotencyと結び付ける
- 進捗キー: `gcp_labXX_complete`

## Field Questions

- Organization/Folder/ProjectとIAM境界はどうなっているか
- VPC route/firewall/NATからbackendまで到達しているか
- Cloud SQL等の正本/replicaとfreshness要件は一致するか
- Monitoring/LoggingとAudit Logsのどれが今回の証拠か
- Interconnect/VPNからCoreまでEnd-to-Endで正常か
- そのEvidenceはGoogle Cloud固有実装か、共通概念か

Next: **Azure / Financial War Room**
