import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { Button } from '@/libs/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/libs/components/ui/dialog';

interface ImageCropperProps {
	isOpen: boolean;
	onClose: () => void;
	onCropComplete: (croppedFile: File) => void;
	imageUrl: string;
	aspectRatio?: number;
	circularCrop?: boolean;
	quality?: number;
}

export const ImageCropper = ({
	isOpen,
	onClose,
	onCropComplete,
	imageUrl,
	aspectRatio = 1,
	circularCrop = false,
	quality = 0.95,
}: ImageCropperProps) => {
	const { t } = useTranslation('common');
	const imgRef = useRef<HTMLImageElement>(null);
	const [crop, setCrop] = useState<Crop>({
		unit: '%',
		width: 80,
		height: 80,
		x: 10,
		y: 10,
	});

	const getCroppedImg = async (image: HTMLImageElement, crop: Crop): Promise<Blob> => {
		const canvas = document.createElement('canvas');
		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;

		// Set canvas size to match the crop size
		canvas.width = Math.floor(crop.width * scaleX);
		canvas.height = Math.floor(crop.height * scaleY);

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			throw new Error('No 2d context');
		}

		// Set image smoothing
		ctx.imageSmoothingQuality = 'high';
		ctx.imageSmoothingEnabled = true;

		// Draw the cropped image
		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			crop.width * scaleX,
			crop.height * scaleY,
		);

		// If circular crop is enabled, create a circular version
		if (circularCrop) {
			const circleCanvas = document.createElement('canvas');
			const circleCtx = circleCanvas.getContext('2d');
			if (!circleCtx) {
				throw new Error('No 2d context for circle');
			}

			// Set circle canvas size
			const size = Math.min(canvas.width, canvas.height);
			circleCanvas.width = size;
			circleCanvas.height = size;

			// Create circular path
			circleCtx.beginPath();
			circleCtx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
			circleCtx.closePath();
			circleCtx.clip();

			// Draw the cropped image centered in the circle
			circleCtx.drawImage(canvas, (canvas.width - size) / 2, (canvas.height - size) / 2, size, size, 0, 0, size, size);

			// Convert to blob with quality settings
			return new Promise((resolve) => {
				circleCanvas.toBlob(
					(blob) => {
						if (!blob) {
							throw new Error('Canvas is empty');
						}
						resolve(blob);
					},
					'image/jpeg',
					quality,
				);
			});
		}

		// If not circular, return the regular cropped image
		return new Promise((resolve) => {
			canvas.toBlob(
				(blob) => {
					if (!blob) {
						throw new Error('Canvas is empty');
					}
					resolve(blob);
				},
				'image/jpeg',
				quality,
			);
		});
	};

	const handleCropComplete = async () => {
		if (!imgRef.current) return;

		try {
			const croppedImageBlob = await getCroppedImg(imgRef.current, crop);

			// Create a new file with proper name and type
			const croppedFile = new File([croppedImageBlob], `cropped_${Date.now()}.jpg`, {
				type: 'image/jpeg',
				lastModified: Date.now(),
			});

			onCropComplete(croppedFile);
			onClose();
		} catch (err) {
			console.error('Error cropping image:', err);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>{t('Crop Image')}</DialogTitle>
				</DialogHeader>
				<div className="mt-4">
					<div className="relative aspect-square w-full max-h-[400px] overflow-hidden rounded-lg">
						<ReactCrop
							crop={crop}
							onChange={(c) => setCrop(c)}
							aspect={aspectRatio}
							circularCrop={circularCrop}
							className="max-w-full"
						>
							<img
								ref={imgRef}
								src={imageUrl}
								alt="Crop preview"
								className="max-w-full"
								style={{ maxHeight: '400px' }}
							/>
						</ReactCrop>
					</div>
					<div className="mt-4 flex justify-end gap-2">
						<Button variant="outline" onClick={onClose}>
							{t('Cancel')}
						</Button>
						<Button onClick={handleCropComplete}>{t('Crop & Save')}</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
