import { describe, it, expect, vi } from 'vitest';
import type { Image, WpMedia } from '../../src/types';
import {
	moveImageInArray,
	replaceImageAtIndex,
	removeImageAtIndex,
	addImageToArray,
	imageOrderStateUpdaters,
	createBlockAttributeUpdaters,
	validateImagesAttribute,
	wpMediaToImage,
	wpMediaArrayToImages,
} from '../../src/utils/imageOrderUtils';

describe( 'moveImageInArray', () => {
	const mockImages: Image[] = [
		{ url: 'image1.jpg', id: 1, alt: 'First image' },
		{ url: 'image2.jpg', id: 2, alt: 'Second image' },
		{ url: 'image3.jpg', id: 3, alt: 'Third image' },
	];

	describe( '正常系：画像の移動', () => {
		it( '中間位置の画像を上に移動できる', () => {
			const result = moveImageInArray( mockImages, 1, 'moveUp' );

			expect( result.success ).toBe( true );
			expect( result.newImages ).toHaveLength( 3 );
			expect( result.newImages[ 0 ].id ).toBe( 2 );
			expect( result.newImages[ 1 ].id ).toBe( 1 );
			expect( result.newImages[ 2 ].id ).toBe( 3 );
			expect( result.error ).toBeUndefined();
		} );

		it( '中間位置の画像を下に移動できる', () => {
			const result = moveImageInArray( mockImages, 1, 'moveDown' );

			expect( result.success ).toBe( true );
			expect( result.newImages ).toHaveLength( 3 );
			expect( result.newImages[ 0 ].id ).toBe( 1 );
			expect( result.newImages[ 1 ].id ).toBe( 3 );
			expect( result.newImages[ 2 ].id ).toBe( 2 );
			expect( result.error ).toBeUndefined();
		} );

		it( '最初の画像を下に移動できる', () => {
			const result = moveImageInArray( mockImages, 0, 'moveDown' );

			expect( result.success ).toBe( true );
			expect( result.newImages ).toHaveLength( 3 );
			expect( result.newImages[ 0 ].id ).toBe( 2 );
			expect( result.newImages[ 1 ].id ).toBe( 1 );
			expect( result.newImages[ 2 ].id ).toBe( 3 );
		} );

		it( '最後の画像を上に移動できる', () => {
			const result = moveImageInArray( mockImages, 2, 'moveUp' );

			expect( result.success ).toBe( true );
			expect( result.newImages ).toHaveLength( 3 );
			expect( result.newImages[ 0 ].id ).toBe( 1 );
			expect( result.newImages[ 1 ].id ).toBe( 3 );
			expect( result.newImages[ 2 ].id ).toBe( 2 );
		} );
	} );

	describe( '境界値：移動不可能なケース', () => {
		it( '最初の画像を上に移動しようとした場合はエラーを返す', () => {
			const result = moveImageInArray( mockImages, 0, 'moveUp' );

			expect( result.success ).toBe( false );
			expect( result.newImages ).toEqual( mockImages );
			expect( result.error ).toBe( 'Cannot move first image up' );
		} );

		it( '最後の画像を下に移動しようとした場合はエラーを返す', () => {
			const result = moveImageInArray( mockImages, 2, 'moveDown' );

			expect( result.success ).toBe( false );
			expect( result.newImages ).toEqual( mockImages );
			expect( result.error ).toBe( 'Cannot move last image down' );
		} );
	} );

	describe( '異常系：無効な入力', () => {
		it( '負のインデックスの場合はエラーを返す', () => {
			const result = moveImageInArray( mockImages, -1, 'moveUp' );

			expect( result.success ).toBe( false );
			expect( result.newImages ).toEqual( mockImages );
			expect( result.error ).toBe( 'Invalid image index' );
		} );

		it( '範囲外のインデックスの場合はエラーを返す', () => {
			const result = moveImageInArray( mockImages, 3, 'moveUp' );

			expect( result.success ).toBe( false );
			expect( result.newImages ).toEqual( mockImages );
			expect( result.error ).toBe( 'Invalid image index' );
		} );

		it( '空配列での操作はエラーを返す', () => {
			const result = moveImageInArray( [], 0, 'moveUp' );

			expect( result.success ).toBe( false );
			expect( result.newImages ).toEqual( [] );
			expect( result.error ).toBe( 'Invalid image index' );
		} );
	} );

	describe( 'イミュータビリティの確認', () => {
		it( '元の配列を変更しない', () => {
			const originalImages = [ ...mockImages ];
			const result = moveImageInArray( mockImages, 1, 'moveUp' );

			expect( mockImages ).toEqual( originalImages );
			expect( result.newImages ).not.toBe( mockImages );
		} );
	} );
} );

