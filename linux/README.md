# Linux / Infrastructure — Complete Package v18

## Goal

Linuxコマンド暗記ではなく、`DNS → Network → Port → Process → Application → Log` の順で状態を追い、障害時に「どこまで正常か」を証拠付きで説明できること。

さらに、製品名より先に次を説明できる状態を目指す。

```text
なぜその部品が必要？
  ↓
Linux共通Conceptか、Distribution差分か
  ↓
OS標準 / 設定 / Package / Control Tool / 外部Platformのどれか
  ↓
追加・設定後に何が増えた？
  ↓
何をEvidenceとして確認する？
```

## Financial Linux Profile Model

金融ITのLinuxをUbuntuだけで代表させない。本教材は次の構造を正本とする。

```text
Common Linux
├ Kernel
├ Process
├ File / Permission
├ TCP/IP / Port
├ systemd / Log
└ Operational Evidence

Distribution Profile
├ Package Manager
├ Firewall management
├ Mandatory Access Control
├ Kernel flavor
├ Support / Lifecycle
└ Vendor Certification
```

### 教材の標準Profile

**RHEL系を標準Profile**にする。

これは「金融業界のLinux市場シェアが何％」と断定するためではない。Enterprise Support、長期運用、Vendor Certification、製品Support Matrixを意識する学習基準として採用する。

| Profile | 教材での位置づけ | Package | Firewall | Security | 代表的な文脈 |
|---|---|---|---|---|---|
| **RHEL / Rocky / AlmaLinux** | **教材標準 / Enterprise基準** | `dnf / rpm` | `firewalld` | SELinux | 業務Server、Enterprise Middleware、基幹周辺 |
| **Ubuntu LTS / Debian** | Cloud / Digital Profile | `apt / dpkg` | `ufw / nftables` | AppArmor | OpenStack、Kubernetes、Digital Service |
| **SUSE Linux Enterprise Server** | Specialized Enterprise Profile | `zypper / rpm` | `firewalld / nftables` | AppArmor | SAP、IBM Z/LinuxONE、Mixed Enterprise |
| **Oracle Linux** | Oracle Workload Profile | `dnf / rpm` | `firewalld` | SELinux | Oracle Database、Exadata、OCI、UEK/RHCK |

### 重要な境界

- Rocky Linux / AlmaLinuxはRHEL系操作の学習には有効。
- ただし、RHEL Subscription、Vendor Support、製品Certificationまで同一ではない。
- Ubuntu、SLES、Oracle Linuxも重要であり、案件では実際のDistribution・Version・契約・Support Matrixを確認する。
- Parrot OSはSecurity / Forensics学習向け。金融業務Serverの標準Profileとは分ける。

## Step -1 — Linux・Network・Server Role・製品を分ける

```text
Financial Linux Profileを選ぶ
  ↓
Common Linuxの土台
Kernel / Process / File / TCP-IP / systemd
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

- **RHEL / Ubuntu / SLES / Oracle Linux** = Distribution Profile
- **Network接続** = NIC・IP・Route・DNS・周辺Networkが成立した状態
- **Web Server** = HTTP Requestへ応答するSystem上の役割
- **nginx** = Web Server役割を実現するApplicationの1つ

したがって、**Linux OS ≠ Distribution固有操作 ≠ Web Server role ≠ nginx**。

Linuxを入れただけでInternet接続が保証されるわけではない。Network機能はOSにあるが、NIC、Virtual switch、Router、DHCP、DNS、Security Control等は別に確認する。

nginxを入れる理由はNetworkへ接続するためではない。別端末からHTTPで利用できるよう、`package / config / service / process / port / log`を持つWeb Server Applicationを追加するため。

### Profileごとのnginx導入例

```text
RHEL系 / Oracle Linux
sudo dnf install -y nginx

Ubuntu LTS / Debian
sudo apt install -y nginx

