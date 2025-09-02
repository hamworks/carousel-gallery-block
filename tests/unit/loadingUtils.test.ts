import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getEagerImageCount } from '../../src/utils/loadingUtils';

/**
 * Mock window.innerWidth property
 * @param width - Window width to set
 */
const mockWindow = ( width: number ) => {
	Object.defineProperty( window, 'innerWidth', {
		writable: true,
		configurable: true,
		value: width,
	} );
};

describe( 'getEagerImageCount', () => {
	let originalWindow: Window & typeof globalThis;

	beforeEach( () => {
		// Store original window state
		originalWindow = global.window;
	} );

	afterEach( () => {
		// Restore window state after each test to prevent contamination
		global.window = originalWindow;
		vi.restoreAllMocks();
	} );

	describe( 'Normal cases', () => {
		const normalTestCases = [
			{
				width: 599,
				expected: 1,
				description: 'width less than 600px (mobile)',
			},
			{
				width: 700,
				expected: 2,
				description: 'width between 600px and 781px (tablet)',
			},
			{
				width: 1000,
				expected: 3,
				description: 'width 782px and above (desktop)',
			},
		] as const;

		it.each( normalTestCases )(
			'should return $expected for $description',
			( { width, expected } ) => {
				mockWindow( width );

				const result = getEagerImageCount();

				expect( result ).toBe( expected );
			}
		);
	} );

	describe( 'Boundary value tests', () => {
		const boundaryTestCases = [
			{
				width: 599,
				expected: 1,
				description: 'width less than 600px (boundary)',
			},
			{
				width: 600,
				expected: 2,
				description: 'width equal to 600px (boundary)',
			},
			{
				width: 781,
				expected: 2,
				description: 'width equal to 781px (boundary)',
			},
			{
				width: 782,
				expected: 3,
				description: 'width equal to 782px (boundary)',
			},
		] as const;

		it.each( boundaryTestCases )(
			'should return $expected for $description',
			( { width, expected } ) => {
				mockWindow( width );

				const result = getEagerImageCount();

				expect( result ).toBe( expected );
			}
		);
	} );

	describe( 'Edge cases', () => {
		it( 'should return default value 2 in SSR environment (window undefined)', () => {
			// Delete window object to simulate SSR environment
			const savedWindow = global.window;
			delete ( global as any ).window;

			const result = getEagerImageCount();

			expect( result ).toBe( 2 );

			// Restore window object after test
			global.window = savedWindow;
		} );

		it( 'should return 1 for 0px (minimum value)', () => {
			mockWindow( 0 );

			const result = getEagerImageCount();

			expect( result ).toBe( 1 );
		} );

		it( 'should return 3 for very large value (9999px)', () => {
			mockWindow( 9999 );

			const result = getEagerImageCount();

			expect( result ).toBe( 3 );
		} );

		it( 'should return 1 for negative values (-100px)', () => {
			mockWindow( -100 );

			const result = getEagerImageCount();

			expect( result ).toBe( 1 );
		} );

		it( 'should return 1 for negative values (-1px)', () => {
			mockWindow( -1 );

			const result = getEagerImageCount();

			expect( result ).toBe( 1 );
		} );
	} );

	describe( 'Special value tests', () => {
		it( 'should handle NaN gracefully', () => {
			mockWindow( NaN );

			const result = getEagerImageCount();

			// NaN < 600 is false, NaN < 782 is also false, so it returns 3 (desktop)
			expect( result ).toBe( 3 );
		} );

		it( 'should handle Infinity properly', () => {
			mockWindow( Infinity );

			const result = getEagerImageCount();

			expect( result ).toBe( 3 );
		} );

		it( 'should handle negative Infinity properly', () => {
			mockWindow( -Infinity );

			const result = getEagerImageCount();

			expect( result ).toBe( 1 );
		} );
	} );

	describe( 'Type safety tests', () => {
		it( 'should always return a number type', () => {
			mockWindow( 700 );

			const result = getEagerImageCount();

			expect( typeof result ).toBe( 'number' );
			expect( Number.isInteger( result ) ).toBe( true );
			expect( result ).toBeGreaterThan( 0 );
		} );

		it( 'should return valid range values (1-3)', () => {
			const testCases = [ 500, 700, 900 ];

			testCases.forEach( ( width ) => {
				mockWindow( width );
				const result = getEagerImageCount();

				expect( result ).toBeGreaterThanOrEqual( 1 );
				expect( result ).toBeLessThanOrEqual( 3 );
			} );
		} );
	} );
} );
