# Financial IT Learning Lab

金融ITを「読む」のではなく、**触って理解し、技術・業務・PMの3視点で説明できる**ことを目指すインタラクティブ学習ラボです。

## Complete Curriculum

### Core — 80 Labs

- 🐧 Linux / Infrastructure — 20
- 💾 SQL / Database — 20
- 🟩 COBOL / Business Systems — 20
- ⚙️ JCL / Batch Operations — 20

### Cloud — 80 Labs

- ☁️ Cloud Fundamentals — 20
- 🟧 AWS for Financial IT — 20
- 🔵 Google Cloud for Financial IT — 20
- 🔷 Azure for Financial IT — 20

### Final Capstone

- 🚨 Financial War Room — 12 incident cases
- TRI-ROLE SIGN-OFF: Engineer / Consultant / PM が各85点以上

**Total: 160 Labs + 12 War Room Cases**

## Learning concept

1. Learning Step 0で全体像を知る
2. 基本モードで状態変化を見る
3. 選択モードで判断する
4. 入力モードで自分の言葉/設計メモにする
5. 状態DIFF・証拠・処理フローで理解する
6. 各ModuleのCapstoneで障害切り分け
7. Financial War Roomで技術・業務・PMの三者Sign-off

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

## War Room rule

Financial War Roomは原因当てゲームではありません。

**Impact → Hypothesis → Evidence → Primary/Contributing cause → Safe Recovery → Verification/Reconciliation → Communication**

の順番を評価します。

広範囲な再起動、根拠のないDB直接修正、security controlの全解除、RC=0だけで業務完了とみなす判断は減点します。

詳しくは [CURRICULUM.md](./CURRICULUM.md) を参照してください。

## References

公開されている金融庁/FISCの位置づけ、AWS/Google Cloud/Azureの公式Well-Architected/Architecture guidanceを確認しています。

[REFERENCES.md](./REFERENCES.md)

> This repository contains learning simulators. It is not an operational runbook, regulatory checklist, or production change procedure.
