import { NEXT_APP_API_URL } from "./config";
import { getJwtToken } from "./auth";

/**
 * Upload a single image file to the server
 * @param file - The file to upload
 * @param target - The target directory (e.g., 'event', 'member', 'group')
 * @returns Promise resolving to the uploaded file URL
 * @throws Error if upload fails
 */
export async function uploadImage(file: File, target: string): Promise<string> {
	if (!file) {
		throw new Error("File is required");
	}

	if (!target) {
		throw new Error("Target parameter is required");
	}

	const formData = new FormData();
	formData.append("file", file);
	formData.append("target", target);

	const token = getJwtToken();
	const headers: HeadersInit = {};
	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	try {
		const response = await fetch(`${NEXT_APP_API_URL}/upload/image`, {
			method: "POST",
			headers,
			body: formData,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: "Upload failed" }));
			throw new Error(errorData.message || `Upload failed with status ${response.status}`);
		}

		const data = await response.json();
		return data.url;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Failed to upload image");
	}
}

/**
 * Upload multiple image files to the server
 * @param files - Array of files to upload
 * @param target - The target directory (e.g., 'event', 'member', 'group')
 * @returns Promise resolving to an array of uploaded file URLs
 * @throws Error if upload fails
 */
export async function uploadImages(files: File[], target: string): Promise<string[]> {
	if (!files || files.length === 0) {
		throw new Error("At least one file is required");
	}

	if (!target) {
		throw new Error("Target parameter is required");
	}

	const formData = new FormData();
	files.forEach((file) => {
		formData.append("files", file);
	});
	formData.append("target", target);

	const token = getJwtToken();
	const headers: HeadersInit = {};
	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	try {
		const response = await fetch(`${NEXT_APP_API_URL}/upload/images`, {
			method: "POST",
			headers,
			body: formData,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({ message: "Upload failed" }));
			throw new Error(errorData.message || `Upload failed with status ${response.status}`);
		}

		const data = await response.json();
		return data.urls;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Failed to upload images");
	}
}
