import '@testing-library/jest-dom/vitest';
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import type { MockedFunction } from 'vitest';

// WordPress global mock setup
Object.defineProperty( window, 'wp', {
	value: {
		i18n: {
			__: vi.fn( ( text: string ) => text ) as MockedFunction<
				( text: string, domain?: string ) => string
			>,
			_x: vi.fn( ( text: string ) => text ) as MockedFunction<
				( text: string, context: string, domain?: string ) => string
			>,
			_n: vi.fn( ( single: string, plural: string, number: number ) =>
				number === 1 ? single : plural
			) as MockedFunction<
				(
					single: string,
					plural: string,
					number: number,
					domain?: string
				) => string
			>,
		},
		element: {
			createElement: vi.fn( () => null ) as MockedFunction< () => null >,
			Fragment: 'Fragment',
		},
		components: {
			Button: vi.fn( () => null ),
			Panel: vi.fn( () => null ),
			PanelBody: vi.fn( () => null ),
			PanelRow: vi.fn( () => null ),
			RangeControl: vi.fn( () => null ),
			ToggleControl: vi.fn( () => null ),
			SelectControl: vi.fn( () => null ),
		},
		blockEditor: {
			InspectorControls: vi.fn( () => null ),
			MediaUpload: vi.fn( () => null ),
			MediaPlaceholder: vi.fn( () => null ),
			useBlockProps: vi.fn( () => ( {} ) ),
		},
		data: {
			useSelect: vi.fn() as MockedFunction<
				typeof import('@wordpress/data').useSelect
			>,
			useDispatch: vi.fn() as MockedFunction<
				typeof import('@wordpress/data').useDispatch
			>,
		},
	},
	writable: true,
	configurable: true,
} );

// Mock HTMLCanvasElement.getContext for jsdom environment
HTMLCanvasElement.prototype.getContext = vi.fn( () => null );

// Mock window.matchMedia for responsive components with proper types
Object.defineProperty( window, 'matchMedia', {
	writable: true,
	value: vi.fn( ( query: string ) => ( {
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	} ) ),
} );

// IntersectionObserver mock implementation
globalThis.IntersectionObserver = class {
	readonly root: Element | null = null;
	readonly rootMargin = '';
	readonly thresholds: ReadonlyArray< number > = [];

	observe(): void {
		// Mock implementation
	}

	unobserve(): void {
		// Mock implementation
	}

	disconnect(): void {
		// Mock implementation
	}

	takeRecords(): IntersectionObserverEntry[] {
		return [];
	}
};

// ResizeObserver mock implementation
globalThis.ResizeObserver = class {
	observe(): void {
		// Mock implementation
	}

	unobserve(): void {
		// Mock implementation
	}

	disconnect(): void {
		// Mock implementation
	}
};

// Enable auto cleanup after each test
afterEach( () => {
	cleanup();
} );