SLES
sudo zypper --non-interactive install nginx
```

目的は共通して **Web Server roleを追加すること**。CommandはProfile差分。

## Component Origin Model

Linuxで登場する部品を、すべて「downloadして入れるSoftware」として扱わない。

| Origin | 例 |
|---|---|
| OSに含まれる | Kernel、Process、TCP/IP stack、File system |
| 設定して使う | IP/Route/DNS、Firewall rule、cron/systemd timer |
| Packageとして追加 | nginx、OpenSSH Server、Container Runtime、Monitoring Agent |
| 操作する側へ追加 | Ansible等のControl Tool |
| 外側のPlatform | Hypervisor、Cloud Compute、Cloud Security Group |
| Distribution固有の管理 | `apt` / `dnf` / `zypper`、SELinux / AppArmor |

各Labでは次の順で表示する。

```text
もともと何がある？
→ 何に困る？
→ 何の機能が必要？
→ なぜ今回この製品？
→ どのProfileでどう実装する？
→ 追加前 / 追加後
→ 何をEvidenceとして見る？
```

## v18 Context Model

分類軸を混ぜない。

```text
Need / Problem
  ↓
Common Linux Concept
  ↓
Distribution Profile
  ↓
Package / Firewall / Security implementation
  ↓
Service / Process / Application
  ↓
Operational Evidence
  ↓
Safe Change / Rollback / Business Verification
```

### Environment Profiles

- RHEL / Rocky / AlmaLinux: `dnf / rpm`, `firewalld`, SELinux
- Ubuntu LTS / Debian: `apt / dpkg`, `ufw / nftables`, AppArmor
- SLES: `zypper / rpm`, `firewalld / nftables`, AppArmor
- Oracle Linux: `dnf / rpm`, `firewalld`, SELinux, UEK / RHCK
- systemd、Process、File、TCP/IPは共通Conceptとして別レイヤー表示

### Incident Training

- Guided / Standard / Engineer modes
- Evidence Gate
- Wrong-layer guidance
- Host Firewall vs Cloud Security Group
- Guest OS vs Hypervisor / Cloud Control Plane
- Distribution差分 vs Product固有差分

## 20 Labs

- 01–05: Web/nginx, Firewall, IP/DNS, SSH, Permissions
- 06–10: Process/Memory, Storage/Mount, Logs, Package, Boot/Kernel
- 11–15: Bash/Pipe, Scheduler, Backup, Containers, TLS/HTTPS
- 16–20: Monitoring, Ansible/IaC, VM/Cloud, Security, Capstone

## Completion

- Lab01–20を修了
- Linux共通ConceptとDistribution固有実装を分ける
- RHEL / Ubuntu / SLES / Oracle LinuxのProfile差分を説明する
- Linux OS / Network connection / Server role / product-specific Applicationを混同しない
- SoftwareがOS標準・設定・Package・Control Tool・外部Platformのどれか説明する
- RHEL互換操作と、RHELの契約・Support・Certificationを同一視しない
- Lab20で Evidence → Cause → Safe Change → Rollback → Verify → Report を説明
- 進捗キー: `linux_labXX_complete`

## Field Questions

- 対象LinuxのDistribution・Version・Support契約は何か
- RHEL、Rocky、AlmaLinuxをどの意味で「互換」と扱っているか
- Oracle WorkloadはOracle Linux / UEK / RHCK等の要件があるか
- SAP / IBM Z / Cloud Native等、Workload側のSupport Matrixは何か
- この操作はLinux共通か、Distribution固有か、製品固有か
- この部品はOS標準か、設定か、追加Packageか、外部Platformか
- 何に困ったため、そのSoftware / Serviceが必要になったのか
- 名前解決・疎通・待受Portのどこまで正常か
- Processは生きているか、resource異常はないか
- Disk / mount / permission / logに証拠があるか
- 直近変更、rollback、復旧確認は何か

詳細設計: [`docs/FINANCIAL_LINUX_PROFILES.md`](../docs/FINANCIAL_LINUX_PROFILES.md)

Next: **SQL / Database**
