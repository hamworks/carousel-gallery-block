import { describe, it, expect } from 'vitest';
import type { Image } from '../../src/types';
import {
	moveImageInArray,
	replaceImageAtIndex,
	removeImageAtIndex,
	addImageToArray,
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