describe( 'replaceImageAtIndex', () => {
	const mockImages: Image[] = [
		{ url: 'image1.jpg', id: 1 },
		{ url: 'image2.jpg', id: 2 },
		{ url: 'image3.jpg', id: 3 },
	];

	it( '指定した位置の画像を置き換えできる', () => {
		const newImage: Image = {
			url: 'new-image.jpg',
			id: 99,
			alt: 'New image',
		};
		const result = replaceImageAtIndex( mockImages, 1, newImage );

		expect( result.success ).toBe( true );
		expect( result.newImages ).toHaveLength( 3 );
		expect( result.newImages[ 0 ] ).toEqual( mockImages[ 0 ] );
		expect( result.newImages[ 1 ] ).toEqual( newImage );
		expect( result.newImages[ 2 ] ).toEqual( mockImages[ 2 ] );
		expect( result.error ).toBeUndefined();
	} );

	it( '最初の画像を置き換えできる', () => {
		const newImage: Image = { url: 'new-image.jpg', id: 99 };
		const result = replaceImageAtIndex( mockImages, 0, newImage );

		expect( result.success ).toBe( true );
		expect( result.newImages[ 0 ] ).toEqual( newImage );
		expect( result.newImages[ 1 ] ).toEqual( mockImages[ 1 ] );
		expect( result.newImages[ 2 ] ).toEqual( mockImages[ 2 ] );
	} );

	it( '最後の画像を置き換えできる', () => {
		const newImage: Image = { url: 'new-image.jpg', id: 99 };
		const result = replaceImageAtIndex( mockImages, 2, newImage );

		expect( result.success ).toBe( true );
		expect( result.newImages[ 0 ] ).toEqual( mockImages[ 0 ] );
		expect( result.newImages[ 1 ] ).toEqual( mockImages[ 1 ] );
		expect( result.newImages[ 2 ] ).toEqual( newImage );
	} );

	it( '元の配列を変更しない', () => {
		const originalImages = [ ...mockImages ];
		const newImage: Image = { url: 'new-image.jpg', id: 99 };
		const result = replaceImageAtIndex( mockImages, 1, newImage );

		expect( mockImages ).toEqual( originalImages );
		expect( result.newImages ).not.toBe( mockImages );
	} );

	it( '無効なインデックスの場合はエラーを返す', () => {
		const newImage: Image = { url: 'new-image.jpg', id: 99 };
		const result = replaceImageAtIndex( mockImages, 5, newImage );

		expect( result.success ).toBe( false );
		expect( result.newImages ).toEqual( mockImages );
		expect( result.error ).toBe( 'Invalid image index' );
	} );
} );

describe( 'removeImageAtIndex', () => {
	const mockImages: Image[] = [
		{ url: 'image1.jpg', id: 1 },
		{ url: 'image2.jpg', id: 2 },
		{ url: 'image3.jpg', id: 3 },
	];

	it( '指定した位置の画像を削除できる', () => {
		const result = removeImageAtIndex( mockImages, 1 );

		expect( result.success ).toBe( true );
		expect( result.newImages ).toHaveLength( 2 );
		expect( result.newImages[ 0 ] ).toEqual( mockImages[ 0 ] );
		expect( result.newImages[ 1 ] ).toEqual( mockImages[ 2 ] );
		expect( result.error ).toBeUndefined();
	} );

	it( '最初の画像を削除できる', () => {
		const result = removeImageAtIndex( mockImages, 0 );

		expect( result.success ).toBe( true );
		expect( result.newImages ).toHaveLength( 2 );
		expect( result.newImages[ 0 ] ).toEqual( mockImages[ 1 ] );
		expect( result.newImages[ 1 ] ).toEqual( mockImages[ 2 ] );
	} );

	it( '最後の画像を削除できる', () => {
		const result = removeImageAtIndex( mockImages, 2 );

		expect( result.success ).toBe( true );
		expect( result.newImages ).toHaveLength( 2 );
		expect( result.newImages[ 0 ] ).toEqual( mockImages[ 0 ] );
		expect( result.newImages[ 1 ] ).toEqual( mockImages[ 1 ] );
	} );

	it( '単一画像を削除して空配列を返す', () => {
		const singleImage: Image[] = [ { url: 'single.jpg', id: 1 } ];
		const result = removeImageAtIndex( singleImage, 0 );

		expect( result.success ).toBe( true );
		expect( result.newImages ).toEqual( [] );
	} );

	it( '無効なインデックスの場合はエラーを返す', () => {
		const result = removeImageAtIndex( mockImages, 5 );

		expect( result.success ).toBe( false );
		expect( result.newImages ).toEqual( mockImages );
		expect( result.error ).toBe( 'Invalid image index' );
	} );

	it( '元の配列を変更しない', () => {
		const originalImages = [ ...mockImages ];
		const result = removeImageAtIndex( mockImages, 1 );

		expect( mockImages ).toEqual( originalImages );
		expect( result.newImages ).not.toBe( mockImages );
	} );
} );

