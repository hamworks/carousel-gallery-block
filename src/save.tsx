/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import type { BlockEditProps } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import type { BlockAttributes } from './types';
import Images from './Images';

export default function Save( props: BlockEditProps< BlockAttributes > ) {
	const { attributes } = props;
	const { images, speed } = attributes;
	return (
		<div { ...useBlockProps.save( {} ) } data-speed={ speed }>
			<Images images={ images } />
		</div>
	);
}
