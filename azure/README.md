# Azure for Financial IT — Complete Package

## Goal

Azureを VNet / Compute / Data / Microsoft Entra / RBAC / Key Vault / Monitor / Hybrid という金融システム導線として理解し、共通クラウド概念へ戻して説明できること。

## 20 Labs

- 01–06: Tenant/Subscription/Region/AZ, VNet/Subnet, NSG/Route/NAT, VM/Scale, Load Balancer/Application Gateway
- 07–10: Blob/Disk/Files, Azure SQL系, Entra/RBAC/Managed Identity, Key Vault
- 11–14: DNS, Azure Monitor/Log Analytics/Activity Log, Service Bus/Event系, Functions/Container/AKS
- 15–20: ExpressRoute/VPN, Private Link/Endpoint, Backup/DR, Bicep/ARM/IaC, Cost/Well-Architected, War Room

## Completion

- Lab01–20を修了
- identity / key / runtime / auditを役割で分離
- Azure側の正常だけでなくHybrid / 正本 / customer journeyまで確認
- 進捗キー: `azure_labXX_complete`

## Field Questions

- Tenant/Subscription/Resource Group/RBACの管理境界はどうなっているか
- VNet/NSG/Route/Private Endpointからbackendまで到達しているか
- Managed Identity/Key Vault/証明書rotationに変更はないか
- Azure Monitor/Log AnalyticsとActivity Logのどれが今回の証拠か
- ExpressRoute/VPNからCoreまでEnd-to-Endで正常か

Next: **Financial War Room**
