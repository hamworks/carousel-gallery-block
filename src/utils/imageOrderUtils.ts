import type {
	Image,
	ImageOrderAction,
	ImageOrderResult,
	WpMedia,
} from '../types';
import { __ } from '@wordpress/i18n';

/**
 * @description Error messages for image order operations with WordPress i18n support
 * Using function calls for internationalization compatibility
 */
const getErrorMessages = () => ( {
	INVALID_INDEX: __( 'Invalid image index', 'carousel-gallery-block' ),
	CANNOT_MOVE_FIRST_UP: __(
		'Cannot move first image up',
		'carousel-gallery-block'
	),
	CANNOT_MOVE_LAST_DOWN: __(
		'Cannot move last image down',
		'carousel-gallery-block'
	),
} );

/**
 * @description Cached error messages (evaluated once per runtime)
 */
const ERROR_MESSAGES = getErrorMessages();

/**
 * @description Type-safe error message type
 */
type ErrorMessage = string; // Changed to string for i18n compatibility

/**
 * @description Validates if an index is within the valid range for an array
 * @param {number} index       - Index to validate
 * @param {number} arrayLength - Length of the array
 * @return {boolean} True if index is valid, false otherwise
 */
const isValidIndex = ( index: number, arrayLength: number ): boolean => {
	return Number.isInteger( index ) && index >= 0 && index < arrayLength;
};

/**
 * @description Creates a result object for image operations
 * Optimized for React: reuses original array reference when operation fails
 * to prevent unnecessary re-renders in React.memo or useEffect dependencies
 * @param {ReadonlyArray<Image>} images  - Original or modified images array
 * @param {boolean}              success - Whether the operation succeeded
 * @param {ErrorMessage}         error   - Optional error message for failed operations
 * @return {ImageOrderResult} Result object
 */
const createResult = (
	images: readonly Image[],
	success: boolean,
	error?: ErrorMessage
): ImageOrderResult => {
	const newImages = Array.isArray( images )
		? ( images as Image[] )
		: [ ...images ];

	return success
		? { success: true, newImages }
		: { success: false, newImages, error: error! };
};

/**
 * @description Executes array operations safely with validation
 * @param {ReadonlyArray<Image>} images        - Input images array
 * @param {number}               index         - Index to validate
 * @param {Function}             operation     - Function to execute if validation passes
 * @param {ErrorMessage}         indexError    - Error to return if index is invalid
 * @param {ErrorMessage}         boundaryError - Optional boundary-specific error
 * @return {ImageOrderResult} Result of the operation
 */
const executeArrayOperation = (
	images: readonly Image[],
	index: number,
	operation: ( images: readonly Image[], index: number ) => readonly Image[],
	indexError: ErrorMessage,
	boundaryError?: ErrorMessage
): ImageOrderResult => {
	if ( ! isValidIndex( index, images.length ) ) {
		return createResult( images, false, indexError );
	}

	if ( boundaryError ) {
		return createResult( images, false, boundaryError );
	}

	try {
		const newImages = operation( images, index );
		return createResult( newImages, true );
	} catch {
		return createResult( images, false, indexError );
	}
};

/**
 * @description Move an image within an array to a different position
 * @param {ReadonlyArray<Image>} images - Array of images
 * @param {number}               index  - Current index of the image to move
 * @param {ImageOrderAction}     action - Move action (moveUp or moveDown)
 * @return {ImageOrderResult} Result object with success status, new array, and optional error message
 * @example
 * ```typescript
 * const images = [{ url: 'a.jpg', id: 1 }, { url: 'b.jpg', id: 2 }] as const;
 * const result = moveImageInArray(images, 1, 'moveUp');
 * // result.newImages will be [{ url: 'b.jpg', id: 2 }, { url: 'a.jpg', id: 1 }]
 * ```
 */
export const moveImageInArray = (
	images: readonly Image[],
	index: number,
	action: ImageOrderAction
): ImageOrderResult => {
	// Check boundary conditions first
	let boundaryError: ErrorMessage | undefined;
	if ( action === 'moveUp' && index === 0 ) {
		boundaryError = ERROR_MESSAGES.CANNOT_MOVE_FIRST_UP;
	} else if ( action === 'moveDown' && index === images.length - 1 ) {
		boundaryError = ERROR_MESSAGES.CANNOT_MOVE_LAST_DOWN;
	} else {
		boundaryError = undefined;
	}

	// Execute move operation using unified handler
	return executeArrayOperation(
		images,
		index,
		( imgs, idx ) => {
			const newImages = [ ...imgs ];
			const targetIndex = action === 'moveUp' ? idx - 1 : idx + 1;
			[ newImages[ idx ], newImages[ targetIndex ] ] = [
				newImages[ targetIndex ],
				newImages[ idx ],
			];
			return newImages;
		},
		ERROR_MESSAGES.INVALID_INDEX,
		boundaryError
	);
};

