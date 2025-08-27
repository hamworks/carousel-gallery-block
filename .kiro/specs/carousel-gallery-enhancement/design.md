# 設計書

## 概要

この設計書は、既存のCarousel Gallery Blockに対してカルーセル方向制御機能と画像順序管理機能を追加するための技術的なアプローチを定義します。設計は既存のコードベースとの互換性を保ちながら、新機能を効率的に実装することを目的としています。

## アーキテクチャ

### 全体構成

```
carousel-gallery-block/
├── src/
│   ├── types.ts                 # 型定義（拡張）
│   ├── block.json              # ブロック定義（属性追加）
│   ├── edit/
│   │   ├── index.tsx           # メインエディターコンポーネント
│   │   ├── ImagesControls.tsx  # 画像管理コンポーネント（拡張）
│   │   └── MediaControl.tsx    # 個別画像コントロール
│   ├── Images.tsx              # 画像表示コンポーネント
│   ├── save.tsx                # 保存コンポーネント（拡張）
│   ├── view.ts                 # フロントエンド動作（拡張）
│   └── utils/                  # 新規追加
│       ├── imageOrderUtils.ts  # 画像順序管理ユーティリティ
│       └── carouselUtils.ts    # カルーセル制御ユーティリティ
└── tests/                      # 新規追加
    ├── e2e/
    ├── unit/
    └── snapshots/
```

### 設計原則

1. **既存コードの最小限の変更**: 既存の機能を壊さずに新機能を追加
2. **関心の分離**: UI、ロジック、データ管理を明確に分離
3. **適切な依存関係の管理**:
   - **WordPress依存部分**: ブロック属性操作、WordPress APIとの連携は積極的にWordPress機能を活用
   - **純粋関数部分**: 配列操作、データ変換、ビジネスロジックはWordPressに依存しない純粋な関数として実装
4. **国際化対応**: すべてのユーザー向けテキストを翻訳可能に
5. **アクセシビリティ**: ARIA属性とキーボードナビゲーションをサポート

## コンポーネントとインターフェース

### 1. 型定義の拡張 (types.ts)

```typescript
// 最小限のメディア型（必要に応じて拡張）
export type WpMedia = { id: number; url: string; alt?: string; caption?: string };

// 既存のBlockAttributesを拡張
export interface BlockAttributes {
  images: Image[];
  breakpoint: number;
  speed: number;
  direction: 'ltr' | 'rtl'; // 新規追加
  allowedBlocks: string[];
  templateLock?: 'all' | 'insert' | 'contentOnly' | false;
}

// WpMediaを基にした画像型
export interface Image {
  url: string;
  id: number | undefined;
  alt?: string;
  caption?: string;
}

// 新規追加：画像順序管理用の型
export type ImageOrderAction = 'moveUp' | 'moveDown';

export interface ImageOrderResult {
  success: boolean;
  newImages: Image[];
  error?: string;
}
```

### 2. ブロック定義の拡張 (block.json)

```json
{
  "attributes": {
    "speed": {
      "type": "number",
      "default": 1
    },
    "direction": {
      "type": "string",
      "default": "ltr",
      "enum": ["ltr", "rtl"]
    },
    "images": {
      "type": "array",
      "source": "query",
      "selector": ".wp-block-carousel-gallery-block__image img",
      "query": {
        "id": {
          "type": "number",
          "source": "attribute",
          "attribute": "data-id"
        },
        "url": {
          "default": "",
          "type": "string",
          "source": "attribute",
          "attribute": "src"
        }
      },
      "default": []
    }
  }
}
```

### 3. エディターコンポーネントの拡張

#### Edit Component (edit/index.tsx)

```typescript
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import type { BlockAttributes } from '../types';

export default function Edit( props: BlockEditProps< BlockAttributes > ) {
  const { attributes, setAttributes } = props;
  const { images, speed, direction } = attributes;

  const inspectorControls = (
    <InspectorControls>
      <PanelBody title={ __( 'Media settings', 'carousel-gallery-block' ) } initialOpen={ true }>
        <RangeControl
          label={ __( 'Speed', 'carousel-gallery-block' ) }
          value={ speed }
          min={ 1 }
          max={ 10 }
          onChange={ ( value: number | undefined ) =>
            setAttributes( { speed: value ?? 1 } )
          }
        />
        <ToggleControl
          label={ __( 'Reverse direction', 'carousel-gallery-block' ) }
          checked={ direction === 'rtl' }
          onChange={ ( checked: boolean ) =>
            setAttributes( { direction: checked ? 'rtl' : 'ltr' } )
          }
        />
        <ImagesControls
          images={ images }
          setAttributes={ setAttributes }
        />
      </PanelBody>
    </InspectorControls>
  );

  return (
    <div { ...useBlockProps() }>
      { inspectorControls }
      <Images images={ images } />
    </div>
  );
}
```

