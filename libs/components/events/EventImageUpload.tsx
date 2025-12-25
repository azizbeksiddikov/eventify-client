"use client";

import Image from "next/image";
import { useTranslation } from "next-i18next";
import { ImageIcon, RefreshCw } from "lucide-react";
import { imageTypes } from "@/libs/config";

interface EventImageUploadProps {
	imagePreview: string | null;
	onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;
	changeLabel?: string;
}

export const EventImageUpload = ({ imagePreview, onImageChange, className, changeLabel }: EventImageUploadProps) => {
	const { t } = useTranslation("events");

	return (
		<div className="space-y-4">
			<label className="text-sm font-medium text-foreground">{t("event_image")} *</label>
			<div
				className={`relative aspect-video w-full max-w-2xl mx-auto rounded-xl overflow-hidden bg-muted/50 ${className || ""}`}
			>
				{imagePreview ? (
					<>
						<Image src={imagePreview} alt={t("event_preview")} className="w-full h-full" fill />

						<label
							htmlFor="image"
							className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors duration-200 cursor-pointer"
						>
							<div className="flex items-center gap-2 bg-white/90 text-foreground px-4 py-2 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200">
								<RefreshCw className="h-4 w-4" />
								<span className="font-medium">{changeLabel || t("reset_image")}</span>
							</div>
						</label>
					</>
				) : (
					<label
						htmlFor="image"
						className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 hover:bg-muted/60 transition-colors duration-200 cursor-pointer"
					>
						<ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
						<span className="text-muted-foreground font-medium">{t("click_to_upload_image")}</span>
					</label>
				)}
				<input id="image" name="image" type="file" accept={imageTypes} onChange={onImageChange} className="hidden" />
				<p className="text-sm text-muted-foreground mt-1">{t("only_jpg_jpeg_png_allowed")}</p>
			</div>
		</div>
	);
};
