import type { Image, ImageOrderAction, ImageOrderResult } from '../types';

/**
 * @description Error messages for image order operations
 * Using const assertion for better type inference and reference stability
 */
const ERROR_MESSAGES = {
	INVALID_INDEX: 'Invalid image index',
	CANNOT_MOVE_FIRST_UP: 'Cannot move first image up',
	CANNOT_MOVE_LAST_DOWN: 'Cannot move last image down',
} as const;

/**
 * @description Type-safe error message type
 */
type ErrorMessage = ( typeof ERROR_MESSAGES )[ keyof typeof ERROR_MESSAGES ];

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
 * @description Creates an error result for failed image operations
 * Optimized for React: reuses original array reference when operation fails
 * to prevent unnecessary re-renders in React.memo or useEffect dependencies
 * @param {ReadonlyArray<Image>} images - Original images array
 * @param {ErrorMessage}         error  - Error message
 * @return {ImageOrderResult} Error result object
 */
const createErrorResult = (
	images: readonly Image[],
	error: ErrorMessage
): ImageOrderResult => {
	return {
		success: false,
		// Reuse original array reference for React optimization
		// Only create new array if images is not already an Image[]
		newImages: Array.isArray( images )
			? ( images as Image[] )
			: [ ...images ],
		error,
	};
};

/**
 * @description Creates a success result for successful image operations
 * @param {ReadonlyArray<Image>} newImages - Modified images array
 * @return {ImageOrderResult} Success result object
 */
const createSuccessResult = (
	newImages: readonly Image[]
): ImageOrderResult => {
	return {
		success: true,
		newImages: [ ...newImages ],
	};
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
	// Validate input parameters
	if ( ! isValidIndex( index, images.length ) ) {
		return createErrorResult( images, ERROR_MESSAGES.INVALID_INDEX );
	}

	// Check boundary conditions
	if ( action === 'moveUp' && index === 0 ) {
		return createErrorResult( images, ERROR_MESSAGES.CANNOT_MOVE_FIRST_UP );
	}

	if ( action === 'moveDown' && index === images.length - 1 ) {
		return createErrorResult(
			images,
			ERROR_MESSAGES.CANNOT_MOVE_LAST_DOWN
		);
	}

	// Perform the move operation
	const newImages = [ ...images ];
	const targetIndex = action === 'moveUp' ? index - 1 : index + 1;

	// Swap images at the two positions
	[ newImages[ index ], newImages[ targetIndex ] ] = [
		newImages[ targetIndex ],
		newImages[ index ],
	];

	return createSuccessResult( newImages );
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
	if ( ! isValidIndex( index, images.length ) ) {
		return createErrorResult( images, ERROR_MESSAGES.INVALID_INDEX );
	}

	const newImages = [ ...images ];
	newImages[ index ] = newImage;
	return createSuccessResult( newImages );
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
	if ( ! isValidIndex( index, images.length ) ) {
		return createErrorResult( images, ERROR_MESSAGES.INVALID_INDEX );
	}

	const newImages = images.filter( ( _, i ) => i !== index );
	return createSuccessResult( newImages );
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
	const newImages = [ ...images, newImage ];
	return createSuccessResult( newImages );
};

/**
 * @description React-optimized function factories for use with useCallback
 * These functions return state updaters that work with React's setState
 * @example
 * ```typescript
 * const handleMoveUp = useCallback((index: number) => {
 *   setImages(prevImages => {
 *     const result = moveImageInArray(prevImages, index, 'moveUp');
 *     return result.success ? result.newImages : prevImages;
 *   });
 * }, []);
 * ```
 */
export const imageOrderStateUpdaters = {
	/**
	 * @param index
	 * @param action
	 * @description Create a state updater function for moving images
	 */
	createMoveUpdater:
		( index: number, action: ImageOrderAction ) =>
		( prevImages: readonly Image[] ): Image[] => {
			const result = moveImageInArray( prevImages, index, action );
			return result.success
				? result.newImages
				: ( prevImages as Image[] );
		},

	/**
	 * @param index
	 * @param newImage
	 * @description Create a state updater function for replacing images
	 */
	createReplaceUpdater:
		( index: number, newImage: Image ) =>
		( prevImages: readonly Image[] ): Image[] => {
			const result = replaceImageAtIndex( prevImages, index, newImage );
			return result.success
				? result.newImages
				: ( prevImages as Image[] );
		},

	/**
	 * @param index
	 * @description Create a state updater function for removing images
	 */
	createRemoveUpdater:
		( index: number ) =>
		( prevImages: readonly Image[] ): Image[] => {
			const result = removeImageAtIndex( prevImages, index );
			return result.success
				? result.newImages
				: ( prevImages as Image[] );
		},

	/**
	 * @param newImage
	 * @description Create a state updater function for adding images
	 */
	createAddUpdater:
		( newImage: Image ) =>
		( prevImages: readonly Image[] ): Image[] => {
			const result = addImageToArray( prevImages, newImage );
			return result.success
				? result.newImages
				: ( prevImages as Image[] );
		},
} as const;
