/**
 * Global type definitions for test environment
 */

import type { MockedFunction } from 'vitest';
import type * as Components from '@wordpress/components';
import type * as BlockEditor from '@wordpress/block-editor';
import type * as I18n from '@wordpress/i18n';
import type * as Element from '@wordpress/element';

// WordPress i18n mock types
interface WpI18n {
	__: MockedFunction< typeof I18n.__ >;
	_x: MockedFunction< typeof I18n._x >;
	_n: MockedFunction< typeof I18n._n >;
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
	components: Pick<
		typeof Components,
		| 'Button'
		| 'Panel'
		| 'PanelBody'
		| 'PanelRow'
		| 'RangeControl'
		| 'ToggleControl'
		| 'SelectControl'
	>;
	blockEditor: Pick<
		typeof BlockEditor,
		| 'InspectorControls'
		| 'MediaUpload'
		| 'MediaPlaceholder'
		| 'useBlockProps'
	>;
	data: WpData;
}

declare global {
	interface Window {
		wp: WpGlobal;
	}
}
