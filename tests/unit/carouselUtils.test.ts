import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
	duplicateSlides,
	calculateMinRequiredSlides,
	isDuplicationNeeded,
} from '../../src/utils/carouselUtils';

describe( 'carouselUtils', () => {
	let mockContainer: HTMLElement;
	let mockImages: HTMLElement[];

	beforeEach( () => {
		// Reset DOM
		document.body.innerHTML = '';

		// Create mock container
		mockContainer = document.createElement( 'div' );
		mockContainer.className =
			'wp-block-hamworks-carousel-gallery-block__images';

		// Create mock images
		mockImages = [];
		for ( let i = 0; i < 2; i++ ) {
			const imageDiv = document.createElement( 'div' );
			imageDiv.className =
				'wp-block-hamworks-carousel-gallery-block__image';
			// Add keen-slider__slide class as it would be added in view.ts
			imageDiv.classList.add( 'keen-slider__slide' );

			const img = document.createElement( 'img' );
			img.setAttribute( 'data-id', `image-${ i + 1 }` );
			img.src = `test-image-${ i + 1 }.jpg`;

			imageDiv.appendChild( img );
			mockImages.push( imageDiv );
			mockContainer.appendChild( imageDiv );
		}

		document.body.appendChild( mockContainer );
	} );

	describe( 'calculateMinRequiredSlides', () => {
		it( 'should calculate minimum required slides correctly', () => {
			expect( calculateMinRequiredSlides( 1.5 ) ).toBe( 3 );
			expect( calculateMinRequiredSlides( 2.5 ) ).toBe( 5 );
			expect( calculateMinRequiredSlides( 3.5 ) ).toBe( 7 );
		} );

		it( 'should handle whole numbers', () => {
			expect( calculateMinRequiredSlides( 2 ) ).toBe( 4 );
			expect( calculateMinRequiredSlides( 3 ) ).toBe( 6 );
		} );
	} );

	describe( 'isDuplicationNeeded', () => {
		it( 'should return true when duplication is needed', () => {
			expect( isDuplicationNeeded( 2, 2.5 ) ).toBe( true );
			expect( isDuplicationNeeded( 1, 1.5 ) ).toBe( true );
			expect( isDuplicationNeeded( 3, 3.5 ) ).toBe( true );
		} );

		it( 'should return false when duplication is not needed', () => {
			expect( isDuplicationNeeded( 5, 2.5 ) ).toBe( false );
			expect( isDuplicationNeeded( 7, 3.5 ) ).toBe( false );
		} );

		it( 'should handle edge cases', () => {
			expect( isDuplicationNeeded( 3, 1.5 ) ).toBe( false ); // 3 >= 3 (ceil(1.5 * 2))
			expect( isDuplicationNeeded( 4, 2 ) ).toBe( false ); // 4 >= 4 (ceil(2 * 2))
		} );
	} );

	describe( 'duplicateSlides', () => {
		it( 'should return success false when no images found', () => {
			const emptyContainer = document.createElement( 'div' );
			const result = duplicateSlides( emptyContainer, 2.5 );

			expect( result.success ).toBe( false );
			expect( result.duplicatedCount ).toBe( 0 );
			expect( result.error ).toBe( 'No images found in container' );
		} );

		it( 'should not duplicate when enough slides exist', () => {
			// Add more images to meet the requirement
			for ( let i = 2; i < 5; i++ ) {
				const imageDiv = document.createElement( 'div' );
				imageDiv.className =
					'wp-block-hamworks-carousel-gallery-block__image';
				imageDiv.classList.add( 'keen-slider__slide' );
				mockContainer.appendChild( imageDiv );
			}

			const result = duplicateSlides( mockContainer, 2.5 ); // needs 5 slides, we have 5

			expect( result.success ).toBe( true );
			expect( result.duplicatedCount ).toBe( 0 );
		} );

		it( 'should duplicate slides when needed', () => {
			const result = duplicateSlides( mockContainer, 2.5 ); // needs 5 slides, we have 2

			expect( result.success ).toBe( true );
			expect( result.duplicatedCount ).toBe( 4 ); // Need to duplicate 2 images twice to get 6 total

			// Check that slides were actually duplicated in DOM
			const allImages = mockContainer.querySelectorAll(
				'.wp-block-hamworks-carousel-gallery-block__image'
			);
			expect( allImages.length ).toBe( 6 ); // 2 original + 4 duplicated

			// Check duplicated slides have correct classes
			const duplicatedSlides = mockContainer.querySelectorAll(
				'.carousel-duplicated-slide'
			);
			expect( duplicatedSlides.length ).toBe( 4 );

			// Check that all slides have keen-slider__slide class
			allImages.forEach( ( slide ) => {
				expect( slide.classList.contains( 'keen-slider__slide' ) ).toBe(
					true
				);
			} );
		} );

		it( 'should handle data-id attributes correctly', () => {
			const result = duplicateSlides( mockContainer, 2.5 );

			expect( result.success ).toBe( true );

			// Check that duplicated images have modified data-id attributes
			const allImgs = mockContainer.querySelectorAll( 'img' );
			const dataIds = Array.from( allImgs ).map( ( img ) =>
				img.getAttribute( 'data-id' )
			);

			// Should have original ids and duplicated ids
			expect( dataIds ).toContain( 'image-1' );
			expect( dataIds ).toContain( 'image-2' );
			expect( dataIds ).toContain( 'image-1-duplicate-0' );
			expect( dataIds ).toContain( 'image-2-duplicate-0' );
		} );

		it( 'should handle images without data-id', () => {
			// Remove data-id from one image
			const img = mockContainer.querySelector( 'img' );
			img?.removeAttribute( 'data-id' );

			const result = duplicateSlides( mockContainer, 2.5 );

			expect( result.success ).toBe( true );
			expect( result.duplicatedCount ).toBe( 4 );
		} );

		it( 'should handle DOM errors gracefully', () => {
			// Mock cloneNode to throw an error
			const originalCloneNode = Element.prototype.cloneNode;

			try {
				Element.prototype.cloneNode = vi.fn( () => {
					throw new Error( 'Clone failed' );
				} );

				const result = duplicateSlides( mockContainer, 2.5 );

				expect( result.success ).toBe( false );
				expect( result.duplicatedCount ).toBe( 0 );
				expect( result.error ).toBe( 'Clone failed' );
			} finally {
				// Restore original method - this will always execute
				Element.prototype.cloneNode = originalCloneNode;
			}
		} );

		it( 'should calculate correct duplication for different perView values', () => {
			// Test with perView 1.5 (needs 3 slides, have 2, need 2 more)
			let result = duplicateSlides( mockContainer, 1.5 );
			expect( result.duplicatedCount ).toBe( 2 );

			// Reset container
			mockContainer.innerHTML = '';
			mockImages.forEach( ( img ) => {
				const clone = img.cloneNode( true ) as HTMLElement;
				mockContainer.appendChild( clone );
			} );

			// Test with perView 3.5 (needs 7 slides, have 2, need 6 more)
			result = duplicateSlides( mockContainer, 3.5 );
			expect( result.duplicatedCount ).toBe( 6 );
		} );

		it( 'should work with custom item selector', () => {
			// Create container with custom class items
			const customContainer = document.createElement( 'div' );
			for ( let i = 0; i < 2; i++ ) {
				const customItem = document.createElement( 'div' );
				customItem.className = 'custom-carousel-item';
				customItem.classList.add( 'keen-slider__slide' );

				const img = document.createElement( 'img' );
				img.setAttribute( 'data-id', `custom-image-${ i + 1 }` );
				img.src = `custom-test-image-${ i + 1 }.jpg`;

				customItem.appendChild( img );
				customContainer.appendChild( customItem );
			}

			// Test with custom selector
			const result = duplicateSlides(
				customContainer,
				2.5,
				'.custom-carousel-item'
			);

			expect( result.success ).toBe( true );
			expect( result.duplicatedCount ).toBe( 4 );

			// Verify custom items were duplicated
			const allCustomItems = customContainer.querySelectorAll(
				'.custom-carousel-item'
			);
			expect( allCustomItems.length ).toBe( 6 );

			// Verify duplicated items have correct classes
			const duplicatedItems = customContainer.querySelectorAll(
				'.carousel-duplicated-slide'
			);
			expect( duplicatedItems.length ).toBe( 4 );
		} );

		it( 'should return error when no items found with custom selector', () => {
			// Test with non-existent custom selector
			const result = duplicateSlides(
				mockContainer,
				2.5,
				'.non-existent-class'
			);

			expect( result.success ).toBe( false );
			expect( result.duplicatedCount ).toBe( 0 );
			expect( result.error ).toBe( 'No images found in container' );
		} );

		it( 'should maintain backward compatibility when no selector provided', () => {
			// Test that default behavior is unchanged
			const result = duplicateSlides( mockContainer, 2.5 );

			expect( result.success ).toBe( true );
			expect( result.duplicatedCount ).toBe( 4 );

			// Verify WordPress class items were found and duplicated
			const allImages = mockContainer.querySelectorAll(
				'.wp-block-hamworks-carousel-gallery-block__image'
			);
			expect( allImages.length ).toBe( 6 );
		} );
	} );
} );
