# Linux / Infrastructure — Complete Package v19

## Goal

Linux commandの暗記ではなく、完全未経験から次を説明できることを目指す。

```text
Computerは何で動く？
  ↓
OSは何を管理する？
  ↓
Linux共通Conceptは何？
  ↓
Distribution固有操作は何？
  ↓
なぜそのSoftware / Serviceが必要？
  ↓
何をEvidenceとして確認する？
```

障害時の基本順序は、`DNS → Network → Port → Process → Application → Log`。ただし、この言葉自体が分からない学習者へ、いきなり用語だけを並べない。

## STEP -2 — ComputerとOSは、どう動いている？

Linux Profileを選ぶ前に、10〜15分の操作型Foundationを置く。

```text
01 Computerの部品
02 OSの役割
03 Kernel
04 ProgramとProcess
05 File・Directory・Path
06 IP・Subnet・Default Route・DNS・Port
07 Server・Service・Port
08 Boot
```

### 普通の言葉 → 専門用語

- CPU = 計算する場所
- Memory = 作業中の置き場
- Storage = 電源を切っても残る保存場所
- OS = ApplicationとHardwareの間を取り仕切る基本Software
- **Kernel = OSの司令塔**
- Program = 保存された手順書
- Process = いま動いているProgram
- File = 名前を付けて保存したData
- TCP/IP stack = 通信ルールを処理するOS機能
- IP Address = Network上の住所
- Subnet = 同じ近所として扱う範囲
- **Default Route = 近所以外へ出る基本の出口**
- DNS = 名前をIP Addressへ変える案内
- Port = Applicationごとの受付窓口
- Server = 他のComputerからの依頼に答える役割

入口では関係性を理解する。CPU scheduling、Page Table、Kernel内部実装、TCP congestion control等は必要になった時に深掘りする。

### 30秒確認

8 STEPを一度ずつ見た後、次の3点だけ確認する。

1. Programを起動して現在動いている状態 = Process
2. 同じNetwork外へ出る基本の出口 = Default Route
3. nginx = Web Server役割を実現するApplicationの一つ

進捗キー：`linux_computer_os_foundation_complete`

詳細設計：[`docs/COMPUTER_OS_FOUNDATION.md`](../docs/COMPUTER_OS_FOUNDATION.md)

## 説明レベル

知っている人へ説明を強制しない。

| Mode | 表示 |
|---|---|
| **完全未経験** | 専門用語の横に普通の言葉を自動表示。STEP -2を未修了時に開く |
| **標準** | 専門用語は押した時だけ説明。STEP -2は折りたたみ |
| **説明最小** | 本文の用語補助を非表示。用語帳とSTEP -2だけ任意で開く |

設定キー：`fit_explanation_level_v1`

共通用語帳はLinuxだけでなく、SQL、COBOL、JCL、Cloud、Field Incident、Financial War Roomでも利用できる。

## STEP -1 — Financial Linux Profile Model

金融ITのLinuxをUbuntuだけで代表させない。

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

これは金融業界のLinux市場シェアを断定するものではない。Enterprise Support、長期運用、Vendor Certification、製品Support Matrixを意識する学習基準として採用する。

| Profile | 教材での位置づけ | Package | Firewall | Security | 代表文脈 |
|---|---|---|---|---|---|
| **RHEL / Rocky / AlmaLinux** | **教材標準 / Enterprise基準** | `dnf / rpm` | `firewalld` | SELinux | 業務Server、Enterprise Middleware、基幹周辺 |
| Ubuntu LTS / Debian | Cloud / Digital | `apt / dpkg` | `ufw / nftables` | AppArmor | OpenStack、Kubernetes、Digital Service |
| SLES | Specialized Enterprise | `zypper / rpm` | `firewalld / nftables` | AppArmor | SAP、IBM Z/LinuxONE |
| Oracle Linux | Oracle Workload | `dnf / rpm` | `firewalld` | SELinux | Oracle Database、Exadata、OCI、UEK/RHCK |

### 重要な境界

