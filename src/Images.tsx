import type { Image } from './types';

type Props = {
	images: Image[];
};

const Images = ( { images }: Props ) => (
	<div className="wp-block-hamworks-carousel-gallery-block__images">
		{ images.map( ( image, index ) => (
			<div
				key={ image.id ?? `temp-${ Date.now() }-${ index }` }
				className="wp-block-hamworks-carousel-gallery-block__image"
			>
				{ image.url && (
					<img
						src={ image.url }
						data-id={ image.id || 0 }
						alt={ image.alt ?? `Image ${ index + 1 }` }
						loading={ index < 3 ? 'eager' : 'lazy' }
					/>
				) }
			</div>
		) ) }
	</div>
);

export default Images;
