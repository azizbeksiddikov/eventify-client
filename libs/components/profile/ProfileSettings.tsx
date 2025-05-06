import { useState, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { ImageIcon, RefreshCw } from 'lucide-react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { Button } from '@/libs/components/ui/button';
import { Input } from '@/libs/components/ui/input';
import { Label } from '@/libs/components/ui/label';
import { Textarea } from '@/libs/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/libs/components/ui/dialog';

import { REACT_APP_API_GRAPHQL_URL, REACT_APP_API_URL, imageTypes } from '@/libs/config';
import { getJwtToken } from '@/libs/auth';
import { smallError } from '@/libs/alert';
import { MemberUpdateInput } from '@/libs/types/member/member.update';
import { Message } from '@/libs/enums/common.enum';
import { formatPhoneNumber } from '@/libs/utils';

interface ProfileSettingsProps {
	handleUpdateMember: (data: MemberUpdateInput) => void;
	memberUpdateInput: MemberUpdateInput;
	setMemberUpdateInput: (data: MemberUpdateInput) => void;
}

export const ProfileSettings = ({
	handleUpdateMember,
	memberUpdateInput,
	setMemberUpdateInput,
}: ProfileSettingsProps) => {
	const { t } = useTranslation('common');
	const token = getJwtToken();
	const imgRef = useRef<HTMLImageElement>(null);

	const [imagePreview, setImagePreview] = useState<string | null>(
		memberUpdateInput.memberImage ? `${REACT_APP_API_URL}/${memberUpdateInput.memberImage}` : null,
	);
	const [cropModalOpen, setCropModalOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [crop, setCrop] = useState<Crop>({
		unit: '%',
		width: 100,
		height: 100,
		x: 0,
		y: 0,
	});
	const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);

	/** HANDLERS */

	const handlePhoneChange = (value: string) => {
		const formattedNumber = formatPhoneNumber(value);
		setMemberUpdateInput({ ...memberUpdateInput, memberPhone: formattedNumber });
	};

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

		// Create a new canvas for the circular crop
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
				0.95, // High quality JPEG
			);
		});
	};

	const handleCropComplete = async () => {
		if (!imgRef.current || !selectedFile) return;

		try {
			const croppedImageBlob = await getCroppedImg(imgRef.current, crop);

			// Create a new file with proper name and type
			const croppedFile = new File([croppedImageBlob], `profile_${Date.now()}.jpg`, {
				type: 'image/jpeg',
				lastModified: Date.now(),
			});

			await uploadImage(croppedFile);
			setCropModalOpen(false);
			setSelectedFile(null);
			setTempImageUrl(null);
		} catch (err) {
			console.error('Error cropping image:', err);
			smallError(t('Failed to crop image'));
		}
	};

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			const imageUrl = URL.createObjectURL(file);
			setTempImageUrl(imageUrl);
			setCropModalOpen(true);
		}
	};

	const uploadImage = async (image: File) => {
		try {
			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
					variables: {
						file: null,
						target: 'member',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.file'],
				}),
			);
			formData.append('0', image);

			const response = await axios.post(`${REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.imageUploader;

			const imageUrl = `${REACT_APP_API_URL}/${responseImage}`;
			setImagePreview(imageUrl);

			// Update form data and preview
			setMemberUpdateInput({ ...memberUpdateInput, memberImage: responseImage });

			return imageUrl;
		} catch (err) {
			console.error('Error uploading image:', err);
			smallError(t('Failed to upload image'));
			return null;
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Validate email if it's being updated
		if (memberUpdateInput.memberEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberUpdateInput.memberEmail)) {
			smallError(Message.INVALID_EMAIL);
			return;
		}

		handleUpdateMember(memberUpdateInput);
	};

	return (
		<div className="bg-card rounded-xl shadow-sm">
			<div className="px-6 py-4 border-b border-border">
				<h2 className="text-lg font-medium text-card-foreground">{t('Profile Settings')}</h2>
			</div>
			<form onSubmit={handleSubmit} className="p-6 space-y-6">
				{/* Image Upload Section */}
				<div className="space-y-4">
					<label className="text-sm font-medium text-foreground">{t('Profile Image')}</label>
					<div className="relative w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full overflow-hidden bg-muted/50 border-2 border-dashed border-border hover:border-primary/50 transition-all duration-200">
						{imagePreview ? (
							<>
								<div className="relative w-full h-full">
									<Image
										src={imagePreview}
										alt={memberUpdateInput.memberFullName ?? t('No image')}
										className="object-contain rounded-full"
										fill
									/>
									<div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-200">
										<label htmlFor="image" className="absolute inset-0 flex items-center justify-center cursor-pointer">
											<div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm text-card-foreground px-3 py-1.5 rounded-md opacity-0 hover:opacity-100 transition-all duration-200 shadow-lg">
												<RefreshCw className="h-3.5 w-3.5" />
												<span className="text-sm font-medium">{t('Change')}</span>
											</div>
										</label>
									</div>
								</div>
							</>
						) : (
							<label
								htmlFor="image"
								className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 hover:bg-muted/60 transition-all duration-200 cursor-pointer group"
							>
								<div className="flex flex-col items-center gap-2">
									<div className="p-2.5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
										<ImageIcon className="h-5 w-5 text-primary" />
									</div>
									<p className="text-xs text-muted-foreground">{t('Upload')}</p>
								</div>
							</label>
						)}
						<input
							id="image"
							name="image"
							type="file"
							accept={imageTypes}
							onChange={handleImageChange}
							className="hidden"
						/>
					</div>
					<p className="text-center text-xs text-muted-foreground mt-2">{t('JPG, JPEG, PNG up to 5MB')}</p>
				</div>

				<div className="space-y-2">
					<Label htmlFor="username">{t('Username')}</Label>
					<Input
						id="username"
						value={memberUpdateInput.username}
						onChange={(e) => setMemberUpdateInput({ ...memberUpdateInput, username: e.target.value.toLowerCase() })}
						className="bg-background"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="fullName">{t('Full Name')}</Label>
					<Input
						id="fullName"
						value={memberUpdateInput.memberFullName}
						onChange={(e) => setMemberUpdateInput({ ...memberUpdateInput, memberFullName: e.target.value })}
						className="bg-background"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="email">{t('Email')}</Label>
					<Input
						id="email"
						value={memberUpdateInput.memberEmail}
						onChange={(e) => setMemberUpdateInput({ ...memberUpdateInput, memberEmail: e.target.value })}
						className="bg-background"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="phone">{t('Phone')}</Label>
					<Input
						id="phone"
						value={memberUpdateInput.memberPhone}
						onChange={(e) => handlePhoneChange(e.target.value)}
						placeholder="XXX-XXXX-XXXX"
						className="bg-background"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="description">{t('Description')}</Label>
					<Textarea
						id="description"
						value={memberUpdateInput.memberDesc}
						onChange={(e) => setMemberUpdateInput({ ...memberUpdateInput, memberDesc: e.target.value })}
						rows={4}
						className="bg-background"
					/>
				</div>

				<div className="flex justify-end">
					<Button type="submit">{t('Save Changes')}</Button>
				</div>

				{/* Crop Modal */}
				<Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
					<DialogContent className="sm:max-w-[600px]">
						<DialogHeader>
							<DialogTitle>{t('Crop Image')}</DialogTitle>
						</DialogHeader>
						<div className="mt-4">
							{tempImageUrl && (
								<div className="relative aspect-square w-full max-h-[400px] overflow-hidden rounded-lg">
									<ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={1} circularCrop>
										<img ref={imgRef} src={tempImageUrl} alt="Crop preview" className="max-w-full" />
									</ReactCrop>
								</div>
							)}
							<div className="mt-4 flex justify-end gap-2">
								<Button variant="outline" onClick={() => setCropModalOpen(false)}>
									{t('Cancel')}
								</Button>
								<Button onClick={handleCropComplete}>{t('Crop & Save')}</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</form>
		</div>
	);
};
