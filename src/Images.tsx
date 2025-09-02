import type { Image } from './types';
import { getEagerImageCount } from './utils/loadingUtils';

type Props = {
	images: Image[];
};

const Images = ( { images }: Props ) => {
	const eagerCount = getEagerImageCount();

	return (
		<div className="wp-block-hamworks-carousel-gallery-block__images">
			{ images.map( ( image, index ) => (
				<div
					key={ image.id ?? `${ image.url }-${ index }` }
					className="wp-block-hamworks-carousel-gallery-block__image"
				>
					{ image.url && (
						<img
							src={ image.url }
							{ ...( image.id !== undefined
								? { 'data-id': image.id }
								: {} ) }
							alt={ image.alt ?? '' }
							loading={ index < eagerCount ? 'eager' : 'lazy' }
							decoding="async"
							{ ...( index === 0
								? { fetchPriority: 'high' as const }
								: {} ) }
						/>
					) }
				</div>
			) ) }
		</div>
	);
};

export default Images;