/**
 * @description Replace an image at a specific index with a new image
 * @param {ReadonlyArray<Image>} images   - Array of images
 * @param {number}               index    - Index where to replace the image
 * @param {Image}                newImage - New image to place at the index
 * @return {ImageOrderResult} Result object with success status, new array, and optional error message
 * @example
 * ```typescript
 * const images = [{ url: 'a.jpg', id: 1 }, { url: 'b.jpg', id: 2 }] as const;
 * const newImage = { url: 'c.jpg', id: 3 };
 * const result = replaceImageAtIndex(images, 0, newImage);
 * // result.newImages will be [{ url: 'c.jpg', id: 3 }, { url: 'b.jpg', id: 2 }]
 * ```
 */
export const replaceImageAtIndex = (
	images: readonly Image[],
	index: number,
	newImage: Image
): ImageOrderResult => {
	return executeArrayOperation(
		images,
		index,
		( imgs, idx ) => {
			const newImages = [ ...imgs ];
			newImages[ idx ] = newImage;
			return newImages;
		},
		ERROR_MESSAGES.INVALID_INDEX
	);
};

/**
 * @description Remove an image at a specific index
 * @param {ReadonlyArray<Image>} images - Array of images
 * @param {number}               index  - Index of the image to remove
 * @return {ImageOrderResult} Result object with success status, new array, and optional error message
 * @example
 * ```typescript
 * const images = [{ url: 'a.jpg', id: 1 }, { url: 'b.jpg', id: 2 }] as const;
 * const result = removeImageAtIndex(images, 0);
 * // result.newImages will be [{ url: 'b.jpg', id: 2 }]
 * ```
 */
export const removeImageAtIndex = (
	images: readonly Image[],
	index: number
): ImageOrderResult => {
	return executeArrayOperation(
		images,
		index,
		( imgs, idx ) => imgs.filter( ( _, i ) => i !== idx ),
		ERROR_MESSAGES.INVALID_INDEX
	);
};

/**
 * @description Add a new image to the end of the array
 * @param {ReadonlyArray<Image>} images   - Array of images
 * @param {Image}                newImage - New image to add
 * @return {ImageOrderResult} Result object with success status, new array, and optional error message
 * @example
 * ```typescript
 * const images = [{ url: 'a.jpg', id: 1 }] as const;
 * const newImage = { url: 'b.jpg', id: 2 };
 * const result = addImageToArray(images, newImage);
 * // result.newImages will be [{ url: 'a.jpg', id: 1 }, { url: 'b.jpg', id: 2 }]
 * ```
 */
export const addImageToArray = (
	images: readonly Image[],
	newImage: Image
): ImageOrderResult => {
	return createResult( [ ...images, newImage ], true );
};

/**
 * @description Create a state updater function for moving images
 * @param {number}           index  - Index of the image to move
 * @param {ImageOrderAction} action - Move action (moveUp or moveDown)
 * @return {Function} State updater function for React setState
 */
const createMoveStateUpdater = ( index: number, action: ImageOrderAction ) => {
	return ( prevImages: readonly Image[] ): Image[] => {
		const result = moveImageInArray( prevImages, index, action );
		return result.success ? result.newImages : ( prevImages as Image[] );
	};
};

/**
 * @description Create a state updater function for replacing images
 * @param {number} index    - Index of the image to replace
 * @param {Image}  newImage - New image to place at the index
 * @return {Function} State updater function for React setState
 */
const createReplaceStateUpdater = ( index: number, newImage: Image ) => {
	return ( prevImages: readonly Image[] ): Image[] => {
		const result = replaceImageAtIndex( prevImages, index, newImage );
		return result.success ? result.newImages : ( prevImages as Image[] );
	};
};

/**
 * @description Create a state updater function for removing images
 * @param {number} index - Index of the image to remove
 * @return {Function} State updater function for React setState
 */
const createRemoveStateUpdater = ( index: number ) => {
	return ( prevImages: readonly Image[] ): Image[] => {
		const result = removeImageAtIndex( prevImages, index );
		return result.success ? result.newImages : ( prevImages as Image[] );
	};
};

/**
 * @description Create a state updater function for adding images
 * @param {Image} newImage - New image to add to the array
 * @return {Function} State updater function for React setState
 */
