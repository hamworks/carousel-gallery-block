import type { Image, ImageOrderAction, ImageOrderResult } from '../types';

/**
 * @description Validates if an index is within the valid range for an array
 * @param {number} index       - Index to validate
 * @param {number} arrayLength - Length of the array
 * @return {boolean} True if index is valid, false otherwise
 */
const isValidIndex = ( index: number, arrayLength: number ): boolean => {
	return index >= 0 && index < arrayLength;
};

/**
 * @description Creates an error result for failed image operations
 * @param {Image[]} images - Original images array
 * @param {string}  error  - Error message
 * @return {ImageOrderResult} Error result object
 */
const createErrorResult = (
	images: Image[],
	error: string
): ImageOrderResult => {
	return {
		success: false,
		newImages: images,
		error,
	};
};

/**
 * @description Creates a success result for successful image operations
 * @param {Image[]} newImages - Modified images array
 * @return {ImageOrderResult} Success result object
 */
const createSuccessResult = ( newImages: Image[] ): ImageOrderResult => {
	return {
		success: true,
		newImages,
	};
};

/**
 * @description Move an image within an array to a different position
 * @param {Image[]}          images - Array of images
 * @param {number}           index  - Current index of the image to move
 * @param {ImageOrderAction} action - Move action (moveUp or moveDown)
 * @return {ImageOrderResult} Result object with success status, new array, and optional error message
 * @example
 * ```typescript
 * const images = [{ url: 'a.jpg', id: 1 }, { url: 'b.jpg', id: 2 }];
 * const result = moveImageInArray(images, 1, 'moveUp');
 * // result.newImages will be [{ url: 'b.jpg', id: 2 }, { url: 'a.jpg', id: 1 }]
 * ```
 */
export const moveImageInArray = (
	images: Image[],
	index: number,
	action: ImageOrderAction
): ImageOrderResult => {
	// Validate input parameters
	if ( ! isValidIndex( index, images.length ) ) {
		return createErrorResult( images, 'Invalid image index' );
	}

	// Check boundary conditions
	if ( action === 'moveUp' && index === 0 ) {
		return createErrorResult( images, 'Cannot move first image up' );
	}

	if ( action === 'moveDown' && index === images.length - 1 ) {
		return createErrorResult( images, 'Cannot move last image down' );
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
 * @param {Image[]} images   - Array of images
 * @param {number}  index    - Index where to replace the image
 * @param {Image}   newImage - New image to place at the index
 * @return {Image[]} New array with the image replaced
 * @example
 * ```typescript
 * const images = [{ url: 'a.jpg', id: 1 }, { url: 'b.jpg', id: 2 }];
 * const newImage = { url: 'c.jpg', id: 3 };
 * const result = replaceImageAtIndex(images, 0, newImage);
 * // result will be [{ url: 'c.jpg', id: 3 }, { url: 'b.jpg', id: 2 }]
 * ```
 */
export const replaceImageAtIndex = (
	images: Image[],
	index: number,
	newImage: Image
): Image[] => {
	if ( ! isValidIndex( index, images.length ) ) {
		return images;
	}

	const newImages = [ ...images ];
	newImages[ index ] = newImage;
	return newImages;
};

/**
 * @description Remove an image at a specific index
 * @param {Image[]} images - Array of images
 * @param {number}  index  - Index of the image to remove
 * @return {Image[]} New array with the image removed
 * @example
 * ```typescript
 * const images = [{ url: 'a.jpg', id: 1 }, { url: 'b.jpg', id: 2 }];
 * const result = removeImageAtIndex(images, 0);
 * // result will be [{ url: 'b.jpg', id: 2 }]
 * ```
 */
export const removeImageAtIndex = (
	images: Image[],
	index: number
): Image[] => {
	if ( ! isValidIndex( index, images.length ) ) {
		return images;
	}

	return images.filter( ( _, i ) => i !== index );
};

/**
 * @description Add a new image to the end of the array
 * @param {Image[]} images   - Array of images
 * @param {Image}   newImage - New image to add
 * @return {Image[]} New array with the image added
 * @example
 * ```typescript
 * const images = [{ url: 'a.jpg', id: 1 }];
 * const newImage = { url: 'b.jpg', id: 2 };
 * const result = addImageToArray(images, newImage);
 * // result will be [{ url: 'a.jpg', id: 1 }, { url: 'b.jpg', id: 2 }]
 * ```
 */
export const addImageToArray = (
	images: Image[],
	newImage: Image
): Image[] => {
	return [ ...images, newImage ];
};
