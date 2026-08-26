# Enterprise Application / Java — Learning Architecture

Reviewed: 2026-08-26

## 1. Why this package exists

既存カリキュラムには、Linux、Database、COBOL、JCL、Cloudがある。一方、Online Requestを受け、業務Ruleを実行し、Databaseや外部SystemへつなぐApplication層は独立教材になっていなかった。

Javaを追加する理由は、言語の人気や文法学習ではない。金融ITで頻出するEnterprise Applicationの代表Profileとして、次を一つのRequest Journeyに接続するためである。

```text
HTTP / API
  ↓
Business Rule
  ↓
Transaction / JDBC / Connection Pool
  ↓
JVM / Thread / Heap / GC
  ↓
Messaging / External System
  ↓
Linux / Container / Cloud
  ↓
Observability / Release / Reconciliation
```

## 2. Canonical concept and Java profile

```text
Common Application Concept
├ Request / Response
├ API Contract
├ Business Rule
├ Transaction
├ Concurrency
├ Configuration
├ Observability
├ Messaging
└ Delivery / Rollback

Java Profile
├ Java Language
├ JDK / JVM / Class File
├ Spring Boot / Spring Framework
├ JDBC / DataSource
├ JMS / IBM MQ
├ Maven / Gradle
├ JAR / WAR
└ JFR / jcmd / Heap Dump / Thread Dump
```

Java固有の用語を、Application一般の概念と同一視しない。将来.NET、Node.js等を追加する場合も、Common Application Conceptへ戻して比較する。

## 3. Writing standard

文章は次の順で構成する。

1. 現在地 — 何がすでにあるか
2. 困りごと — 無いと何が起きるか
3. 必要能力 — Systemとして何を実現したいか
4. 代表実装 — Java / Spring Boot等をなぜ使うか
5. 境界 — 何と何を混同しやすいか
6. Before / After — Systemに何が増えたか
7. Evidence — 何を見れば事実確認できるか
8. Decision — Evidenceを踏まえて何を判断するか
9. Financial Context — 顧客・取引・正本・統制への接続

専門語の羅列や、製品名だけを主語にした説明を避ける。断定できない製品差、Version差、運用差は明示する。

## 4. Technical depth boundary

### Beginner baseline

- Java / JVM / JDK / Spring Bootの役割
- HTTP Requestの流れ
- Class / Method / Objectの読み方
- JDBC / Connection Pool / Transaction
- Exception / Thread / Heap / GC
- Log / Metrics / Trace
- Messaging / Retry / Idempotency
- Container / Cloud / Rollback

### Expert lens

- Class File compatibilityとSupport Matrix
- Dependency resolution、SBOM、Artifact provenance
- Proxy-based transactionとself-invocation
- Platform Thread / Virtual Thread / downstream capacity
- Heap / Native Memory / Container limit
- JFR / jcmd / Thread Dump / Heap Dump
- Delivery guarantee、ACK、Transactional Outbox / Inbox
- Canary、Business SLI、False Green Health Check

### Out of scope

- Java Language Specificationの全構文
- Algorithm競技
- GUI Application開発
- Framework APIの網羅
- Vendor資格試験対策
- 実本番Runbook

## 5. UI / UX principle

### Request Journey is always visible

学習者は、いま扱う知識が次のどこにいるかを確認できる。

```text
Client → Edge / LB → Java App → JVM → Database → Messaging
```

### Progressive disclosure

- 初心者向け説明は最初から見える
- 重複説明と高度な論点は折りたたむ
- Expert Lensは自分で開く
- Code、Command、Evidenceは説明文と視覚的に分ける
- Mobileでは1列にし、操作順序を崩さない

### Evidence before judgment

選択問題を先に解かせない。必要数のEvidenceを取得した後にDecision Gateを開く。

### Capstone is an investigation game

Lab20では、原因候補や手順を解説通りに押すだけにしない。Evidence budget、Layer diversity、Hypothesis Board、Cause Declaration、Safe Recovery、Business Verificationを持つ。

## 6. Official reference baseline

- Oracle Java SE Support Roadmap
  - https://www.oracle.com/java/technologies/java-se-support-roadmap.html
- Java Virtual Machine Specification, Java SE 25
  - https://docs.oracle.com/javase/specs/jvms/se25/html/
- Spring Boot Reference Documentation
  - https://docs.spring.io/spring-boot/reference/
- Spring Framework Transaction Management
  - https://docs.spring.io/spring-framework/reference/data-access/transaction.html
- Java JDBC Basics
  - https://docs.oracle.com/javase/tutorial/jdbc/basics/
- Java Virtual Threads
  - https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html
- Java Troubleshooting / `jcmd` / JFR
  - https://docs.oracle.com/en/java/javase/25/troubleshoot/
- Spring Security Reference
  - https://docs.spring.io/spring-security/reference/
- Jakarta Messaging Specification
  - https://jakarta.ee/specifications/messaging/
- IBM MQ Java / JMS documentation
  - https://www.ibm.com/docs/en/ibm-mq/9.4.x?topic=mq-java

公式Documentationを事実の基準にし、案件では利用VersionとVendor Support Matrixを再確認する。
