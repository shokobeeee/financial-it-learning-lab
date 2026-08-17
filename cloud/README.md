# Cloud Fundamentals — Complete Package

## Goal

AWS / Google Cloud / Azure / OCIのサービス名を覚える前に、Cloudを Network / Compute / Data / Identity / Observability / DR / Hybrid / Cost という共通構造として理解すること。

## Layer Model

```text
Business / SLO
  ↓
Responsibility / Account Boundary
  ↓
Network
  ↓
Compute
  ↓
Data / Messaging
  ↓
Identity / Security
  ↓
Observability / Change / Hybrid / DR
```

## Provider Translation Profiles

**🧭 Context**で同じConceptをproviderへ翻訳する。

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

OCIは現状translation profileとして取り込み、VCN / Compute / Database services / IAM / Vault / Monitoring / Audit / FastConnect等を共通概念へ対応付ける。固有論点を20段階で学ぶ必要が出た場合に独立Package化する。

## 20 Labs

- 01–07: Shared Responsibility, Region/AZ, Network, Subnet, Route/NAT, LB, Compute
- 08–14: Storage, Managed DB, IAM, Encryption/KMS, Secrets/Certificate, Observability, Backup
- 15–19: Hybrid, HA/DR, IaC/Change, FinOps, Third Party/Governance
- 20: Cloud Fundamentals War Room

## Completion

- Lab01–20を修了
- provider名なしでも障害レイヤとEvidenceを説明
- Common Conceptから複数providerへ翻訳し、1:1同一視しない
- Shared Responsibility / RTO / RPO / Hybrid / Reconciliationを会話に入れられる
- 進捗キー: `cloud_labXX_complete`

## Field Questions

- 重要業務・SLO・RTO/RPO・正本は何か
- 障害ドメインと責任分界はどこか
- Customer→Network→Compute→Data→Coreの経路はどうか
- Identity / Key / Secret / Auditはどう分かれているか
- provider固有サービスでは、同じ目的のEvidenceをどこから取るか
- 技術復旧後の顧客導線・金融データ照合は何か

Next: **AWS / Google Cloud / Azure**
