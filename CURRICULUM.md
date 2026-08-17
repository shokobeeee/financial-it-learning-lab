# Financial IT Learning Lab — Curriculum & Sign-off Design

## 1. ゴール

この教材のゴールは資格試験のサービス名暗記ではない。

金融システムを、**顧客導線 / 業務 / アプリ / Cloud / Network / OS / Database / COBOL / JCL / Batch / 外部接続**まで一つのシステムとして捉え、次の3つを同時にできる状態を目指す。

1. **Financial Engineer** — 症状をレイヤ分解し、証拠を集め、安全に一次切り分け・復旧できる。
2. **Financial Consultant** — 技術事象を顧客影響、重要業務、リスク、統制、コスト、外部委託、レジリエンスへ翻訳できる。
3. **PM / PMO** — 依存関係、意思決定者、変更・rollback、RTO/RPO、進捗、状況共有、再発防止を前へ進められる。

### Sign-off rule

Financial War Roomでは、各Caseで以下を満たしたときのみ **TRI-ROLE SIGN-OFF** とする。

- Financial Engineer: 85 / 100 以上
- Financial Consultant: 85 / 100 以上
- PM / PMO: 85 / 100 以上

「原因を当てた」だけでは合格しない。  
データ整合性を壊す復旧、証拠を消す一斉再起動、顧客影響を無視した判断、rollback/承認/状況共有が欠ける場合は減点する。

---

## 2. 完成モジュール

### Core — 80 Labs

- Linux / Infrastructure — 20
- COBOL / Business Systems — 20
- SQL / Database — 20
- JCL / Batch Operations — 20

### Cloud — 80 Labs

- Cloud Fundamentals — 20
- AWS for Financial IT — 20
- Google Cloud for Financial IT — 20
- Azure for Financial IT — 20

### Final Capstone

- Financial War Room — 12 incident cases

合計: **160 Labs + 12 War Room Cases**

---

## 3. 必要知識の最終マップ

### A. Customer / Business

- 重要業務、顧客導線、代替手段
- SEV判定
- SLI / SLO / SLA
- RTO / RPO
- 締切、営業開始、決済時限
- 正本データと業務完了条件

### B. Architecture / Infrastructure

- DNS / TLS / Load Balancer
- Route / NAT / Firewall
- VPC / VNet / VCN / Subnet
- VM / Container / Serverless
- Linux process / memory / disk / log
- Hybrid connectivity / dedicated circuit / VPN
- Failure domain / AZ / Region / DR

### C. Data

- SQL / Transaction / COMMIT / ROLLBACK
- Lock / Isolation / Connection pool
- Primary / Replica / replication lag
- Backup / Restore
- Reconciliation
- Count / Amount / Debit-Credit / Ledger invariant
- Idempotency / duplicate / retry
- DBMS product context: Db2 / Oracle Database / PostgreSQL / SQL Server

### D. Mainframe / Batch

- COBOL data processing
- Compiler / Runtime / Host platform boundary
- Db2 / Oracle / CICS boundary
- JOB / EXEC / DD
- JES / RC / ABEND
- GDG / PROC
- Enterprise Scheduler: Control-M / JP1/AJS3 / IBM Z Workload Scheduler等の文脈
- partial commit
- checkpoint / restart / rerun safety
- batch completion vs end-to-end business completion

### E. Security / Governance

- Shared responsibility
- IAM / RBAC / workload identity
- least privilege / MFA
- KMS / Key Vault / OCI Vault / Secret / Certificate
- audit trail
- WAF / network controls
- data classification
- external service / third-party dependency
- change control / IaC / drift / rollback
- exit strategy / data portability

### F. Management / Consulting

- architecture trade-off
- residual risk
- cost / FinOps
- vendor / cloud concentration
- migration / coexistence / cutover
- ownership / RACI
- runbook
- incident communication
- post-incident action / owner / due date

---

## 4. v16 Context Model — 分類軸を混ぜない

