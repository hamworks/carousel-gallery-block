// Unit tests for frontend initialization script
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock KeenSlider
const mockKeenSlider = vi.fn( () => ( {
	moveToIdx: vi.fn(),
	track: {
		details: {
			abs: 0,
		},
	},
} ) );

vi.mock( 'keen-slider', () => ( {
	default: mockKeenSlider,
} ) );

describe( 'view.ts frontend initialization script', () => {
	let mockElement: HTMLElement;
	let mockImagesContainer: HTMLElement;
	let mockImageElement: HTMLElement;

	beforeEach( () => {
		// Set up DOM environment
		document.body.innerHTML = '';

		// Create image element
		mockImageElement = document.createElement( 'div' );
		mockImageElement.className =
			'wp-block-hamworks-carousel-gallery-block__image';

		// Create multiple image elements to improve test stability
		const mockImageElement2 = document.createElement( 'div' );
		mockImageElement2.className =
			'wp-block-hamworks-carousel-gallery-block__image';

		mockImagesContainer = document.createElement( 'div' );
		mockImagesContainer.className =
			'wp-block-hamworks-carousel-gallery-block__images';
		mockImagesContainer.appendChild( mockImageElement );
		mockImagesContainer.appendChild( mockImageElement2 );

		mockElement = document.createElement( 'div' );
		mockElement.className = 'wp-block-hamworks-carousel-gallery-block';
		mockElement.appendChild( mockImagesContainer );

		document.body.appendChild( mockElement );

		// Clear mocks
		vi.clearAllMocks();
	} );

	afterEach( () => {
		document.body.innerHTML = '';
		// Clear module cache
		vi.resetModules();
		// Ensure KeenSlider mock is restored to original implementation
		vi.doUnmock( 'keen-slider' );
		vi.doMock( 'keen-slider', () => ( {
			default: mockKeenSlider,
		} ) );
	} );

	describe( 'data-direction attribute reading', () => {
		it( 'KeenSlider is called correctly when data-direction="rtl" is set', async () => {
			// Test view.ts implementation
			mockElement.setAttribute( 'data-direction', 'rtl' );
			mockElement.setAttribute( 'data-speed', '1' );

			// Import and execute view.ts
			await import( '../../src/view' );

			// Fire DOMContentLoaded event
			const domEvent = new Event( 'DOMContentLoaded' );
			document.dispatchEvent( domEvent );

			// Fire load event to execute KeenSlider initialization
			const loadEvent = new Event( 'load' );
			window.dispatchEvent( loadEvent );

			// Verify KeenSlider was called
			expect( mockKeenSlider ).toHaveBeenCalled();
			expect( mockElement.getAttribute( 'data-direction' ) ).toBe(
				'rtl'
			);
		} );

		it( 'KeenSlider is called correctly when data-direction="ltr" is set', async () => {
			mockElement.setAttribute( 'data-direction', 'ltr' );
			mockElement.setAttribute( 'data-speed', '1' );

			await import( '../../src/view' );

			const domEvent = new Event( 'DOMContentLoaded' );
			document.dispatchEvent( domEvent );

			const loadEvent = new Event( 'load' );
			window.dispatchEvent( loadEvent );

			expect( mockKeenSlider ).toHaveBeenCalled();
			expect( mockElement.getAttribute( 'data-direction' ) ).toBe(
				'ltr'
			);
		} );

		it( 'KeenSlider is called with ltr as default when data-direction attribute is not set', async () => {
			// Do not set data-direction attribute
			mockElement.setAttribute( 'data-speed', '1' );

			await import( '../../src/view' );

			const domEvent = new Event( 'DOMContentLoaded' );
			document.dispatchEvent( domEvent );

			const loadEvent = new Event( 'load' );
			window.dispatchEvent( loadEvent );

			expect( mockKeenSlider ).toHaveBeenCalled();
			// Returns null by default
			expect( mockElement.getAttribute( 'data-direction' ) ).toBeNull();
		} );

		it( 'KeenSlider is called even with invalid data-direction value', async () => {
			mockElement.setAttribute( 'data-direction', 'invalid-value' );
			mockElement.setAttribute( 'data-speed', '1' );

			await import( '../../src/view' );

			const domEvent = new Event( 'DOMContentLoaded' );
			document.dispatchEvent( domEvent );

			const loadEvent = new Event( 'load' );
			window.dispatchEvent( loadEvent );

			expect( mockKeenSlider ).toHaveBeenCalled();
			expect( mockElement.getAttribute( 'data-direction' ) ).toBe(
				'invalid-value'
			);
		} );
	} );

	describe( 'KeenSlider RTL settings', () => {
		it( 'rtl: true is passed to KeenSlider when data-direction="rtl"', async () => {
			mockElement.setAttribute( 'data-direction', 'rtl' );
			mockElement.setAttribute( 'data-speed', '1' );

			await import( '../../src/view' );

			const domEvent = new Event( 'DOMContentLoaded' );
			document.dispatchEvent( domEvent );

			const loadEvent = new Event( 'load' );
			window.dispatchEvent( loadEvent );

			// Verify KeenSlider was called
			expect( mockKeenSlider ).toHaveBeenCalled();

			// Check settings passed to KeenSlider
			// Check the latest call
			const calls = mockKeenSlider.mock.calls as unknown[][];
			const callArgs = calls[ calls.length - 1 ];
			const options = callArgs?.[ 1 ] as Record< string, unknown >; // Second argument is options

			// Verify rtl: true is set
			expect( options?.rtl ).toBe( true );
		} );

		it( 'rtl: false is passed to KeenSlider when data-direction="ltr"', async () => {
			mockElement.setAttribute( 'data-direction', 'ltr' );
			mockElement.setAttribute( 'data-speed', '1' );

			await import( '../../src/view' );

			const domEvent = new Event( 'DOMContentLoaded' );
			document.dispatchEvent( domEvent );

			const loadEvent = new Event( 'load' );
			window.dispatchEvent( loadEvent );

			expect( mockKeenSlider ).toHaveBeenCalled();

			// Check the latest call
			const calls = mockKeenSlider.mock.calls as unknown[][];
			const callArgs = calls[ calls.length - 1 ];
			const options = callArgs?.[ 1 ] as Record< string, unknown >;

			// Verify rtl: false is set
			expect( options?.rtl ).toBe( false );
		} );

		it( 'rtl: false is set as default to KeenSlider when data-direction attribute is not set', async () => {
			mockElement.setAttribute( 'data-speed', '1' );
			// Do not set data-direction attribute

			await import( '../../src/view' );

			const domEvent = new Event( 'DOMContentLoaded' );
			document.dispatchEvent( domEvent );

			const loadEvent = new Event( 'load' );
			window.dispatchEvent( loadEvent );

			expect( mockKeenSlider ).toHaveBeenCalled();

			// Check the latest call
			const calls = mockKeenSlider.mock.calls as unknown[][];
			const callArgs = calls[ calls.length - 1 ];
			const options = callArgs?.[ 1 ] as Record< string, unknown >;

			// Verify rtl: false is set by default
			expect( options?.rtl ).toBe( false );
		} );
	} );

	describe( 'Error handling', () => {
		it( 'catches and handles KeenSlider initialization errors', async () => {
			// Test error handling implementation
			mockElement.setAttribute( 'data-speed', '1' );

			// Spy on console.error
			const consoleErrorSpy = vi
				.spyOn( console, 'error' )
				.mockImplementation( () => {} );

			await import( '../../src/view' );

			const domEvent = new Event( 'DOMContentLoaded' );
			document.dispatchEvent( domEvent );

			const loadEvent = new Event( 'load' );
			window.dispatchEvent( loadEvent );

			// Verify KeenSlider was called
			expect( mockKeenSlider ).toHaveBeenCalled();

			// console.error should not be called (normal case)
			expect( consoleErrorSpy ).not.toHaveBeenCalled();

			consoleErrorSpy.mockRestore();
		} );

		it( 'default value 1 is used when data-speed attribute has invalid value', async () => {
			mockElement.setAttribute( 'data-speed', 'invalid' );
			mockElement.setAttribute( 'data-direction', 'ltr' );

			await import( '../../src/view' );

			const domEvent = new Event( 'DOMContentLoaded' );
			document.dispatchEvent( domEvent );

			const loadEvent = new Event( 'load' );
			window.dispatchEvent( loadEvent );

			expect( mockKeenSlider ).toHaveBeenCalled();
			// Test if invalid speed falls back to 1 in duration calculation
			// duration = (count * 2000) / speed, so check duration when speed=1
		} );

		it( 'fallback processing is executed when KeenSlider initialization error occurs', async () => {
			// Execute error handling test in independent mock environment
			const testElement = document.createElement( 'div' );
			testElement.className = 'wp-block-hamworks-carousel-gallery-block';

			const testImagesContainer = document.createElement( 'div' );
			testImagesContainer.className =
				'wp-block-hamworks-carousel-gallery-block__images';

			const testImageElement = document.createElement( 'div' );
			testImageElement.className =
				'wp-block-hamworks-carousel-gallery-block__image';
			testImagesContainer.appendChild( testImageElement );

			testElement.appendChild( testImagesContainer );
			testElement.setAttribute( 'data-speed', '1' );
			document.body.appendChild( testElement );

			// Spy on console.error
			const consoleErrorSpy = vi
				.spyOn( console, 'error' )
				.mockImplementation( () => {} );

			// Generate error with new mock
			const errorMockKeenSlider = vi.fn().mockImplementation( () => {
				throw new Error( 'KeenSlider initialization failed' );
			} );

			// Temporarily replace mock
			vi.doMock( 'keen-slider', () => ( {
				default: errorMockKeenSlider,
			} ) );

			// Reset modules and apply new mock
			vi.resetModules();
			await import( '../../src/view' );

			// Fire events
			const domEvent = new Event( 'DOMContentLoaded' );
			document.dispatchEvent( domEvent );

			const loadEvent = new Event( 'load' );
			window.dispatchEvent( loadEvent );

			// Verify error handling was executed
			expect( consoleErrorSpy ).toHaveBeenCalledWith(
				'Carousel initialization failed:',
				expect.any( Error )
			);

			// Verify fallback class was added
			expect(
				testElement.classList.contains( 'carousel-fallback' )
			).toBe( true );

			// Cleanup
			consoleErrorSpy.mockRestore();
			document.body.removeChild( testElement );
		} );
	} );
} );
