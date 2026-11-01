"use client";

import { useMutation, useQuery, useReactiveVar } from "@apollo/client/react";
import { ArrowLeft, ImageIcon, RefreshCw, Trash2 } from "lucide-react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ImageCropper } from "@/libs/components/common/ImageCropper";
import Loading from "@/libs/components/common/Loading";
import { Button } from "@/libs/components/ui/button";
import { Card } from "@/libs/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/libs/components/ui/dialog";
import { Input } from "@/libs/components/ui/input";
import { Textarea } from "@/libs/components/ui/textarea";

import { userVar } from "@/apollo/store";
import { DELETE_GROUP, UPDATE_GROUP } from "@/apollo/user/mutation";
import { GET_GROUP } from "@/apollo/user/query";
import { smallError, smallSuccess } from "@/libs/alert";
import { imageTypes } from "@/libs/config";
import { GroupCategory } from "@/libs/enums/group.enum";
import { AppError, friendlyErrorMessage } from "@/libs/errorMessages";
import { useInlineValidation } from "@/libs/hooks/useInlineValidation";
import { GroupUpdateInput } from "@/libs/types/group/group.update";
import { GroupMember } from "@/libs/types/groupMembers/groupMember";
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
		isDeleteDialogOpen: false,
	});

	// Form State
	const [selectedCategories, setSelectedCategories] = useState<GroupCategory[]>([]);
	const [formData, setFormData] = useState<GroupUpdateInput | null>(null);

	// Inline validation (same behaviour as the create form)
	const errors = {
		groupName: !formData?.groupName?.trim() ? t("group_name_is_required") : undefined,
		groupDesc: !formData?.groupDesc?.trim() ? t("group_description_is_required") : undefined,
		groupCategories: selectedCategories.length === 0 ? t("group_category_is_required") : undefined,
		groupImage: !formData?.groupImage ? t("group_image_is_required") : undefined,
	};
	const { errorProps, errorText, validate, touch } = useInlineValidation(errors, [
		"groupName",
		"groupDesc",
		"groupCategories",
		"groupImage",
	]);

	/** APOLLO REQUESTS **/
	const [updateGroup] = useMutation(UPDATE_GROUP);
	const [deleteGroup] = useMutation(DELETE_GROUP);
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
			const isModerator = group.groupModerators?.some((m: GroupMember) => m.memberId === user?._id);

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
		if (!validate()) return;

		setUiState((prev) => ({ ...prev, isSubmitting: true }));

		try {
			if (!user._id) throw new AppError("NOT_AUTHENTICATED");

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
			smallError(friendlyErrorMessage(error));
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

	const deleteGroupHandler = async () => {
		if (!groupId) return;
		try {
			await deleteGroup({
				variables: { input: groupId },
			});
			await smallSuccess(t("group_deleted_successfully"));
			router.push("/groups");
		} catch (error: unknown) {
			if (error instanceof Error) {
				smallError(friendlyErrorMessage(error));
			} else {
				smallError(t("failed_to_delete_group"));
			}
		}
		setUiState((prev) => ({ ...prev, isDeleteDialogOpen: false }));
	};

	if (groupLoading || !formData) {
		return <Loading />;
	}

	const isOwner = groupData?.getGroup?.memberId === user?._id;

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

				<Card className="p-4 sm:p-6 bg-card text-card-foreground">
					<h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4 sm:mb-6">{t("update_group")}</h1>

					<form noValidate onSubmit={submitHandler} className="space-y-6">
						{/* Group Name */}
						<div className="space-y-2">
							<label htmlFor="groupName" className="text-sm font-medium text-foreground">
								{t("group_name")} *
							</label>
							<Input
								id="groupName"
								{...errorProps("groupName")}
								name="groupName"
								value={formData.groupName}
								onChange={inputHandler}
								placeholder={t("enter_group_name")}
							/>
							{errorText("groupName")}
						</div>

						{/* Group Description */}
						<div className="space-y-2">
							<label htmlFor="groupDesc" className="text-sm font-medium text-foreground">
								{t("description")} *
							</label>
							<Textarea
								id="groupDesc"
								{...errorProps("groupDesc")}
								name="groupDesc"
								value={formData.groupDesc}
								onChange={inputHandler}
								placeholder={t("enter_group_description")}
								className="min-h-[120px]"
							/>
							{errorText("groupDesc")}
						</div>

						{/* Categories */}
						<div className="space-y-2" id="groupCategories" tabIndex={-1}>
							<label className="text-sm font-medium text-foreground">{t("categories_select_up_to_3")} *</label>
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
								{Object.values(GroupCategory).map((category) => (
									<Button
										key={category}
										type="button"
										variant={selectedCategories.includes(category) ? "default" : "outline"}
										onClick={() => {
											categoryHandler(category);
											touch("groupCategories");
										}}
										aria-pressed={selectedCategories.includes(category)}
										disabled={selectedCategories.length >= 3 && !selectedCategories.includes(category)}
										className="h-11 fine:h-10"
									>
										{t(category.toLowerCase())}
									</Button>
								))}
							</div>
							{errorText("groupCategories")}
						</div>

						{/* Image Upload */}
						<div className="space-y-4" id="groupImage" tabIndex={-1}>
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
							{errorText("groupImage")}
						</div>

						<ImageCropper
							isOpen={uiState.isCropperOpen}
							onClose={() => setUiState((prev) => ({ ...prev, isCropperOpen: false, tempImageUrl: null }))}
							onCropComplete={cropCompleteHandler}
							imageUrl={uiState.tempImageUrl || ""}
						/>

						<div className="flex justify-end gap-3 pt-4">
							{isOwner && (
								<Button
									type="button"
									size="lg"
									variant="destructive"
									onClick={() => setUiState((prev) => ({ ...prev, isDeleteDialogOpen: true }))}
									className="px-8"
								>
									<Trash2 className="h-4 w-4 mr-2" />
									{t("delete")}
								</Button>
							)}
							<Button type="submit" size="lg" disabled={uiState.isSubmitting} className="px-12">
								{uiState.isSubmitting ? t("updating") : t("update_group")}
							</Button>
						</div>
					</form>
				</Card>

				{/* Delete Confirmation Dialog */}
				<Dialog
					open={uiState.isDeleteDialogOpen}
					onOpenChange={(open) => setUiState((prev) => ({ ...prev, isDeleteDialogOpen: open }))}
				>
					<DialogContent className="sm:max-w-md max-w-[90vw] rounded-lg">
						<DialogHeader>
							<DialogTitle>{t("delete_group")}</DialogTitle>
							<DialogDescription>{t("delete_group_confirmation_message")}</DialogDescription>
						</DialogHeader>
						<DialogFooter className="flex-col sm:flex-row gap-2">
							<Button
								variant="outline"
								onClick={() => setUiState((prev) => ({ ...prev, isDeleteDialogOpen: false }))}
								className="w-full sm:w-auto"
							>
								{t("cancel")}
							</Button>
							<Button
								onClick={deleteGroupHandler}
								className="bg-destructive hover:bg-destructive/90 text-destructive-foreground w-full sm:w-auto"
							>
								{t("delete")}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
};

export default GroupUpdatePage;
