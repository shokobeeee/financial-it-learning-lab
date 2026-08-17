# Financial IT Learning Lab

金融ITを「読む」のではなく、**触って理解し、技術・業務・PMの3視点で説明できる**ことを目指すインタラクティブ学習ラボです。

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

### Final Capstone

- 🚨 Financial War Room — 12 incident cases
- TRI-ROLE SIGN-OFF: Engineer / Consultant / PM が各85点以上

**Total: 8 Complete Packages / 160 Labs + 12 War Room Cases**

## What “Complete Package” means

20 Labsがあるだけでは完成扱いにしません。

- Start from Zero
- 20 Labs / 12 Cases
- 基本 / 選択 / 入力
- State / Evidence
- Financial Context
- Field Questions
- Glossary / Cheat Sheet
- Engineer / Consultant / PM視点
- Final Capstone
- Completion / Next Path

定義は [PACKAGE_STANDARD.md](./PACKAGE_STANDARD.md) を参照。

各教材画面の右下 **📦 Guide** から、ロードマップ・現場質問・用語・Capstone修了条件・次教材を確認できます。

## Final Goal

以下を別々の単語ではなく、一つの金融システムとしてつなげる。

```text
Customer / App
  ↓
Cloud / DNS / TLS / Load Balancer
  ↓
VPC / VNet / Hybrid Network
  ↓
Linux / Compute / Application
  ↓
SQL / Database / Transaction
  ↓
On-prem / Mainframe
  ↓
COBOL / Db2 / CICS
  ↓
JCL / Batch / Scheduler
  ↓
Reconciliation / Operational Resilience
```

## Recommended Path

```text
Linux → SQL / Database → COBOL → JCL / Batch
      → Cloud Fundamentals → AWS / Google Cloud / Azure
      → Financial War Room
```

3クラウドは順不同でも構いません。共通概念へ戻して比較できることを重視します。

## War Room rule

Financial War Roomは原因当てゲームではありません。

**Impact → Hypothesis → Evidence → Primary/Contributing cause → Safe Recovery → Verification/Reconciliation → Communication**

を評価します。

詳しい知識マップとSign-off設計は [CURRICULUM.md](./CURRICULUM.md)。
公開参照先の整理は [REFERENCES.md](./REFERENCES.md)。

> This repository contains learning simulators. It is not an operational runbook, regulatory checklist, product certification course, or production change procedure.
