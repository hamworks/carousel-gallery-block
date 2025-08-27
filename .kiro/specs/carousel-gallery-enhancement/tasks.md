# 実装計画

## 概要

この実装計画は、Carousel Gallery Blockにカルーセル方向制御機能と画像順序管理機能を追加するための具体的なコーディングタスクを定義します。各タスクは段階的に実装され、テスト駆動開発のアプローチを採用します。

## タスクリスト

- [ ] 0. 環境構築とテストフレームワーク移行
  - Jest→Vitest移行とテスト環境のセットアップ
  - Vitestの設定ファイル作成とTypeScript統合
  - テストディレクトリ構造の構築
  - 依存関係の追加と設定
  - _要件: 全テスト関連要件の基盤_

- [ ] 0.1 依存関係の更新
  - `vitest`、`@vitest/ui`パッケージの追加
  - `keen-slider`パッケージの追加（フロントエンド用）
  - 既存のJest関連設定の確認と移行準備
  - package.jsonのscriptsセクション更新
  - _要件: テスト実行環境の準備_

- [ ] 0.2 Vitest設定ファイルの作成
  - `vitest.config.ts`の作成（Vite統合設定）
  - グローバルAPI有効化（`globals: true`）
  - jsdom環境設定（React Testing Library用）
  - テストカバレッジ設定（80%以上の閾値）
  - setupFiles設定
  - _要件: 4.7（80%カバレッジ）_

- [ ] 0.3 テストディレクトリ構造の作成
  - `tests/unit/`、`tests/integration/`、`tests/e2e/`、`tests/snapshots/`ディレクトリ作成
  - `tests/setup.ts`ファイル作成（@testing-library/jest-dom設定等）
  - TypeScript設定でテストファイルを認識するよう設定
  - _要件: テスト実装の基盤準備_

- [ ] 1. 基盤実装とユーティリティ関数の作成（TDDアプローチ）
  - DefinitelyTyped型定義を活用した型システムの拡張
  - 画像順序管理のための純粋関数をVitest駆動で実装
  - 各機能に対してテスト→実装のサイクルを実行
  - _要件: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 1.1 型定義の拡張とDefinitelyTyped型の統合
  - `src/types.ts`でDefinitelyTyped型定義を活用したBlockAttributes型を拡張
  - `direction`属性（'ltr' | 'rtl'）をブロック定義に追加
  - DefinitelyTyped MediaItem型を使用したImage型の定義
  - 型定義が不完全な場合は@ts-ignoreで対処（コメント必須）
  - _要件: 1.1, 1.2_

- [ ] 1.2 画像順序管理ユーティリティ関数のテスト作成
  - `tests/unit/imageOrderUtils.test.ts`でWordPressに依存しない純粋関数のVitestテストを作成
  - `moveImageInArray`, `replaceImageAtIndex`, `removeImageAtIndex`関数のテストケースを実装
  - 正常系・異常系の両方をカバーするテストケースを定義
  - Vitest設定とテスト環境の整備
  - _要件: 2.2, 2.3, 2.4_

- [ ] 1.3 画像順序管理ユーティリティ関数の実装
  - `src/utils/imageOrderUtils.ts`に純粋関数として画像配列操作関数を実装
  - テストケースを満たす`moveImageInArray`, `replaceImageAtIndex`, `removeImageAtIndex`関数を作成
  - エラーハンドリングとバリデーション機能を含める
  - _要件: 2.2, 2.3, 2.4_

- [ ] 2. ブロック定義とコア機能の拡張
  - `block.json`に新しい属性を追加
  - 属性のデフォルト値とバリデーションを設定
  - _要件: 1.1, 1.2_

- [ ] 2.1 block.jsonの属性拡張
  - `direction`属性（デフォルト: 'ltr', enum: ['ltr', 'rtl']）を追加
  - 既存の`images`属性構造を維持しつつ、新しいプロパティに対応
  - 属性のスキーマ定義とバリデーションルールを設定
  - _要件: 1.1, 1.2_

- [ ] 3. エディターUI機能の実装
  - InspectorControlsに方向制御トグルを追加
  - 画像順序管理UIコンポーネントを実装
  - WordPress公式コンポーネントを活用したアクセシブルなUI
  - WordPress依存コンポーネントはE2Eテストで検証
  - _要件: 1.3, 1.4, 2.1, 2.6, 2.7, 2.8_

