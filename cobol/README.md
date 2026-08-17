# COBOL / Business Systems — Complete Package

## Goal

COBOLを古い文法としてではなく、業務データを `READ → 判定/計算 → WRITE` する金融・基幹処理として読み、JCL / Database / CICS等との境界も説明できること。

## Layer Model

```text
COBOL Language
  ↓
Compiler / Runtime
  ↓
Host Platform
  ↓
Database / TP / File Integration
  ↓
JCL / Batch / Scheduler
```

**COBOL = mainframe** と固定しない。言語、実装、ホスト、外部サービスを別レイヤーにする。

## Platform Profiles

**🧭 Context**で代表的な実行文脈を重ねる。

- IBM Enterprise COBOL / z/OS — canonical financial-mainframe context
- GnuCOBOL / Open Systems
- Oracle Pro*COBOL + Oracle Database context

Scope Badgeでは、COBOL標準文、Embedded SQL、CICS、JCL、Runtime Evidenceを別色で表示する。

## 20 Labs

- 01–05: 構造・データ定義・PIC・MOVE
- 06–10: IF/EVALUATE, PERFORM, 集計・繰返し
- 11–15: File, FILE STATUS, SORT, COPY/CALL等
- 16–20: 振込処理, JCL境界, Db2/CICS, S0C7, Bank Night Batch War Room

## Completion

- Lab01–20を修了
- COBOL / Compiler / Host OS / JCL / Database / CICSを混同しない
- `EXEC SQL`や`EXEC CICS`を「COBOL文法だけの世界」と扱わず外部基盤との境界として説明する
- S0C7等で入力データ・I/O・外部基盤の証拠を分離
- 進捗キー: `cobol_labXX_complete`

## Field Questions

- 入力レコードのlayout/PICはどう定義されているか
- 業務ルールと例外条件はどこか
- FILE STATUS / RETURN-CODE / SQLCODEのどれが証拠か
- JCL / Database / CICSとの責務境界はどこか
- Compiler / Runtime / Host環境は何か
- 処理前後の件数・金額・control totalは一致するか

Next: **JCL / Batch Operations**
