import KeenSlider from 'keen-slider';
import { getCarouselPerView } from './utils/loadingUtils';
import { duplicateSlides } from './utils/carouselUtils';

/**
 * @description Initializes carousel gallery blocks on page load
 * Reads data attributes for speed and direction settings, then creates KeenSlider instances
 */
document.addEventListener( 'DOMContentLoaded', () => {
	document
		.querySelectorAll< HTMLElement >(
			'.wp-block-hamworks-carousel-gallery-block'
		)
		.forEach( ( el ) => {
			el.classList.add( `is-loading` );
			const speed = el.getAttribute( 'data-speed' ) || '1';

			/**
			 * @description Reads and validates direction attribute from block element
			 * @return 'rtl' for right-to-left direction, 'ltr' for left-to-right (default)
			 */
			const rawDirection = el.getAttribute( 'data-direction' );
			const direction = rawDirection === 'rtl' ? 'rtl' : 'ltr';
			const images = el.querySelector< HTMLElement >(
				'.wp-block-hamworks-carousel-gallery-block__images'
			);
			if ( ! images ) {
				return;
			}

			// Add keen-slider class to images container for official CSS support
			images.classList.add( 'keen-slider' );

			// Add keen-slider__slide class to each image for official CSS support
			const imageElements = images.querySelectorAll(
				'.wp-block-hamworks-carousel-gallery-block__image'
			);
			imageElements.forEach( ( imageElement ) => {
				imageElement.classList.add( 'keen-slider__slide' );
			} );

			const count = images.children.length;
			const idx = count - 1;
			const duration = ( count * 2000 ) / parseInt( speed, 10 );

			const animation = { duration, easing: ( t: number ) => t };

			window.addEventListener( `load`, () => {
				el.classList.remove( `is-loading` );

				/**
				 * @description Initialize KeenSlider with error handling
				 * Applies direction (RTL/LTR) setting and creates infinite loop carousel
				 * Uses official keen-slider classes for proper CSS integration
				 * Duplicates slides if necessary for smooth looping
				 */
				try {
					const perView = getCarouselPerView();

					// Duplicate slides if necessary for smooth looping
					const duplicationResult = duplicateSlides(
						images,
						perView
					);
					if (
						! duplicationResult.success &&
						duplicationResult.error
					) {
						// eslint-disable-next-line no-console
						console.warn(
							'Slide duplication failed:',
							duplicationResult.error
						);
					}

					new KeenSlider( images, {
						loop: true,
						renderMode: 'performance',
						slides: {
							perView,
							spacing: 16,
						},
						drag: false,
						rtl: direction === 'rtl',

						created( s ) {
							s.moveToIdx( idx, true, animation );
						},
						updated( s ) {
							s.moveToIdx(
								s.track.details.abs + idx,
								true,
								animation
							);
						},
						animationEnded( s ) {
							s.moveToIdx(
								s.track.details.abs + idx,
								true,
								animation
							);
						},
					} );
				} catch ( error ) {
					/**
					 * @description Fallback handling for KeenSlider initialization errors
					 * Logs error and applies fallback class for static display
					 */
					// eslint-disable-next-line no-console
					console.error( 'Carousel initialization failed:', error );
					el.classList.add( 'carousel-fallback' );
				}
			} );
		} );
} );
