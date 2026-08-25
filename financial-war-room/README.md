# Financial War Room — Final Complete Package

## Goal

原因当てではなく、時間制約下で `Impact → Hypothesis → Evidence Diversity → Primary/Contributing Cause → Safe Recovery → Verification/Reconciliation → Communication` を完遂する。

## Beginner Entry / 覗いた人が状況を理解できる入口

War Roomは最終Capstoneだが、**Caseを開いた瞬間に試験を開始しない**。

```text
War Room Home
  ↓
Caseを選ぶ
  ↓
初見ガイド（採点なし）
  ├ 何が起きている？
  ├ Systemのどこ？
  ├ 今わかっている事実
  ├ まだ原因は未確定
  └ このあと何をする？
  ↓
「状況は分かった → 挑戦を始める」
  ↓
Challenge / Scoring
```

Homeでは最初に、War Roomを

**「銀行システムで障害が起き、原因未確定の状態から、影響・証拠・安全な復旧・業務確認を順番に進める教材」**

として説明する。

初見ガイドでは `SEV / Hypothesis / Evidence / Recovery / Reconciliation` の5語を短く確認できる。Case固有の答えは教えず、**症状・位置・既知の事実だけ**を理解してから挑戦へ入る。

Challenge画面の7段階も、専門英語を主見出しにせず次の日本語を先に表示する。

1. まず「どれくらい困っているか」を決める — Business impact / Severity
2. 原因の候補を置く — Hypothesis tree
3. 確認材料を取りに行く — Evidence request
4. 集めた証拠から原因を判断する — Primary / Contributing cause
5. 安全な戻し方を選ぶ — Recovery decision
6. 本当に業務が戻ったか確認する — Verification / Reconciliation
7. 関係者へ今の状況を共有する — Status communication

採点ロジック・Case内容・合格基準は変更しない。

## v16 Incident Model

### Evidence Diversity Gate

Cause確定前に、同じログを複数見るだけではなく**異なるレイヤーのEvidence**を要求する。

- Case01–11: 2レイヤー以上
- Final Case12: 3レイヤー以上

Evidence layer例:

- App / Compute
- Network / Hybrid
- Data / Ledger
- Async / Ingest
- Identity / Security
- Core / Batch
- Control / Change
- Business / Reconciliation

### Wrong Layer Coach

操作自体が妥当でも、現在の仮説とレイヤーが違う場合に理由を表示する。

### Provider Context

**🧭 Context**でCommon / AWS / Google Cloud / Azure / OCIへ翻訳できる。ただし製品を1:1同一視せず、まず共通レイヤーで仮説を作る。

## 12 Cases

- 01–03: False Green / Replica Lag / Duplicate & Idempotency
- 04–07: Hybrid Core Link / Credential Rotation / TLS / DNS Cutover
- 08–10: Night Batch Partial Commit / Queue Backlog / WAF False Positive
- 11–12: Regional DR / Month-End Financial Mega War Room

## Sign-off

各Caseで以下すべて85点以上。

- Financial Engineer ≥ 85
- Financial Consultant ≥ 85
- PM / PMO ≥ 85

## Anti-patterns

- Evidenceを取る前の全体再起動
- 同一レイヤーのログだけ大量取得して原因確定
- 正本DBを推測で直接修正
- Security controlの全解除
- Partial commit確認なしの全件rerun
- RC=0だけで業務完了と判断
- provider名だけで原因を断定

## Final Case 12

Core ledger / JCL / export / Cloud ingest / reconciliationを横断し、RC=0でもCloud明細が不足する状況を解く。欠落対象だけをidempotent replayし、件数・金額・duplicate=0・customer journeyまで照合して最終Sign-off。

Progress key: `financial_warroom_<case>_result`
