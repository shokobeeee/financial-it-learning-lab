# Development Workflow

Parent review: #6

このrepoは教材内容そのものが製品品質なので、**コードが動くこと**と**初学者へ正しく教えられること**の両方をPRで確認する。

## Standard flow

```text
Issue / learning problem
  ↓
feature branch
  ↓
Pull Request
  ↓
Repository Quality Gate
  ↓
Learning / Concept / UX review
  ↓
review fixes
  ↓
re-review
  ↓
merge to main
  ↓
GitHub Pages deploy
```

原則として **mainへ直接実装しない**。

## Branch naming

短く目的が分かる名前にする。

- `cloud-visual-learning-v1`
- `cloud-concept-registry-v1`
- `warroom-evidence-metadata-v1`
- `fix-home-progress-version`

一時的なreview base branchは、review終了後に削除する。

## Pull Request

PRは `.github/pull_request_template.md` を使う。

最低限、次を説明する。

1. 何を変えたか
2. なぜ変えるか
3. 初学者の学習導線がどう変わるか
4. Concept / Product / Evidenceのどこに影響するか
5. QAと手動確認の結果

## Permanent quality gate

`.github/workflows/qa.yml` がPRとmain pushで実行される。

現在のbaseline checks:

- JavaScript syntax
- SQL / COBOL / JCL = 20 Labs
- Cloud Fundamentals / provider aligned = 20 Topics
- Financial War Room = 12 Cases
- Home progress prefix contract
- module entrypoint wiring
- Context / Cloud Mapの重要invariant
- temporary workflowがmainに残っていないこと
- module entrypointのlocal link切れ

Issue #6のP0/P1を直したら、対応するregression guardをこのQAへ追加する。

**修正しただけで終わらせず、「同じ不具合が戻らないcheck」を1つ増やす**のを原則とする。

## Review order

### 1. Learning review

最初に見る。

- 未経験者が前提を知らなくても始められるか
- 問題を出す前に必要な説明をしているか
- 用語が孤立していないか
- 「これは何のため？」を説明できるか

### 2. Concept / architecture review

- 分類軸を混ぜていないか
- ConceptとProductを同一視していないか
- Provider mappingを1:1互換に見せていないか
- Source of Truthを増やしていないか
- Evidenceが目的レイヤーと一致しているか

### 3. UX / accessibility review

- first viewの主Actionが明確か
- mobileで読める・押せるか
- modalのEscape / focus / return
- Help UIが増殖していないか
- 情報量が学習段階に合っているか

### 4. Code / regression review

- state / localStorageへの副作用
- progress / routing
- MutationObserver等の重い後付け処理
- dead data / duplicate mapping
- QAで守れるinvariant

## Merge rule

merge前に最低限:

- PR diff review済み
- `Repository Quality Gate / quality` 成功
- review findingがある場合は修正済み
- temporary QA workflowを作った場合は削除済み
- mainへ入れるファイルが意図したscopeだけ

## Desired main protection

GitHub側では最終的に以下を有効にする。

- Pull Request必須
- `Repository Quality Gate / quality` 必須
- unresolved review conversationがないこと
- force push禁止
- branch deletion禁止

この設定が有効になるまでも、運用上は同じルールを守る。

## Deploy

main merge後は `.github/workflows/pages.yml` がGitHub Pagesへdeployする。

Deploy失敗時は、まず

1. Quality Gateが成功していたか
2. Pages workflowのどのstepで失敗したか
3. GitHub側のdownload/rate-limit障害か、repo変更起因か

を分けて確認する。
