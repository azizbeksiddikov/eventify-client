import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { Button } from '@/libs/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/libs/components/ui/dialog';

interface ImageCropperProps {
	isOpen: boolean;
	onClose: () => void;
	onCropComplete: (croppedFile: File) => void;
	imageUrl: string;
	isCircular?: boolean;
	quality?: number;
}

function createInitialCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
	const crop = makeAspectCrop(
		{
			unit: '%',
			width: 90,
		},
		aspect,
		mediaWidth,
		mediaHeight,
	);
	return centerCrop(crop, mediaWidth, mediaHeight);
}

export const ImageCropper = ({
	isOpen,
	onClose,
	onCropComplete,
	imageUrl,
	isCircular = false,
	quality = 0.92,
}: ImageCropperProps) => {
	const { t } = useTranslation('common');
	const imgRef = useRef<HTMLImageElement>(null);

	const isCircularOutput = isCircular;
	const cropperAspect = isCircular ? 1 : 16 / 9;

	const [crop, setCrop] = useState<Crop>({
		unit: '%', // Changed to percentage-based for better scaling
		x: 0,
		y: 0,
		width: 0,
		height: 0,
	});

	const [imgDimensions, setImgDimensions] = useState<{
		naturalWidth: number;
		naturalHeight: number;
		renderedWidth: number;
		renderedHeight: number;
	} | null>(null);

	// Reset states when dialog closes or imageUrl changes
	useEffect(() => {
		if (!isOpen || !imageUrl) {
			setImgDimensions(null);
			setCrop({ unit: '%', x: 0, y: 0, width: 0, height: 0 });
		}
	}, [isOpen, imageUrl]);

	const imageReadyHandler = (imgElement: HTMLImageElement) => {
		const { naturalWidth, naturalHeight, width: renderedWidth, height: renderedHeight } = imgElement;

		if (naturalWidth === 0 || naturalHeight === 0) {
			console.error('Image could not be loaded or is empty (zero natural dimensions).');
			setImgDimensions(null);
			setCrop({ unit: '%', x: 0, y: 0, width: 0, height: 0 });
			return;
		}

		setImgDimensions({
			naturalWidth,
			naturalHeight,
			renderedWidth,
			renderedHeight,
		});

		// Create initial crop based on rendered dimensions
		const initialCrop = createInitialCrop(renderedWidth, renderedHeight, cropperAspect);
		setCrop(initialCrop);
	};

	const getCroppedImg = async (): Promise<Blob> => {
		if (!imgRef.current || !imgDimensions) {
			throw new Error('Image reference or dimensions not available');
		}

		if (!crop || crop.width === 0 || crop.height === 0) {
			throw new Error('Invalid crop dimensions');
		}

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		if (!ctx) {
			throw new Error('Failed to get 2D rendering context');
		}

		// Calculate the pixel values based on percentages if using percentage units
		let cropX, cropY, cropWidth, cropHeight;

		if (crop.unit === '%') {
			// Convert percentage to pixels based on the rendered dimensions
			cropX = (crop.x * imgDimensions.renderedWidth) / 100;
			cropY = (crop.y * imgDimensions.renderedHeight) / 100;
			cropWidth = (crop.width * imgDimensions.renderedWidth) / 100;
			cropHeight = (crop.height * imgDimensions.renderedHeight) / 100;
		} else {
			// Already in pixels
			cropX = crop.x;
			cropY = crop.y;
			cropWidth = crop.width;
			cropHeight = crop.height;
		}

		// Calculate scaling factors between rendered and natural image dimensions
		const scaleX = imgDimensions.naturalWidth / imgDimensions.renderedWidth;
		const scaleY = imgDimensions.naturalHeight / imgDimensions.renderedHeight;

		// Scale crop values to natural image dimensions
		const cropXNatural = cropX * scaleX;
		const cropYNatural = cropY * scaleY;
		const cropWidthNatural = cropWidth * scaleX;
		const cropHeightNatural = cropHeight * scaleY;

		// Set canvas dimensions to match the cropped area's natural size
		canvas.width = Math.round(cropWidthNatural);
		canvas.height = Math.round(cropHeightNatural);

		// Apply high-quality rendering settings
		ctx.imageSmoothingQuality = 'high';
		ctx.imageSmoothingEnabled = true;

		// Draw the cropped portion of the image onto the canvas
		ctx.drawImage(
			imgRef.current,
			cropXNatural,
			cropYNatural,
			cropWidthNatural,
			cropHeightNatural,
			0,
			0,
			canvas.width,
			canvas.height,
		);

		// Handle circular cropping if needed
		if (isCircularOutput) {
			const circleCanvas = document.createElement('canvas');
			const circleCtx = circleCanvas.getContext('2d');

			if (!circleCtx) {
				throw new Error('Failed to get 2D context for circular crop');
			}

			const size = Math.min(canvas.width, canvas.height);
			circleCanvas.width = size;
			circleCanvas.height = size;

			circleCtx.imageSmoothingQuality = 'high';
			circleCtx.imageSmoothingEnabled = true;

			// Create circular clipping path
			circleCtx.beginPath();
			circleCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
			circleCtx.closePath();
			circleCtx.clip();

			// Center the image in the circular canvas
			const offsetX = (canvas.width - size) / 2;
			const offsetY = (canvas.height - size) / 2;
			circleCtx.drawImage(canvas, offsetX, offsetY, size, size, 0, 0, size, size);

			return new Promise((resolve, reject) => {
				circleCanvas.toBlob(
					(blob) => (blob ? resolve(blob) : reject(new Error('Circular canvas is empty after processing'))),
					'image/jpeg',
					quality,
				);
			});
		}

		// Return the rectangular cropped image
		return new Promise((resolve, reject) => {
			canvas.toBlob(
				(blob) => (blob ? resolve(blob) : reject(new Error('Canvas is empty after processing'))),
				'image/jpeg',
				quality,
			);
		});
	};

	const performCropHandler = async () => {
		if (!imgRef.current || !imgDimensions) {
			console.error('Image reference or dimensions not available for cropping.');
			return;
		}

		if (!crop || crop.width === 0 || crop.height === 0) {
			console.error('Crop is not set or has zero dimensions.');
			return;
		}

		try {
			const croppedImageBlob = await getCroppedImg();
			const outputFileName = `cropped_${Date.now()}.jpg`;
			const croppedFile = new File([croppedImageBlob], outputFileName, {
				type: 'image/jpeg',
				lastModified: Date.now(),
			});

			onCropComplete(croppedFile);
			onClose();
		} catch (err) {
			console.error('Error during image cropping:', err);
			// Optionally, display an error message to the user
		}
	};

	// Key for ReactCrop: ensures re-initialization if image or shape changes
	const reactCropKey = `${imageUrl}-${isCircular}`;

	// Enable crop button only if all conditions are met
	const canCrop = !!crop && crop.width > 0 && crop.height > 0 && !!imageUrl && !!imgDimensions;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px] w-[90vw]">
				<DialogHeader>
					<DialogTitle>{t('cropImage.title', 'Crop Image')}</DialogTitle>
				</DialogHeader>
				<div className="mt-4">
					<div
						className="relative w-full min-h-[200px] flex justify-center items-center bg-muted rounded-lg overflow-hidden"
						style={{ maxHeight: 'clamp(200px, calc(80vh - 200px), 600px)' }}
					>
						{imageUrl ? (
							<ReactCrop
								key={reactCropKey}
								crop={crop}
								onChange={(c) => setCrop(c)}
								aspect={cropperAspect}
								circularCrop={isCircularOutput}
							>
								<div className="max-w-full max-h-[calc(80vh-200px)]">
									<Image
										ref={imgRef}
										src={imageUrl || '/placeholder.svg'}
										alt={t('cropImage.altPreview', 'Crop preview')}
										width={1000}
										height={1000}
										unoptimized={true}
										onLoadingComplete={imageReadyHandler}
										style={{
											maxWidth: '100%',
											maxHeight: 'calc(80vh - 200px)',
											objectFit: 'contain',
											display: 'block',
										}}
										priority={isOpen}
									/>
								</div>
							</ReactCrop>
						) : (
							<p className="text-muted-foreground p-4 text-center">
								{t('cropImage.noImage', 'No image loaded. Please provide an image URL.')}
							</p>
						)}
					</div>
					<div className="mt-6 flex justify-end gap-3">
						<Button variant="outline" onClick={onClose}>
							{t('common.cancel', 'Cancel')}
						</Button>
						<Button onClick={performCropHandler} disabled={!canCrop}>
							{t('cropImage.cropAndSave', 'Crop')}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
