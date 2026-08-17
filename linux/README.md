# Linux / Infrastructure — Complete Package v16

## Goal

Linuxコマンド暗記ではなく、`DNS → Network → Port → Process → Application → Log` の順で状態を追い、障害時に「どこまで正常か」を証拠付きで説明できること。

## v16 Context Model

v16では「分類軸を混ぜない」を明示する。

```text
Distribution
├ Debian / Ubuntu
└ RHEL / Rocky / AlmaLinux
   ↓
Package / Firewall management
   ↓
Service / Log management = systemd
   ↓
Application / Tool
nginx / Docker / Ansible / OpenSSL ...
```

- Debian/RHELはOS系統
- apt/dpkg, dnf/rpmはPackage管理
- ufw, firewalldはFirewall管理
- systemdはService/Log管理基盤
- nginx等は製品固有

同じコマンド列に見えても、どのレイヤーを操作しているかScope Badgeで表示する。

### Environment Profiles

- Debian / Ubuntu: `apt / dpkg`, `ufw`
- RHEL / Rocky / AlmaLinux: `dnf / rpm`, `firewalld`
- systemdは両系統で共通基盤として別レイヤー表示

### Incident Training

- Guided / Standard / Engineer modes
- Evidence Gate
- Wrong-layer guidance
- Host Firewall vs Cloud Security Group、Guest OS vs Hypervisor等の境界を区別

## 20 Labs

- 01–05: Web/nginx, Firewall, IP/DNS, SSH, Permissions
- 06–10: Process/Memory, Storage/Mount, Logs, Package, Boot/Kernel
- 11–15: Bash/Pipe, Scheduler, Backup, Containers, TLS/HTTPS
- 16–20: Monitoring, Ansible/IaC, VM/Cloud, Security, Capstone

## Completion

- Lab01–20を修了
- Distribution / management layer / systemd / product-specific toolを混同しない
- Lab20で Evidence → Cause → Safe Change → Rollback → Verify → Report を説明
- 進捗キー: `linux_labXX_complete`

## Field Questions

- 対象LinuxはDebian系かRHEL系か
- 今確認しているのはOS共通、systemd、package/firewall、製品固有のどのレイヤーか
- 名前解決・疎通・待受Portのどこまで正常か
- Processは生きているか、resource異常はないか
- Disk / mount / permission / logに証拠があるか
- 直近変更は何か
- rollbackと復旧確認は何か

Next: **SQL / Database**
