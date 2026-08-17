# SQL / Database — Complete Package

## Goal

SQL文法を覚えることではなく、金融データについて「どれが正本か」「更新は確定済みか」「同時更新で壊れていないか」「件数・金額が一致するか」を説明できること。

## Layer Model

```text
SQL Language
  ↓
DBMS / Product
  ↓
Schema / Table / Index
  ↓
Transaction / Lock / Isolation
  ↓
Application / COBOL / Batch
```

SQL・Database・DBMS・Applicationを同じものとして扱わない。

## Product Profiles

Canonical LabはDb2寄りの金融文脈を維持しつつ、**🧭 Context**で代表的な製品差分を確認できる。

- IBM Db2 — default profile
- Oracle Database
- PostgreSQL
- Microsoft SQL Server

例: Lock確認という共通目的に対して、Db2 `MON_GET_LOCKS`、Oracle `V$LOCK + V$SESSION`、PostgreSQL `pg_locks + pg_stat_activity`、SQL Server `sys.dm_tran_locks`のように代表Evidenceを `≒` で対応付ける。完全互換という意味ではない。

## 20 Labs

- 01–08: Table, SELECT, WHERE, Aggregate, GROUP BY, JOIN, NULL
- 09–15: INSERT, UPDATE/DELETE, Constraint, Transaction, Lock, Isolation, Index/EXPLAIN
- 16–19: Reconciliation, COBOL+Db2, Security/Audit, Lock/Deadlock Incident
- 20: Balance War Room

## Completion

- Lab01–20を修了
- COMMIT / ROLLBACK / Lock / Isolationを更新整合性と結び付ける
- Conceptと製品固有monitor/catalog/planを分けて説明する
- Lab20で正本・取引・監査・同時更新を確認して残高不一致を説明
- 進捗キー: `sql_db_labXX_complete`

## Field Questions

- 正本はどこか
- COMMIT済みか
- Lock/Isolationはどうなっているか
- 更新前後の件数・金額は一致するか
- 遅いSQLの実行計画・Indexはどうか
- いま使っているDBMSでは、そのEvidenceをどのcatalog/monitor/viewから取るか

Next: **COBOL / Business Systems**
