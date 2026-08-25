# AWS for Financial IT — Cloud Fundamentals Translation Package

## Goal

Cloud Fundamentalsで作った同じ銀行Webを、**同じLab番号・同じConcept順**でAWSへ翻訳する。

AWSを新しい20個の仕組みとして覚えない。正本は `assets/js/cloud-concepts.js`。

```text
共通Concept             → AWSの代表実装
VM / Compute            → Amazon EC2
Virtual Network         → Amazon VPC
Managed Relational DB   → Amazon RDS / Aurora
Identity                → AWS IAM / IAM Role
Observe / Audit         → CloudWatch / CloudTrail
Hybrid                  → Direct Connect / Site-to-Site VPN
```

Provider間は `=` ではなく **`≒ conceptual mapping`**。

## Learning Step 0

**「Cloud Fundamentalsで作った銀行Webを、AWSでは何と呼ぶ？」**から始める。

Provider教材は `Cloud Fundamentals canonical topics → Cloud Concept Registry → AWS Adapter` の順で描画する。

## 20 Labs — Cloud Fundamentalsと番号を揃える

- 01 Webサービスの流れ
- 02 VM / Compute — Amazon EC2
- 03 Persistent Data / 正本 — RDS / Aurora / DB on EC2等、要件で選ぶ
- 04 Virtual Network — Amazon VPC
- 05 Public / Private — Subnet
- 06 Route / NAT — Route Table / Internet Gateway / NAT Gateway
- 07 Entry / Load Balancer — Elastic Load Balancing
- 08 Firewall — Security Group / NACL
- 09 Failure Domain — Availability Zone
  - Computeの台数・自動復旧は **EC2 Auto Scaling / Auto Scaling group**。AZとは別分類。
- 10 Storage — S3 / EBS / EFS
- 11 Managed DB — RDS / Aurora
- 12 IAM — AWS IAM / IAM Role
- 13 Secret / Key / Certificate — Secrets Manager / KMS / ACM
- 14 Observability — CloudWatch / CloudTrail
- 15 Backup / RPO / RTO — AWS Backup / Snapshot / Restore
- 16 Region / DR — Region / Multi-Region DR
- 17 Hybrid — Direct Connect / Site-to-Site VPN
- 18 Provider Translation
- 19 Change / Governance — CloudFormation / Organizations / Cost Explorer
- 20 AWS Financial War Room

## Provider Extras

主導線を崩さないよう独立Labにはしないが、Cloud Map / Guideで以下も扱う。

- SQS / SNS / EventBridge — Queue / Event連携
- VPC Endpoint / PrivateLink — Private Service Connectivity
- ECS / EKS / Fargate / Lambda — Container / Serverless等の実行方式

## Completion

AWS名を見て共通Conceptへ戻せ、共通Conceptから代表AWSサービスを挙げられること。AWS側GreenだけでなくCore・顧客導線・金融Dataまで確認する。

Next: **Google Cloud / Azure / Financial War Room**
