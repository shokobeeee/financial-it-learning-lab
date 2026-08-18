# Cloud Fundamentals — Zero-Base Complete Package

## Goal

Cloud用語を暗記する前に、**Webサービスには何が必要で、Cloudを使うと何を借りられるのか**から理解する。

この教材では1つの銀行Webサービスを20 Labsかけて育てる。

```text
📱 利用者
  ↓
🌐 入口
  ↓
🧱 Cloud内Network
  ↓
🖥 App
  ↓
🗄 Data
  ↓
🏢 銀行内 / Core
```

Security / Observe / Async / Recovery / Change を途中から追加する。

## Learning Step 0

最初の見出しは **「クラウドって、そもそも何？」**。

- Appを動かすコンピュータ
- Network
- Data保存場所
- それらをCloud事業者から借りる
- 守る
- 止まりにくく・戻せるようにする

までを先に理解し、VPC / IAM / AZ / KMS等は必要になったLabで初めて名前を付ける。

## 20 Labs

- 01–07: App / Network / Subnet / Route / Firewall / Entrance / HA
- 08–14: Storage / Managed DB / IAM / Encryption / Secrets / Observability / Async
- 15–19: Hybrid / Private Access / Backup-DR / IaC / Responsibility-Governance
- 20: Cloud War Room

## Rule

**用語 → 意味**ではなく、**問題 → 必要な部品 → 名前**の順で学ぶ。

各Labには「いま作っている銀行Web」を表示し、今回追加する部品を強調する。

Next: **AWS / Google Cloud / Azure** — 同じ銀行Webを各Provider名へ翻訳する。
