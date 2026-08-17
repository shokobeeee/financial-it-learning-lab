# Financial War Room — Final Complete Package

## Goal

原因当てではなく、時間制約下で `Impact → Hypothesis → Evidence Diversity → Primary/Contributing Cause → Safe Recovery → Verification/Reconciliation → Communication` を完遂する。

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