#### ImagesControls Component (edit/ImagesControls.tsx)

```typescript
import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button, BaseControl } from '@wordpress/components';
import { chevronUp, chevronDown } from '@wordpress/icons';
import type { BlockAttributes, Image, ImageOrderAction } from '../types';
import { moveImageInArray, replaceImageAtIndex, removeImageAtIndex } from '../utils/imageOrderUtils';

interface Props {
  images: Image[];
  setAttributes: ( attributes: Partial< BlockAttributes > ) => void;
}

const ImagesControls = ( { images, setAttributes }: Props ) => {
  // WordPress依存部分：ブロック属性の更新
  const updateImagesAttribute = ( newImages: Image[] ) => {
    setAttributes( { images: newImages } );
  };

  const moveImage = ( index: number, action: ImageOrderAction ) => {
    // 純粋関数を呼び出してデータ変換
    const result = moveImageInArray( images, index, action );
    if ( result.success ) {
      // WordPress APIを使って属性を更新
      updateImagesAttribute( result.newImages );
    }
  };

  const selectImage = ( index: number, newImage: Image ) => {
    // 純粋関数でデータ変換
    const newImages = replaceImageAtIndex( images, index, newImage );
    // WordPress APIで属性更新
    updateImagesAttribute( newImages );
  };

  const removeImage = ( index: number ) => {
    // 純粋関数でデータ変換
    const newImages = removeImageAtIndex( images, index );
    // WordPress APIで属性更新
    updateImagesAttribute( newImages );
  };

  // Add image via MediaUpload (render-prop)

  return (
    <MediaUploadCheck>
      { images.map( ( image, index ) => (
        <div key={ index } className="carousel-image-control">
          <BaseControl
            id={ `image-${ index }` }
            label={ `Image ${ index + 1 }` }
          >
            <div className="image-controls-wrapper">
              <MediaControl
                media={ image }
                onSelect={ ( media: WpMedia ) => {
                  selectImage( index, {
                    url: media.url,
                    id: media.id,
                    alt: media.alt,
                    caption: media.caption,
                  } );
                } }
                onRemove={ () => removeImage( index ) }
              />
              { images.length > 1 && (
                <div className="image-order-controls">
                  <Button
                    icon={ chevronUp }
                    disabled={ index === 0 }
                    onClick={ () => moveImage( index, 'moveUp' ) }
                    aria-label={ __( 'Move image up', 'carousel-gallery-block' ) }
                  />
                  <Button
                    icon={ chevronDown }
                    disabled={ index === images.length - 1 }
                    onClick={ () => moveImage( index, 'moveDown' ) }
                    aria-label={ __( 'Move image down', 'carousel-gallery-block' ) }
                  />
                </div>
              ) }
            </div>
          </BaseControl>
        </div>
      ) ) }
      <Button
        className="is-primary"
        onClick={ () => {
          const empty = {
            url: '',
            id: undefined,
          };
          updateImagesAttribute( addImageToArray( images, empty ) );
        } }
      >
        { __( 'Add', 'carousel-gallery-block' ) }
      </Button>
    </MediaUploadCheck>
  );
};

export default ImagesControls;
```

### 4. 保存コンポーネントの拡張 (save.tsx)

```typescript
import { useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import type { BlockAttributes } from './types';
import Images from './Images';

export default function Save( props: BlockSaveProps< BlockAttributes > ) {
  const { attributes } = props;
  const { images, speed, direction } = attributes;

  return (
    <div
      { ...useBlockProps.save() }
      data-speed={ speed }
      data-direction={ direction }
    >
      <Images images={ images } />
    </div>
  );
}
```

## データモデル

### 画像順序管理

画像の順序は配列のインデックスで管理し、内部的な`order`プロパティは使用しません。これにより既存のデータ構造との互換性を保ちます。

```typescript
// 画像配列の例
const images: Image[] = [
  { url: 'image1.jpg', id: 1 },    // index: 0 (最初)
  { url: 'image2.jpg', id: 2 },    // index: 1
  { url: 'image3.jpg', id: 3 },    // index: 2 (最後)
];
```

### 方向制御

方向は`direction`属性で管理し、以下の値を取ります：
- `'ltr'`: 左から右（デフォルト）
- `'rtl'`: 右から左

## エラーハンドリング

### 純粋関数部分（WordPressに依存しない）