describe( 'addImageToArray', () => {
	const mockImages: Image[] = [
		{ url: 'image1.jpg', id: 1 },
		{ url: 'image2.jpg', id: 2 },
	];

	it( '配列の最後に画像を追加できる', () => {
		const newImage: Image = { url: 'new-image.jpg', id: 3 };
		const result = addImageToArray( mockImages, newImage );

		expect( result.success ).toBe( true );
		expect( result.newImages ).toHaveLength( 3 );
		expect( result.newImages[ 0 ] ).toEqual( mockImages[ 0 ] );
		expect( result.newImages[ 1 ] ).toEqual( mockImages[ 1 ] );
		expect( result.newImages[ 2 ] ).toEqual( newImage );
		expect( result.error ).toBeUndefined();
	} );

	it( '空配列に画像を追加できる', () => {
		const newImage: Image = { url: 'new-image.jpg', id: 1 };
		const result = addImageToArray( [], newImage );

		expect( result.success ).toBe( true );
		expect( result.newImages ).toHaveLength( 1 );
		expect( result.newImages[ 0 ] ).toEqual( newImage );
	} );

	it( '元の配列を変更しない', () => {
		const originalImages = [ ...mockImages ];
		const newImage: Image = { url: 'new-image.jpg', id: 3 };
		const result = addImageToArray( mockImages, newImage );

		expect( mockImages ).toEqual( originalImages );
		expect( result.newImages ).not.toBe( mockImages );
	} );
} );

describe( 'imageOrderStateUpdaters - React最適化関数', () => {
	const mockImages: Image[] = [
		{ url: 'image1.jpg', id: 1 },
		{ url: 'image2.jpg', id: 2 },
		{ url: 'image3.jpg', id: 3 },
	];

	describe( 'move', () => {
		it( '画像を正常に移動できる', () => {
			const updater = imageOrderStateUpdaters.move( 1, 'moveUp' );
			const result = updater( mockImages );

			expect( result ).toHaveLength( 3 );
			expect( result[ 0 ].id ).toBe( 2 );
			expect( result[ 1 ].id ).toBe( 1 );
		} );

		it( 'エラー時は元の配列を返す（参照が同じ）', () => {
			const updater = imageOrderStateUpdaters.move( 0, 'moveUp' );
			const result = updater( mockImages );

			expect( result ).toBe( mockImages );
		} );
	} );

	describe( 'replace', () => {
		it( '画像を正常に置き換えできる', () => {
			const newImage: Image = { url: 'new.jpg', id: 99 };
			const updater = imageOrderStateUpdaters.replace( 1, newImage );
			const result = updater( mockImages );

			expect( result ).toHaveLength( 3 );
			expect( result[ 1 ] ).toEqual( newImage );
		} );

		it( 'エラー時は元の配列を返す', () => {
			const newImage: Image = { url: 'new.jpg', id: 99 };
			const updater = imageOrderStateUpdaters.replace( 5, newImage );
			const result = updater( mockImages );

			expect( result ).toBe( mockImages );
		} );
	} );

	describe( 'remove', () => {
		it( '画像を正常に削除できる', () => {
			const updater = imageOrderStateUpdaters.remove( 1 );
			const result = updater( mockImages );

			expect( result ).toHaveLength( 2 );
			expect( result[ 0 ].id ).toBe( 1 );
			expect( result[ 1 ].id ).toBe( 3 );
		} );

		it( 'エラー時は元の配列を返す', () => {
			const updater = imageOrderStateUpdaters.remove( 5 );
			const result = updater( mockImages );

			expect( result ).toBe( mockImages );
		} );
	} );

	describe( 'add', () => {
		it( '画像を正常に追加できる', () => {
			const newImage: Image = { url: 'new.jpg', id: 4 };
			const updater = imageOrderStateUpdaters.add( newImage );
			const result = updater( mockImages );

			expect( result ).toHaveLength( 4 );
			expect( result[ 3 ] ).toEqual( newImage );
		} );

		it( '空配列に画像を追加できる', () => {
			const newImage: Image = { url: 'new.jpg', id: 1 };
			const updater = imageOrderStateUpdaters.add( newImage );
			const result = updater( [] );

			expect( result ).toHaveLength( 1 );
			expect( result[ 0 ] ).toEqual( newImage );
		} );
	} );

	describe( 'React useCallbackとの統合', () => {
		it( '同じパラメータで同じ関数参照を返す（メモ化可能）', () => {
			const updater1 = imageOrderStateUpdaters.move( 1, 'moveUp' );
			const updater2 = imageOrderStateUpdaters.move( 1, 'moveUp' );

			// 関数の実行結果が同じであることを確認
			expect( updater1( mockImages ) ).toEqual( updater2( mockImages ) );
		} );
	} );
} );

