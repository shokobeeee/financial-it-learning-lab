(function(){
'use strict';
const SUPPLEMENTS={
  1:[
    {kind:'Zenn / Supplementary',publisher:'Zenn / ツルオカ',title:'CrowdStrikeとサイバーセキュリティ',date:'2024-07-25',url:'https://zenn.dev/tsuruo/scraps/c1bfcf55e90c7d',why:'CrowdStrike障害の技術背景と社会影響を日本語で俯瞰する補助線。'},
    {kind:'Technical / Recovery',publisher:'Microsoft Intune Customer Success',title:'New Recovery Tool to help with CrowdStrike issue impacting Windows endpoints',date:'2024-07-20',url:'https://techcommunity.microsoft.com/blog/intunecustomersuccess/new-recovery-tool-to-help-with-crowdstrike-issue-impacting-windows-endpoints/4196959',why:'更新をrevertしただけでは戻らない端末を、WinPE / Safe Mode / PXE等でどう復旧したかを見る。'}
  ],
  2:[
    {kind:'Zenn / Supplementary',publisher:'Zenn / chooser',title:'GitHub Actionsのコストを見て、自宅にCI・セキュリティ基盤を建てた',date:'2026-08-21',url:'https://zenn.dev/chooser/articles/series-003-tooling',why:'実機のsplit-brainとfencingを題材に、failoverと「旧主系を締め出す」ことの違いを掴む。'},
    {kind:'Zenn / Concept',publisher:'Zenn / kackey',title:'Storage Replication',date:'2023-11-23',url:'https://zenn.dev/kackey/articles/storage-replication',why:'非同期replication・Leader failover・split-brain・未反映writeの基本概念を整理する。'}
  ],
  3:[
    {kind:'Zenn / Supplementary',publisher:'Zenn / chemy_pvl',title:'サーバ移設で「動いているように見える」バックアップ停止を検知する方法',date:'2026-07-29',url:'https://zenn.dev/chemy_pvl/articles/home-server-migration-backup-mount-failure',why:'サービスが動いていることとBackupが取れていることは別、という運用Evidenceの感覚を補う。'},
    {kind:'Zenn / Hands-on',publisher:'Zenn / supino0017',title:'Azure SQL Databaseのリストア',date:'2024-12-08',url:'https://zenn.dev/supino0017/articles/905f23553fd0b5',why:'Point-in-Time Restoreを具体操作で確認し、Backup保有とrestore可能性を分けて理解する。'}
  ],
  4:[
    {kind:'Zenn / Hands-on',publisher:'Zenn / you2h',title:'BGPの経路が現れて・消えて・戻るのをwithdrawで観察する',date:'2026-07-05',url:'https://zenn.dev/you2h/articles/protocol-lab-bgp-02',why:'BGP sessionが生きたままrouteだけwithdrawされる挙動を実験で確認できる。'}
  ],
  5:[
    {kind:'Zenn / Architecture',publisher:'Zenn / kg_filled',title:'Cloudflare障害から学ぶフロントエンド耐障害設計4パターン',date:'2026-02-27',url:'https://zenn.dev/kg_filled/articles/925cb0467f0512',why:'別事故の解説だが、Control Plane変更が広域Edgeへ波及するblast radiusとfallback設計を考える補助教材。'}
  ],
  6:[
    {kind:'Zenn / Concept',publisher:'Zenn / まさきち',title:'リトライ処理時のExponential Backoff（指数関数バックオフ）戦略',date:'2025-04-28',url:'https://zenn.dev/arsaga/articles/5b15281c7fb9fa',why:'Exponential BackoffとJitterが、同時retryによる負荷集中をどう緩和するかを日本語で整理する。'},
    {kind:'Technical / Architecture',publisher:'AWS Architecture Blog',title:'re:Invent 2019: Introducing the Amazon Builders’ Library (Part I)',date:'2019-12-05',url:'https://aws.amazon.com/blogs/architecture/reinvent-2019-introducing-the-amazon-builders-library-part-i/',why:'Timeout / retry / backoff / queue backlogが小さな障害を全体障害へ増幅する設計論を補う。'}
  ],
  8:[
    {kind:'Zenn / Engineering',publisher:'NTT DATA Tech / Zenn',title:'【COBOL現新移行検証⑤】ファイル定義 ─ FD句とI/O挙動の差異',date:'2026-05-07',url:'https://zenn.dev/nttdata_tech/articles/2520a84d392c8e',why:'COBOL移行でrecord length・固定長/可変長・I/O差異を実データ比較する観点を学べる。'},
    {kind:'Zenn / Engineering',publisher:'NTT DATA Tech / Zenn',title:'【COBOL現新移行検証⑧】ソート順 ─ 照合順の違いが業務結果を変える',date:'2026-05-14',url:'https://zenn.dev/nttdata_tech/articles/14a0528ac5c085',why:'「処理系差分が業務結果へ波及する」ことを、移行テストの観点から理解する。'}
  ],
  10:[
    {kind:'Technical / Distributed Systems',publisher:'Amazon Builders’ Library',title:'Making retries safe with idempotent APIs',date:'2021-01-15',url:'https://builder.aws.com/content/3Ev0BENTyBr0XxzRk5FDZzgNYos/making-retries-safe-with-idempotent-apis',why:'timeout後の再送で副作用を重複させないためのidempotency設計を、実システム設計の観点で補う。'},
    {kind:'Zenn / Concept',publisher:'Zenn / yoshiyoshifujii',title:'SAGAパターンの補償アクション失敗にどう立ち向かうか？DLQとリトライ戦略',date:'2025-04-22',url:'https://zenn.dev/yoshiyoshifujii/articles/6028590863dbfb',why:'DLQ・補償処理・retryを通じて、分散取引で「再送すれば良い」では済まない理由を補う。'}
  ]
};
if(!window.FIELD_CASES)return;
window.FIELD_CASES.forEach(c=>{const extra=SUPPLEMENTS[c.id]||[];if(extra.length)c.sources=[...(c.sources||[]),...extra]});
window.FIELD_CASE_SOURCE_SUPPLEMENTS=SUPPLEMENTS;
})();
