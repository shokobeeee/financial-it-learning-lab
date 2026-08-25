# Financial IT Learning Lab — Curriculum & Sign-off Design

## 1. ゴール

この教材のゴールは資格試験のサービス名暗記ではない。

金融システムを、**顧客導線 / 業務 / App / Cloud / Network / OS / Database / COBOL / JCL / Batch / 外部接続**まで一つのSystemとして捉え、次の3つを同時にできる状態を目指す。

1. **Financial Engineer** — 症状をレイヤー分解し、仮説とEvidenceで一次切り分けし、安全に復旧・検証できる。
2. **Financial Consultant** — 技術事象を顧客影響、重要業務、リスク、統制、コスト、外部委託、レジリエンスへ翻訳できる。
3. **PM / PMO** — 依存関係、意思決定者、変更・rollback、RTO/RPO、進捗、状況共有、再発防止を前へ進められる。

「原因を当てた」だけでは合格しない。Data integrityを壊す復旧、証拠を消す一斉再起動、顧客影響を無視した判断、rollback/承認/共有の欠落は減点する。

## 2. Curriculum structure

### Core — 80 Labs

- Linux / Infrastructure — 20
- SQL / Database — 20
- COBOL / Business Systems — 20
- JCL / Batch Operations — 20

### Cloud — 80 Labs

- Cloud Fundamentals — 20
- AWS for Financial IT — 20
- Google Cloud for Financial IT — 20
- Azure for Financial IT — 20

### Final Practice

- **Field Incident Gate — 10 public-report reconstructions**
  - Financial Engineer: 80 / 100 以上
  - Financial Consultant: 80 / 100 以上
  - PM / PMO: 80 / 100 以上
- **Financial War Room — 12 financial incident cases**
  - Financial Engineer: 85 / 100 以上
  - Financial Consultant: 85 / 100 以上
  - PM / PMO: 85 / 100 以上

合計: **160 Labs + 10 Field Cases + 12 War Room Cases**

```text
基礎を理解する
  ↓
各Labの War Room Link で事故へ転移
  ↓
Field Incident Gateで公開事例を読む
  ↓
弱点Labへ戻る
  ↓
Financial War Roomで金融横断判断を仕上げる
```

## 3. 必要知識の最終マップ

### A. Customer / Business

- 重要業務、顧客導線、代替手段、SEV
- SLI / SLO / SLA
- RTO / RPO、営業開始、決済時限
- 正本データと業務完了条件
- 件数、金額、Debit-Credit、重複、未処理

### B. Architecture / Infrastructure

- DNS / TLS / Load Balancer / WAF
- Route / NAT / Firewall
- VPC / VNet / VCN / Subnet
- VM / Container / Serverless
- Linux process / memory / disk / boot / log
- Hybrid connectivity / dedicated circuit / VPN
- Failure domain / AZ / Region / DR
- Control Plane / out-of-band recovery

### C. Data

- SQL / Transaction / COMMIT / ROLLBACK
- Lock / Isolation / Connection pool
- Primary / Replica / replication lag / fencing
- Backup / Restore / point-in-time recovery
- Reconciliation / authoritative ledger
- Idempotency / duplicate / retry
- Db2 / Oracle Database / PostgreSQL / SQL Server context

### D. Mainframe / Batch

- COBOL record layout / business logic / FILE STATUS / S0C7
- Compiler / Runtime / Host boundary
- Db2 / Oracle / CICS / File integration
- JOB / EXEC / DD / JES / RC / ABEND
- GDG / PROC / SORT / Enterprise Scheduler
- Partial commit / checkpoint / restart / rerun safety
- Batch completion vs end-to-end business completion

### E. Security / Governance

- Shared responsibility / third-party dependency
- IAM / RBAC / workload identity / least privilege
- Secret / Key / Certificate / rotation
- Audit trail / WAF / network controls
- Change control / IaC / drift / canary / rollback
- Capacity / failover / recovery rehearsal / exit strategy

### F. Management / Consulting

- Architecture trade-off / residual risk / cost
- Ownership / RACI / approval / Runbook
- Migration / coexistence / cutover
- Incident communication / customer response
- Post-incident action / owner / due date / completion Evidence
- 一次情報・二次解説・教材推論の区別

## 4. v16 Context Model

```text
Concept
  ↓
Product / Platform implementation
  ↓
Operational Evidence
  ↓
Safe Decision / Change
  ↓
Business Verification
```

製品間対応は `=` ではなく **`≒ conceptual mapping`**。権限、粒度、仕様、運用、性能特性まで同一とはみなさない。

### Layer examples

```text
Linux
Distribution → Package/Firewall → systemd → App/Tool

SQL
SQL Language → DBMS → Schema/Object → Transaction/Concurrency → App/Batch

COBOL
Language → Compiler/Runtime → Host → DB/CICS/File → JCL/Batch

JCL
Scheduler → JES → JCL → Program/Utility → Dataset/DB/Downstream

Cloud
Business → Responsibility → Network → Compute → Data → Identity/Security → Observe/Hybrid/DR
```

Wrong Layer Coachは「操作自体が正しい」ことと「現在の仮説に適切」なことを分ける。

- `EXPLAIN`はSQL性能を見るEvidenceであり、Lock waitの直接Evidenceではない。
- `systemctl`はHost service管理であり、Cloud Security Groupとは別。
- `RC=0`はJCL step正常終了であり、業務完了ではない。
- `S0C7`を見てJCL構文ミスと即断しない。

