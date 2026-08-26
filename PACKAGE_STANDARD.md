# Financial IT Learning Lab — Complete Package Standard

## 完パケの定義

このrepoでは「20 Labsが存在する」だけでは教材完成としない。

1教材を **Complete Learning Package** と呼ぶ条件は以下。

1. **Start from Zero** — 初学者が「そもそも何をする技術か」から入れる。
2. **Need before Tool / Component Origin** — 製品名・install・provisionより先に、「もともと何があるか」「無いと何に困るか」「どんな能力が必要か」「その部品はどこから来るか」を説明する。目的（何のためにあるか）と困りごと（無いと何が起きるか）は別の文として書き分ける。
3. **20 Labs** — 基礎 → 実務 → 障害対応/Capstoneまで段階がある。
4. **Progressive Learning Modes** — 見る/作る → 選ぶ/判断する → 入力/Evidenceへ、理解段階に合わせて難度を上げる。**全Labで同じ3モードを強制しない。**
5. **State / Evidence at the Right Time** — 何が変わったか・何を証拠とするかを学ぶ。初学者の最初のLabへ高度なEvidence UIを先回りさせない。
6. **Layer Guide** — 同じ軸ではないものを分離し、いま何のレイヤーを見ているか説明できる。
7. **Concept → Product → Evidence** — 共通概念・製品実装・運用Evidenceを分ける。製品間対応は `=` ではなく `≒ conceptual mapping` とする。
8. **Product / Platform Profile** — 正本Labを複製せず、profile adapterで主要製品差分を重ねる。
9. **Scope Badge / Wrong Layer Coach** — 操作・SQL・JCL・Evidenceの所属レイヤーを表示し、目的レイヤーが違う場合は理由付きで指摘する。
10. **Evidence Diversity** — 同種ログの大量取得ではなく、異なるレイヤーの証拠を組み合わせる。
11. **Financial Context** — 件数・金額・残高・正本・締切・顧客影響と接続する。
12. **Field Questions** — 会議・障害対応で実際に確認すべき質問を持つ。
13. **Glossary / Cheat Sheet** — 用語を単語ではなく役割で説明する。
14. **Tri-role View** — Engineer / Consultant / PM・PMOの3視点で修了像を定義する。
15. **Final Capstone** — 正解当てではなく Evidence → Safe Action → Verification を行う。
16. **War Room Link / Public Incident Transfer** — 各Labから「この知識が効く事故」へ進み、公開事例ベースCaseで知識を転移し、結果から復習Labへ戻れる。
17. **Completion / Next Path** — 進捗、修了状態、次教材・関連教材が分かる。

## Need before Tool / Component Origin Model

SoftwareやCloud serviceを登場させる時は、製品名やCommandを先に出さない。

```text
もともと何がある？
  ↓
無いと何に困る？
  ↓
どんな能力が必要？
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

### Component Origin

同じ「使い始める」でも由来を混ぜない。

| Origin | 意味 | 例 |
|---|---|---|
| OS / Platformに含まれる | 土台として最初からある | Kernel、Process、TCP/IP stack |
| 既存機能を設定・有効化 | 新製品ではなく設定で使う | Network設定、Firewall rule、timer |
| Packageとして追加 | Repository等からSoftwareを導入 | nginx、Container Runtime |
| Compiler / Runtimeを追加 | Sourceを実行可能にする | GnuCOBOL、DB client/runtime |
| 操作する側へToolを追加 | Control node / 管理端末へ置く | Ansible、Cloud CLI、IaC Tool |
| Cloud上にResourceを作成 | Provider側へprovisionする | EC2、VPC、Managed DB |
| 別Platformで提供 | 対象Linuxへinstallしない | JES、CICS、Enterprise Scheduler |

### 必須の説明境界

- `Common Linux` = Kernel・Process・File・TCP/IP等の共通Concept
- `RHEL / Ubuntu LTS / SLES / Oracle Linux` = Distribution Profile
- `Web Server` = System上の役割
- `nginx` = Web Server役割を実現するApplicationの1つ
- Networkに接続できることと、HTTPへ応答できることは別
- Linux共通ConceptとPackage・Firewall・Security等のDistribution固有実装は別
- SQLは言語、DBMSはSQLを実行してDataを管理するSoftware
- COBOL SourceとCompiler / Runtimeは別
- JCLはJob定義、JESは実行基盤
- Cloud CLIをdownloadすることと、Cloud Resourceをprovisionすることは別

教材はBrowser内Simulatorであり、実機へSoftwareやCloud Resourceを自動導入しない。本番作業では対象環境・version・権限・承認・Runbookを確認する。

## Financial Linux Profile Model

金融ITのLinuxを一つのDistributionで代表させない。

```text
Common Linux
Kernel / Process / File / Permission / TCP-IP / Port / systemd / Log
  ↓