describe( 'createBlockAttributeUpdaters', () => {
	it( 'setAttributesと統合して画像を移動できる', () => {
		const setAttributes = vi.fn();
		const helpers = createBlockAttributeUpdaters( setAttributes );

		helpers.moveImage( 1, 'moveUp' );

		expect( setAttributes ).toHaveBeenCalledWith( {
			images: expect.any( Function ),
		} );
	} );

	it( 'setAttributesと統合して画像を置き換えできる', () => {
		const setAttributes = vi.fn();
		const helpers = createBlockAttributeUpdaters( setAttributes );
		const newImage: Image = { url: 'new.jpg', id: 99 };

		helpers.replaceImage( 1, newImage );

		expect( setAttributes ).toHaveBeenCalledWith( {
			images: expect.any( Function ),
		} );
	} );

	it( 'setAttributesと統合して画像を削除できる', () => {
		const setAttributes = vi.fn();
		const helpers = createBlockAttributeUpdaters( setAttributes );

		helpers.removeImage( 1 );

		expect( setAttributes ).toHaveBeenCalledWith( {
			images: expect.any( Function ),
		} );
	} );

	it( 'setAttributesと統合して画像を追加できる', () => {
		const setAttributes = vi.fn();
		const helpers = createBlockAttributeUpdaters( setAttributes );
		const newImage: Image = { url: 'new.jpg', id: 4 };

		helpers.addImage( newImage );

		expect( setAttributes ).toHaveBeenCalledWith( {
			images: expect.any( Function ),
		} );
	} );

	it( 'カスタム属性名を指定できる', () => {
		const setAttributes = vi.fn();
		const helpers = createBlockAttributeUpdaters(
			setAttributes,
			'gallery'
		);

		helpers.moveImage( 0, 'moveDown' );

		expect( setAttributes ).toHaveBeenCalledWith( {
			gallery: expect.any( Function ),
		} );
	} );
} );

