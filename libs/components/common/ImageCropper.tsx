import { useRef, useState, useEffect } from 'react';
import Image from 'next/image'; // Import Next.js Image component
import { useTranslation } from 'next-i18next';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { Button } from '@/libs/components/ui/button'; // Assuming these are your UI components
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/libs/components/ui/dialog'; // Assuming these are your UI components

interface ImageCropperProps {
	isOpen: boolean;
	onClose: () => void;
	onCropComplete: (croppedFile: File) => void;
	imageUrl: string; // Data URL, object URL, or external URL for JPG, JPEG, PNG
	isCircular?: boolean;
	quality?: number; // Output JPG quality (0.0 to 1.0)
}

// Helper function to create an initial centered crop with a specific aspect ratio
function createInitialCrop(
	mediaWidth: number, // Rendered width of the image
	mediaHeight: number, // Rendered height of the image
	aspect: number, // Target aspect ratio for the crop
): Crop {
	const crop = makeAspectCrop(
		{
			unit: '%', // Start with a percentage-based selection
			width: 90, // Aim for 90% coverage of the constraining dimension
		},
		aspect,
		mediaWidth,
		mediaHeight,
	);
	// centerCrop converts the percentage crop from makeAspectCrop into pixel values.
	return centerCrop(crop, mediaWidth, mediaHeight);
}

