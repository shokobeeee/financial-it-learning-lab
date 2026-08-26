# Financial IT Learning Lab — Curriculum & Sign-off Design

## 1. ゴール

この教材のゴールは、資格試験の製品名や構文を暗記することではない。

金融Systemを、**顧客導線 / API / Application / Cloud / Network / OS / Database / COBOL / JCL / Batch / 外部接続**まで一つのSystemとして捉え、次の3つを同時に行える状態を目指す。

1. **Financial Engineer** — 症状をLayerへ分解し、仮説とEvidenceで一次切り分けし、安全に復旧・検証できる。
2. **Financial Consultant** — 技術事象を顧客影響、重要業務、正本Data、Risk、統制、Cost、外部委託、Resilienceへ翻訳できる。
3. **PM / PMO** — Dependency、Decision Owner、変更・Rollback、RTO/RPO、進捗、状況共有、再発防止を前へ進められる。

原因を当てただけでは合格しない。Data integrityを壊す復旧、Evidenceを消す一斉再起動、顧客影響を無視した判断、Rollback・承認・共有の欠落は減点する。

## 2. Curriculum Structure

### Platform, Data & Application — 60 Labs

- Linux / Infrastructure — 20
- SQL / Database — 20
- Enterprise Application / Java — 20

### Core Systems & Batch — 40 Labs

- COBOL / Business Systems — 20
- JCL / Batch Operations — 20

### Cloud — 80 Labs

- Cloud Fundamentals — 20
- AWS for Financial IT — 20
- Google Cloud for Financial IT — 20
- Azure for Financial IT — 20

### Final Practice

- Field Incident Gate — 10 Cases / Engineer・Consultant・PM 各80点以上
- Financial War Room — 12 Cases / Engineer・Consultant・PM 各85点以上

合計: **180 Labs + 10 Field Cases + 12 War Room Cases**

```text
Computer / OS Foundation
  ↓
Linux → SQL → Enterprise Application / Java
  ↓
COBOL → JCL / Batch
  ↓
Cloud Fundamentals → AWS / GCP / Azure
  ↓
Field Incident Gate
  ↓
Financial War Room
```

## 3. 必要知識の最終Map

### A. Customer / Business

- 重要業務、顧客導線、代替手段、SEV
- SLI / SLO / SLA
- RTO / RPO、営業開始、決済時限
- 正本Dataと業務完了条件
- 件数、金額、Debit-Credit、重複、未処理

### B. Architecture / Infrastructure

- DNS / TLS / Load Balancer / WAF / API Gateway
- Route / NAT / Firewall / VPC / VNet / Subnet
- VM / Container / Serverless
- Linux Process / Memory / Disk / Boot / Log
- Hybrid Connectivity / VPN / Dedicated Circuit
- Failure Domain / Zone / Region / DR
- Control Plane / Out-of-band Recovery

### C. Enterprise Application / Java

- HTTP Method / Status / JSON / API Contract
- Java / JVM / JDK / Class File / Support Matrix
- Spring Boot / Controller / Service / Repository
- Build / Dependency / JAR / WAR / Artifact / SBOM
- JDBC / Driver / DataSource / Connection Pool
- Transaction / `@Transactional` / COMMIT / ROLLBACK
- Exception / Error Contract / Correlation ID
- Platform Thread / Virtual Thread / Queue / Downstream Capacity
- Heap / GC / Native Memory / JFR / Thread Dump / Heap Dump
- Timeout / Retry / Backoff / Jitter / Idempotency
- Log / Metrics / Trace / Health / Business SLI
- Authentication / Authorization / Secret / Certificate
- JMS / IBM MQ / ACK / Redelivery / DLQ
- Container / Cloud / Canary / Rollback

### D. Data

- SQL / Transaction / COMMIT / ROLLBACK
- Lock / MVCC / Isolation / Connection Pool
- Primary / Replica / Replication Lag / Fencing
- Backup / Restore / Point-in-time Recovery
- Reconciliation / Authoritative Ledger
- Idempotency / Duplicate / Retry
- Db2 / Oracle Database / PostgreSQL / SQL Server Context

### E. Mainframe / Batch

- COBOL Record Layout / Business Logic / FILE STATUS / S0C7
- Compiler / Runtime / Host Boundary
- Db2 / Oracle / CICS / File Integration
- JOB / EXEC / DD / JES / RC / ABEND
- GDG / PROC / SORT / Enterprise Scheduler
- Partial COMMIT / Checkpoint / Restart / Rerun Safety
- Batch Completion vs End-to-end Business Completion

### F. Security / Governance

- Shared Responsibility / Third-party Dependency
- IAM / RBAC / Workload Identity / Least Privilege
- Secret / Key / Certificate / Rotation
- Audit Trail / WAF / Network Controls
- Change Control / IaC / Drift / Canary / Rollback
- Capacity / Failover / Recovery Rehearsal / Exit Strategy
- Runtime・Framework・Driver・OSのEOL / License / Vendor Support

## 4. Context Model

```text
Plain Language
  ↓
Need / Problem
  ↓
Capability / Common Concept
  ↓
Product / Platform Profile
  ↓
Operational Evidence
  ↓
Safe Decision / Change
  ↓
Business Verification
```

製品間対応は `=` ではなく **`≒ conceptual mapping`**。権限、粒度、仕様、運用、性能特性まで同一とはみなさない。

### Layer Examples

