# Field Incident Gate — Public Source Register

## Purpose

この一覧は、`field-casebook/` の10 Caseが参照した公開情報を記録する。Case本体は以下をそのまま再現せず、金融IT学習向けに匿名化・簡略化・再構成している。

## Source hierarchy

1. **Primary / Fact anchor** — 公式Post-Incident Report / 企業発表 / 規制当局資料
2. **Supplementary technical reference** — Zenn / Qiita / Microsoft Tech Community / AWS Builders’ Library / 企業Engineering Blog等
3. **Supplementary public-impact view** — note / 新聞・技術メディア等

一次情報と二次解説が食い違う場合は一次情報を優先する。Zenn等の記事は「事故の事実認定」ではなく、概念・実装・復旧・設計判断を理解する補助線として使う。

## Case sources

### Case 01 — Endpoint content update

**Primary / incident sources**

- CrowdStrike, “Preliminary Post Incident Review: Content Configuration Update Impacting the Falcon Sensor and Windows” (2024-07-24)
  - https://www.crowdstrike.com/en-us/blog/falcon-content-update-preliminary-post-incident-report/
- Qiita @jemm, “某セキュリティソフトによるWindowsブルスク問題の原因から学ぶカーネル” (2024-09-26)
  - https://qiita.com/jemm/items/23ebf3053a652b9f30e8

**Supplementary technical reading**

- Zenn / ツルオカ, “CrowdStrikeとサイバーセキュリティ” (2024-07-25)
  - https://zenn.dev/tsuruo/scraps/c1bfcf55e90c7d
- Microsoft Intune Customer Success, “New Recovery Tool to help with CrowdStrike issue impacting Windows endpoints” (2024-07-20)
  - https://techcommunity.microsoft.com/blog/intunecustomersuccess/new-recovery-tool-to-help-with-crowdstrike-issue-impacting-windows-endpoints/4196959

### Case 02 — Database partition and failover

**Primary / incident sources**

- GitHub, “October 21 post-incident analysis” (2018-10-30)
  - https://github.blog/news-insights/company-news/oct21-post-incident-analysis/

**Supplementary technical reading**

- Zenn / chooser, “GitHub Actionsのコストを見て、自宅にCI・セキュリティ基盤を建てた” (2026-08)
  - https://zenn.dev/chooser/articles/series-003-tooling
- Zenn / kackey, “Storage Replication” (2023)
  - https://zenn.dev/kackey/articles/storage-replication

### Case 03 — Database deletion and backup recovery

**Primary / incident sources**

- GitLab, “Postmortem of database outage of January 31” (2017)
  - https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/
- InfoQ Japan, GitLab outage postmortem coverage
  - https://www.infoq.com/jp/news/2017/03/gitlab-outage-postmortem/

**Supplementary technical reading**

- Zenn / chemy_pvl, “サーバ移設で「動いているように見える」バックアップ停止を検知する方法” (2026-07-29)
  - https://zenn.dev/chemy_pvl/articles/home-server-migration-backup-mount-failure
- Zenn / supino0017, “Azure SQL Databaseのリストア”
  - https://zenn.dev/supino0017/articles/905f23553fd0b5

### Case 04 — Backbone routing and DNS/control plane

**Primary / incident sources**

- Meta Engineering, “More details about the October 4 outage” (2021-10-05)
  - https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/

**Supplementary technical reading**

- Zenn / you2h, “BGPの経路が現れて・消えて・戻るのをwithdrawで観察する” (2026-07-05)
  - https://zenn.dev/you2h/articles/protocol-lab-bgp-02

### Case 05 — Latent edge bug activated by configuration

**Primary / incident sources**

- Fastly, “Summary of June 8 outage” (2021-06-08)
  - https://www.fastly.com/blog/summary-of-june-8-outage

**Supplementary technical reading**