Linux v16で導入した「同じ軸ではないものを分けて見せる」考え方を全教材へ展開する。

### 4.1 Concept → Product / Platform → Operational Evidence

学習者はまず共通概念を理解し、その後に製品固有の実装へ降りる。

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

例:

```text
Lock / waiting                   ← Concept
├ Db2: MON_GET_LOCKS            ← Product-specific evidence
├ Oracle: V$LOCK + V$SESSION
├ PostgreSQL: pg_locks
└ SQL Server: sys.dm_tran_locks
```

製品間対応は `=` ではなく **`≒ conceptual mapping`**。  
権限、粒度、仕様、運用、性能特性まで同じとはみなさない。

### 4.2 Canonical Lab + Profile Adapter

共通Labを製品ごとに複製しない。

- Canonical Lab: 業務・概念・判断ロジックの正本
- Profile Adapter: 製品名、代表構文、monitor/audit evidence、境界の差分

これにより、Oracle等を追加しても「Db2版20 Labs」「Oracle版20 Labs」のような教材コピーを量産しない。

### 4.3 Layer Guide

各教材で「どのレイヤーか」を明示する。

**Linux**

```text
Distribution → Package/Firewall management → systemd → App/Tool
```

**SQL**

```text
SQL Language → DBMS → Schema/Object → Transaction/Concurrency → Application/Batch
```

**COBOL**

```text
COBOL Language → Compiler/Runtime → Host Platform → Db/CICS/File → JCL/Batch
```

**JCL**

```text
Enterprise Scheduler → JES → JCL → Program/Utility → Dataset/DB/Downstream
```

**Cloud**

```text
Business → Responsibility → Network → Compute → Data → Identity/Security → Observe/Hybrid/DR
```

### 4.4 Product Profiles

- SQL: IBM Db2 / Oracle Database / PostgreSQL / Microsoft SQL Server
- COBOL: IBM Enterprise COBOL / GnuCOBOL / Oracle Pro*COBOL context
- JCL周辺: Generic / BMC Control-M / JP1/AJS3 / IBM Z Workload Scheduler
- Cloud translation: Common / AWS / Google Cloud / Azure / OCI

OCIは現在、Cloud FundamentalsとFinancial War Roomのtranslation profileとする。  
OCI固有の設計・運用を20段階で深掘りする必要が出た場合のみ、独立Packageへ昇格する。

### 4.5 Scope Badge / Wrong Layer Coach

操作やEvidenceへ所属レイヤーを表示する。

例:

- `EXPLAIN`はSQL性能/optimizerを見るEvidenceであり、Lock waitの直接Evidenceではない。
- `systemctl`はHost OS/service管理であり、Cloud Security Group control planeとは別。
- `RC=0`はJCL step正常終了Evidenceであり、金融業務完了を証明しない。
- `S0C7`を見てJCL構文ミスと即断しない。

「操作自体が正しい」ことと「今の仮説に適切」なことを分ける。

---

## 5. Cloudの学ばせ方

順番は以下とする。

1. **Cloud Fundamentals**
   - vendor名を使わず、責任・障害ドメイン・network・compute・data・IAM・observability・DRを理解。
   - Common / AWS / Google Cloud / Azure / OCI profileで概念翻訳できる。
2. **AWS / Google Cloud / Azure**
   - 同じ概念を各providerのサービス名へ翻訳。
   - Context GuideでOCIを含む他providerとのconceptual mapも確認する。
3. **Financial War Room**
   - provider名より先に、共通レイヤで仮説を立てる。
   - 必要な場合のみprovider固有のログ/サービスへ降りる。

「AWSならEC2」「AzureならVM」という単語対応だけで終わらず、
**なぜその層を見るのか**を説明できることを合格条件とする。

---

## 6. Financial War Room の挑戦ロジック

### Step 1 — Impact first

最初に確認するのは技術原因ではなく、

- どの重要業務か
- 何人/何件/何円に影響しているか
- 顧客影響
- 代替手段
- 次の業務締切

