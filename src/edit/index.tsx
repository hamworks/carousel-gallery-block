/**
 * WordPress dependencies
 */
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import type { BlockEditProps } from '@wordpress/blocks';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';

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

	const handleSpeedChange = useCallback(
		( value: number | undefined ): void => {
			if ( typeof value === 'number' && value >= 1 && value <= 10 ) {
				setAttributes( { speed: value } );
			} else {
				setAttributes( { speed: 1 } );
			}
		},
		[ setAttributes ]
	);

	const handleDirectionChange = useCallback(
		( checked: boolean ): void => {
			const newDirection: BlockAttributes[ 'direction' ] = checked
				? 'rtl'
				: 'ltr';
			setAttributes( { direction: newDirection } );
		},
		[ setAttributes ]
	);

	const inspectorControls: JSX.Element = (
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
	);

	return (
		<div { ...useBlockProps() }>
			{ inspectorControls }
			<Images images={ images } />
		</div>
	);
}