- [ ] 3.1 方向制御UIの実装
  - `src/edit/index.tsx`のInspectorControlsにToggleControlを追加
  - DefinitelyTyped型定義を使用した型安全な実装
  - 国際化対応されたラベルとアクセシビリティ属性を設定
  - _要件: 1.3, 1.4_

- [ ] 3.2 画像順序管理コンポーネントの実装
  - `src/edit/ImagesControls.tsx`を拡張して順序変更ボタンを追加
  - WordPressのButton, BaseControl, MediaUploadコンポーネントを使用
  - chevronUp, chevronDownアイコンを使用したシンプルなUI
  - _要件: 2.1, 2.6, 2.7, 2.8_

- [ ] 4. 保存機能とフロントエンド表示の実装（Vitestアプローチ）
  - save.tsxコンポーネントの拡張（Vitestスナップショットテストで検証）
  - data属性を使用したフロントエンド設定の保存
  - 既存のImages表示コンポーネントとの統合
  - 純粋関数のみVitestで検証
  - _要件: 1.5, 2.5, 2.6_

- [ ] 4.1 保存コンポーネントの実装
  - `src/save.tsx`でBlockSaveProps型を使用した型安全な実装
  - data-speed, data-direction属性をHTML出力に追加
  - useBlockProps.save()を使用した適切なブロック保存
  - _要件: 1.5, 2.5_

- [ ] 4.2 フロントエンド初期化スクリプトのテスト作成
  - `tests/unit/view.test.ts`でdata属性読み取りとKeenSlider初期化のVitestテストを作成
  - 方向制御（rtl設定）をKeenSliderに適用するテスト
  - エラーハンドリングとフォールバック表示のテスト
  - _要件: 1.5, 2.6_

- [ ] 4.3 フロントエンド初期化スクリプトの実装
  - `src/view.ts`でテストケースを満たすdata属性を読み取りKeenSliderを初期化
  - 方向制御（rtl設定）をKeenSliderに適用
  - エラーハンドリングとフォールバック表示の実装
  - _要件: 1.5, 2.6_

- [ ] 5. 統合テストとE2Eテストの実装
  - DefinitelyTyped型を使用したVitest統合テスト
  - Playwrightを使用したE2Eテスト
  - エディター操作からフロントエンド表示までの完全なテスト
  - _要件: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

- [ ] 5.1 WordPress統合テストの実装
  - `tests/integration/blockAttributes.test.ts`でVitestとBlockEditProps型を使用したテスト
  - setAttributes関数の呼び出しとブロック属性更新のテスト
  - WordPressコンポーネントとの統合テスト
  - _要件: 1.1, 1.2, 1.3, 1.4_

- [ ] 5.2 E2Eテストの実装
  - `tests/e2e/carousel-controls.spec.ts`でPlaywrightエディター操作のテスト
  - 方向制御トグルの動作確認（WordPress依存UIコンポーネントのテスト）
  - 画像順序管理コンポーネントの操作テスト
  - 画像順序変更（ボタン操作）のテスト
  - フロントエンド表示の確認
  - _要件: 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.8_

- [ ] 5.3 スナップショットテストの実装
  - `tests/snapshots/save.test.ts`でVitestを使用した保存コンポーネントの出力テスト
  - 新しい属性（direction）を含むHTML出力の確認
  - data-direction属性の正しい出力確認
  - 既存機能の回帰テスト
  - _要件: 1.5, 2.5_

- [ ] 6. 最終統合とドキュメント更新
  - 全機能の統合テスト
  - パフォーマンス最適化
  - README更新とドキュメント作成
  - _要件: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10_

- [ ] 6.1 パフォーマンス最適化
  - 大量画像での動作確認とVitestパフォーマンステスト
  - 不要な再レンダリングの防止
  - メモリリークの確認と修正
  - _要件: 2.4, 2.5_

- [ ] 6.2 アクセシビリティ最終確認
  - ARIA属性の適切な設定確認
  - キーボードナビゲーションの動作確認
  - スクリーンリーダーでの操作確認
  - _要件: 2.8, 2.9, 2.10_

- [ ] 6.3 ドキュメント更新
  - README.mdに新機能の説明を追加
  - 使用方法とカスタマイズ方法の記載
  - 開発者向けドキュメントの更新
  - _要件: 全要件_
