# Enterprise Application / Java — Complete Package v1

## Goal

本教材は、Java文法の網羅や資格試験対策を目的としない。

金融システムのApplication層を、次の一連の流れとして理解する。

```text
Customer / Channel
  ↓ HTTP / API
Load Balancer / API Gateway
  ↓
Java / Spring Boot Application
  ↓
JVM / Thread / Heap / GC
  ↓ JDBC / Messaging
Database / IBM MQ / External System
  ↓
Technical + Business Verification
```

最終的には、Application障害について次を説明できることを目指す。

- どのRequest、機能、Node、Versionに影響が偏っているか
- Java、JVM、Framework、OS、Database、Messagingのどの境界を見ているか
- 何をEvidenceとして仮説を残す／消すか
- Data integrityを壊さず、どのActionで影響を止めるか
- 技術Greenだけでなく、顧客導線・件数・金額・重複まで何を確認するか

## Start from Zero

最初に、Application層が必要になる理由を置く。

```text
Browser / Mobile App
  ↓ Request
NetworkとLinuxはある
Databaseもある
  ↓
しかし、入力検証・権限確認・業務Rule・Data変換を担う層がない
  ↓
Application層が必要
  ↓
本教材ではJava / Spring Bootを代表Profileとして使う
```

### 必ず分ける境界

- Java = Programming Language
- JVM = Class Fileを実行するRuntime
- JDK = Compiler・Runtime・診断Tool等を含むToolset
- Spring Boot = Applicationを構築・運転するFramework
- Tomcat等 = Servlet Container / Web Server実装
- JDBC = JavaからDatabaseへ接続するAPI
- JMS = JavaのMessaging API

Java、JVM、JDK、Spring Boot、Tomcatを同じものとして扱わない。

## 20 Labs

### 01–05 — Build / Request Journey

1. Application層は何を引き受けるか
2. Source → Bytecode → JVM / JDK
3. Class・Method・Objectを責務として読む
4. Maven / Gradle、JAR / WAR、Artifact
5. Linux上のJava Process / Service / Port

### 06–10 — Guided / Web and Data

6. HTTP API Contract
7. Controller / Service / Repository
8. JDBC / Driver / DataSource / PreparedStatement
9. Connection Pool
10. Transaction / `@Transactional`

### 11–15 — Diagnose / Runtime Evidence

11. ExceptionとError Contract
12. Thread Pool / Queue / Virtual Thread
13. Heap / GC / Native Memory / JFR
14. Timeout / Retry / Backoff / Idempotency
15. Log / Metrics / Trace / Correlation ID

### 16–19 — Operate / Control and Delivery

16. Authentication / Authorization
17. External Configuration / Secret / Certificate
18. JMS / IBM MQ / Redelivery / DLQ
19. JAR → Container / Cloud / Canary / Rollback

### 20 — Java Application War Room

LBはHealthyだが、残高照会だけ18%がHTTP 500。node-bへ配布したv42、Connection Pool、Thread Dump、Database、Health Check、取引監査を自由に調査する。

```text
Impact
  ↓
Free Investigation
  ↓
Evidence Diversity
  ↓
Cause Declaration
  ↓
Safe Recovery
  ↓
Technical + Business Verification
  ↓
Engineer / Consultant / PM Sign-off
```

## Progressive Learning Model

- Lab01–05: 部品を追加し、Request JourneyとBefore / Afterを理解する
- Lab06–10: 状況とEvidenceを見て、設計・実装上の判断を行う
- Lab11–15: Runtime Evidenceから障害仮説を絞る
- Lab16–19: Security・Messaging・Releaseを運用責任へ接続する
- Lab20: 手順を先に見せず、自分で調査順序を決める

初心者には共通用語帳を表示し、玄人向け論点は `Expert Lens` に格納する。基本説明を隠しても、Application Stack MapとEvidenceは残る。

## Financial Context

Java Applicationを「画面を表示するProgram」で終わらせない。

- 正本DataとRead Modelを区別する
- Transaction境界と外部Side Effectを分ける
- Timeoutを失敗確定とみなさず、取引Stateを照合する
- Retry / Redeliveryを前提にIdempotencyを設計する
- Health CheckのGreenと顧客Journeyの成功を分ける
- Release完了をArtifact配布ではなく、業務Verificationまで追う
- JDK / Framework / Driver / Application ServerのSupport MatrixとEOLを確認する

## Tri-role Completion

### Financial Engineer

- RequestをHTTP → Application → JVM → DB / MQまで追う
- Thread・Heap・GC・Pool・Exception・TraceをEvidenceとして扱う
- 可逆的なContainmentとRollbackを選ぶ

### Financial Consultant

- 技術事象を顧客導線・重要業務・正本・重複・統制へ翻訳する
- Primary CauseとControl Gapを分ける
- Java採用・更改をSupport・License・保守責任へ接続する

### PM / PMO

- Version、Artifact、Owner、Dependency、Approval、Rollbackを管理する
- 原因未確定でもImpact・Fact・Unknown・Action・次回更新時刻を共有する
- 技術復旧後の件数・金額・顧客対応・後続処理まで閉じる

## Completion

- Lab01–20を修了
- 進捗キー: `java_app_labXX_complete`
- Lab20のSign-off: Engineer / Consultant / PMが各85点以上
- Java War Room結果: `java_app_warroom_result`

## Boundary

この教材はBrowser内のLearning Simulatorである。Java実行環境、Spring Boot Project、Database、MQ、Cloud Resourceを実際に作成しない。本番作業では、対象Version、Vendor Support、License、権限、変更承認、Runbook、最新の公式Documentationを確認する。
