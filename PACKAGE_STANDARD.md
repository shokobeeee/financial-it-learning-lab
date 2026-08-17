# Financial IT Learning Lab — Complete Package Standard

## 完パケの定義

このrepoでは「20 Labsが存在する」だけでは教材完成としない。

1教材を **Complete Learning Package** と呼ぶ条件は以下。

1. **Start from Zero** — 初学者が「そもそも何をする技術か」から入れる。
2. **20 Labs** — 基礎 → 実務 → 障害対応/Capstoneまで段階がある。
3. **3 Learning Modes** — 基本 / 選択 / 入力で、見る→判断→自分で書くへ進む。
4. **State / Evidence** — 何が変わったか、何を証拠とするかが見える。
5. **Layer Guide** — 「同じ軸ではないもの」を分離し、今どのレイヤーを見ているか説明できる。
6. **Concept → Product → Evidence** — 共通概念・製品実装・運用Evidenceを分ける。製品間対応は `=` ではなく `≒ conceptual mapping` とする。
7. **Product / Platform Profile** — 必要な領域では、正本Labを複製せずprofile adapterで主要製品差分を学べる。
8. **Scope Badge / Wrong Layer Coach** — 操作・SQL・JCL・Evidenceの所属レイヤーを表示し、目的レイヤーが違う場合は理由付きで指摘する。
9. **Evidence Diversity** — 障害演習では同種ログの大量取得ではなく、異なるレイヤーの証拠を集める。
10. **Financial Context** — 件数・金額・残高・正本・締切・顧客影響と接続する。
11. **Field Questions** — 会議・障害対応で実際に確認すべき質問を持つ。
12. **Glossary / Cheat Sheet** — 用語を単語ではなく役割で説明する。
13. **Tri-role View** — Engineer / Consultant / PM・PMOの3視点で修了像を定義する。
14. **Final Capstone** — 正解当てではなく Evidence → Safe Action → Verification を行う。
15. **Completion / Next Path** — 進捗、修了状態、次教材・関連教材が分かる。

## v16 Context Model

Linux v16の設計思想を全教材の共通教育OSとして採用する。

```text
Concept
  ↓
Product / Platform Implementation
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

ここで4製品を「同じ」とは扱わない。  
**同じ目的を見る代表的な実装**として対応付け、権限・仕様・粒度・運用方法の差を残す。

### Canonical Lab + Profile Adapter

製品ごとに20 Labsをコピーしない。

- Canonical Lab = 共通概念・金融業務・判断ロジックの正本
- Profile Adapter = 製品名、代表構文、monitor/audit evidence、境界の差分

これによりOracle、PostgreSQL、SQL Server、OCI等を追加しても教材の正本が分裂しない。

### 現在のProfile対象

- Linux: Debian/Ubuntu / RHEL-Rocky-Alma + systemd / tool scope
- SQL: IBM Db2 / Oracle Database / PostgreSQL / Microsoft SQL Server
- COBOL: IBM Enterprise COBOL / GnuCOBOL / Oracle Pro*COBOL context
- JCL周辺: Generic Scheduler / BMC Control-M / JP1/AJS3 / IBM Z Workload Scheduler
- Cloud translation: Common / AWS / Google Cloud / Azure / OCI

OCIは現時点ではCloud Fundamentals / Financial War Roomのtranslation profile。独立20-Lab化は、OCI固有の設計・運用を深掘りする必要が生じた時点で判断する。

## 共通の修了判断

### Financial Engineer

- レイヤを分解できる
- Conceptと製品固有実装を混同しない
- 証拠を選べる
- 異なるレイヤーのEvidenceを組み合わせられる
- 変更前後の差分を説明できる
- data integrityを壊さない
- rollback / verificationを考えられる

### Financial Consultant

- 技術を顧客影響・重要業務・riskへ翻訳できる
- 製品名より先に共通判断軸で比較できる
- 正本・統制・third party・RTO/RPOを会話に入れられる
- Primary causeとcontrol gapを分けられる

### PM / PMO

- impact / severity / deadlineを固定できる
- owner / dependency / approvalを整理できる
- product/team間の責任境界を整理できる
- safe change / rollback / checkpointを管理できる
- 復旧を「技術正常」だけで閉じず業務完了まで追える

## 現在のComplete Packages

### Core

- Linux / Infrastructure — 20 Labs
- SQL / Database — 20 Labs
- COBOL / Business Systems — 20 Labs
- JCL / Batch Operations — 20 Labs

### Cloud

- Cloud Fundamentals — 20 Labs
- AWS for Financial IT — 20 Labs
- Google Cloud for Financial IT — 20 Labs
- Azure for Financial IT — 20 Labs

### Final

- Financial War Room — 12 Cases / TRI-ROLE SIGN-OFF

## 推奨ルート

```text
Linux
  ↓
SQL / Database
  ↓
COBOL
  ↓
JCL / Batch
  ↓
Cloud Fundamentals
  ↓
AWS → Google Cloud → Azure
  ↓
Financial War Room
```

3クラウドは順不同でもよい。重要なのは Cloud Fundamentals の共通概念へ戻して比較できること。Oracle DatabaseやOCI等はContext Profileで差分を重ね、必要なものだけ独立Packageへ昇格する。

## 完成後の品質管理

教材追加・大幅変更時は最低限以下を機械確認する。

- JavaScript syntax
- 20 Labs / 12 Cases の件数
- progress prefix
- module indexからComplete Package Guideを開ける
- Context / Layer Guideが対象教材で開ける
- Profile adapterの主要IDと代表Evidenceが存在する
- 製品対応を完全互換として表現していない
- Wrong Layer Coachが学習操作を破壊しない
- Evidence Diversity GateがCause確定前に機能する
- Final Capstoneが存在する
- 総合TOPからリンク切れがない
- Financial War Roomのsafe recovery / reconciliation / tri-role sign-offが到達可能

> 本教材は学習用シミュレーター。製品資格、規制適合判定、本番Runbook、変更手順の代替ではない。
