# JCL / Batch Operations — Complete Package

## Goal

夜間バッチを「プログラム実行」だけでなく、JOB/STEP、入力/出力、戻り値、依存関係、再実行、安全な復旧まで含む運用システムとして理解すること。

## Layer Model

```text
Enterprise Scheduler
  ↓
JES
  ↓
JCL (JOB / EXEC / DD)
  ↓
Program / Utility
  ↓
Dataset / Database / Downstream
```

Scheduler・JES・JCL・実行Programを同じものとして扱わない。

## Scheduler Context Profiles

**🧭 Context**でジョブネット全体を管理する代表製品文脈を確認できる。

- Generic Enterprise Scheduler
- BMC Control-M
- JP1/Automatic Job Management System 3
- IBM Z Workload Scheduler

Canonical LabのJOB / EXEC / DDは維持し、profileは「営業日・依存・release・rerun orchestration」というScheduler層の差分だけを重ねる。

## 20 Labs

- 01–06: JOB, EXEC, DD, Dataset, SYSIN/SYSOUT, JES
- 07–13: DISP, RC, IF/COND, PROC, STEPLIB, GDG等
- 14–17: Utility/Sort, COBOL+Db2, Scheduler, Job dependency
- 18–20: JCL ERROR/ABEND, Restart Safety, Night Batch War Room

## Completion

- Lab01–20を修了
- JCL ERROR / RC / ABENDを分ける
- Scheduler / JES / JCL / Program / Datasetを別レイヤーとして説明する
- 先行処理のCATLG・DB COMMIT・外部送信等の副作用を確認してRestart判断する
- RC=0だけで業務完了としない
- 進捗キー: `jcl_batch_labXX_complete`

## Field Questions

- どのSTEPまで成功し、どこで失敗したか
- JCL解析/割当か、program実行後か
- Scheduler上の前提・依存・営業日・締切は何か
- 先行STEPで何が確定済みか
- 再実行で二重処理になる範囲はどこか
- 後続JOBと業務締切まで何分あるか

Next: **Cloud Fundamentals**
