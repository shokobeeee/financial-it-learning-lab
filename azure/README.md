# Azure for Financial IT — Complete Package

## Goal

Azureを VNet / Compute / Data / Microsoft Entra / RBAC / Key Vault / Monitor / Hybrid という金融システム導線として理解し、共通クラウド概念へ戻して説明できること。

## Context Model

このPackageはAzure固有。ただし **🧭 Context** ではCommon Conceptを併記し、AWS / Google Cloud / OCIとの `≒ conceptual mapping` を確認できる。

- VNet ≒ virtual network concept
- Azure SQL等 ≒ managed relational database concept
- Microsoft Entra ID + Azure RBAC ≒ identity / authorization concept
- ExpressRoute ≒ dedicated hybrid connectivity concept

製品・責任・Evidenceの差は残し、単なる名称置換にしない。

## 20 Labs

- 01–06: Tenant/Subscription/Region/AZ, VNet/Subnet, NSG/Route/NAT, VM/Scale, Load Balancer/Application Gateway
- 07–10: Blob/Disk/Files, Azure SQL系, Entra/RBAC/Managed Identity, Key Vault
- 11–14: DNS, Azure Monitor/Log Analytics/Activity Log, Service Bus/Event系, Functions/Container/AKS
- 15–20: ExpressRoute/VPN, Private Link/Endpoint, Backup/DR, Bicep/ARM/IaC, Cost/Well-Architected, War Room

## Completion

- Lab01–20を修了
- identity / key / runtime / auditを役割で分離
- Scope BadgeでNetwork / Compute / Data / Identity / Observe / Async / Hybridを分離
- Azure側の正常だけでなくHybrid / 正本 / customer journeyまで確認
- 進捗キー: `azure_labXX_complete`

## Field Questions

- Tenant/Subscription/Resource Group/RBACの管理境界はどうなっているか
- VNet/NSG/Route/Private Endpointからbackendまで到達しているか
- Managed Identity/Key Vault/証明書rotationに変更はないか
- Azure Monitor/Log AnalyticsとActivity Logのどれが今回の証拠か
- ExpressRoute/VPNからCoreまでEnd-to-Endで正常か
- そのEvidenceはAzure固有実装か、共通概念か

Next: **Financial War Room**
