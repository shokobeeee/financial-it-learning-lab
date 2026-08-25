# Financial War Room — Final Complete Package

## Goal

原因当てではなく、時間制約下で **Impact → Investigation → Hypothesis elimination → Evidence Diversity → Cause declaration → Safe Recovery → Verification / Reconciliation → Communication** を完遂する。

## Investigation Game Model

War Roomは「手順を上から押す試験」ではない。

```text
Incident Brief
  ↓
自由に調査する
  ↓
Evidence Boardへ証拠が増える
  ↓
原因候補を
  調査中 / 有力 / 除外
  に自分で整理する
  ↓
「原因を指摘する」
  ↓
Safe Recovery
  ↓
Technical + Business Verification
  ↓
Communication / Sign-off
```

Caseを開いた直後は採点しない。まず事件現場として、症状・System Map・既知の事実だけを見る。

**「どこを調べるべきか」「何番目に何をするか」は最初から表示しない。**

Challenge開始後は、Evidenceを好きな順番で取得する。Evidenceごとに時間コストがあり、全部を見るより、いま考えている仮説を確認・反証できるEvidenceを選ぶ方が高評価になる。

### Evidence Board

取得したEvidenceはカードとしてBoardへ蓄積する。

Board自体は「このEvidenceはこの仮説を否定する」と答えを教えない。学習者自身がEvidenceを読み、Hypothesis Boardを更新する。

### Hypothesis Board

Scenarioにある原因候補を次の状態へ自分で動かす。

- 🟡 調査中
- 🔥 有力
- ✕ 除外
- 未整理

同時に追跡する仮説は最大3つ。証拠が増えるたびに「これは違う」「こちらが怪しい」を整理する。

### Cause Declaration

十分だと思ったら **「☝ 原因を指摘する」** を押す。

Primary causeとContributing factorを宣言し、確定後はRecoveryへ進む。一度指摘した原因は戻せない。

行き詰まった場合だけ `📓 捜査メモ` を開ける。捜査メモは正解順ではなく、

- 事実と推測を分ける
- 仮説が正しいなら何が見えるか考える
- 仮説を消せるEvidenceを探す
- 同じレイヤーばかり見ない

という問いだけを提供する。

## Evidence Diversity Gate

Cause確定前に、同じログを複数見るだけではなく**異なるレイヤーのEvidence**を要求する。

- Case01–11: 2レイヤー以上
- Final Case12: 3レイヤー以上

Evidence button自身が `data-layer` を持ち、Gateは表示文言のregex推定ではなく明示layer metadataを読む。

Evidence layer例:

- App / Compute
- Network / Hybrid
- Data / Ledger
- Async / Ingest
- Identity / Security
- Core / Batch
- Control / Change
- Business / Reconciliation

## Scoring / Sign-off

既存の採点思想は維持する。

各Caseで以下すべて85点以上。

- Financial Engineer ≥ 85
- Financial Consultant ≥ 85
- PM / PMO ≥ 85

評価対象:

- 初期Impact判断
- 高価値Evidenceの選択
- 仮説を絞れているか
- Primary / Contributing cause
- 必要Evidenceを揃えたSafe Recovery
- Technical + Financial / Business verification
- Status communication
- Evidenceの取りすぎ / timebox

## Provider Context

**🧭 Context**でCommon / AWS / Google Cloud / Azure / OCIへ翻訳できる。ただし製品を1:1同一視せず、まず共通レイヤーで仮説を作る。

## 12 Cases

- 01–03: False Green / Replica Lag / Duplicate & Idempotency
- 04–07: Hybrid Core Link / Credential Rotation / TLS / DNS Cutover
- 08–10: Night Batch Partial Commit / Queue Backlog / WAF False Positive
- 11–12: Regional DR / Month-End Financial Mega War Room

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
