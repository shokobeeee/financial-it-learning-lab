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

各教材の **🧭 Context** からLayer Guide / Product Profile / conceptual translationを確認できます。

Cloud系はさらに **☁️ Cloud Map** で、用語を「何をする？ / どこまで任せる？ / 各社では何て呼ぶ？ / 銀行Systemのどこ？」の4軸から確認できます。分類・Provider mappingの正本は `assets/js/cloud-concepts.js` です。

## What “Complete Package” means

20 Labsがあるだけでは完成扱いにしません。

- Start from Zero
- 20 Labs / 12 Cases
- Progressive Learning Modes — 理解段階に合わせて、見る/作る → 選ぶ → 入力/Evidenceへ進む
- State / Evidence at the Right Time — Evidence UIを初学者へ先回りさせない
- Layer Guide / Concept → Product → Evidence
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

## Recommended Path

```text
Linux → SQL / Database → COBOL → JCL / Batch
      → Cloud Fundamentals → AWS / Google Cloud / Azure
      → Financial War Room
```

3クラウド教材は順不同。OCIはCloud Fundamentals / War Roomのtranslation profileとして扱い、必要なら将来独立20-Lab packageへ拡張できます。

### Cloud Fundamentalsだけは最初に「教えるUI」を使う

```text
Lab01–07  見る → 困る → 部品を足す → 名前を知る
Lab08–15  状況を見る → 選ぶ → 理由を理解する
Lab16–20  Evidence → 判断 → Verify / Reconcile
```

AWS / Google Cloud / Azureは、この共通Conceptを理解した後のProvider翻訳・演習として進めます。

## War Room rule

Financial War Roomは原因当てゲームではありません。

**Impact → Hypothesis → Evidence Diversity → Primary/Contributing cause → Safe Recovery → Verification/Reconciliation → Communication**

を評価します。同じ種類のログを大量に読むだけではCause確定できず、複数レイヤーのEvidenceを要求します。

詳しい知識マップとSign-off設計は [CURRICULUM.md](./CURRICULUM.md)。
公開参照先の整理は [REFERENCES.md](./REFERENCES.md)。
v16統合方針は [docs/V16_INTEGRATION_PLAN.md](./docs/V16_INTEGRATION_PLAN.md)。

> This repository contains learning simulators. It is not an operational runbook, regulatory checklist, product certification course, or production change procedure.