import type { Image } from './types';

type Props = {
	images: Image[];
};

const Images = ( { images }: Props ) => (
	<div className="wp-block-satori-blocks-logo-carousel__images">
		{ images.map( ( image, index ) => (
			<div
				key={ image.id || `temp-${ index }` }
				className="wp-block-satori-blocks-logo-carousel__image"
			>
				<img
					src={ image.url || '' }
					data-id={ image.id || null }
					alt={ image.alt || '' }
					loading="lazy"
				/>
			</div>
		) ) }
	</div>
);

export default Images;