Distribution Profile
Package / Firewall / MAC Security / Kernel flavor / Support / Lifecycle / Certification
```

- **RHEL / Rocky / AlmaLinux** — Enterprise運用を考える教材標準Profile
- **Ubuntu LTS / Debian** — Cloud / Digital / OpenStack / Kubernetes Profile
- **SUSE Linux Enterprise Server** — SAP / IBM Z / Mixed Enterprise Profile
- **Oracle Linux** — Oracle Database / Exadata / OCI Profile

RHEL系を標準にするのは市場シェアの断定ではなく、Enterprise Support・長期運用・Vendor Certificationを意識する教材設計上の基準点である。

Rocky / AlmaLinuxはRHEL系操作の学習に使えるが、RHEL Subscription・Vendor Support・製品Certificationまで同一とは扱わない。Parrot OSはSecurity / Forensics学習環境として残し、金融業務Serverの標準Profileとは分ける。

詳細は [`docs/FINANCIAL_LINUX_PROFILES.md`](./docs/FINANCIAL_LINUX_PROFILES.md) を参照。

## Progressive Learning Modes

重要なのはUIの完全統一ではなく、認知負荷を学習者の理解段階へ合わせること。

```text
SQL / COBOL / JCL
見る（基本） → 選択 → 入力

Cloud Fundamentals
Lab01–07  見る → 困る → 部品を足す → 名前を知る
Lab08–15  状況を見る → 選ぶ → 理由を理解する
Lab16–20  Evidence → 判断 → Verify / Reconcile
```

「高度なUIがあるほど良い教材」とはしない。問題を解けるところまで教材が教えてから問う。

## v18 Context Model

Linuxで育てた「分類軸を混ぜない」設計思想を全教材の共通教育OSとして採用する。

```text
Need / Problem
  ↓
Capability
  ↓
Common Concept
  ↓
Distribution / Product / Platform Profile
  ↓
Component Origin
  ↓
Operational Evidence
  ↓
Safe Decision / Change
  ↓
Business Verification
```

例:

```text
Lock / Waiting                         ← Concept
├ Db2 MON_GET_LOCKS                    ← Product implementation / Evidence
├ Oracle V$LOCK + V$SESSION
├ PostgreSQL pg_locks + pg_stat_activity
└ SQL Server sys.dm_tran_locks
```

4製品を「同じ」とは扱わない。同じ目的を見る代表実装として対応付け、権限・仕様・粒度・運用方法の差を残す。

### Canonical Lab + Profile Adapter

- Canonical Lab = 共通概念・金融業務・判断ロジックの正本
- Profile Adapter = 製品名、代表構文、monitor/audit Evidence、境界の差分

現在のProfile対象:

- Linux: Common Linux + RHEL/Rocky/AlmaLinux（標準） / Ubuntu LTS/Debian / SLES / Oracle Linux
- SQL: IBM Db2 / Oracle Database / PostgreSQL / Microsoft SQL Server
- COBOL: IBM Enterprise COBOL / GnuCOBOL / Oracle Pro*COBOL context
- JCL周辺: Generic Scheduler / BMC Control-M / JP1/AJS3 / IBM Z Workload Scheduler
- Cloud translation: Common / AWS / Google Cloud / Azure / OCI

OCIは現時点ではCloud Fundamentals / War Roomのtranslation profile。OCI固有の設計・運用を20段階で深掘りする必要が生じた場合だけ独立Packageへ昇格する。

## War Room Link / Public Incident Transfer

教材内の知識を、次の転移ループで実戦へつなぐ。

```text
LabでConceptを理解
  ↓
🚨 War Room Link
「この知識が効く事故」を症状だけで確認
  ↓
Field Incident Gate
公開報告ベースCaseを自由捜査
  ↓
ResultでSource・考え方・復習Labを開示
  ↓
弱いLabへ戻る
  ↓
