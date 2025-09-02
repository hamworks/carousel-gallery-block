/**
 * @description Determines the number of images for eager loading based on window width
 * Uses official Gutenberg breakpoints for responsive behavior
 * @return Number of images to load eagerly
 * - Mobile (< 600px): 1 image
 * - Tablet (600px - 781px): 2 images
 * - Desktop (≥ 782px): 3 images
 * - SSR environment: 2 images (default)
 * @example
 * ```typescript
 * // Browser environment usage
 * const eagerCount = getEagerImageCount(); // 1, 2, or 3
 *
 * // SSR environment always returns 2
 * delete window; // SSR simulation
 * const defaultCount = getEagerImageCount(); // 2
 * ```
 */
export const getEagerImageCount = (): number => {
	if ( typeof window === 'undefined' ) {
		return 2; // Default value for SSR environment
	}

	const width = window.innerWidth;

	if ( width < 600 ) {
		return 1; // Mobile (Gutenberg $break-mobile: 600px)
	} else if ( width < 782 ) {
		return 2; // Tablet (Gutenberg $break-small: 782px)
	}
	return 3; // Desktop (Gutenberg $break-wide: 1080px+)
};
