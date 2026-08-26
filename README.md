# Financial IT Learning Lab

金融ITを「読む」だけで終わらせず、**触って理解し、公開事例で試し、技術・業務・PMの3視点で説明できる**状態を目指すインタラクティブ学習ラボです。

## Complete Learning Packages

### Platform, Data & Application — 60 Labs

- 🐧 Linux / Infrastructure — 20
- 💾 SQL / Database — 20
- ☕ Enterprise Application / Java — 20

### Core Systems & Batch — 40 Labs

- 🟩 COBOL / Business Systems — 20
- ⚙️ JCL / Batch Operations — 20

### Cloud — 80 Labs

- ☁️ Cloud Fundamentals — 20
- 🟧 AWS for Financial IT — 20
- 🔵 Google Cloud for Financial IT — 20
- 🔷 Azure for Financial IT — 20

### Final Practice

- 📰 Field Incident Gate — 10 public-report reconstructions
  - 企業・規制当局・公式postmortemを事実の軸にする
  - Zenn / Qiita / note / 新聞・技術メディアを補助線として使う
  - Engineer / Consultant / PM が各80点以上
- 🚨 Financial War Room — 12 financial incident cases
  - Engineer / Consultant / PM が各85点以上

**Total: 9 Complete Packages / 180 Labs + 10 Field Cases + 12 War Room Cases**

## Learning Route

```text
Computer / OS Foundation
  ↓
Linux / Infrastructure
  ↓
SQL / Database
  ↓
Enterprise Application / Java
  ↓
COBOL / Business Systems → JCL / Batch
  ↓
Cloud Fundamentals → AWS / Google Cloud / Azure
  ↓
Field Incident Gate
  ↓
Financial War Room
```

Javaは言語文法の独立講座ではありません。HTTP Requestを業務処理へ変換し、JVM上で動き、Database・Messaging・Linux・Cloudへつながる**Application層の代表Profile**として扱います。

## Lab → Incident Transfer

各Labの下には **🚨 War Room Link / この知識が効く事故** を表示します。

```text
Concept / Command / Code
        ↓
どの障害で使える？
        ↓
公開事例ベースCase
        ↓
Evidenceを自分で取り、仮説を潰す
        ↓
教材へ戻って弱点を補う
```

## Context Model

教材全体で、次の順序を正本とします。

```text
Plain Language
  ↓
Need / Problem
  ↓
Capability / Common Concept
  ↓
Product / Platform Profile
  ↓
Component Origin
  ↓
Operational Evidence
  ↓
Safe Decision / Change
  ↓
Business Verification
```

製品間の対応は `=` ではなく **`≒ conceptual mapping`**。同じ目的を見る代表実装であり、権限・仕様・性能・運用・Supportまで同一とはみなしません。

### Profile examples

- Linux: Common Linux + RHEL系（教材標準） / Ubuntu LTS / SLES / Oracle Linux
- SQL: IBM Db2 / Oracle Database / PostgreSQL / Microsoft SQL Server
- Application: Common Application Concept + Java / JVM / Spring Boot / JDBC / JMS
- COBOL: IBM Enterprise COBOL / GnuCOBOL / Oracle Pro*COBOL context
- JCL周辺: JES / JCLとEnterprise Schedulerを別Layerで扱う
- Cloud: Common / AWS / Google Cloud / Azure / OCI translation

## What “Complete Package” means

20 Labsがあるだけでは完成扱いにしません。

- Start from Zero
- Need before Tool / Component Origin
- Progressive Learning Modes
- Layer Guide / Stack Map
- Concept → Product → Evidence
- Financial Context
- Field Questions
- Plain-language Glossary / Expert Lens
- Engineer / Consultant / PM視点
- Final Capstone
- War Room Link / Public Incident Transfer
- Completion / Next Path

定義は [PACKAGE_STANDARD.md](./PACKAGE_STANDARD.md) を参照。

## Final System Map

```text
Customer / Channel
  ↓
DNS / TLS / Load Balancer / API
  ↓
Java / Spring Boot Application
  ├ JVM / Thread / Heap / GC
  ├ JDBC / Connection Pool / Transaction
  └ JMS / IBM MQ / External API
  ↓
Linux / Container / Cloud Compute
  ↓
Database / Authoritative Data
  ↓
COBOL / Db2 / CICS
  ↓
JCL / JES / Enterprise Scheduler
  ↓
Reconciliation / Operational Resilience
```

## Investigation Rule

Field Incident Gate、Java War Room、Financial War Roomは原因当てクイズではありません。

**Impact → Free Investigation → Evidence Diversity → Hypothesis elimination → Cause declaration → Safe Recovery → Verification / Reconciliation → Communication**

を評価します。

> This repository contains learning simulators. It is not an operational runbook, regulatory checklist, product certification course, or production change procedure.
