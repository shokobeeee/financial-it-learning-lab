# Financial Linux Profile Model

## Purpose

金融IT向けLinux教材を、特定DistributionのCommand暗記へ閉じないための正本設計。

```text
Common Linux Concept
  ↓
Distribution Profile
  ↓
Product / Middleware
  ↓
Operational Evidence
```

## Design decision

本教材は **RHEL系を標準Profile** とする。

これは市場シェアの断定ではない。次を意識するための教材上の基準点である。

- Enterprise Support
- Long lifecycle
- Vendor Certification / Support Matrix
- Change management
- Security baseline
- Middleware / Database compatibility

Ubuntu LTS、SLES、Oracle Linuxは同じLinuxの比較Profileとして扱う。

## Common Linux

Distribution名より先に理解する。

- Kernel
- Process
- File / Permission
- TCP/IP / Port
- Service / systemd
- Log / Audit
- Resource / Evidence
- Safe change / rollback

## Profile matrix

| Profile | Package | Firewall | MAC Security | Additional boundary |
|---|---|---|---|---|
| RHEL / Rocky / AlmaLinux | `dnf / rpm` | `firewalld` | SELinux | RHELのSubscription / Support / Certificationと互換Distributionを同一視しない |
| Ubuntu LTS / Debian | `apt / dpkg` | `ufw / nftables` | AppArmor | Cloud / Digital文脈でもEnterprise Support条件を確認 |
| SLES | `zypper / rpm` | `firewalld / nftables` | AppArmor | SAP / IBM Z / Repository Module等のSupport Matrixを確認 |
| Oracle Linux | `dnf / rpm` | `firewalld` | SELinux | UEK / RHCK、Oracle製品・Exadata・OCI要件を確認 |

## Why not Parrot OS as the baseline?

Parrot OSはSecurity / Forensics学習に適したDistribution。手元のSecurity学習環境としては有用だが、金融業務ServerのEnterprise Profileとは目的が違う。

```text
Parrot OS
→ Security learning environment

RHEL / Ubuntu LTS / SLES / Oracle Linux
→ Workload / Support / Operations profile
```

## Step -1 UX

```text
1. Linux共通Conceptを見る
2. Distribution Profileを選ぶ
3. Networkが成立しているか確認
4. HTTP listenerが無い状態を体験
5. Web Server roleが必要と理解
6. nginxを一実装として追加
7. ProfileごとのPackage Commandへ翻訳
```

### nginx example

```text
Common need
HTTP Requestを受けたい
  ↓
Required role
Web Server
  ↓
Product choice
nginx / Apache / Application server
  ↓
Profile implementation
RHEL / Oracle  → dnf
Ubuntu         → apt
SLES           → zypper
  ↓
Evidence
Package / config / service / process / port / log / response
```

## What the profile selector changes

- Package command display
- Firewall command display
- Command input normalization in the simulator
- Scope badge
- Security framework context
- Package/Firewall Lab guidance

## What it does not claim

- Provider market share
- Exact production configuration
- Full command equivalence between distributions
- Product certification for the learner's environment
- Production-safe Runbook

## Questions to ask in a real project

1. Distribution and major/minor version?
2. Vendor support contract and end date?
3. Kernel flavor?
4. Middleware / DB / Agent support matrix?
5. Security baseline: SELinux / AppArmor / FIPS / CIS etc.?
6. Package repository and patch route?
7. Firewall responsibility: Host / Network / Cloud?
8. HA / Backup / Monitoring agents supported?
9. Change / rollback / evidence requirements?
10. RHEL-compatible means command-compatible, binary-compatible, or vendor-supported?

## Official reference starting points

- Red Hat Enterprise Linux Life Cycle: https://access.redhat.com/support/policy/updates/errata
- Ubuntu Pro: https://ubuntu.com/pro
- SUSE Product Support Lifecycle: https://www.suse.com/lifecycle/
- Oracle Linux Support: https://www.oracle.com/linux/support/

Always confirm the current product version, lifecycle, certification, and support matrix before an actual project decision.
