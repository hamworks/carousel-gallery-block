import '@testing-library/jest-dom/vitest';
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import type { MockedFunction } from 'vitest';
import type * as Components from '@wordpress/components';
import type * as BlockEditor from '@wordpress/block-editor';

// WordPress i18n mock types
interface WpI18n {
	__: MockedFunction< ( text: string, domain?: string ) => string >;
	_x: MockedFunction<
		( text: string, context: string, domain?: string ) => string
	>;
	_n: MockedFunction<
		(
			single: string,
			plural: string,
			number: number,
			domain?: string
		) => string
	>;
}

// WordPress element mock types
interface WpElement {
	createElement: MockedFunction< () => null >;
	Fragment: string;
}

// WordPress data mock types
interface WpData {
	useSelect: MockedFunction< typeof import('@wordpress/data').useSelect >;
	useDispatch: MockedFunction< typeof import('@wordpress/data').useDispatch >;
}

// WordPress global mock type
interface WpGlobal {
	i18n: WpI18n;
	element: WpElement;
	components: Partial< typeof Components >;
	blockEditor: Partial< typeof BlockEditor >;
	data: WpData;
}

// WordPress global mock setup with proper types
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
			createElement: vi.fn( () => null ),
			Fragment: 'Fragment',
		},
		components: {},
		blockEditor: {},
		data: {
			useSelect: vi.fn(),
			useDispatch: vi.fn(),
		},
	} as WpGlobal,
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
