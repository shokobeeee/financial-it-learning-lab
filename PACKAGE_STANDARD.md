# Financial IT Learning Lab — Complete Package Standard

## 完パケの定義

このrepoでは「20 Labsが存在する」だけでは教材完成としない。

1教材を **Complete Learning Package** と呼ぶ条件は以下。

1. **Start from Zero** — 初学者が「そもそも何をする技術か」から入れる。
2. **20 Labs** — 基礎 → 実務 → 障害対応/Capstoneまで段階がある。
3. **3 Learning Modes** — 基本 / 選択 / 入力で、見る→判断→自分で書くへ進む。
4. **State / Evidence** — 何が変わったか、何を証拠とするかが見える。
5. **Financial Context** — 件数・金額・残高・正本・締切・顧客影響と接続する。
6. **Field Questions** — 会議・障害対応で実際に確認すべき質問を持つ。
7. **Glossary / Cheat Sheet** — 用語を単語ではなく役割で説明する。
8. **Tri-role View** — Engineer / Consultant / PM・PMOの3視点で修了像を定義する。
9. **Final Capstone** — 正解当てではなく Evidence → Safe Action → Verification を行う。
10. **Completion / Next Path** — 進捗、修了状態、次教材・関連教材が分かる。

## 共通の修了判断

### Financial Engineer

- レイヤを分解できる
- 証拠を選べる
- 変更前後の差分を説明できる
- data integrityを壊さない
- rollback / verificationを考えられる

### Financial Consultant

- 技術を顧客影響・重要業務・riskへ翻訳できる
- 正本・統制・third party・RTO/RPOを会話に入れられる
- Primary causeとcontrol gapを分けられる

### PM / PMO

- impact / severity / deadlineを固定できる
- owner / dependency / approvalを整理できる
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

3クラウドは順不同でもよい。重要なのは Cloud Fundamentals の共通概念へ戻して比較できること。

## 完成後の品質管理

教材追加・大幅変更時は最低限以下を機械確認する。

- JavaScript syntax
- 20 Labs / 12 Cases の件数
- progress prefix
- module indexからComplete Package Guideを開ける
- Final Capstoneが存在する
- 総合TOPからリンク切れがない
- Financial War Roomのsafe recovery / reconciliation / tri-role sign-offが到達可能

> 本教材は学習用シミュレーター。製品資格、規制適合判定、本番Runbook、変更手順の代替ではない。