- Rocky Linux / AlmaLinuxはRHEL系操作の学習に有効。
- RHEL Subscription、Vendor Support、製品Certificationまで同一ではない。
- Ubuntu、SLES、Oracle Linuxも重要。案件では実際のDistribution・Version・契約・Support Matrixを確認する。
- Parrot OSはSecurity / Forensics学習向け。金融業務Serverの標準Profileとは分ける。

詳細：[`docs/FINANCIAL_LINUX_PROFILES.md`](../docs/FINANCIAL_LINUX_PROFILES.md)

## STEP 0 — Linux・Network・Server Role・製品を分ける

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
Web Serverという役割が必要
  ↓
nginx / Apache / Application Server等から選ぶ
  ↓
教材ではnginxを代表例として追加
```

### 大事な区別

- RHEL / Ubuntu / SLES / Oracle Linux = Distribution Profile
- Network接続 = NIC・IP・Route・DNS・周辺Networkが成立した状態
- Web Server = HTTP Requestへ応答するSystem上の役割
- nginx = Web Server役割を実現するApplicationの一つ

したがって、**Linux OS ≠ Distribution固有操作 ≠ Web Server role ≠ nginx**。

Linuxを入れただけでInternet接続が保証されるわけではない。Network機能はOSにあるが、NIC、Virtual switch、Router、DHCP、DNS、Security Control等は別に確認する。

nginxを入れる理由はNetworkへ接続するためではない。`package / config / service / process / port / log`を持つWeb Server Applicationを追加するため。

```text
RHEL系 / Oracle Linux
sudo dnf install -y nginx

Ubuntu LTS / Debian
sudo apt install -y nginx

SLES
sudo zypper --non-interactive install nginx
```

目的は共通してWeb Server roleを追加すること。CommandはProfile差分。

## Need before Tool / Component Origin

各Labは、製品名やCommandより先に次を説明する。

```text
もともと何がある？
→ 無いと何に困る？
→ どんな機能が必要？
→ なぜ今回この製品を選ぶ？
→ どのProfileでどう実装する？
→ 追加前 / 追加後
→ 何をEvidenceとして見る？
```

| Origin | 例 |
|---|---|
| OSに含まれる | Kernel、Process、TCP/IP stack、File system |
| 設定して使う | IP / Route / DNS、Firewall rule、timer |
| Packageとして追加 | nginx、OpenSSH、Container Runtime、Monitoring Agent |
| 操作する側へ追加 | Ansible等のControl Tool |
| 外側のPlatform | Hypervisor、Cloud Compute、Cloud Security Group |
| Distribution固有管理 | `apt` / `dnf` / `zypper`、SELinux / AppArmor |

## v19 Context Model

```text
Plain language
  ↓
Technical term
  ↓
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

## 20 Labs

- 01–05: Web/nginx, Firewall, IP/DNS, SSH, Permissions
- 06–10: Process/Memory, Storage/Mount, Logs, Package, Boot/Kernel
- 11–15: Bash/Pipe, Scheduler, Backup, Containers, TLS/HTTPS
- 16–20: Monitoring, Ansible/IaC, VM/Cloud, Security, Capstone

## Completion

- STEP -2でComputer・OS・Networkの基本関係を説明できる
- Lab01–20を修了
- Common LinuxとDistribution固有実装を分ける
- RHEL / Ubuntu / SLES / Oracle LinuxのProfile差分を説明する
- Linux OS / Network / Server role / Productを混同しない
- SoftwareがOS標準・設定・Package・Control Tool・外部Platformのどれか説明する
- RHEL系操作とRHEL契約・Support・Certificationを同一視しない
- Lab20で Evidence → Cause → Safe Change → Rollback → Verify → Report を説明する

Lab進捗キー：`linux_labXX_complete`

## Field Questions

- この用語を普通の言葉で説明すると何か
- Systemのどこにいて、無いと何に困るか
- 対象LinuxのDistribution・Version・Support契約は何か
- この操作はLinux共通か、Distribution固有か、製品固有か
- この部品はOS標準か、設定か、Packageか、外部Platformか
- 名前解決・疎通・Default Route・待受Portのどこまで正常か
- Programはinstall済みか、Processとして実行中か
- Service、Process、Port、Logの関係はどうなっているか
- 直近変更、rollback、復旧確認は何か

Next: **SQL / Database**