Financial War Roomで金融横断判断
```

### Source hierarchy

1. 公式postmortem・企業発表・規制当局資料をFactの軸にする。
2. Zenn / Qiita / 企業Engineering Blog等は、概念・実装・復旧・設計判断の補助線として使う。
3. note / 新聞・技術メディア等は、社会影響や別視点を補う。
4. 一次情報と二次解説が食い違う場合は一次情報を優先する。
5. 原文を長く転載せず、学習用に匿名化・簡略化・再構成する。
6. 実事故名・Source・推奨復習LabはResultまで隠し、推理をspoilerしない。
7. Caseは本番Runbook、法令判断、完全な事故再現ではない。

### 難度とSign-off

- **Field Incident Gate** — 10 Public-Report Reconstructions。Engineer / Consultant / PMが各80点以上。
- **Financial War Room** — 12 Financial Incidents。Engineer / Consultant / PMが各85点以上。

Field Gateは「外部の事故報告を読める自信」を作る移行関門、Financial War Roomは金融業務・正本・決済・Batch・Hybridを横断する最終関門とする。

## 共通の修了判断

### Financial Engineer

- レイヤーを分解し、Conceptと製品固有実装を混同しない
- Common LinuxとDistribution固有のPackage・Firewall・Security実装を分ける
- その部品がOS標準・Package・Runtime・Cloud Resource・外部Platformのどれか説明する
- 仮説を置き、価値の高いEvidenceで残す/消す
- 異なるレイヤーのEvidenceを組み合わせる
- Data integrityを壊さず、rollbackと技術検証を考える

### Financial Consultant

- 技術を顧客影響・重要業務・riskへ翻訳する
- 「なぜその製品が必要か」を業務能力・運用責任・代替案で説明する
- Distribution選定をSupport・Lifecycle・Certification・Workload要件へ翻訳する
- 正本・統制・third party・RTO/RPOを会話に入れる
- Primary causeとcontrol gapを分ける
- 公開事例の事実・解説・推論を区別する

### PM / PMO

- Impact / severity / deadlineを固定する
- 新規導入・設定変更・Cloud provision・外部Platform連携を同じ作業として扱わない
- Distribution / Version / Support契約 / EOL / Support Matrixを確認する
- Owner / dependency / approval / rollbackを整理する
- 復旧を技術Greenだけで閉じず、顧客・件数・金額・後続まで追う
- 未確定事項と次回更新時刻を含めて共有する

## 現在のComplete Packages

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

- Field Incident Gate — 10 Cases / TRI-ROLE 80
- Financial War Room — 12 Cases / TRI-ROLE 85

## 推奨ルート

```text
Linux → SQL / Database → COBOL → JCL / Batch
      → Cloud Fundamentals → AWS / Google Cloud / Azure
      → Field Incident Gate
      → Financial War Room
```

3クラウドは順不同。重要なのはCloud Fundamentalsの共通概念へ戻して比較できること。

## 完成後の品質管理

教材追加・大幅変更時は最低限以下を機械確認する。

- JavaScript syntax
- 20 Labs / 10 Field Cases / 12 War Room Casesの件数
- progress prefix / result key
- Guide / Context / Layer Guide / War Room Linkのwiring
- Software / Service登場前にNeed → Capability → Component Originが説明されている
- OS標準 / 設定 / Package / Runtime / Cloud provision / 外部Platformを混同していない
- Common LinuxとDistribution固有実装を混同していない
- RHEL標準Profileを市場シェアの断定として表現していない
- Ubuntu LTS / SLES / Oracle Linuxの比較Profileが維持されている
- RHEL互換操作とRHELのSupport / Subscription / Certificationを同一視していない
- 製品対応を完全互換として表現していない
- 初心者PreviewがSource・Root cause・推奨Labをspoilerしない
- 各公開事例Caseに公式/規制当局Sourceがある
- 全体Source mixにZenn / Qiita / note / 新聞・技術メディアがある
- Evidence Diversity GateがCause確定前に機能する
- Safe Recovery / Reconciliation / Communicationが存在する
- 検証済みgolden pathでField Gate 80×3、War Room 85×3へ到達可能
- 総合TOP・各教材からリンク切れがない

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

- mainへの直接実装を原則避ける
- 不具合を修正したら同じ不具合を防ぐQA guardを追加する
- 一時QA workflowはmerge前に削除する
- SourceのFactと教材側の推論を明確に分ける

詳細は [docs/DEVELOPMENT_WORKFLOW.md](./docs/DEVELOPMENT_WORKFLOW.md) を参照。

> 本教材は学習用シミュレーター。製品資格、規制適合判定、本番Runbook、変更手順の代替ではない。