```typescript
// utils/imageOrderUtils.ts - 純粋関数として実装
export const moveImageInArray = (
  images: Image[],
  index: number,
  action: ImageOrderAction
): ImageOrderResult => {
  // バリデーション
  if ( index < 0 || index >= images.length ) {
    return {
      success: false,
      newImages: images,
      error: 'Invalid image index'
    };
  }

  if ( action === 'moveUp' && index === 0 ) {
    return {
      success: false,
      newImages: images,
      error: 'Cannot move first image up'
    };
  }

  if ( action === 'moveDown' && index === images.length - 1 ) {
    return {
      success: false,
      newImages: images,
      error: 'Cannot move last image down'
    };
  }

  // 実際の移動処理
  const newImages = [...images];
  const targetIndex = action === 'moveUp' ? index - 1 : index + 1;

  [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];

  return {
    success: true,
    newImages,
  };
};

// その他の純粋関数
export const replaceImageAtIndex = ( images: Image[], index: number, newImage: Image ): Image[] => {
  const newImages = [...images];
  newImages[index] = newImage;
  return newImages;
};

export const removeImageAtIndex = ( images: Image[], index: number ): Image[] => {
  return images.filter( ( _, i ) => i !== index );
};

export const addImageToArray = ( images: Image[], newImage: Image ): Image[] => {
  return [...images, newImage];
};
```

### WordPress依存部分

```typescript
// edit/ImagesControls.tsx - WordPress APIを活用
const ImagesControls = ( { images, setAttributes }: Props ) => {
  // WordPress依存：ブロック属性の更新関数
  const updateBlockAttributes = ( updates: Partial<BlockAttributes> ) => {
    setAttributes( updates );
  };

  // WordPress依存：方向属性の更新
  const updateDirection = ( direction: 'ltr' | 'rtl' ) => {
    updateBlockAttributes( { direction } );
  };

  // WordPress依存：速度属性の更新
  const updateSpeed = ( speed: number ) => {
    updateBlockAttributes( { speed } );
  };

  // 純粋関数とWordPress APIの組み合わせ
  const handleImageMove = ( index: number, action: ImageOrderAction ) => {
    const result = moveImageInArray( images, index, action ); // 純粋関数
    if ( result.success ) {
      updateBlockAttributes( { images: result.newImages } ); // WordPress API
    }
  };
};
```

### フロントエンド エラーハンドリング

```typescript
// view.ts内でのエラーハンドリング
const initializeCarousel = ( element: HTMLElement ) => {
  try {
    const speedAttr = element.getAttribute( 'data-speed' ) || '1';
    const speed = Math.max(1, Number.parseFloat(speedAttr)) || 1;
    const direction = element.getAttribute( 'data-direction' ) === 'rtl' ? 'rtl' : 'ltr';
    const imagesContainer = element.querySelector('.wp-block-carousel-gallery-block__images') as HTMLElement | null;
    if (!imagesContainer) {
      throw new Error('Images container not found');
    }

    // KeenSlider初期化
    const slider = new KeenSlider( imagesContainer, {
      loop: true,
      renderMode: 'performance',
      slides: { perView: 'auto' },
      rtl: direction === 'rtl',
      // その他の設定...
    } );

  } catch ( error ) {
    console.error( 'Carousel initialization failed:', error );
    // フォールバック: 静的表示
    element.classList.add( 'carousel-fallback' );
  }
};
```

## テスト戦略

### 1. ユニットテスト

#### 純粋関数のテスト（WordPressに依存しない）

```typescript
// tests/unit/imageOrderUtils.test.ts - Vitestを使用
import { describe, it, expect } from 'vitest';
import { moveImageInArray } from '../../src/utils/imageOrderUtils';

describe( 'moveImageInArray', () => {
  const mockImages = [
    { url: 'image1.jpg', id: 1 },
    { url: 'image2.jpg', id: 2 },
    { url: 'image3.jpg', id: 3 },
  ];

  it( 'should move image up successfully', () => {
    const result = moveImageInArray( mockImages, 1, 'moveUp' );
    expect( result.success ).toBe( true );
    expect( result.newImages[0].id ).toBe( 2 );
    expect( result.newImages[1].id ).toBe( 1 );
  } );

  it( 'should not move first image up', () => {
    const result = moveImageInArray( mockImages, 0, 'moveUp' );
    expect( result.success ).toBe( false );
    expect( result.error ).toBe( 'Cannot move first image up' );
  } );
} );
```

#### WordPress統合テスト（DefinitelyTypedとVitestを使用）

