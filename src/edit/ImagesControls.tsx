/**
 * WordPress dependencies
 */
import { MediaUploadCheck } from '@wordpress/block-editor';
import { BaseControl, Button } from '@wordpress/components';
import { chevronUp, chevronDown } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import '../editor.css';
import type { Image, BlockAttributes, ImageOrderAction } from '../types';
import {
	moveImageInArray,
	removeImageAtIndex,
	addImageToArray,
	wpMediaToImage,
} from '../utils/imageOrderUtils';
import MediaControl from './MediaControl';
import { __, sprintf } from '@wordpress/i18n';

type Props = {
	images: Image[];
	setAttributes: ( attributes: Partial< BlockAttributes > ) => void;
};

const createEmptyImage = (): Image => ( {
	url: '',
	id: undefined,
	clientId: crypto.randomUUID(),
} );

const ImagesControls = ( { images, setAttributes }: Props ) => {
	const selectImage = ( index: number, props: Image ) => {
		const newImages = [ ...images ];
		newImages.splice( index, 1, props );
		setAttributes( {
			images: newImages,
		} );
	};

	const moveImage = ( index: number, action: ImageOrderAction ) => {
		const result = moveImageInArray( images, index, action );
		if ( result.success ) {
			setAttributes( { images: result.newImages } );
		}
	};

	const removeImage = ( index: number ) => {
		const result = removeImageAtIndex( images, index );
		if ( result.success ) {
			setAttributes( { images: result.newImages } );
		}
	};

	return (
		<MediaUploadCheck>
			{ images.map( ( image, index ) => (
				<div
					key={ image.clientId ?? String( image.id ?? index ) }
					className="my-4"
				>
					<BaseControl
						id={ `image-${ index }` }
						label={ sprintf(
							// translators: %d: Image position number (e.g., 1, 2, 3)
							__( 'Image %d', 'carousel-gallery-block' ),
							index + 1
						) }
					>
						<div className="my-4">
							<MediaControl
								media={ image }
								onSelect={ ( media: unknown ) => {
									try {
										// Type-safe conversion with runtime validation
										const validatedImage =
											wpMediaToImage( media );
										selectImage( index, validatedImage );
									} catch ( error ) {
										// eslint-disable-next-line no-console
										console.error(
											'Invalid media object received:',
											error
										);
									}
								} }
								onRemove={ () => removeImage( index ) }
							/>
							{ images.length > 1 && (
								<div className="wp-block-hamworks-carousel-gallery-block__image-order-controls">
									<Button
										icon={ chevronUp }
										disabled={ index === 0 }
										onClick={ () =>
											moveImage( index, 'moveUp' )
										}
										aria-label={ __(
											'Move image up',
											'carousel-gallery-block'
										) }
										variant="secondary"
										size="small"
									/>
									<Button
										icon={ chevronDown }
										disabled={ index === images.length - 1 }
										onClick={ () =>
											moveImage( index, 'moveDown' )
										}
										aria-label={ __(
											'Move image down',
											'carousel-gallery-block'
										) }
										variant="secondary"
										size="small"
									/>
								</div>
							) }
						</div>
					</BaseControl>
					<hr />
				</div>
			) ) }

			<Button
				variant="primary"
				onClick={ () => {
					const result = addImageToArray(
						images,
						createEmptyImage()
					);
					if ( result.success ) {
						setAttributes( { images: result.newImages } );
					}
				} }
			>
				{ __( 'Add', 'carousel-gallery-block' ) }
			</Button>
		</MediaUploadCheck>
	);
};

export default ImagesControls;
