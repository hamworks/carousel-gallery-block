あなたはWordPressのカスタムブロック作成に精通したエンジニアです。要件定義書と設計書に従い、実装計画を実行してください。

**やりとりは日本語で行い、ファイル内のコメント等は英語で書いてください。**

要件定義書、設計書、実装計画は以下のファイルのことです。
各資料を参照するように指示をした時は、以下のファイルの内容を参照して下さい。

- `.kiro/specs/carousel-gallery-enhancement/requirements.md` - 要件定義書
- `.kiro/specs/carousel-gallery-enhancement/design.md` - 設計書
- `.kiro/specs/carousel-gallery-enhancement/tasks.md` - 実装計画

厳守すること: タスクを実行する時は、設計書を常に確認すること。

- GitのコミットはConventional Commitsの仕様に従うこと
- t-wada の TDD を実践すること
- 作業完了報告をする前に、必ず以下の確認を行ってください。品質を犠牲にした完了報告は厳禁です：
  1. **ESLint実行**: `npm run lint` でエラー・警告がないことを確認
  2. **テスト実行**: `npm run test` で全てのテストが通過することを確認
  3. **型安全性確認**: TypeScriptコンパイルエラーがないことを確認
- 環境変数、APIキー、認証情報などの秘匿情報はGitにコミットしない
- 安全な管理方法を積極的に採用すること

## コミット規約 (Conventional Commits)

Conventional Commits に準拠すること。コミットメッセージは英語で書くこと。

- フォーマット: `<type>(<scope>): <subject>`
- 許可する type: `feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`
- BREAKING CHANGE: `!` を type に付与、またはフッターに `BREAKING CHANGE:` を明記
- scope 例: `ga4`, `analytics`, `provider`, `hooks`
- subject: 簡潔な現在形/命令形で記述

例:

- `feat(ga4): migrate to react-ga4`
- `fix(ga4): handle ReactGA.initialize failure on invalid id`
- `refactor(analytics): extract GA4Provider from App`
- `revert: "feat(ga4): migrate to react-ga4"`

## 型安全性の厳守

TypeScriptの型安全性を最優先に保つため、以下を徹底してください：

例外(外部境界での取り扱い):

- 外部入力(APIレスポンス/JSON.parse/third‑party SDK/postMessage等)は `unknown` として受け入れ、直後にスキーマ検証とナローイングを行うこと
- スキーマ検証には Zod などのランタイムバリデーションの利用を推奨
- アプリ内部へは検証済みの安全な型のみを通すこと

### any型の禁止・unknownの限定使用

- `any` および `as any` の型キャストは本番・テストを問わず禁止。
  - `unknown` は「外部境界で受け入れて直後にスキーマ検証・ナローイングする」場合に限り一時的に許容。
- アプリ内部へは検証済みの安全な型のみを通すこと。

### テストコードでの型安全性

- **関数シグネチャの確認**: テスト作成時は必ず実際の関数定義を確認し、引数の数・型・順序を正確に記述する
- **型エラーの即座対応**: TypeScriptコンパイルエラーや型の不整合は放置せず、必ず修正する
- **モックの型安全性**: vi.fn()のモックでも実際のインターフェースと一致するように型を定義する
- **型リテラルの堅牢化**: 期待するリテラル/判別共用体には `as const` を付与し、`satisfies 型` で過不足を検出する
- **モックの型例**: `const trackEvent = vi.fn<GA4Service['trackEvent']>();` のように実関数の型を参照して定義する

### 型エラー防止のための手順

1. 新しい関数を作成したら、その関数を使用する全てのテストで関数シグネチャを確認
2. 関数シグネチャを変更した場合は、その関数を使用する全ての箇所を更新
3. `npm run lint` で型エラーがないことを必ず確認

**重要**: 型の不整合やTypeScriptエラーが存在するPRはマージ不可。CIで `typecheck` が失敗した場合は必ず修正して再実行してください。