```typescript
// tests/unit/blockAttributes.test.ts - Vitestと@testing-library/reactを使用
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { BlockEditProps } from '@wordpress/blocks';
import type { BlockAttributes } from '../../src/types';
import Edit from '../../src/edit';

// DefinitelyTyped型定義を使用したテスト
describe( 'Block Attributes Integration', () => {
  it( 'should update direction attribute correctly', async () => {
    const user = userEvent.setup();
    const mockSetAttributes = vi.fn();
    const mockAttributes: BlockAttributes = {
      direction: 'ltr',
      images: [],
      speed: 1,
      breakpoint: 768,
      allowedBlocks: [],
    };

    const props: BlockEditProps< BlockAttributes > = {
      attributes: mockAttributes,
      setAttributes: mockSetAttributes,
      clientId: 'test-client-id',
      name: 'hamworks/carousel-gallery-block',
      isSelected: true,
    };

    // WordPress APIを使用したコンポーネントのテスト
    render( <Edit { ...props } /> );

    // 方向制御トグルを探してクリック
    const toggle = screen.getByLabelText( 'Reverse direction' );
    await user.click( toggle );

    // WordPress依存の機能をテスト
    expect( mockSetAttributes ).toHaveBeenCalledWith(
      expect.objectContaining({ direction: 'rtl' })
    );
  } );
} );
```

### 2. E2Eテスト（Playwright）

```typescript
// tests/e2e/carousel-controls.spec.ts - Playwrightを使用
import { test, expect } from '@playwright/test';

test( 'should control carousel direction with toggle', async ( { page, editor } ) => {
  await editor.insertBlock( { name: 'hamworks/carousel-gallery-block' } );

  // InspectorControlsを開く
  await page.click( '[data-type="hamworks/carousel-gallery-block"]' );

  // 方向制御トグルをテスト
  const toggle = page.locator( 'input[aria-label*="Reverse direction"]' );
  await toggle.click();

  // 属性が正しく設定されることを確認
  const blockData = await editor.getBlocks();
  expect( blockData[0].attributes.direction ).toBe( 'rtl' );
} );
```

### 3. スナップショットテスト（Vitest）

```typescript
// tests/snapshots/save.test.ts - Vitestスナップショットを使用
import { describe, it, expect } from 'vitest';
import save from '../../src/save';

describe( 'Save component snapshots', () => {
  it( 'should render with direction attribute', () => {
    const mockImages = [
      { url: 'image1.jpg', id: 1 },
      { url: 'image2.jpg', id: 2 },
    ] as const;
    const attributes = {
      images: mockImages,
      speed: 2,
      direction: 'rtl' as const,
    };

    const output = save( { attributes } );
    expect( output ).toMatchSnapshot();
  } );
} );
```

## 国際化対応

### 翻訳可能文字列

```typescript
// すべてのユーザー向けテキストを翻訳可能に
const strings = {
  reverseDirection: __( 'Reverse direction', 'carousel-gallery-block' ),
  moveImageUp: __( 'Move image up', 'carousel-gallery-block' ),
  moveImageDown: __( 'Move image down', 'carousel-gallery-block' ),
  speed: __( 'Speed', 'carousel-gallery-block' ),
  mediaSettings: __( 'Media settings', 'carousel-gallery-block' ),
  add: __( 'Add', 'carousel-gallery-block' ),
};
```

### POTファイル生成

ビルドプロセスで`.pot`ファイルを生成し、翻訳者が利用できるようにします。

## パフォーマンス考慮事項

### 1. 画像順序変更の最適化

- 配列の不要なコピーを避けるため、必要な場合のみ新しい配列を作成
- 大量の画像がある場合のパフォーマンステスト実装

### 2. フロントエンド最適化

- KeenSliderの設定を最適化し、不要な再描画を避ける
- 画像の遅延読み込み対応（既存機能の維持）

### 3. メモリ使用量

- 画像データの重複を避ける
- 不要なイベントリスナーの適切なクリーンアップ

## セキュリティ考慮事項

### 1. 入力検証

- 画像インデックスの範囲チェック
- 方向属性の値検証（'ltr' | 'rtl'のみ許可）

### 2. XSS対策

- 画像URLの適切なエスケープ（既存実装を維持）
- data属性の値検証

## 後方互換性

### 既存ブロックの移行

```typescript
// 既存のブロックに新しい属性のデフォルト値を適用
const migrateBlockAttributes = ( attributes: any ) => {
  return {
    ...attributes,
    direction: attributes.direction || 'ltr',
  };
};
```

### CSS互換性

既存のCSSクラス名を維持し、新しいスタイルは追加のみ行います。

## 実装フェーズ

### フェーズ1: 基盤実装
- 型定義の拡張
- ユーティリティ関数の実装
- ユニットテストの作成

### フェーズ2: UI実装
- InspectorControlsの拡張
- 画像順序管理UIの実装
- E2Eテストの作成

### フェーズ3: フロントエンド実装
- KeenSliderの方向制御対応
- スナップショットテストの作成
- 統合テスト

### フェーズ4: 最終調整
- パフォーマンス最適化
- アクセシビリティ改善
- ドキュメント更新
