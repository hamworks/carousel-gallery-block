import KeenSlider from 'keen-slider';

document.addEventListener( 'DOMContentLoaded', () => {
	document
		.querySelectorAll< HTMLElement >(
			'.wp-block-hamworks-carousel-gallery-block'
		)
		.forEach( ( el ) => {
			el.classList.add( `is-loading` );
			const speed = el.getAttribute( 'data-speed' ) || '1';
			const images = el.querySelector< HTMLElement >(
				'.wp-block-hamworks-carousel-gallery-block__images'
			);
			if ( ! images ) {
				return;
			}

			/**
			 * Count を超えるまで、要素を複製。
			 * @param count
			 */
			const duplicateSlides = ( count = 1 ) => {
				const originalSlides = el.querySelectorAll(
					'.wp-block-hamworks-carousel-gallery-block__image'
				);

				if ( images && originalSlides.length > 0 ) {
					const currentSlideCount = images.children.length;
					const slidesToAdd = Math.floor( count / currentSlideCount );
					if ( slidesToAdd > 0 ) {
						for ( let i = 0; i < slidesToAdd; i++ ) {
							originalSlides.forEach( ( slide ) => {
								const clone = slide.cloneNode( true );
								images.appendChild( clone );
							} );
						}
					}
				}
			};

			duplicateSlides( 20 );

			const count = images.children.length;
			const idx = count - 1;
			const duration = ( count * 2000 ) / parseInt( speed, 10 );

			const animation = { duration, easing: ( t: number ) => t };

			window.addEventListener( `load`, () => {
				el.classList.remove( `is-loading` );
				new KeenSlider( images, {
					loop: true,
					renderMode: 'performance',
					slides: {
						perView: 'auto',
					},
					selector:
						'.wp-block-hamworks-carousel-gallery-block__image',
					drag: false,

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
			} );
		} );
} );
