"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ImageIcon, RefreshCw, ArrowLeft } from "lucide-react";
import { useMutation, useReactiveVar, useQuery } from "@apollo/client/react";
import { useTranslation } from "next-i18next";

import { Button } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";
import { Textarea } from "@/libs/components/ui/textarea";
import { Card } from "@/libs/components/ui/card";
import { ImageCropper } from "@/libs/components/common/ImageCropper";

import { userVar } from "@/apollo/store";
import { UPDATE_GROUP } from "@/apollo/user/mutation";
import { GET_GROUP } from "@/apollo/user/query";
import { smallError, smallSuccess } from "@/libs/alert";
import { Message } from "@/libs/enums/common.enum";
import { GroupCategory } from "@/libs/enums/group.enum";
import { GroupUpdateInput } from "@/libs/types/group/group.update";
import { imageTypes } from "@/libs/config";
import { uploadImage } from "@/libs/upload";
import { getImageUrl } from "@/libs/utils";

const GroupUpdatePage = () => {
	const router = useRouter();
	const params = useParams();
	const { t } = useTranslation(["groups", "errors"]);
	const user = useReactiveVar(userVar);
	const groupId = params?.id as string;

	// UI State
	const [uiState, setUiState] = useState({
		isSubmitting: false,
		imagePreview: null as string | null,
		isCropperOpen: false,
		tempImageUrl: null as string | null,
	});

	// Form State
	const [selectedCategories, setSelectedCategories] = useState<GroupCategory[]>([]);
	const [formData, setFormData] = useState<GroupUpdateInput | null>(null);

	/** APOLLO REQUESTS **/
	const [updateGroup] = useMutation(UPDATE_GROUP);
	const { data: groupData, loading: groupLoading } = useQuery(GET_GROUP, {
		variables: { input: groupId },
		fetchPolicy: "cache-and-network",
		skip: !groupId,
	});

	/** LIFECYCLE */
	useEffect(() => {
		if (groupData?.getGroup) {
			const group = groupData.getGroup;

			// Authorization Check
			const isOwner = group.memberId === user?._id;
			const isModerator = group.groupModerators?.some(
				(m: any) => m && typeof m === "object" && "memberId" in m && m.memberId === user?._id,
			);

			if (!isOwner && !isModerator) {
				smallError(t("errors:not_authorized"));
				router.push(`/groups/${group._id}`);
				return;
			}

			setFormData({
				_id: group._id,
				groupName: group.groupName || "",
				groupDesc: group.groupDesc || "",
				groupCategories: (group.groupCategories || []) as GroupCategory[],
				groupImage: group.groupImage || "",
			});

			setSelectedCategories((group.groupCategories || []) as GroupCategory[]);
			setUiState((prev) => ({
				...prev,
				imagePreview: getImageUrl(group.groupImage || "", "group"),
			}));
		}
	}, [groupData, user?._id, router, t]);

	/** HANDLERS */
	const handleImageUpload = async (image: File) => {
		try {
			const responseImage = await uploadImage(image, "group");
			const imageUrl = getImageUrl(responseImage, "group");

			setFormData((prev) => (prev ? { ...prev, groupImage: responseImage } : null));
			setUiState((prev) => ({ ...prev, imagePreview: imageUrl }));

			return imageUrl;
		} catch (err) {
			console.error("Error uploading image:", err);
			smallError(t("errors:failed_to_upload"));
			return null;
		}
	};

	const imageChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setUiState((prev) => ({ ...prev, tempImageUrl: imageUrl, isCropperOpen: true }));
		}
	};

	const cropCompleteHandler = async (croppedFile: File) => {
		try {
			const imageUrl = await handleImageUpload(croppedFile);
			if (imageUrl) {
				setUiState((prev) => ({ ...prev, imagePreview: imageUrl, tempImageUrl: null }));
			}
		} catch (err) {
			console.error("Error handling cropped image:", err);
			smallError(t("errors:failed_to_process_image"));
		}
	};

	const submitHandler = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData) return;

		setUiState((prev) => ({ ...prev, isSubmitting: true }));

		try {
			if (!user._id) throw new Error(t("errors:not_authenticated"));
			if (!formData.groupName?.trim()) throw new Error(t("please_enter_group_name"));
			if (!formData.groupDesc?.trim()) throw new Error(t("please_enter_group_description"));
			if (selectedCategories.length === 0) throw new Error(t("please_select_at_least_one_category"));
			if (!formData.groupImage) throw new Error(t("please_upload_group_image"));

			const updatedInput: GroupUpdateInput = {
				...formData,
				groupCategories: selectedCategories,
			};

			await updateGroup({
				variables: { input: updatedInput },
			});

			await smallSuccess(t("group_updated_successfully"));
			router.push(`/groups/${formData._id}`);
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : t("errors:something_went_wrong");
			smallError(errorMessage);
		} finally {
			setUiState((prev) => ({ ...prev, isSubmitting: false }));
		}
	};

	const inputHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
	};

	const categoryHandler = (category: GroupCategory) => {
		if (selectedCategories.includes(category)) {
			setSelectedCategories((prev) => prev.filter((c) => c !== category));
		} else if (selectedCategories.length < 3) {
			setSelectedCategories((prev) => [...prev, category]);
		}
	};

	if (groupLoading || !formData) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<Button
						variant="outline"
						onClick={() => router.push(`/groups/${formData._id}`)}
						className="flex items-center gap-2 text-primary hover:text-primary-foreground hover:bg-primary border-primary transition-colors duration-200"
					>
						<ArrowLeft className="h-4 w-4" />
						{t("back_to_group")}
					</Button>
				</div>

				<Card className="p-6 bg-card text-card-foreground">
					<h1 className="text-3xl font-semibold text-foreground mb-6">{t("update_group")}</h1>

					<form onSubmit={submitHandler} className="space-y-6">
						{/* Group Name */}
						<div className="space-y-2">
							<label htmlFor="groupName" className="text-sm font-medium text-foreground">
								{t("group_name")} *
							</label>
							<Input
								id="groupName"
								name="groupName"
								value={formData.groupName}
								onChange={inputHandler}
								placeholder={t("enter_group_name")}
								required
							/>
						</div>

						{/* Group Description */}
						<div className="space-y-2">
							<label htmlFor="groupDesc" className="text-sm font-medium text-foreground">
								{t("description")} *
							</label>
							<Textarea
								id="groupDesc"
								name="groupDesc"
								value={formData.groupDesc}
								onChange={inputHandler}
								placeholder={t("enter_group_description")}
								className="min-h-[120px]"
								required
							/>
						</div>

						{/* Categories */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground">{t("categories_select_up_to_3")} *</label>
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
								{Object.values(GroupCategory).map((category) => (
									<Button
										key={category}
										type="button"
										variant={selectedCategories.includes(category) ? "default" : "outline"}
										onClick={() => categoryHandler(category)}
										disabled={selectedCategories.length >= 3 && !selectedCategories.includes(category)}
										className="h-10"
									>
										{t(category.toLowerCase())}
									</Button>
								))}
							</div>
						</div>

						{/* Image Upload */}
						<div className="space-y-4">
							<label className="text-sm font-medium text-foreground">{t("group_image")} *</label>
							<div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted/50 border-2">
								{uiState.imagePreview ? (
									<>
										<Image src={uiState.imagePreview} alt="Group preview" className="object-contain" fill />
										<label
											htmlFor="image"
											className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors cursor-pointer group"
										>
											<div className="flex items-center gap-2 bg-white/90 text-foreground px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
												<RefreshCw className="h-4 w-4" />
												<span className="font-medium">{t("change_image")}</span>
											</div>
										</label>
									</>
								) : (
									<label
										htmlFor="image"
										className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/60 transition-colors"
									>
										<ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
										<span className="text-muted-foreground font-medium">{t("click_to_upload_image")}</span>
									</label>
								)}
								<input id="image" type="file" accept={imageTypes} onChange={imageChangeHandler} className="hidden" />
							</div>
						</div>

						<ImageCropper
							isOpen={uiState.isCropperOpen}
							onClose={() => setUiState((prev) => ({ ...prev, isCropperOpen: false, tempImageUrl: null }))}
							onCropComplete={cropCompleteHandler}
							imageUrl={uiState.tempImageUrl || ""}
						/>

						<div className="flex justify-end pt-4">
							<Button type="submit" size="lg" disabled={uiState.isSubmitting} className="px-12">
								{uiState.isSubmitting ? t("updating") : t("update_group")}
							</Button>
						</div>
					</form>
				</Card>
			</div>
		</div>
	);
};

export default GroupUpdatePage;
