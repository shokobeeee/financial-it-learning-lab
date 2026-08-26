# Financial IT Learning Lab — Complete Package Standard

## 完パケの定義

このrepoでは「20 Labsが存在する」だけでは教材完成としない。

1教材を **Complete Learning Package** と呼ぶ条件は以下。

1. **Start from Zero** — 初学者が「そもそも何をする技術か」から入れる。
2. **Need before Tool / Component Origin** — 製品名・install・provisionより先に、「もともと何があるか」「無いと何に困るか」「どんな機能が必要か」「その部品はどこから来るか」を説明する。
3. **20 Labs** — 基礎 → 実務 → 障害対応 / Capstoneまで段階がある。
4. **Progressive Learning Modes** — 見る / 作る → 選ぶ / 判断する → 入力 / Evidenceへ、理解段階に合わせて難度を上げる。全Labへ同じUIを強制しない。
5. **State / Evidence at the Right Time** — 何が変わったか・何をEvidenceとするかを学ぶ。初学者へ高度なUIを先回りさせない。
6. **Layer Guide / Stack Map** — 同じ軸ではないものを分離し、いま何のLayerを見ているか説明できる。
7. **Concept → Product → Evidence** — 共通概念・製品実装・運用Evidenceを分ける。製品間対応は `=` ではなく `≒ conceptual mapping` とする。
8. **Product / Platform Profile** — Canonical Conceptを複製せず、Profile Adapterで主要実装差を重ねる。
9. **Scope Badge / Wrong Layer Coach** — 操作・Code・SQL・JCL・Evidenceの所属Layerを示し、目的Layerが違う場合は理由付きで指摘する。
10. **Evidence Diversity** — 同種Logの大量取得ではなく、異なるLayerのEvidenceを組み合わせる。
11. **Financial Context** — 件数・金額・残高・正本・締切・顧客影響と接続する。
12. **Field Questions** — 会議・障害対応で実際に確認すべき質問を持つ。
13. **Plain-language Glossary / Expert Lens** — 完全未経験者には普通の言葉、経験者には高度な論点を提供する。
14. **Tri-role View** — Engineer / Consultant / PM・PMOの3視点で修了像を定義する。
15. **Final Capstone** — 正解当てではなく Evidence → Safe Action → Verificationを行う。
16. **War Room Link / Public Incident Transfer** — 各Labから「この知識が効く事故」へ進み、結果から復習Labへ戻れる。
17. **Completion / Next Path** — 進捗、修了状態、次教材・関連教材が分かる。

## Need before Tool / Component Origin

```text
もともと何がある？
  ↓
無いと何に困る？
  ↓
どんな機能が必要？
  ↓
選択肢は？
  ↓
今回はなぜこの部品？
  ↓
どこから来る？
  ↓
追加・設定後に何が増えた？
  ↓
何をEvidenceとして確認する？
```

| Origin | 意味 | 例 |
|---|---|---|
| OS / Platformに含まれる | 土台として最初からある | Kernel、Process、TCP/IP stack |
| 既存機能を設定・有効化 | 新製品ではなく設定で使う | Network設定、Firewall Rule、Timer |
| Packageとして追加 | Repository等からSoftwareを導入 | nginx、JDK、Container Runtime |
| Compiler / Runtimeを追加 | Sourceを実行可能にする | Java JDK / JVM、GnuCOBOL |
| 操作する側へToolを追加 | Control Node / 管理端末へ置く | Maven、Cloud CLI、IaC Tool |
| Cloud上にResourceを作成 | Provider側へprovisionする | EC2、VPC、Managed DB |
| 別Platformで提供 | 対象Linuxへinstallしない | JES、CICS、Enterprise Scheduler、Managed MQ |

## 必須の説明境界

- Common LinuxとDistribution固有のPackage・Firewall・Security実装は別
- Web Serverは役割、nginxはその実装の一つ
- SQLは言語、DatabaseはDataの集合・仕組み、DBMSは管理Software
- Javaは言語、JVMは実行基盤、JDKはToolset、Spring BootはFramework
- Controller / Service / Repositoryは責務分割の代表例であり、唯一の設計ではない
- JDBCはDatabase接続API、Connection Poolは有限Resourceの管理
- `@Transactional`はAnnotationを書いただけで全経路がTransactionになるとは限らない
- Virtual Threadは同時実行数を扱いやすくするが、DB Connectionや下流Capacityを増やさない
- JCLはJob定義、JESは実行基盤、Enterprise Schedulerは外側の運用Layer
- Cloud CLIをdownloadすることと、Cloud Resourceをprovisionすることは別

教材はBrowser内Simulatorであり、実機へSoftwareやCloud Resourceを自動導入しない。本番作業では対象Version、Vendor Support、License、権限、承認、Runbook、最新の公式Documentationを確認する。

## Progressive Learning Modes