- Zenn / kg_filled, “Cloudflare障害から学ぶフロントエンド耐障害設計4パターン” (2026-02-27)
  - https://zenn.dev/kg_filled/articles/925cb0467f0512
  - 別インシデントを題材に、Control Plane変更の広域波及・CDN依存・fallback設計を学ぶ補助記事。

### Case 06 — Internal congestion and retry amplification

**Primary / incident sources**

- AWS, “Summary of the AWS Service Event in the Northern Virginia (US-EAST-1) Region” (2021-12)
  - https://aws.amazon.com/message/12721/

**Supplementary technical reading**

- Zenn / まさきち, “リトライ処理時のExponential Backoff（指数関数バックオフ）戦略” (2025-04-28)
  - https://zenn.dev/arsaga/articles/5b15281c7fb9fa
- AWS Architecture Blog, “re:Invent 2019: Introducing the Amazon Builders’ Library (Part I)”
  - https://aws.amazon.com/blogs/architecture/reinvent-2019-introducing-the-amazon-builders-library-part-i/
  - Timeouts / retries / backoff with jitter / queue backlogの設計論を補う。

### Case 07 — Month-end batch and ATM customer impact

**Primary / incident sources**

- みずほフィナンシャルグループ, “システム障害特別調査委員会の調査報告書の受領について” (2021-06-15)
  - https://www.mizuho-fg.co.jp/release/20210615release_jp.html
- 金融庁, “みずほ銀行及びみずほフィナンシャルグループに対する行政処分について” (2021-11-26)
  - https://www.fsa.go.jp/news/r3/ginkou/20211126/20211126.html

**Supplementary public-impact reading**

- note / えがおIT研究所, “No227 みずほ銀行は何を間違っていたのか？” (2021-09-27)
  - https://note.com/egao_it/n/n5706bc7fc9bd

### Case 08 — Relay-system refresh and data-layout boundary

**Primary / incident sources**

- 全国銀行資金決済ネットワーク / NTTデータ, “全国銀行データ通信システムの障害について” (2023-12-01)
  - https://www.nttdata.com/global/ja/news/release/2023/120100/

**Supplementary technical / public-impact reading**

- note / えがおIT研究所, “全銀ネットで起きていたこと（No337）” (2023-12-11)
  - https://note.com/egao_it/n/n01f3cff5e7cf
- NTT DATA Tech / Zenn, “【COBOL現新移行検証⑤】ファイル定義 ─ FD句とI/O挙動の差異” (2026-05-07)
  - https://zenn.dev/nttdata_tech/articles/2520a84d392c8e
- NTT DATA Tech / Zenn, “【COBOL現新移行検証⑧】ソート順 ─ 照合順の違いが業務結果を変える” (2026-05-14)
  - https://zenn.dev/nttdata_tech/articles/14a0528ac5c085

### Case 09 — Telecom route switch and reconnect storm

**Primary / incident sources**

- KDDI, “2022年7月2日に発生した通信障害について” (2022-07-29)
  - https://news.kddi.com/kddi/corporate/newsrelease/2022/07/29/6183.html

### Case 10 — Payment-switch renewal workload and overload

**Primary / incident sources**

- 日本カードネットワーク, “CARDNETセンター障害に関するお知らせ” (2023-11)
  - https://www.cardnet.co.jp/release/20231111_1.html
- 朝日新聞社 ツギノジダイ, “CARDNETに障害　カード決済が一時使えず　原因にシステム更改準備” (2023-11-11)
  - https://smbiz.asahi.com/article/15054689

**Supplementary technical reading**

- Amazon Builders’ Library, “Making retries safe with idempotent APIs”
  - https://builder.aws.com/content/3Ev0BENTyBr0XxzRk5FDZzgNYos/making-retries-safe-with-idempotent-apis
- Zenn / yoshiyoshifujii, “SAGAパターンの補償アクション失敗にどう立ち向かうか？DLQとリトライ戦略”
  - https://zenn.dev/yoshiyoshifujii/articles/6028590863dbfb
