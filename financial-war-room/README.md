# Financial War Room — Final Complete Package

## Goal

原因当てではなく、時間制約下で `Impact → Hypothesis → Evidence → Primary/Contributing Cause → Safe Recovery → Verification/Reconciliation → Communication` を完遂する。

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
- 正本DBを推測で直接修正
- Security controlの全解除
- Partial commit確認なしの全件rerun
- RC=0だけで業務完了と判断

## Final Case 12

Core ledger / JCL / export / Cloud ingest / reconciliationを横断し、RC=0でもCloud明細が不足する状況を解く。欠落対象だけをidempotent replayし、件数・金額・duplicate=0・customer journeyまで照合して最終Sign-off。

Progress key: `financial_warroom_<case>_result`
