# v16 Cross-Module Integration Plan

Linux v16 の設計思想を Financial IT Learning Lab 全体へ展開する。

## 共通原則

1. Concept / Product / Evidence を分離する
   - Concept: transaction, lock, identity, network, scheduler など
   - Product: Db2 / Oracle / PostgreSQL / SQL Server, AWS / GCP / Azure / OCI など
   - Evidence: MON_GET_LOCKS, V$LOCK, pg_locks, sys.dm_tran_locks, provider audit/log/metrics 等
2. 製品間対応は `=` ではなく `≒ conceptually similar` と扱う
3. Canonical Lab + Profile Adapter 方式
   - Lab本文を製品ごとに複製しない
   - 共通概念を正本にし、profileで用語・診断例・Evidenceを翻訳する
4. Wrong Layer Coach
   - コマンド/SQL自体が正しくても、現在の仮説レイヤに合わない場合は理由付きで止める
5. Evidence Diversity Gate
   - 同じ種類の証拠を複数取るだけではCause確定不可
   - 複数レイヤのEvidenceを要求する

## 実装対象

### Linux
- v16を統合repoへ同期
- Debian/RHEL profile
- Scope badge / Layer Guide / Evidence gate / Wrong layer coach

### SQL / Database
- Layer: SQL Language -> DBMS -> Schema/Object -> Transaction/Lock -> Application
- Profiles: IBM Db2 / Oracle Database / PostgreSQL / Microsoft SQL Server
- Product-specific Evidence examples

### COBOL
- Layer: COBOL -> Compiler/Runtime -> z/OS -> Db2/CICS/File -> JCL/Batch
- Scope badge: COBOL / Embedded SQL / CICS / JCL / Runtime evidence

### JCL
- Layer: Scheduler -> JES -> JCL -> Program/Utility -> Dataset/DB
- Scope badge: JCL / JES / DFSORT/utility / Scheduler / Program

### Cloud Fundamentals
- Layer: Business -> Shared Responsibility -> Network -> Compute -> Data -> Identity/Security -> Observability -> Hybrid/DR
- Provider profiles: Common / AWS / Google Cloud / Azure / Oracle Cloud Infrastructure (OCI)
- OCI examples: VCN, Compute, Database services, IAM, Vault, Monitoring, Audit, FastConnect

### AWS / GCP / Azure
- Common concept badge + provider-specific implementation badge
- Wrong layer coach
- Cross-provider conceptual translation including OCI

### Financial War Room
- Evidence layer badges
- Evidence Diversity Gate
- Wrong-layer coaching
- Primary vs Contributing Cause stays mandatory

## Oracle / OCI

Oracle Database is treated as a first-class DB profile.
OCI is added to Cloud Fundamentals as a provider translation profile rather than immediately creating another 20-Lab module.
This keeps the curriculum compact while exposing VCN / Compute / Database / IAM / Vault / Monitoring / Audit / FastConnect and Exadata/Autonomous Database context.

If OCI-specific depth is later needed, it can become an independent 20-Lab package without changing the common conceptual model.
