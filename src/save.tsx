/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import type { BlockAttributes } from './types';
import Images from './Images';

export default function Save( props: BlockSaveProps< BlockAttributes > ) {
	const { attributes } = props;
	const { images, speed, direction } = attributes;
	return (
		<div
			{ ...useBlockProps.save() }
			data-speed={ speed }
			data-direction={ direction }
			role="region"
			aria-label={ `Image carousel gallery with ${ images.length } images` }
		>
			<Images images={ images } />
		</div>
	);
}
