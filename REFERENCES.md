# References

Reviewed: 2026-08-17

この教材は特定ベンダーの資格教材ではなく、金融ITの判断軸を学ぶシミュレーターです。サービス仕様は変更されるため、実案件では最新の公式ドキュメントを確認してください。

## Japan / Financial Services

- 金融庁「オペレーショナル・レジリエンス確保に向けた基本的な考え方」
  - https://www.fsa.go.jp/news/r4/ginkou/20230427.html
- 金融庁「主要行等向けの総合的な監督指針」
  - https://www.fsa.go.jp/common/law/guide/city/03c2.html
- FISC「金融機関等コンピュータシステムの安全対策基準・解説書」
  - 第14版公表: https://www.fisc.or.jp/topics/007222.php

## AWS

- AWS Well-Architected Framework
  - https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html
- AWS Direct Connect
  - https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html
- Amazon CloudWatch supported data sources
  - https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/data-sources.html

## Google Cloud

- Google Cloud Well-Architected Framework — Financial services perspective
  - https://docs.cloud.google.com/architecture/framework/perspectives/fsi
- Google Cloud VPC
  - https://docs.cloud.google.com/vpc/docs/overview

## Microsoft Azure

- Azure Well-Architected Framework
  - https://learn.microsoft.com/azure/well-architected/
- Azure networking overview
  - https://learn.microsoft.com/azure/networking/networking-overview

## Oracle Cloud Infrastructure / Oracle Database

- OCI documentation
  - https://docs.oracle.com/en-us/iaas/Content/
- OCI core-service security / VCN / FastConnect context
  - https://docs.oracle.com/en-us/iaas/Content/Security/Concepts/security_core_services.htm
- OCI Database service
  - https://docs.oracle.com/en-us/iaas/Content/Database/home.htm
- OCI Audit
  - https://docs.oracle.com/en-us/iaas/Content/Audit/home.htm
- Oracle Database Dynamic Performance Views
  - https://docs.oracle.com/en/database/oracle/oracle-database/26/refrn/dynamic-performance-views.html
- Oracle Pro*COBOL Precompiler Programmer's Guide
  - https://docs.oracle.com/en/database/oracle/oracle-database/26/lnpcb/toc.htm

## Database Product Context

- IBM Db2 MON_GET_LOCKS
  - https://www.ibm.com/docs/en/db2/12.1.x?topic=mmr-mon-get-locks-table-function-list-all-locks-in-currently-connected-database
- PostgreSQL pg_locks
  - https://www.postgresql.org/docs/current/view-pg-locks.html
- Microsoft SQL Server sys.dm_tran_locks
  - https://learn.microsoft.com/en-us/sql/relational-databases/system-dynamic-management-objects/sys-dm-tran-locks-transact-sql

## COBOL

- IBM Enterprise COBOL for z/OS documentation library
  - https://www.ibm.com/support/pages/enterprise-cobol-zos-documentation-library
- GnuCOBOL Manual
  - https://gnucobol.sourceforge.io/doc/gnucobol.html

## Enterprise Scheduler Context

- BMC Control-M Documentation
  - https://documents.bmc.com/supportu/controlm-saas/en-US/Documentation/home.htm
- JP1/Automatic Job Management System 3
  - https://www.hitachi.co.jp/Prod/comp/soft1/jp1/product/jp1/ajs/index.html
- IBM Z Workload Scheduler
  - https://www.ibm.com/docs/en/workload-automation/10.2.6?topic=z-workload-scheduler

## Enterprise Integration / Middleware Context

- IBM MQ introduction / message queuing
  - https://www.ibm.com/docs/en/ibm-mq/9.4.x?topic=mq-introduction
- HULFT file transfer documentation
  - https://www.hulft.com/help/en-us/HULFT-V8/COM-FUN/Content/HULFT_FUN/Outline/file_transfer.htm
- OCI Streaming developer guide
  - https://docs.oracle.com/en-us/iaas/Content/Streaming/Tasks/developing.htm

Queue messaging、event streaming、managed file transfer、API managementは同じ連携方式ではないため、Context UIでも別patternとして扱います。

## Notes

- FISCの安全対策基準本文は有償刊行物を含みます。この教材は公開ページで確認できる位置づけを参照し、基準本文を転載していません。
- Product Profileは「同じ目的を見る代表的な実装」を示すもので、製品間の完全互換や1:1対応を意味しません。
- 各クラウドのCLI/API構文暗記を目的にせず、責任境界・障害ドメイン・データ整合性・運用・復旧の判断軸を中心にしています。
