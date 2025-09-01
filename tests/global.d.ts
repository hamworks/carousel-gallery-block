/**
 * Global type definitions for test environment
 */

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

declare global {
	interface Window {
		wp: WpGlobal;
	}
}