export const ImageCropper = ({
	isOpen,
	onClose,
	onCropComplete,
	imageUrl,
	isCircular = false,
	quality = 0.92, // High quality JPG default
}: ImageCropperProps) => {
	const { t } = useTranslation('common');
	const imgRef = useRef<HTMLImageElement>(null); // Ref for the underlying <img> from Next/Image

	const isCircularOutput = isCircular;
	const cropperAspect = isCircular ? 1 : 16 / 9; // 1:1 for circular

	const [crop, setCrop] = useState<Crop>({
		unit: 'px',
		x: 0,
		y: 0,
		width: 0,
		height: 0,
	});

	// Store natural dimensions of the source image for Next/Image's aspect ratio handling
	const [sourceImageDimensions, setSourceImageDimensions] = useState<{ width: number; height: number } | null>(null);

	// Handler for Next/Image's onLoadingComplete event
	const handleImageReady = (imgElement: HTMLImageElement) => {
		const { naturalWidth, naturalHeight, width: renderedWidth, height: renderedHeight } = imgElement;

		if (naturalWidth === 0 || naturalHeight === 0) {
			console.error('Image could not be loaded or is empty (zero natural dimensions).');
			setSourceImageDimensions(null);
			setCrop({ unit: 'px', x: 0, y: 0, width: 0, height: 0 });
			return;
		}

		setSourceImageDimensions({ width: naturalWidth, height: naturalHeight });

		// Use the actual rendered dimensions of the Next/Image for initial crop calculation
		const initialCrop = createInitialCrop(renderedWidth, renderedHeight, cropperAspect);
		setCrop(initialCrop);
	};

	// Reset states when dialog closes or imageUrl changes
	useEffect(() => {
		if (!isOpen || !imageUrl) {
			// Reset if dialog is closed or imageUrl is cleared
			setSourceImageDimensions(null);
			setCrop({ unit: 'px', x: 0, y: 0, width: 0, height: 0 });
		}
	}, [isOpen, imageUrl]);

	const getCroppedImg = async (imageElement: HTMLImageElement, currentCrop: Crop): Promise<Blob> => {
		if (!currentCrop || currentCrop.width === 0 || currentCrop.height === 0) {
			throw new Error('Invalid crop dimensions. Width or height is zero.');
		}

		const canvas = document.createElement('canvas');
		// Scale factors from displayed image size (imageElement.width/height)
		// to natural image size (imageElement.naturalWidth/Height)
		const scaleX = imageElement.naturalWidth / imageElement.width;
		const scaleY = imageElement.naturalHeight / imageElement.height;

		// Crop values (x, y, width, height) are in pixels relative to the displayed image.
		// Scale these to the natural image dimensions for drawing.
		const cropXNatural = currentCrop.x * scaleX;
		const cropYNatural = currentCrop.y * scaleY;
		const cropWidthNatural = currentCrop.width * scaleX;
		const cropHeightNatural = currentCrop.height * scaleY;

		canvas.width = Math.floor(cropWidthNatural);
		canvas.height = Math.floor(cropHeightNatural);

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw new Error('Failed to get 2D rendering context');
		}

		ctx.imageSmoothingQuality = 'high';
		ctx.imageSmoothingEnabled = true;

		ctx.drawImage(
			imageElement, // This is the actual <img> element from Next/Image
			cropXNatural,
			cropYNatural,
			cropWidthNatural,
			cropHeightNatural,
			0,
			0,
			canvas.width,
			canvas.height,
		);

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

			circleCtx.beginPath();
			circleCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
			circleCtx.closePath();
			circleCtx.clip();

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

		return new Promise((resolve, reject) => {
			canvas.toBlob(
				(blob) => (blob ? resolve(blob) : reject(new Error('Rectangular canvas is empty after processing'))),
				'image/jpeg',
				quality,
			);
		});
	};

	const handlePerformCrop = async () => {
		if (!imgRef.current) {
			console.error('Image reference not available for cropping.');
			return;
		}
		if (!crop || crop.width === 0 || crop.height === 0) {
			console.error('Crop is not set or has zero dimensions. Cannot perform crop.');
			return;
		}

		try {
			const croppedImageBlob = await getCroppedImg(imgRef.current, crop);
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

	// Key for ReactCrop: ensures re-initialization if image or shape changes.
	const reactCropKey = `${imageUrl}-${isCircular}`;
	// Enable crop button only if all conditions are met
	const canCrop = !!crop && crop.width > 0 && crop.height > 0 && !!imageUrl && !!sourceImageDimensions;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px] w-[90vw]">
				<DialogHeader>
					<DialogTitle>{t('cropImage.title', 'Crop Image')}</DialogTitle>
				</DialogHeader>
				<div className="mt-4">
					<div
						className="relative w-full min-h-[200px] flex justify-center items-center bg-muted rounded-lg overflow-hidden"
						// Responsive max height for the cropper area
						style={{ maxHeight: 'clamp(200px, calc(80vh - 200px), 600px)' }}
					>
						{imageUrl ? (
							<ReactCrop
								key={reactCropKey}
								crop={crop}
								onChange={(pixelCrop) => setCrop(pixelCrop)} // Assumes pixelCrop is desired for state
								aspect={cropperAspect}
								circularCrop={isCircularOutput} // Visual cue for circular selection
								// onImageLoad prop of ReactCrop is not used here;
								// Next/Image's onLoadingComplete handles image readiness.
							>
								<Image
									ref={imgRef}
									src={imageUrl}
									alt={t('cropImage.altPreview', 'Crop preview')}
									// Provide natural width/height for Next/Image's aspect ratio calculation with layout="responsive".
									// Fallback to common large dimensions if not yet loaded to guide initial layout.
									width={sourceImageDimensions?.width || 1920}
									height={sourceImageDimensions?.height || 1080}
									layout="responsive"
									unoptimized={true} // Essential for arbitrary external URLs, data URLs, or blobs
									onLoadingComplete={handleImageReady}
									// Styling applied to the actual <img> tag rendered by Next/Image
									className="max-w-full" // Ensures it respects parent width if layout="responsive"
									style={{
										maxHeight: 'clamp(200px, calc(80vh - 200px), 600px)', // Match parent's responsive max height
										objectFit: 'contain', // Crucial: scales image down to fit, preserving aspect ratio
									}}
									priority={isOpen} // Hint to Next.js to prioritize loading this image when dialog is open
								/>
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
						<Button onClick={handlePerformCrop} disabled={!canCrop}>
							{t('cropImage.cropAndSave', 'Crop & Save')}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