## 5. Lab → Incident transfer

各教材は単独科目で閉じない。Lab下部に **🚨 War Room Link / この知識が効く事故** を表示する。

```text
今回のConcept
  ↓
症状だけを見せるField Case
  ↓
Evidenceを自由に選ぶ
  ↓
仮説を「調査中 / 有力 / 除外」に整理
  ↓
Cause declaration
  ↓
ResultでSource・考え方・復習Labを開示
```

リンク時点ではRoot cause、推奨Evidence、復習Labを見せない。転移練習を解説付き問題へ戻さない。

## 6. Field Incident Gate

### 目的

公開された障害報告を読んだとき、製品名やニュース見出しに引っ張られず、

- どのレイヤーの事故か
- 何がFactで何が推論か
- 何をEvidenceとして確認するか
- 何を止め、どう安全に戻すか
- 顧客・件数・金額・正本をどう検証するか

を考えられる自信を作る。

### Source policy

- 公式postmortem、企業発表、規制当局資料をFactの軸にする。
- Qiita / note / 新聞・技術メディアは、概念翻訳・社会影響・別視点の補助に使う。
- 一次情報と二次解説が矛盾する場合は一次情報を優先する。
- 原文を長く転載せず、匿名化・簡略化・再構成する。
- 元事故名とSourceはResult後にRevealする。

### 10 Cases

1. Endpoint content update / OS crash / staged rollout
2. Network partition / DB failover / divergent writes
3. Production DB deletion / unusable backups
4. Backbone routing / DNS / Control Plane isolation
5. Valid configuration triggering latent edge bug
6. Internal Network congestion / retry amplification / Queue backlog
7. Month-end Batch resource exhaustion / ATM customer impact
8. Relay-system refresh / Master-data layout boundary defect
9. Route switch / reconnect storm / staged recovery
10. Payment-switch renewal workload / overload / transaction reconciliation

### Sign-off

全CaseでEngineer / Consultant / PMを各80点以上にする。構造QAだけでなく、正しいImpact・Evidence・Cause・Safe Recovery・Verification・Communicationを選ぶgolden pathが80×3へ到達できることを自動確認する。

## 7. Investigation logic

Field Incident GateとFinancial War Roomは同じ思考OSを使う。

```text
Impact first
  ↓
Free Investigation
  ↓
Evidence Board
  ↓
Hypothesis elimination
  ↓
Evidence Diversity Gate
  ↓
Primary cause + Contributing factor
  ↓
Safe Recovery
  ↓
Technical + Financial / Business Verification
  ↓
Status Communication
```

### Impact first

原因不明でも、重要業務、顧客影響、件数/金額、代替手段、締切からSeverityと優先順位は判断できる。

### Free Investigation

Evidenceには時間コストを持たせる。「全部見る」ではなく、仮説を残す/消す確認材料を選ぶ。

### Evidence Diversity

同じレイヤーのログを複数読むだけではCause宣言できない。

- Field Case 01–06: 2レイヤー以上
- Field Case 07–10: 3レイヤー以上
- Financial War Room Case 01–11: 2レイヤー以上
- Financial War Room Case 12: 3レイヤー以上

### Cause declaration

Primary causeと、事故を許したContributing factorを分ける。「直した」で終わらず、設計・運用controlへつなげる。

### Safe Recovery

1. Reversibleか
2. Blast radiusを狭めるか
3. 必要Evidenceがあるか
4. Data integrityを壊さないか
5. Rollbackできるか
6. Approval / Runbookに沿うか

### Verification / Reconciliation

Technical Greenだけで完了しない。

- Error rate / latency / health / resource / route / backlog
- Count / amount / debit-credit / authoritative ledger
- duplicate=0 / input=output / customer journey / downstream completion

### Communication

Known facts、Customer/business impact、Unknown、Action、Risk/fallback、Next update timeを分ける。未確定の段階で「Cloud障害」「DB障害」と断定しない。

## 8. Financial War Room — 12 Cases

1. False Green Health Check
2. Stale Balance / Replica Lag
3. Duplicate Transfer / Idempotency
4. Hybrid Core Link Degradation
5. Credential Rotation Failure
6. TLS Certificate Expiry
7. DNS Cutover Drift
8. Night Batch Partial Commit / S0C7
9. Queue Backlog
10. WAF False Positive
11. Regional Failure / DR Decision
12. Month-End Financial Mega War Room

Case 12はCore ledger / JCL / export / Cloud ingest / reconciliationを横断し、**RC=0でも業務完了ではない**状況を解く。

## 9. 三者の最終到達像

### Financial Engineer

- レイヤーを分解し、価値の高いEvidenceで仮説を潰す
- 正本、commit、Network path、Control Planeを混同しない
- Data integrityを守るreversible recoveryを選ぶ
- TechnicalとBusinessの両方で検証する

### Financial Consultant

- 顧客影響、重要業務、正本、統制、RTO/RPO、third partyを意思決定へ翻訳する
- Primary causeとcontrol gapを分ける
- SourceのFactと記事の解釈、自分の推論を区別する

### PM / PMO

- Severity、deadline、owner、approval、rollback、dependency、checkpointを管理する
- 原因未確定でも正しく状況共有し、復旧を前へ進める
- 技術正常後の顧客対応・取引照合・再発防止まで閉じる

この教材だけで製品の実作業者レベルを保証するものではない。狙いは、**金融IT案件で技術者・業務・経営の間に立ち、会話と一次判断を具体化できること**。
