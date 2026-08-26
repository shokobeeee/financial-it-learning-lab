# Linux / Infrastructure — Complete Package v16

## Goal

Linuxコマンド暗記ではなく、`DNS → Network → Port → Process → Application → Log` の順で状態を追い、障害時に「どこまで正常か」を証拠付きで説明できること。

## Step -1 — OS・Network・Server Role・製品を分ける

Linux教材は、最初からnginxが必要という前提で始めない。

```text
Ubuntu / Linuxを入れる
  ↓
OSの土台
Kernel / Process / File / TCP-IP stack
  ↓
NIC・DHCP・Route・DNS等が成立すればNetwork通信できる
  ↓
ただしHTTPを受けるProgramはまだ無い
  ↓
Web Serverという役割が必要になる
  ↓
nginx / Apache / Application server等から選ぶ
  ↓
教材ではnginxを代表例として追加
```

### 大事な区別

- **Linux / Ubuntu** = OSという土台
- **Network接続** = NIC・IP・Route・DNS・周辺Networkが成立した状態
- **Web Server** = HTTP Requestへ応答するSystem上の役割
- **nginx** = Web Server役割を実現するApplicationの1つ

したがって、**Linux OS ≠ Web Server role ≠ nginx**。

多くのUbuntu環境ではDHCP等によりNetworkが自動設定されることがあるが、OSを入れただけでInternet接続が保証されるわけではない。NIC、Virtual switch、Router、DHCP、DNS等は別に確認する。

nginxを入れる理由はNetworkへ接続するためではない。別端末からHTTPで利用できるよう、`process / service / port / config / log`を持つWeb Applicationを追加するため。

## Component Origin Model

Linuxで登場する部品を、すべて「downloadして入れるSoftware」として扱わない。

| Origin | 例 |
|---|---|
| OSに含まれる | Kernel、Process、TCP/IP stack、File system |
| 設定して使う | IP/Route/DNS、Firewall rule、cron/systemd timer |
| Packageとして追加 | nginx、OpenSSH Server、Container Runtime、Monitoring Agent |
| 操作する側へ追加 | Ansible等のControl Tool |
| 外側のPlatform | Hypervisor、Cloud Compute、Cloud Security Group |

各Labでは次の順で表示する。

```text
もともと何がある？
→ 何に困る？
→ 何の機能が必要？
→ なぜ今回この製品？
→ 追加前 / 追加後
→ 何をEvidenceとして見る？
```

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
- Linux OS / Network connection / Server role / product-specific Applicationを混同しない
- SoftwareがOS標準・設定・Package・Control Tool・外部Platformのどれか説明する
- Distribution / management layer / systemd / product-specific toolを混同しない
- Lab20で Evidence → Cause → Safe Change → Rollback → Verify → Report を説明
- 進捗キー: `linux_labXX_complete`

## Field Questions

- この部品はOS標準か、設定か、追加Packageか、外部Platformか
- 何に困ったため、そのSoftware/Serviceが必要になったのか
- 対象LinuxはDebian系かRHEL系か
- 今確認しているのはOS共通、systemd、package/firewall、製品固有のどのレイヤーか
- 名前解決・疎通・待受Portのどこまで正常か
- Processは生きているか、resource異常はないか
- Disk / mount / permission / logに証拠があるか
- 直近変更は何か
- rollbackと復旧確認は何か

Next: **SQL / Database**
