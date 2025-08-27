import { vi } from 'vitest';
import type { MockedFunction } from 'vitest';
import type { useSelect, useDispatch } from '@wordpress/data';
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
	useSelect: MockedFunction< typeof useSelect >;
	useDispatch: MockedFunction< typeof useDispatch >;
}

// WordPress global mock type
export interface WpGlobal {
	i18n: WpI18n;
	element: WpElement;
	components: Partial< typeof Components >;
	blockEditor: Partial< typeof BlockEditor >;
	data: WpData;
}

// Create typed WordPress mock
export const createWpMock = (): WpGlobal => ( {
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
} );

// Type guard for matchMedia mock
export interface MatchMediaMock {
	matches: boolean;
	media: string;
	onchange: null;
	addListener: MockedFunction< () => void >;
	removeListener: MockedFunction< () => void >;
	addEventListener: MockedFunction< () => void >;
	removeEventListener: MockedFunction< () => void >;
	dispatchEvent: MockedFunction< () => boolean >;
}

export const createMatchMediaMock = ( query: string ): MatchMediaMock => ( {
	matches: false,
	media: query,
	onchange: null,
	addListener: vi.fn(),
	removeListener: vi.fn(),
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
	dispatchEvent: vi.fn(),
} );

// Observer mock types
export interface ObserverMock {
	observe: MockedFunction< ( target: Element ) => void >;
	unobserve: MockedFunction< ( target: Element ) => void >;
	disconnect: MockedFunction< () => void >;
}

export const createObserverMock = (): ObserverMock => ( {
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
} );
