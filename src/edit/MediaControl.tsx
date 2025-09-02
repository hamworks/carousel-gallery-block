/**
 * WordPress dependencies
 */
import {
	MediaUpload,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { isBlobURL } from '@wordpress/blob';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import {
	Button,
	DropZone,
	Flex,
	FlexBlock,
	Spinner,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import '../editor.css';
import type { Image } from '../types';

type MediaControlProps = {
	onSelect: ( media: unknown ) => void;
	onRemove: () => void;
	media?: Image;
};

const MediaControl = ( { onSelect, onRemove, media }: MediaControlProps ) => {
	const [ isLoading, setIsLoading ] = useState( false );

	const mediaUpload = useSelect( ( select ) => {
		// @ts-ignore @typesの型が古いため
		return select( blockEditorStore ).getSettings().mediaUpload;
	}, [] );

	function onDropFiles( filesList: File[] ) {
		mediaUpload( {
			allowedTypes: [ 'image' ],
			filesList,
			onFileChange( [ image ]: unknown[] ) {
				if (
					image &&
					typeof image === 'object' &&
					'url' in image &&
					isBlobURL( ( image as { url: string } ).url )
				) {
					setIsLoading( true );
					return;
				}
				onSelect( image );
				setIsLoading( false );
			},
		} );
	}

	return (
		<MediaUpload
			onSelect={ onSelect }
			allowedTypes={ [ 'image' ] }
			render={ ( { open } ) => (
				<div className="relative ">
					<Button
						className={
							media?.url
								? 'flex justify-center overflow-hidden p-0 w-full !h-auto'
								: 'rounded-tl min-h-[90px] px-2 text-center bg-[#f0f0f0] justify-center w-full'
						}
						onClick={ open }
					>
						{ media?.url && (
							<img className="w-full" src={ media.url } alt="" />
						) }
						{ ! media?.url && ! isLoading && __( 'Select' ) }
						{ isLoading && <Spinner /> }
					</Button>
					{ media?.url ? (
						<Flex
							align="flex-end"
							className="absolute transition-opacity duration-[50ms] ease-[ease-out] p-2 bottom-0 opacity-0 hover:opacity-100 h-full"
						>
							<FlexBlock>
								<Button
									className="backdrop-blur-lg backdrop-saturate-[180%] grow justify-center !bg-[hsla(0,0%,100%,.75)] w-full"
									onClick={ open }
									aria-hidden="true"
								>
									{ !! media?.url
										? __( 'Replace' )
										: __( 'Select' ) }
								</Button>
							</FlexBlock>
							<FlexBlock>
								<Button
									className="backdrop-blur-lg backdrop-saturate-[180%] grow justify-center !bg-[hsla(0,0%,100%,.75)] w-full"
									onClick={ onRemove }
								>
									{ __( 'Remove' ) }
								</Button>
							</FlexBlock>
						</Flex>
					) : null }
					<DropZone onFilesDrop={ onDropFiles } />
				</div>
			) }
		/>
	);
};

export default MediaControl;
