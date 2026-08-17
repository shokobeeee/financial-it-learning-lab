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
- VPC / VNet / Subnet
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

### D. Mainframe / Batch

- COBOL data processing
- Db2 / CICS boundary
- JOB / EXEC / DD
- JES / RC / ABEND
- GDG / PROC / Scheduler
- partial commit
- checkpoint / restart / rerun safety
- batch completion vs end-to-end business completion

### E. Security / Governance

- Shared responsibility
- IAM / RBAC / workload identity
- least privilege / MFA
- KMS / Key Vault / Secret / Certificate
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

## 4. Cloudの学ばせ方

順番は以下とする。

1. **Cloud Fundamentals**
   - vendor名を使わず、責任・障害ドメイン・network・compute・data・IAM・observability・DRを理解。
2. **AWS / Google Cloud / Azure**
   - 同じ概念を各providerのサービス名へ翻訳。
3. **Financial War Room**
   - provider名より先に、共通レイヤで仮説を立てる。
   - 必要な場合のみprovider固有のログ/サービスへ降りる。

「AWSならEC2」「AzureならVM」という単語対応だけで終わらず、
**なぜその層を見るのか**を説明できることを合格条件とする。

---

## 5. Financial War Room の挑戦ロジック

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

### Step 3 — Evidence budget

Evidenceには時間コストを持たせる。

- 高価値証拠を少数取るほど高評価
- 無関係なログを全部読むとPM/Engineer評価を下げる
- Evidenceを取らずに変更すると減点

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

## 6. 12 War Room Cases

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

## 7. 三者レビューの判定

### Financial Engineer — OK

以下を満たすためOK。

- Linux / DB / Mainframe / Batch / Cloudを横断
- evidence-based troubleshooting
- data integrity / idempotency / partial commit
- hybrid connectivity
- safe change / rollback / verification

### Financial Consultant — OK

以下を満たすためOK。

- 技術を重要業務・顧客影響へ翻訳
- RTO/RPO / SLO / residual risk
- third-party / shared responsibility
- Well-Architected trade-off
- cost / exit / governance
- primary causeとcontrol gapを分離

### PM / PMO — OK

以下を満たすためOK。

- severity / timebox / deadline
- dependency / owner / approval
- change / rollback
- status communication
- downstream / cutover / DR
- post-incident action tracking

ただし、この教材だけで製品の実作業者レベルを保証するものではない。
狙いは、**金融IT案件で技術者・業務・経営の間に立って、会話と一次判断を前へ進められること**。
