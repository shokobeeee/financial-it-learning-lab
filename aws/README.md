# AWS for Financial IT — Cloud Fundamentals Translation Package

## Goal

Cloud Fundamentalsで作った同じ銀行Webを、**同じLab番号・同じ概念順**でAWSへ翻訳する。

AWSを新しい20個の仕組みとして覚えない。

```text
共通概念      → AWSの代表実装
Compute       → EC2 / ECS / Lambda
Virtual Net   → Amazon VPC
Managed DB    → RDS / Aurora
Identity      → AWS IAM
Observe       → CloudWatch / CloudTrail
Hybrid        → Direct Connect / VPN
```

## Learning Step 0

**「Cloud Fundamentalsで作った銀行Webを、AWSでは何と呼ぶ？」**から始める。

## 20 Labs — Cloud Fundamentalsと番号を揃える

- 01 Webサービスの流れ
- 02 Compute — EC2 / ECS / Lambda
- 03 Data — RDS / Aurora / S3
- 04 Network — Amazon VPC
- 05 Public / Private — Subnet
- 06 Route / NAT — Route Table / IGW / NAT Gateway
- 07 Entry — Route 53 / Elastic Load Balancing
- 08 Firewall — Security Group / NACL
- 09 HA — Availability Zone / Auto Scaling
- 10 Storage — S3 / EBS / EFS
- 11 Managed DB — RDS / Aurora
- 12 IAM — AWS IAM / IAM Role
- 13 Secret / Key — KMS / Secrets Manager / ACM
- 14 Observe — CloudWatch / CloudTrail
- 15 Backup — AWS Backup / Restore
- 16 Region / DR — Multi-AZ / Multi-Region
- 17 Hybrid — Direct Connect / VPN
- 18 Common Concept Translation
- 19 Change / Governance — CloudFormation / Organizations / Cost
- 20 AWS Financial War Room

## Provider Extras

主導線を崩さないよう独立Labにはしないが、Guide / Contextで以下も扱う。

- SQS / SNS / EventBridge — 非同期・Event連携
- VPC Endpoint / PrivateLink — Private接続
- ECS / EKS / Lambda — Container / Kubernetes / Serverlessの選択

## Completion

AWS名を見て共通概念へ戻せ、共通概念から代表AWSサービスを挙げられること。AWS側GreenだけでなくCore・顧客導線・金融データまで確認する。

Next: **Google Cloud / Azure / Financial War Room**
