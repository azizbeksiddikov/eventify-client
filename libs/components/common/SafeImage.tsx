"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

import { getImageUrl } from "@/libs/utils";

type SafeImageProps = Omit<ImageProps, "src"> & {
	src: string;
	/** Which branded placeholder to show when the image is missing or fails to load. */
	fallbackType: "event" | "group" | "member" | "other";
};

/**
 * next/image with a graceful broken-image state: if the file 404s the branded
 * placeholder is shown instead of the browser's broken-image icon and alt text.
 */
export function SafeImage({ src, fallbackType, alt, onError, ...rest }: SafeImageProps) {
	const [failedSrc, setFailedSrc] = useState<string | null>(null);
	const failed = failedSrc === src;

	return (
		<Image
			{...rest}
			src={failed ? getImageUrl("", fallbackType) : src}
			alt={alt}
			unoptimized={failed || rest.unoptimized}
			// The image can fail before React hydrates, so onError never fires; catch that case here.
			ref={(img) => {
				if (img && img.complete && img.naturalWidth === 0) setFailedSrc(src);
			}}
			onError={(e) => {
				setFailedSrc(src);
				onError?.(e);
			}}
		/>
	);
}