```text
Linux
Common Linux → Distribution Profile → Package / Firewall → systemd → App / Tool

SQL
SQL Language → DBMS → Schema / Object → Transaction / Concurrency → App / Batch

Java
HTTP Contract → Application → Framework → JVM → JDBC / Messaging → OS / Cloud

COBOL
Language → Compiler / Runtime → Host → DB / CICS / File → JCL / Batch

JCL
Scheduler → JES → JCL → Program / Utility → Dataset / DB / Downstream

Cloud
Business → Responsibility → Network → Compute → Data → Identity / Security → Observe / Hybrid / DR
```

Wrong Layer Coachは「操作が正しい」ことと「現在の仮説に適切」なことを分ける。

- Java Processが存在しても、Applicationの業務処理が正常とは限らない。
- Health CheckがGreenでも、特定Endpoint・Node・Versionが失敗している可能性がある。
- Connection Pool枯渇を、Database全停止と即断しない。
- Virtual Threadを増やしても、Database ConnectionやDownstream Capacityは増えない。
- `RC=0`はJCL Step正常終了であり、業務完了ではない。

## 5. Progressive Learning Modes

```text
Linux / SQL / COBOL / JCL
見る → 選ぶ → 入力 / Evidence

Enterprise Application / Java
Lab01–05  Request JourneyをBuild
Lab06–10  Web / DataのGuided Decision
Lab11–15  Runtime EvidenceでDiagnose
Lab16–19  Security / Messaging / DeliveryをOperate
Lab20     Free Investigation Java War Room

Cloud Fundamentals
Lab01–07  見る → 困る → 部品を足す → 名前を知る
Lab08–15  状況を見る → 選ぶ → 理由を理解する
Lab16–20  Evidence → 判断 → Verify / Reconcile
```

高度なUIを最初から押し付けない。問題を解けるところまで教材が教えてから問う。一方で、玄人向け論点はExpert Lensへ残す。

## 6. Lab → Incident Transfer

各教材は単独科目で閉じない。Lab下部に **🚨 War Room Link / この知識が効く事故** を表示する。

```text
今回のConcept
  ↓
症状だけを見せるField Case
  ↓
Evidenceを自由に選ぶ
  ↓
仮説を調査中 / 有力 / 除外へ整理
  ↓
Cause Declaration
  ↓
ResultでSource・考え方・復習Labを開示
```

Java Packageでは、False Green Health Check、Connection Pool、Retry Storm、Messaging重複、Release差分等を公開事例・War Roomへ接続する。

## 7. Investigation Logic

```text
Impact First
  ↓
Free Investigation
  ↓
Evidence Board
  ↓
Hypothesis Elimination
  ↓
Evidence Diversity Gate
  ↓
Primary Cause + Contributing Factor
  ↓
Safe Recovery
  ↓
Technical + Financial / Business Verification
  ↓
Status Communication
```

### Safe Recovery

1. Reversibleか
2. Blast Radiusを狭めるか
3. 必要Evidenceがあるか
4. Data integrityを壊さないか
5. Rollbackできるか
6. Approval / Runbookに沿うか

### Verification / Reconciliation

Technical Greenだけで完了しない。

- Error Rate / Latency / Health / Resource / Route / Backlog
- Node / Version / Thread / Heap / Pool / DB Session
- Count / Amount / Debit-Credit / Authoritative Ledger
- Duplicate=0 / Input=Output / Customer Journey / Downstream Completion

## 8. Final Practice

### Field Incident Gate

公式postmortem、企業発表、規制当局資料をFactの軸にする。Zenn / Qiita / Engineering Blogは技術理解、note / 新聞・技術メディアは社会・顧客影響の補助線として扱う。実事故名とSourceはResult後にRevealする。

### Financial War Room

1. False Green Health Check
2. Stale Balance / Replica Lag
3. Duplicate Transfer / Idempotency
4. Hybrid Core Link Degradation
5. Credential Rotation Failure
6. TLS Certificate Expiry
7. DNS Cutover Drift
8. Night Batch Partial COMMIT / S0C7
9. Queue Backlog
10. WAF False Positive
11. Regional Failure / DR Decision
12. Month-End Financial Mega War Room

Java Lab20はFinancial War RoomへのApplication層Capstoneとして、Node、Release、Connection Pool、Thread、Database、Health、取引監査を横断する。

## 9. 三者の最終到達像

### Financial Engineer

- RequestをClientからApplication、JVM、Database、Messagingまで追う
- Layerごとに価値の高いEvidenceを選ぶ
- Data integrityを守るReversible Recoveryを選ぶ
- TechnicalとBusinessの両方で検証する

### Financial Consultant

- 技術を顧客影響、重要業務、正本、統制、RTO/RPOへ翻訳する
- Primary CauseとControl Gapを分ける
- Java / JDK / Framework更改をSupport・License・EOL・Costへ接続する
- SourceのFact、記事の解釈、自分の推論を区別する

### PM / PMO

- Severity、Deadline、Owner、Approval、Rollback、Dependency、Checkpointを管理する
- Artifact、Runtime、Configuration、Database、外部接続のVersionを追う
- 原因未確定でも正しく状況共有し、復旧を前へ進める
- 技術正常後の顧客対応・取引照合・再発防止まで閉じる

この教材だけで製品の実作業者レベルを保証するものではない。狙いは、**金融IT案件で技術者・業務・経営の間に立ち、会話と一次判断を具体化できること**である。
