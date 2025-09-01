/**
 * Type definitions for Carousel Gallery Block
 */

/**
 * @description WordPress media item type with complete metadata
 * Matches the structure of WordPress Media Library objects
 */
export type WpMedia = {
	id: number;
	url: string;
	alt?: string;
	caption?: string;
	title?: string;
	link?: string;
	sizes?: {
		[ key: string ]: {
			url: string;
			width: number;
			height: number;
		};
	};
};

/**
 * @description Block attributes for the carousel gallery
 */
export type BlockAttributes = {
	images: Image[];
	breakpoint: number;
	speed: number;
	direction: 'ltr' | 'rtl'; // New attribute for carousel direction
	allowedBlocks: string[];
	templateLock?: 'all' | 'insert' | 'contentOnly' | false;
};

export type ImageProps = {
	url: string;
	id: number | undefined;
};

export type Image = {
	url: string;
	id: number | undefined;
	alt?: string;
	caption?: string;
};

export interface Media {
	id: number | undefined;
	[ key: string ]: any;
}

/**
 * @description Action types for image order management
 */
export type ImageOrderAction = 'moveUp' | 'moveDown';

/**
 * @description Result type for image order operations
 */
export interface ImageOrderResult {
	success: boolean;
	newImages: Image[];
	error?: string;
}

// WordPress global types for tests
declare global {
	interface Window {
		wp: {
			i18n: {
				__: ( text: string ) => string;
				_x: ( text: string ) => string;
				_n: (
					single: string,
					plural: string,
					number: number
				) => string;
			};
			element: {
				createElement: () => null;
				Fragment: string;
			};
			components: any;
			blockEditor: any;
			data: {
				useSelect: () => any;
				useDispatch: () => any;
			};
		};
	}
}
