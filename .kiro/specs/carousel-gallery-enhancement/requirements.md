# 要件定義書

## はじめに

この文書は、既存のCarousel Gallery Block（WordPressのGutenbergブロック）に対する機能拡張の要件を定義します。現在のブロックは、画像のカルーセル表示機能を提供していますが、カルーセルの方向制御と画像順序の管理機能を追加することで、より柔軟で使いやすいブロックにすることを目的としています。

## 既存機能の概要

現在のCarousel Gallery Blockは以下の機能を提供しています：

- 複数の画像をカルーセル形式で自動スクロール表示
- InspectorControlsでのスピード調整（1-10の範囲）
- 画像の追加・削除・置換機能
- KeenSliderライブラリを使用した滑らかなアニメーション
- レスポンシブ対応

## 要件

### 要件1：カルーセル方向制御機能

**ユーザーストーリー:** エディターとして、カルーセルが左から右、または右から左のどちらの方向にスクロールするかを選択できるようにしたい。これにより、デザインの意図やコンテンツの流れに合わせてカルーセルの動きを調整できる。

#### 受け入れ基準

1. WHEN エディターがInspectorControlsを開く THEN WordPressの`ToggleControl`コンポーネントを使用したカルーセル方向切り替えコントロールが表示される SHALL
2. WHEN エディターがトグルをオフ（false）にする THEN カルーセルは左から右方向にスクロールする SHALL
3. WHEN エディターがトグルをオン（true）にする THEN カルーセルは右から左方向にスクロールする SHALL
4. WHEN ブロックが初期化される THEN デフォルトでトグルはオフ（左から右）に設定されている SHALL
5. WHEN 方向設定が変更される THEN エディター内で静的な画像プレビューが更新される SHALL（実際のスクロールアニメーションは行わない）
6. WHEN ブロックが保存される THEN 選択された方向設定がブロック属性として保存される SHALL
7. WHEN フロントエンドでブロックが表示される THEN 保存された方向設定に従ってカルーセルが動作する SHALL
8. WHEN ToggleControlが表示される THEN 国際化対応された翻訳可能なラベル（`__( 'Reverse direction', 'carousel-gallery-block' )`）が表示される SHALL

### 要件2：画像順序管理機能

**ユーザーストーリー:** エディターとして、InspectorControls内で画像の表示順序を直感的に変更できるようにしたい。これにより、カルーセル内での画像の並び順を自由に調整できる。

#### 受け入れ基準

1. WHEN エディターがInspectorControlsを開く THEN 各画像に対してWordPressの`Button`コンポーネントを使用した順序変更コントロールが表示される SHALL
2. WHEN エディターがInspectorControls内の画像に付いているchevronUpアイコンボタンをクリックする THEN その画像の順序が一つ前に移動する SHALL
3. WHEN エディターがInspectorControls内の画像に付いているchevronDownアイコンボタンをクリックする THEN その画像の順序が一つ後に移動する SHALL
4. WHEN 画像が最初の位置にある THEN InspectorControls内のその画像のchevronUpアイコンボタンが無効化される SHALL
5. WHEN 画像が最後の位置にある THEN InspectorControls内のその画像のchevronDownアイコンボタンが無効化される SHALL
6. WHEN 画像の順序が変更される THEN エディター内の静的な画像一覧表示が変更された順序で更新される SHALL（実際のカルーセルアニメーションは行わない）
7. WHEN ブロックが保存される THEN 変更された画像順序がブロック属性として保存される SHALL
8. WHEN フロントエンドでブロックが表示される THEN 保存された順序で画像がカルーセル表示される SHALL
9. IF 画像が1枚以下の場合 THEN 順序変更コントロールは表示されない SHALL
10. WHEN InspectorControls内の各画像に順序変更ボタンが表示される THEN `chevronUp`と`chevronDown`アイコンを使用したボタンが表示され、適切なaria-labelが設定される SHALL

### 要件3：既存機能の維持

**ユーザーストーリー:** エディターとして、新機能追加後も既存の機能が正常に動作することを期待する。

#### 受け入れ基準

1. WHEN 新機能が追加される THEN 既存のスピード調整機能が正常に動作する SHALL
2. WHEN 新機能が追加される THEN 既存の画像追加・削除・置換機能が正常に動作する SHALL
3. WHEN 新機能が追加される THEN 既存のKeenSliderアニメーションが正常に動作する SHALL
4. WHEN 新機能が追加される THEN 既存のレスポンシブ対応が維持される SHALL
5. WHEN 既存のブロックが読み込まれる THEN 新しい属性のデフォルト値が適用される SHALL

### 要件4：テスト実装

**ユーザーストーリー:** 開発者として、機能の品質を保証し、将来的な変更に対する安全性を確保するため、包括的なテストスイートを実装したい。

#### 受け入れ基準

1. WHEN 新機能が実装される THEN Playwrightを使用したE2Eテストでブロックの挿入・編集・保存が検証される SHALL
2. WHEN 新機能が実装される THEN Vitestスナップショットテストでsave関数の出力が検証される SHALL
3. WHEN 新機能が実装される THEN WordPressに依存しない独立したコンポーネント（画像順序変更ロジック、方向制御ロジックなど）のVitestユニットテストが実装される SHALL
4. WHEN カルーセル方向制御機能が実装される THEN ToggleControlの操作とその結果がE2Eテストで検証される SHALL
5. WHEN 画像順序管理機能が実装される THEN 順序変更ボタンの操作とその結果がE2Eテストで検証される SHALL
6. WHEN ブロック属性が変更される THEN 新しい属性（direction、画像順序）のVitestスナップショットテストが実装される SHALL
7. WHEN テストが実行される THEN 80%以上のテストカバレッジが達成される SHALL
8. WHEN CI/CDパイプラインが実行される THEN クリティカルパスのE2Eテストが5分以内に完了する SHALL

### 要件5：国際化対応

**ユーザーストーリー:** 世界中のWordPressユーザーとして、自分の言語でブロックのUIを利用できるようにしたい。

#### 受け入れ基準

1. WHEN ブロックが実装される THEN すべてのユーザー向けテキストがWordPressの`__()`関数を使用して翻訳可能になっている SHALL
2. WHEN テキストドメインが設定される THEN 一貫して`carousel-gallery-block`が使用される SHALL
3. WHEN ブロックがビルドされる THEN `.pot`ファイルが生成され、翻訳者が利用できる SHALL
4. WHEN WordPressの公式ディレクトリに登録される THEN 国際化のベストプラクティスに準拠している SHALL
5. WHEN 新しいUI要素が追加される THEN それらのテキストも翻訳可能になっている SHALL
