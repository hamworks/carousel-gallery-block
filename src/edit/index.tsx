/**
 * WordPress dependencies
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import type { BlockEditProps } from '@wordpress/blocks';
import {
	PanelBody,
	Placeholder,
	RangeControl,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { gallery } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import '../editor.css';
import type { BlockAttributes } from '../types';
import ImagesControls from './ImagesControls';
import Images from '../Images';

interface EditProps extends BlockEditProps< BlockAttributes > {}

export default function Edit( props: EditProps ): JSX.Element {
	const { attributes, setAttributes } = props;
	const { images, speed, direction } = attributes;

	const handleSpeedChange = ( value: number | undefined ): void => {
		if ( typeof value === 'number' && value >= 1 && value <= 10 ) {
			setAttributes( { speed: value } );
		} else {
			setAttributes( { speed: 1 } );
		}
	};

	const handleDirectionChange = ( checked: boolean ): void => {
		const newDirection: BlockAttributes[ 'direction' ] = checked
			? 'rtl'
			: 'ltr';
		setAttributes( { direction: newDirection } );
	};

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody
					title={ __( 'Media settings', 'carousel-gallery-block' ) }
					initialOpen={ true }
				>
					<RangeControl
						label={ __( 'Speed', 'carousel-gallery-block' ) }
						value={ speed }
						min={ 1 }
						max={ 10 }
						onChange={ handleSpeedChange }
					/>
					<ToggleControl
						label={ __(
							'Reverse direction',
							'carousel-gallery-block'
						) }
						checked={ direction === 'rtl' }
						onChange={ handleDirectionChange }
					/>
					<ImagesControls
						images={ images }
						setAttributes={ setAttributes }
					/>
				</PanelBody>
			</InspectorControls>
			{ images.length > 0 ? (
				<Images images={ images } />
			) : (
				<Placeholder
					icon={ gallery }
					label={ __(
						'Carousel Gallery Block',
						'carousel-gallery-block'
					) }
					instructions={ __(
						'Add images to your carousel gallery',
						'carousel-gallery-block'
					) }
				/>
			) }
		</div>
	);
}
