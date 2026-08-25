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

- 企業・規制当局・公式postmortem等の一次情報をFactの軸にする。
- Qiita / note / 新聞・技術メディアは、技術概念や顧客・社会影響の補助線として使う。
- 原文の長文転載はせず、学習用に要約・匿名化・再構成する。
- Caseは実在事故の完全再現ではない。
- Source名と元事故は、推理をspoilerしないようResult後に公開する。
- 本教材は本番Runbook・法令解釈・製品操作手順ではない。

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
