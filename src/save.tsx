/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import { _n, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { BlockAttributes } from './types';
import Images from './Images';

export default function Save( props: BlockSaveProps< BlockAttributes > ) {
	const { attributes } = props;
	const { images, speed, direction } = attributes;

	const blockProps = useBlockProps.save( {
		'data-speed': speed,
		'data-direction': direction,
		role: 'region',
		'aria-label': sprintf(
			/* translators: %d: number of images in the carousel gallery */
			_n(
				'Image carousel gallery with %d image',
				'Image carousel gallery with %d images',
				images.length,
				'carousel-gallery-block'
			),
			images.length
		),
	} );

	return (
		<div { ...blockProps }>
			<Images images={ images } />
		</div>
	);
}
