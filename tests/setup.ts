import '@testing-library/jest-dom';

// WordPress global mock setup
Object.defineProperty( window, 'wp', {
	value: {
		i18n: {
			__: ( text: string ) => text,
			_x: ( text: string ) => text,
			_n: ( single: string, plural: string, number: number ) =>
				number === 1 ? single : plural,
		},
		element: {
			createElement: () => null,
			Fragment: 'Fragment',
		},
		components: {},
		blockEditor: {},
		data: {
			useSelect: () => ( {} ),
			useDispatch: () => ( {} ),
		},
	},
	writable: true,
} );

// Mock HTMLCanvasElement.getContext for jsdom environment
HTMLCanvasElement.prototype.getContext = vi.fn();

// Mock window.matchMedia for responsive components
Object.defineProperty( window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation( ( query ) => ( {
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	} ) ),
} );

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation( () => ( {
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
} ) );

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation( () => ( {
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
} ) );

// Enable auto cleanup after each test
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach( () => {
	cleanup();
} );
