# Financial IT Learning Lab

金融ITを「読む」のではなく、**触って理解する**ためのインタラクティブ学習ラボです。

## Modules

- 🐧 **Linux / Infrastructure** — 20 Labs
- 🟩 **COBOL / Business Systems** — 20 Labs
- 💾 **SQL / Database** — 20 Labs
- ⚙️ **JCL / Batch Operations** — 20 Labs

## Learning concept

各教材は、単なる用語暗記ではなく次の流れを重視します。

1. まず全体像を知る（Learning Step 0）
2. 基本モードで状態変化を見る
3. 選択モードで判断する
4. 入力モードで自分で書く
5. 状態DIFF・処理フロー・結果で理解する
6. 最終Labで障害切り分け / War Roomを行う

## Goal

ATM / Web / Linux / Database / COBOL / JCL / Batch といったレイヤを別々の単語として覚えるのではなく、**1つの金融システムとしてつなげて説明・一次切り分けできること**を目指します。

JCL moduleでは、JOB / EXEC / DDからJES、DISP、PROC、GDG、ABEND、step restart、Night Batch War Roomまでを扱います。

## Structure

```text
financial-it-learning-lab/
├─ index.html
├─ linux/
├─ cobol/
├─ sql/
├─ jcl/
├─ assets/
│  ├─ css/
│  └─ js/
└─ .github/workflows/
```

> This repository contains learning simulators. It is not an operational runbook for production financial systems.
