# References

Reviewed: 2026-08-26

この教材は特定Vendorの資格教材ではなく、金融ITの判断軸を学ぶSimulatorです。Service仕様・Support期間・Licenseは変更されるため、実案件では利用Versionの最新公式Documentationを確認してください。

## Japan / Financial Services

- 金融庁「オペレーショナル・レジリエンス確保に向けた基本的な考え方」
  - https://www.fsa.go.jp/news/r4/ginkou/20230427.html
- 金融庁「主要行等向けの総合的な監督指針」
  - https://www.fsa.go.jp/common/law/guide/city/03c2.html
- FISC「金融機関等コンピュータシステムの安全対策基準・解説書」
  - 第14版公表: https://www.fisc.or.jp/topics/007222.php

## Enterprise Java / Application

- Oracle Java SE Support Roadmap
  - https://www.oracle.com/java/technologies/java-se-support-roadmap.html
- Java Virtual Machine Specification, Java SE 25
  - https://docs.oracle.com/javase/specs/jvms/se25/html/
- Java Troubleshooting Guide / `jcmd` / JFR / Heap and Thread diagnostics
  - https://docs.oracle.com/en/java/javase/25/troubleshoot/
- Java Virtual Threads
  - https://docs.oracle.com/en/java/javase/21/core/virtual-threads.html
- JDBC Basics / DataSource
  - https://docs.oracle.com/javase/tutorial/jdbc/basics/
- Spring Boot Reference Documentation
  - https://docs.spring.io/spring-boot/reference/
- Spring Boot Actuator / Observability
  - https://docs.spring.io/spring-boot/reference/actuator/
- Spring Framework Transaction Management
  - https://docs.spring.io/spring-framework/reference/data-access/transaction.html
- Spring Security Reference
  - https://docs.spring.io/spring-security/reference/
- Jakarta Messaging Specification
  - https://jakarta.ee/specifications/messaging/
- IBM MQ Java / JMS Documentation
  - https://www.ibm.com/docs/en/ibm-mq/9.4.x?topic=mq-java

Java LTSという名称だけで保守判断を閉じず、JDK Vendor、Framework、Application Server、JDBC Driver、OS、Container Image、License、Support Matrixを組み合わせて確認します。

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

- IBM Enterprise COBOL for z/OS Documentation Library
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

- IBM MQ Introduction / Message Queuing
  - https://www.ibm.com/docs/en/ibm-mq/9.4.x?topic=mq-introduction
- HULFT File Transfer Documentation
  - https://www.hulft.com/help/en-us/HULFT-V8/COM-FUN/Content/HULFT_FUN/Outline/file_transfer.htm
- OCI Streaming Developer Guide
  - https://docs.oracle.com/en-us/iaas/Content/Streaming/Tasks/developing.htm

Queue Messaging、Event Streaming、Managed File Transfer、API Managementは同じ連携方式ではないため、Context UIでも別Patternとして扱います。

## Notes

- FISCの安全対策基準本文は有償刊行物を含みます。この教材は公開Pageで確認できる位置づけを参照し、基準本文を転載していません。
- Product Profileは「同じ目的を見る代表的な実装」を示すもので、製品間の完全互換や1:1対応を意味しません。
- Java Code例は概念を説明するための抜粋であり、そのまま本番へDeployする実装ではありません。
