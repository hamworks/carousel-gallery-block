/**
 * WordPress dependencies
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import type { BlockEditProps } from '@wordpress/blocks';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import '../editor.css';
import type { BlockAttributes } from '../types';
import ImagesControls from './ImagesControls';
import Images from '../Images';

export default function Edit( props: BlockEditProps< BlockAttributes > ) {
	const { attributes, setAttributes } = props;
	const { images, speed, direction } = attributes;

	const inspectorControls = (
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
					onChange={ ( value ) => {
						setAttributes( { speed: value } );
					} }
				/>
				<ToggleControl
					label={ __(
						'Reverse direction',
						'carousel-gallery-block'
					) }
					checked={ direction === 'rtl' }
					onChange={ ( checked ) => {
						setAttributes( { direction: checked ? 'rtl' : 'ltr' } );
					} }
				/>
				<ImagesControls
					images={ images }
					setAttributes={ setAttributes }
				/>
			</PanelBody>
		</InspectorControls>
	);

	return (
		<div { ...useBlockProps( {} ) }>
			{ inspectorControls }
			<Images images={ images } />
		</div>
	);
}