describe( 'validateImagesAttribute', () => {
	it( '有効な画像配列を正しく検証する', () => {
		const validImages = [
			{ url: 'image1.jpg', id: 1, alt: 'First' },
			{ url: 'image2.jpg', id: 2 },
			{ url: 'image3.jpg' },
		];

		const result = validateImagesAttribute( validImages );

		expect( result ).toEqual( validImages );
	} );

	it( 'idがstring型の画像は数値に変換される', () => {
		const images = [
			{ url: 'image1.jpg', id: '123' },
			{ url: 'image2.jpg', id: 456 },
			{ url: 'image3.jpg', id: 'abc123' }, // 無効な文字列
			{ url: 'image4.jpg', id: '123.45' }, // 浮動小数点数文字列
			{ url: 'image5.jpg', id: '0' }, // ゼロ文字列
		];

		const result = validateImagesAttribute( images );

		expect( result ).toHaveLength( 5 );
		expect( result[ 0 ].id ).toBe( 123 ); // 文字列 '123' が数値 123 に変換
		expect( result[ 1 ].id ).toBe( 456 ); // 元々数値なのでそのまま
		expect( result[ 2 ].id ).toBeUndefined(); // 無効な文字列は undefined
		expect( result[ 3 ].id ).toBe( 123 ); // '123.45' は parseInt で 123 に変換
		expect( result[ 4 ].id ).toBe( 0 ); // '0' は 0 に変換
	} );

	it( '無効な画像オブジェクトをフィルタリングする', () => {
		const mixedData = [
			{ url: 'valid.jpg', id: 1 },
			{ notUrl: 'invalid.jpg' }, // urlプロパティがない
			{ url: 123 }, // urlが文字列でない
			null,
			undefined,
			'string',
			{ url: 'valid2.jpg' },
		];

		const result = validateImagesAttribute( mixedData );

		expect( result ).toHaveLength( 2 );
		expect( result[ 0 ] ).toEqual( { url: 'valid.jpg', id: 1 } );
		expect( result[ 1 ] ).toEqual( { url: 'valid2.jpg' } );
	} );

	it( '配列でない場合は空配列を返す', () => {
		expect( validateImagesAttribute( null ) ).toEqual( [] );
		expect( validateImagesAttribute( undefined ) ).toEqual( [] );
		expect( validateImagesAttribute( 'string' ) ).toEqual( [] );
		expect( validateImagesAttribute( {} ) ).toEqual( [] );
		expect( validateImagesAttribute( 123 ) ).toEqual( [] );
	} );

	it( '空配列の場合は空配列を返す', () => {
		const result = validateImagesAttribute( [] );
		expect( result ).toEqual( [] );
	} );
} );

describe( 'wpMediaToImage', () => {
	it( 'WordPress Media objectをImageに変換する', () => {
		const wpMedia: WpMedia = {
			id: 123,
			url: 'https://example.com/image.jpg',
			alt: 'Test image',
			caption: 'Test caption',
			title: 'Test title',
		};

		const result = wpMediaToImage( wpMedia );

		expect( result ).toEqual( {
			id: 123,
			url: 'https://example.com/image.jpg',
			alt: 'Test image',
			caption: 'Test caption',
		} );
	} );

	it( 'オプショナルなプロパティがない場合は空文字列を使用する', () => {
		const wpMedia: WpMedia = {
			id: 456,
			url: 'https://example.com/minimal.jpg',
		};

		const result = wpMediaToImage( wpMedia );

		expect( result ).toEqual( {
			id: 456,
			url: 'https://example.com/minimal.jpg',
			alt: '',
			caption: '',
		} );
	} );

	it( 'sizesプロパティは無視される', () => {
		const wpMedia: WpMedia = {
			id: 789,
			url: 'https://example.com/image.jpg',
			sizes: {
				thumbnail: {
					url: 'https://example.com/thumb.jpg',
					width: 150,
					height: 150,
				},
			},
		};

		const result = wpMediaToImage( wpMedia );

		expect( result ).toEqual( {
			id: 789,
			url: 'https://example.com/image.jpg',
			alt: '',
			caption: '',
		} );
		expect( 'sizes' in result ).toBe( false );
	} );
} );

describe( 'wpMediaArrayToImages', () => {
	it( '複数のWordPress Media objectsを変換する', () => {
		const wpMediaArray: WpMedia[] = [
			{
				id: 1,
				url: 'https://example.com/image1.jpg',
				alt: 'First image',
			},
			{
				id: 2,
				url: 'https://example.com/image2.jpg',
				caption: 'Second image',
			},
			{
				id: 3,
				url: 'https://example.com/image3.jpg',
			},
		];

		const result = wpMediaArrayToImages( wpMediaArray );

		expect( result ).toHaveLength( 3 );
		expect( result[ 0 ] ).toEqual( {
			id: 1,
			url: 'https://example.com/image1.jpg',
			alt: 'First image',
			caption: '',
		} );
		expect( result[ 1 ] ).toEqual( {
			id: 2,
			url: 'https://example.com/image2.jpg',
			alt: '',
			caption: 'Second image',
		} );
		expect( result[ 2 ] ).toEqual( {
			id: 3,
			url: 'https://example.com/image3.jpg',
			alt: '',
			caption: '',
		} );
	} );

	it( '空配列の場合は空配列を返す', () => {
		const result = wpMediaArrayToImages( [] );
		expect( result ).toEqual( [] );
	} );
} );
