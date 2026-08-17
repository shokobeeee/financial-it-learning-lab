# v16 Cross-Module Integration Plan

Linux v16 の設計思想を Financial IT Learning Lab 全体へ展開する。

## 共通原則

1. Concept / Product / Evidence を分離する
   - Concept: transaction, lock, identity, network, scheduler, messaging など
   - Product: Db2 / Oracle / PostgreSQL / SQL Server, AWS / GCP / Azure / OCI, Control-M / JP1, IBM MQ / HULFT など
   - Evidence: MON_GET_LOCKS, V$LOCK, pg_locks, sys.dm_tran_locks, provider audit/log/metrics, queue/file-transfer result 等
2. 製品間対応は `=` ではなく `≒ conceptually similar` と扱う
3. Canonical Lab + Profile Adapter 方式
   - Lab本文を製品ごとに複製しない
   - 共通概念を正本にし、profileで用語・診断例・Evidenceを翻訳する
4. Wrong Layer Coach
   - コマンド/SQL自体が正しくても、現在の仮説レイヤに合わない場合は理由付きで止める
5. Evidence Diversity Gate
   - 同じ種類の証拠を複数取るだけではCause確定不可
   - 複数レイヤのEvidenceを要求する
6. Product Catalog化しない
   - 製品名は「境界を理解するために必要な差分」だけ追加
   - 1製品追加=20 Labs新設、とはしない
   - 固有設計/運用を深く学ぶ必要が出た時だけ独立Package化

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
- Layer: COBOL -> Compiler/Runtime -> Host Platform -> Db/CICS/File -> JCL/Batch
- Profiles: IBM Enterprise COBOL / GnuCOBOL / Oracle Pro*COBOL context
- Scope badge: COBOL / Embedded SQL / CICS / JCL / Runtime evidence

### JCL
- Layer: Scheduler -> JES -> JCL -> Program/Utility -> Dataset/DB
- Scheduler context: Generic / BMC Control-M / JP1/AJS3 / IBM Z Workload Scheduler
- Scope badge: JCL / JES / DFSORT/utility / Scheduler / Program

### Cloud Fundamentals
- Layer: Business -> Shared Responsibility -> Network -> Compute -> Data -> Identity/Security -> Observability -> Hybrid/DR
- Provider profiles: Common / AWS / Google Cloud / Azure / Oracle Cloud Infrastructure (OCI)
- OCI examples: VCN, Compute, Database services, IAM, Vault, Monitoring, Audit, FastConnect

### AWS / GCP / Azure
- Common concept badge + provider-specific implementation badge
- Wrong layer coach
- Cross-provider conceptual translation including OCI

### Enterprise Integration / Middleware
独立20-Lab化せず、COBOL / JCL / Cloud / War RoomのContextとして扱う。

- Queue messaging: IBM MQ / cloud queue services
- Event streaming: Apache Kafka / provider streaming services
- Managed file transfer: HULFT / SFTP等
- API management: API Gateway / Apigee / Azure API Management / OCI API Gateway等

これらは互いの代替ではない。同期API、message queue、event stream、file transferの**連携パターン自体を分ける**。

金融ITでは次のEvidenceまで見る。

- queue depth / oldest message / consumer / DLQ
- retry / duplicate / idempotency
- partition / consumer lag / offset
- file count / size / checksum / send-receive result
- API route / auth / policy / rate limit / backend response / audit
- downstreamの件数・金額・正本照合

### Financial War Room
- Evidence layer badges
- Evidence Diversity Gate
- Wrong-layer coaching
- Common / AWS / Google Cloud / Azure / OCI provider context
- Integration / Middleware context
- Primary vs Contributing Cause stays mandatory

## Oracle / OCI

Oracle Database is treated as a first-class DB profile.
OCI is added to Cloud Fundamentals as a provider translation profile rather than immediately creating another 20-Lab module.
This keeps the curriculum compact while exposing VCN / Compute / Database / IAM / Vault / Monitoring / Audit / FastConnect and Exadata/Autonomous Database context.

If OCI-specific depth is later needed, it can become an independent 20-Lab package without changing the common conceptual model.

## 現時点で独立Packageにしないもの

Oracle Database / OCI / Control-M / JP1 / IBM MQ / HULFT等は、まず既存教材のContextとして学ぶ。

独立Package化の条件は、以下のいずれかを満たす場合。

1. その製品固有の設計判断が共通Conceptだけでは説明しきれない
2. 金融案件で継続的に登場し、20段階の学習価値がある
3. War Roomで製品固有Evidenceを深く操作する必要がある
4. 資格対策ではなく実務会話のために固有知識が明確に必要