const createAddStateUpdater = ( newImage: Image ) => {
	return ( prevImages: readonly Image[] ): Image[] => {
		const result = addImageToArray( prevImages, newImage );
		return result.success ? result.newImages : ( prevImages as Image[] );
	};
};

/**
 * @description React-optimized function factories for use with useCallback
 * These functions return state updaters that work with React's setState
 * @example
 * ```typescript
 * const handleMoveUp = useCallback(imageOrderStateUpdaters.move(index, 'moveUp'), [index]);
 * ```
 */
export const imageOrderStateUpdaters = {
	/**
	 * @description Create a state updater function for moving images
	 */
	move: createMoveStateUpdater,

	/**
	 * @description Create a state updater function for replacing images
	 */
	replace: createReplaceStateUpdater,

	/**
	 * @description Create a state updater function for removing images
	 */
	remove: createRemoveStateUpdater,

	/**
	 * @description Create a state updater function for adding images
	 */
	add: createAddStateUpdater,
} as const;

/**
 * @description WordPress Block attributes integration helper
 * Creates updater functions that work with WordPress block's setAttributes
 * @param {Function} setAttributes - Block's setAttributes function
 * @param {Function} getImages     - Function to retrieve current images array
 * @param {string}   attributeName - Name of the attribute containing images array
 * @return Object with WordPress-integrated image manipulation methods
 * @example
 * ```typescript
 * const imageHelpers = createBlockAttributeUpdaters(
 *   setAttributes,
 *   () => attributes.images,
 *   'images'
 * );
 * imageHelpers.moveImage(0, 'moveDown');
 * ```
 */
export const createBlockAttributeUpdaters = < T extends string >(
	setAttributes: ( attrs: Partial< Record< T, Image[] > > ) => void,
	getImages: () => readonly Image[],
	attributeName: T
) => {
	const updateImages = (
		operation: ( images: readonly Image[] ) => Image[]
	) => {
		const currentImages = getImages();
		const newImages = operation( currentImages );
		setAttributes( {
			[ attributeName ]: newImages,
		} as Partial< Record< T, Image[] > > );
	};

	return {
		moveImage: ( index: number, action: ImageOrderAction ) =>
			updateImages( imageOrderStateUpdaters.move( index, action ) ),
		replaceImage: ( index: number, newImage: Image ) =>
			updateImages( imageOrderStateUpdaters.replace( index, newImage ) ),
		removeImage: ( index: number ) =>
			updateImages( imageOrderStateUpdaters.remove( index ) ),
		addImage: ( newImage: Image ) =>
			updateImages( imageOrderStateUpdaters.add( newImage ) ),
	};
};

/**
 * @description Validates images array for WordPress block attributes
 * Ensures type safety when receiving images from block attributes
 * @param {unknown} images - Raw images data from block attributes
 * @return {Image[]} Validated and typed images array
 * @example
 * ```typescript
 * const safeImages = validateImagesAttribute(attributes.images);
 * ```
 */
export const validateImagesAttribute = ( images: unknown ): Image[] => {
	if ( ! Array.isArray( images ) ) {
		return [];
	}

	return images
		.filter( ( image ): image is Image => {
			return (
				image &&
				typeof image === 'object' &&
				'url' in image &&
				typeof image.url === 'string' &&
				( ! ( 'id' in image ) ||
					typeof image.id === 'number' ||
					typeof image.id === 'string' )
			);
		} )
		.map( ( image ) => {
			// Normalize string id to number, or set to undefined if conversion fails
			if ( 'id' in image && typeof image.id === 'string' ) {
				const parsedId = parseInt( image.id, 10 );
				return {
					...image,
					id: Number.isNaN( parsedId ) ? undefined : parsedId,
				};
			}
			return image;
		} );
};

/**
 * @description Convert WordPress media object to Image type
 * Integrates with WordPress Media Library selection
 * @param {WpMedia} media - WordPress media object from Media Library
 * @return {Image} Converted image object
 * @example
 * ```typescript
 * const onSelectMedia = (media: WpMedia) => {
 *   const image = wpMediaToImage(media);
 *   addImage(image);
 * };
 * ```
 */
export const wpMediaToImage = ( media: WpMedia ): Image => ( {
	id: media.id,
	url: media.url,
	alt: media.alt || '',
	caption: media.caption || '',
} );

/**
 * @description Convert multiple WordPress media objects to Image array
 * @param {WpMedia[]} mediaArray - Array of WordPress media objects
 * @return {Image[]} Array of converted image objects
 */
export const wpMediaArrayToImages = ( mediaArray: WpMedia[] ): Image[] => {
	return mediaArray.map( wpMediaToImage );
};
