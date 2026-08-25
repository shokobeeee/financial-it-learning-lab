# Financial IT Learning Lab

金融ITを「読む」のではなく、**触って理解し、公開事例で試し、技術・業務・PMの3視点で説明できる**ことを目指すインタラクティブ学習ラボです。

## Complete Learning Packages

### Core — 4 Packages / 80 Labs

- 🐧 Linux / Infrastructure — 20
- 💾 SQL / Database — 20
- 🟩 COBOL / Business Systems — 20
- ⚙️ JCL / Batch Operations — 20

### Cloud — 4 Packages / 80 Labs

- ☁️ Cloud Fundamentals — 20
- 🟧 AWS for Financial IT — 20
- 🔵 Google Cloud for Financial IT — 20
- 🔷 Azure for Financial IT — 20

### Final Practice

- 📰 Field Incident Gate — 10 public-report reconstructions
  - 企業・規制当局・公式postmortemを一次情報の軸にする
  - Qiita / note / 新聞・技術メディアを補助線として使う
  - Engineer / Consultant / PM が各80点以上
- 🚨 Financial War Room — 12 financial incident cases
  - TRI-ROLE SIGN-OFF: Engineer / Consultant / PM が各85点以上

**Total: 8 Complete Packages / 160 Labs + 10 Field Cases + 12 War Room Cases**

## Learning Route

```text
Linux → SQL / Database → COBOL → JCL / Batch
      → Cloud Fundamentals → AWS / Google Cloud / Azure
      → Field Incident Gate
      → Financial War Room
```

各Labの下には **🚨 War Room Link / この知識が効く事故** を表示します。

```text
Concept / command / code
        ↓
どの障害で使える？
        ↓
公開事例ベースCase
        ↓
Evidenceを自分で取り、仮説を潰す
        ↓
教材へ戻って弱点を補う
```

## v16 Context Model

Linux v16で導入した「分類軸を混ぜない」設計を全教材へ展開します。

**Concept → Product / Platform → Operational Evidence**

製品間の対応は `=` ではなく **`≒ conceptual mapping`** として扱います。

- Linux: Debian/Ubuntu ↔ RHEL/Rocky/Alma、systemd、製品固有commandを別レイヤー表示
- SQL: IBM Db2 / Oracle Database / PostgreSQL / Microsoft SQL Server profile
- COBOL: IBM Enterprise COBOL / GnuCOBOL / Oracle Pro*COBOL context
- JCL: JCL/JESと、Control-M / JP1/AJS3 / IBM Z Workload Scheduler等のScheduler層を分離
- Cloud Fundamentals / War Room: Common / AWS / Google Cloud / Azure / Oracle Cloud Infrastructure (OCI) translation profile
- AWS / GCP / Azure: provider固有サービスと共通Conceptを同時表示

## Field Incident source policy

Field Incident Gateは実在事故の完全再現ではありません。公開情報から学習論点を抽出し、匿名化・簡略化・再構成します。

- 公式報告・企業発表・規制当局資料をFactの軸にする
- Qiita / note / 新聞・技術メディアは概念翻訳・顧客影響の補助に使う
- 原文を長く転載しない
- 元事故とSourceはCase Result後に公開し、推理のspoilerを避ける
- 詳細: [docs/FIELD_CASE_SOURCES.md](./docs/FIELD_CASE_SOURCES.md)

## What “Complete Package” means

20 Labsがあるだけでは完成扱いにしません。

- Start from Zero
- Progressive Learning Modes
- Layer Guide
- Concept → Product → Evidence
- Financial Context
- Field Questions
- Glossary / Cheat Sheet
- Engineer / Consultant / PM視点
- Final Capstone
- War Room Link / Public Incident transfer
- Completion / Next Path

定義は [PACKAGE_STANDARD.md](./PACKAGE_STANDARD.md) を参照。

## Final Goal

以下を別々の単語ではなく、一つの金融システムとしてつなげる。

```text
Customer / App
  ↓
Cloud / DNS / TLS / Load Balancer
  ↓
VPC / VNet / VCN / Hybrid Network
  ↓
Linux / Compute / Application
  ↓
SQL / Database / Transaction
  ↓
On-prem / Mainframe
  ↓
COBOL / Db2 / Oracle / CICS
  ↓
JCL / JES / Enterprise Scheduler
  ↓
Reconciliation / Operational Resilience
```

## Investigation rule

Field Incident Gate / Financial War Roomは原因当てゲームではありません。

**Impact → Free Investigation → Evidence Diversity → Hypothesis elimination → Cause declaration → Safe Recovery → Verification/Reconciliation → Communication**

を評価します。

> This repository contains learning simulators. It is not an operational runbook, regulatory checklist, product certification course, or production change procedure.