原因が分からなくてもSeverityと優先順位は判断できる。

### Step 2 — Hypothesis tree

仮説は最大3つまで。

例:

- Channel / DNS / TLS / LB
- App / Compute / Release
- DB / Lock / Replica / Connection
- Identity / Secret / Key
- Hybrid Network / Core
- COBOL / JCL / Batch
- Async / Queue / Retry

「全部見る」を防ぎ、仮説に対して証拠を取りにいく。

### Step 3 — Evidence budget + Evidence Diversity Gate

Evidenceには時間コストを持たせる。

- 高価値証拠を少数取るほど高評価
- 無関係なログを全部読むとPM/Engineer評価を下げる
- Evidenceを取らずに変更すると減点
- **同じレイヤーのEvidenceを何個集めても、Cause確定の十分条件にはしない**

Cause確定前に原則2レイヤー以上、最終Case 12では3レイヤー以上のEvidenceを要求する。

例:

```text
Data evidence + App evidence
Network evidence + Control-plane audit
JES evidence + DB commit evidence + Dataset evidence
```

Evidenceは以下の順で価値を考える。

1. Blast radius
2. Last known good
3. Recent change
4. Path / dependency
5. Authoritative data
6. Control-plane audit

### Step 4 — Primary cause + contributing factor

Primary causeと、再発を許したContributing factorを分ける。

例:

- Primary: read replica lag
- Contributing: 残高freshness要件をread routingへ反映していなかった

これにより「直した」で終わらず、設計・運用controlへ改善をつなげる。

### Step 5 — Safe Recovery

復旧Actionは以下の順で評価する。

1. Reversibleか
2. Blast radiusを狭めるか
3. 必要Evidenceがあるか
4. Data integrityを壊さないか
5. Rollbackできるか
6. Approval / Runbookに沿うか

一斉再起動、手動DB修正、security control全解除は強く減点する。

### Step 6 — Verification

復旧完了は「エラーが消えた」ではない。

必ず2種類以上を確認する。

**Technical**
- Error rate
- Latency
- Health
- DB connection / lock / lag
- Network loss
- queue backlog

**Financial / Business**
- Count
- Amount
- Debit = Credit
- authoritative ledger
- duplicate = 0
- batch input = output
- customer journey
- downstream completion

### Step 7 — Status Communication

共有するのは、

- Known facts
- Customer/business impact
- What is unknown
- Action underway
- Risk / fallback
- Next update time

原因未確定の段階で「AWS障害」「DB障害」と断定しない。

### Step 8 — Post Incident

- Primary cause
- Contributing factors
- Detection gap
- Control gap
- Preventive action
- Owner
- Due date
- Test / evidence of completion

---

## 7. 12 War Room Cases

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

Case 12は最終試験。  
Core ledger / JCL / export / Cloud ingest / reconciliationを横断して、**RC=0なのに業務完了ではない**状況を解く。

---

## 8. 三者レビューの判定

### Financial Engineer — OK

以下を満たすためOK。

- Linux / DB / Mainframe / Batch / Cloudを横断
- Concept / Product / Evidenceを分離
- evidence-based troubleshooting
- evidence diversity
- data integrity / idempotency / partial commit
- hybrid connectivity
- safe change / rollback / verification

### Financial Consultant — OK

以下を満たすためOK。

- 技術を重要業務・顧客影響へ翻訳
- provider/product名より共通判断軸で比較
- RTO/RPO / SLO / residual risk
- third-party / shared responsibility
- Well-Architected trade-off
- cost / exit / governance
- primary causeとcontrol gapを分離

### PM / PMO — OK

以下を満たすためOK。

- severity / timebox / deadline
- dependency / owner / approval
- product/team responsibility boundary
- change / rollback
- status communication
- downstream / cutover / DR
- post-incident action tracking

ただし、この教材だけで製品の実作業者レベルを保証するものではない。
狙いは、**金融IT案件で技術者・業務・経営の間に立って、会話と一次判断を前へ進められること**。