```text
Computer / OS Foundation
普通の言葉 → 専門用語 → System上の位置

Linux / SQL / COBOL / JCL
見る → 選ぶ → 入力 / Evidence

Enterprise Application / Java
Lab01–05  Build / Request Journey
Lab06–10  Guided / Web and Data
Lab11–15  Diagnose / Runtime Evidence
Lab16–19  Operate / Security, Messaging, Delivery
Lab20     Free Investigation Java War Room

Cloud Fundamentals
Lab01–07  Build / Visual
Lab08–15  Guided Decision
Lab16–20  Evidence / Operations
```

重要なのはUIの完全統一ではなく、認知負荷を理解段階へ合わせること。

## Canonical Concept + Profile Adapter

- Canonical Concept = 共通概念・金融業務・判断Logicの基準
- Profile Adapter = 製品名、代表構文、Runtime、Monitoring、Support境界の差分

現在のProfile対象:

- Linux: Common Linux + RHEL系（教材標準） / Ubuntu LTS / SLES / Oracle Linux
- SQL: IBM Db2 / Oracle Database / PostgreSQL / Microsoft SQL Server
- Application: Common Application Concept + Java / JVM / Spring Boot / JDBC / JMS
- COBOL: IBM Enterprise COBOL / GnuCOBOL / Oracle Pro*COBOL Context
- JCL周辺: JES / JCLとControl-M / JP1/AJS3 / IBM Z Workload Scheduler
- Cloud: Common / AWS / Google Cloud / Azure / OCI

## War Room Link / Public Incident Transfer

```text
LabでConceptを理解
  ↓
🚨 War Room Link
症状だけを確認
  ↓
Field Incident Gate / Package Capstone
Evidenceを自由に調査
  ↓
ResultでSource・考え方・復習Labを開示
  ↓
弱いLabへ戻る
  ↓
Financial War Roomで横断判断
```

### Source hierarchy

1. 公式postmortem・企業発表・規制当局資料をFactの軸にする。
2. Zenn / Qiita / Engineering Blog等は、概念・実装・復旧・設計判断の補助線として使う。
3. note / 新聞・技術メディア等は、社会影響や別視点を補う。
4. 一次情報と二次解説が食い違う場合は一次情報を優先する。
5. 原文を長く転載せず、学習用に匿名化・簡略化・再構成する。

## 共通の修了判断

### Financial Engineer

- Layerを分解し、Conceptと製品固有実装を混同しない
- Request / Process / Thread / Connection / Transaction / MessageをEvidenceで追う
- 異なるLayerのEvidenceを組み合わせる
- Data integrityを壊さず、Rollbackと技術検証を考える

### Financial Consultant

- 技術を顧客影響・重要業務・Riskへ翻訳する
- 「なぜその製品が必要か」を業務能力・運用責任・代替案で説明する
- Primary CauseとControl Gapを分ける
- Runtime / Framework / Driver / OS更改をSupport・License・Costへ接続する

### PM / PMO

- Impact / Severity / Deadlineを固定する
- Owner / Dependency / Approval / Rollbackを整理する
- Artifact、Runtime、Config、Data、外部接続のVersionを追う
- 技術Greenだけで閉じず、顧客・件数・金額・後続まで確認する

## 現在のComplete Packages

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

- Field Incident Gate — 10 Cases / TRI-ROLE 80
- Financial War Room — 12 Cases / TRI-ROLE 85

**Total: 9 Packages / 180 Labs + 10 Field Cases + 12 War Room Cases**

## 推奨Route

```text
Computer / OS Foundation
  ↓
Linux → SQL → Enterprise Application / Java
  ↓
COBOL → JCL / Batch
  ↓
Cloud Fundamentals → AWS / GCP / Azure
  ↓
Field Incident Gate → Financial War Room
```

## 完成後の品質管理

教材追加・大幅変更時は最低限以下を機械確認する。

- JavaScript Syntax
- PackageごとのLab件数とProgress Prefix
- Guide / Stack Map / Glossary / War Room LinkのWiring
- Need → Capability → Component Originが説明されている
- 初心者向け説明とExpert Lensが両立している
- EvidenceがLab固有で、複数Layerを含む
- Product間を完全互換として表現していない
- Java / JVM / JDK / Framework / JDBC / JMSの境界が維持されている
- Java War Roomの正しいGolden PathがEngineer / Consultant / PM各85点へ到達可能
- Field Gate / War RoomのNo-spoilerとEvidence Diversityが維持されている
- 総合TOP・各教材からLink切れがない

### GitHub Quality Flow

```text
Issue / Learning Problem
  ↓
Feature Branch
  ↓
Pull Request
  ↓
Repository Quality Gate
  ↓
Learning / Concept / UX / Code / Source Review
  ↓
Review Fixes + Re-review
  ↓
Merge to main
  ↓
GitHub Pages Deploy
```

> 本教材はLearning Simulator。製品資格、規制適合判定、本番Runbook、変更手順の代替ではない。
