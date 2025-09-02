/**
 * @description Utilities for carousel functionality
 * Pure functions for carousel behavior that don't depend on WordPress APIs
 */

/**
 * @description Duplicates slides in the carousel container to ensure smooth looping
 * When the number of images is less than the required perView value,
 * KeenSlider's loop functionality may not work properly, causing images to appear cut off.
 * This function duplicates the existing images to meet the minimum requirement.
 *
 * @param container    - The images container element
 * @param perView      - The perView value from KeenSlider configuration
 * @param itemSelector - CSS selector for carousel items (defaults to WordPress block class)
 * @return Object with success status and number of slides duplicated
 *
 * @example
 * ```typescript
 * const container = document.querySelector('.carousel-images');
 * // Using default WordPress selector
 * const result = duplicateSlides(container, 2.5);
 *
 * // Using custom selector for generic carousel
 * const customResult = duplicateSlides(container, 2.5, '.carousel-item');
 *
 * if (result.success) {
 *   console.log(`Duplicated ${result.duplicatedCount} slides`);
 * }
 * ```
 */
export const duplicateSlides = (
	container: HTMLElement,
	perView: number,
	itemSelector = '.wp-block-hamworks-carousel-gallery-block__image'
): { success: boolean; duplicatedCount: number; error?: string } => {
	try {
		const images = container.querySelectorAll( itemSelector );

		if ( images.length === 0 ) {
			return {
				success: false,
				duplicatedCount: 0,
				error: 'No images found in container',
			};
		}

		const currentImageCount = images.length;

		// Check if duplication is needed using the dedicated function
		if ( ! isDuplicationNeeded( currentImageCount, perView ) ) {
			return {
				success: true,
				duplicatedCount: 0,
			};
		}

		// Calculate minimum required slides using the dedicated function
		const minRequiredSlides = calculateMinRequiredSlides( perView );

		// Calculate how many times we need to duplicate the entire set
		const duplicationsNeeded =
			Math.ceil( minRequiredSlides / currentImageCount ) - 1;
		let totalDuplicated = 0;

		// Duplicate the images
		for ( let i = 0; i < duplicationsNeeded; i++ ) {
			images.forEach( ( originalImage ) => {
				const clone = originalImage.cloneNode( true ) as HTMLElement;

				// Add a class to identify duplicated slides for potential cleanup
				clone.classList.add( 'carousel-duplicated-slide' );

				// Ensure KeenSlider class is maintained
				clone.classList.add( 'keen-slider__slide' );

				// Update data-id to avoid conflicts (if it exists)
				const img = clone.querySelector( 'img' );
				if ( img && img.hasAttribute( 'data-id' ) ) {
					const originalId = img.getAttribute( 'data-id' );
					img.setAttribute(
						'data-id',
						`${ originalId }-duplicate-${ i }`
					);
				}

				container.appendChild( clone );
				totalDuplicated++;
			} );
		}

		return {
			success: true,
			duplicatedCount: totalDuplicated,
		};
	} catch ( error ) {
		return {
			success: false,
			duplicatedCount: 0,
			error:
				error instanceof Error
					? error.message
					: 'Unknown error occurred',
		};
	}
};

/**
 * @description Calculates the minimum required slides for smooth KeenSlider looping
 * @param perView - The perView value from KeenSlider configuration
 * @return Minimum number of slides needed
 */
export const calculateMinRequiredSlides = ( perView: number ): number => {
	return Math.ceil( perView * 2 );
};

/**
 * @description Checks if slide duplication is needed
 * @param currentImageCount - Current number of images
 * @param perView           - The perView value from KeenSlider configuration
 * @return Boolean indicating if duplication is needed
 */
export const isDuplicationNeeded = (
	currentImageCount: number,
	perView: number
): boolean => {
	const minRequired = calculateMinRequiredSlides( perView );
	return currentImageCount < minRequired;
};
