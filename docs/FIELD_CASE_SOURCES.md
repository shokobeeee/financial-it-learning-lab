# Field Incident Gate — Public Source Register

## Purpose

この一覧は、`field-casebook/` の10 Caseが参照した公開情報を記録する。Case本体は以下をそのまま再現せず、金融IT学習向けに匿名化・簡略化・再構成している。

## Source hierarchy

1. 公式Post-Incident Report / 企業発表 / 規制当局資料
2. 技術メディア・新聞記事
3. Qiita / note等の解説記事

一次情報と二次解説が食い違う場合は一次情報を優先する。

## Case sources

### Case 01 — Endpoint content update

- CrowdStrike, “Preliminary Post Incident Review: Content Configuration Update Impacting the Falcon Sensor and Windows” (2024-07-24)
  - https://www.crowdstrike.com/en-us/blog/falcon-content-update-preliminary-post-incident-report/
- Qiita @jemm, “某セキュリティソフトによるWindowsブルスク問題の原因から学ぶカーネル” (2024-09-26)
  - https://qiita.com/jemm/items/23ebf3053a652b9f30e8

### Case 02 — Database partition and failover

- GitHub, “October 21 post-incident analysis” (2018-10-30)
  - https://github.blog/news-insights/company-news/oct21-post-incident-analysis/

### Case 03 — Database deletion and backup recovery

- GitLab, “Postmortem of database outage of January 31” (2017)
  - https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/
- InfoQ Japan, GitLab outage postmortem coverage
  - https://www.infoq.com/jp/news/2017/03/gitlab-outage-postmortem/

### Case 04 — Backbone routing and DNS/control plane

- Meta Engineering, “More details about the October 4 outage” (2021-10-05)
  - https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/

### Case 05 — Latent edge bug activated by configuration

- Fastly, “Summary of June 8 outage” (2021-06-08)
  - https://www.fastly.com/blog/summary-of-june-8-outage

### Case 06 — Internal congestion and retry amplification

- AWS, “Summary of the AWS Service Event in the Northern Virginia (US-EAST-1) Region” (2021-12)
  - https://aws.amazon.com/message/12721/

### Case 07 — Month-end batch and ATM customer impact

- みずほフィナンシャルグループ, “システム障害特別調査委員会の調査報告書の受領について” (2021-06-15)
  - https://www.mizuho-fg.co.jp/release/20210615release_jp.html
- 金融庁, “みずほ銀行及びみずほフィナンシャルグループに対する行政処分について” (2021-11-26)
  - https://www.fsa.go.jp/news/r3/ginkou/20211126/20211126.html
- note / えがおIT研究所, “No227 みずほ銀行は何を間違っていたのか？” (2021-09-27)
  - https://note.com/egao_it/n/n5706bc7fc9bd

### Case 08 — Relay-system refresh and data-layout boundary

- 全国銀行資金決済ネットワーク / NTTデータ, “全国銀行データ通信システムの障害について” (2023-12-01)
  - https://www.nttdata.com/global/ja/news/release/2023/120100/
- note / えがおIT研究所, “全銀ネットで起きていたこと（No337）” (2023-12-11)
  - https://note.com/egao_it/n/n01f3cff5e7cf

### Case 09 — Telecom route switch and reconnect storm

- KDDI, “2022年7月2日に発生した通信障害について” (2022-07-29)
  - https://news.kddi.com/kddi/corporate/newsrelease/2022/07/29/6183.html

### Case 10 — Payment-switch renewal workload and overload

- 日本カードネットワーク, “CARDNETセンター障害に関するお知らせ” (2023-11)
  - https://www.cardnet.co.jp/release/20231111_1.html
- 朝日新聞社 ツギノジダイ, “CARDNETに障害　カード決済が一時使えず　原因にシステム更改準備” (2023-11-11)
  - https://smbiz.asahi.com/article/15054689
