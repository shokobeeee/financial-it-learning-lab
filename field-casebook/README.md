# Field Incident Gate — 10 Public-Report Reconstructions

## Goal

Linux / SQL / COBOL / JCL / Cloudを「知っている」で終わらせず、公開された障害報告・技術記事・新聞記事を基に再構成した10事件で使う。

```text
Incident
  ↓
Impact
  ↓
Free Investigation
  ↓
Evidence Board
  ↓
Hypothesis Board
  ↓
Cause Declaration
  ↓
Safe Recovery
  ↓
Technical + Business Verification
  ↓
Communication / Source Reveal
```

## Position in the curriculum

```text
160 Labs
  ↓
Field Incident Gate 10 Cases — Engineer / Consultant / PM 各80点
  ↓
Financial War Room 12 Cases — 各85点
```

Field Incident Gateは「外部の実事故を読む力」を確認する中間の最終関門。Financial War Roomは、より金融文脈を強めた最終Capstone。

## Source policy

- 企業・規制当局・公式postmortem等の一次情報を**Factの軸**にする。
- **Zenn / Qiita / Microsoft Tech Community / AWS Builders’ Library / 企業Engineering Blog**等は、技術概念・実装・復旧・設計判断を理解する補助線として使う。
- note / 新聞・技術メディアは、顧客・社会影響や別視点を補う。
- 一次情報と補助記事が食い違う場合は一次情報を優先する。
- 原文の長文転載はせず、学習用に要約・匿名化・再構成する。
- Caseは実在事故の完全再現ではない。
- Source名と元事故は、推理をspoilerしないようResult後に公開する。
- 本教材は本番Runbook・法令解釈・製品操作手順ではない。

### Result後の読み方

Source Revealでは、事故そのものを確認する一次情報と、理解を深める技術記事を区別して読む。

```text
Primary source
  → 何が実際に起きたか / 公式に確認されたこと

Zenn / 技術サイト
  → なぜその現象が起きるのか
  → どのEvidenceを見るのか
  → どんな設計・復旧パターンがあるのか
```

## 10 Cases

1. Endpoint content update / OS crash / staged rollout
2. Network partition / database failover / divergent writes
3. Production database deletion / backup restore failure
4. Backbone routing / DNS / control-plane isolation
5. Valid configuration triggering latent edge bug
6. Internal network congestion / retry storm / queue backlog
7. Month-end batch resource exhaustion / ATM customer impact
8. Relay-system refresh / master-data layout boundary defect
9. Network route switch / reconnect storm / staged recovery
10. Payment-switch renewal workload / overload / transaction reconciliation

## Completion

- `field_case_<id>_result`
- 各Caseで Engineer / Consultant / PM がすべて80点以上
- 10 Case PASSでField Incident Gate修了
- Resultで元事例と公開Sourceを読み、教材内の推論と公開報告の差分を確認する
- 補助Sourceから、教材で不足している用語・Evidence・設計観点を追加学習する
