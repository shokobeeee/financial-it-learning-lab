# JCL / Batch Operations — Complete Package

## Goal

夜間バッチを「プログラム実行」だけでなく、JOB/STEP、入力/出力、戻り値、依存関係、再実行、安全な復旧まで含む運用システムとして理解すること。

## 20 Labs

- 01–06: JOB, EXEC, DD, Dataset, SYSIN/SYSOUT, JES
- 07–13: DISP, RC, IF/COND, PROC, STEPLIB, GDG等
- 14–17: Utility/Sort, COBOL+Db2, Scheduler, Job dependency
- 18–20: JCL ERROR/ABEND, Restart Safety, Night Batch War Room

## Completion

- Lab01–20を修了
- JCL ERROR / RC / ABENDを分ける
- 先行処理のCATLG・DB COMMIT・外部送信等の副作用を確認してRestart判断する
- 進捗キー: `jcl_batch_labXX_complete`

## Field Questions

- どのSTEPまで成功し、どこで失敗したか
- JCL解析/割当か、program実行後か
- 先行STEPで何が確定済みか
- 再実行で二重処理になる範囲はどこか
- 後続JOBと業務締切まで何分あるか

Next: **Cloud Fundamentals**
