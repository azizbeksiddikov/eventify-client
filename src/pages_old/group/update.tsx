import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Button } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";
import { Textarea } from "@/libs/components/ui/textarea";
import { Card } from "@/libs/components/ui/card";
import { ImageIcon, RefreshCw } from "lucide-react";
import withBasicLayout from "@/libs/components/layout/LayoutBasic";
import { GroupCategory } from "@/libs/enums/group.enum";
import { GroupUpdateInput } from "@/libs/types/group/group.update";
import { ImageCropper } from "@/libs/components/common/ImageCropper";

import { useMutation, useReactiveVar, useQuery } from "@apollo/client";
import { userVar } from "@/apollo/store";
import { UPDATE_GROUP } from "@/apollo/user/mutation";
import { smallError, smallSuccess } from "@/libs/alert";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Message } from "@/libs/enums/common.enum";
import axios from "axios";
import { getJwtToken } from "@/libs/auth";
import { imageTypes, NEXT_APP_API_URL } from "@/libs/config";
import { NEXT_PUBLIC_API_GRAPHQL_URL } from "@/libs/config";
import { GET_GROUP } from "@/apollo/user/query";
import { GroupMember } from "@/libs/types/groupMembers/groupMember";
import Image from "next/image";

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ["common"])),
	},
});

const GroupUpdatePage = () => {
	const router = useRouter();
	const { t } = useTranslation("common");
	const user = useReactiveVar(userVar);
	const token = getJwtToken();

	const [groupId, setGroupId] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [selectedCategories, setSelectedCategories] = useState<GroupCategory[]>([]);
	const [formData, setFormData] = useState<GroupUpdateInput | null>(null);
	const [isCropperOpen, setIsCropperOpen] = useState(false);
	const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);

	/** APOLLO REQUESTS **/
	const [updateGroup] = useMutation(UPDATE_GROUP);
	const { data: groupData, loading: groupLoading } = useQuery(GET_GROUP, {
		variables: { input: groupId },
		fetchPolicy: "cache-and-network",
		skip: !groupId,
	});

	/** LIFECYCLE */
	// Handle group data and authorization
	useEffect(() => {
		if (groupData?.getGroup) {
			const group = groupData.getGroup;

			// Check if user is authorized to update the group
			const isOwner = group.memberId === user?._id;
			const isModerator = group.groupModerators?.some((moderator: GroupMember) => moderator.memberId === user?._id);

			if (!isOwner && !isModerator) {
				smallError(t(Message.NOT_AUTHORIZED));
				router.push("/group/detail?groupId=" + group._id);
				return;
			}

			setFormData({
				_id: group._id,
				groupName: group.groupName,
				groupDesc: group.groupDesc,
				groupCategories: group.groupCategories,
				groupImage: group.groupImage,
			});
			setSelectedCategories(group.groupCategories);
			setImagePreview(`${NEXT_APP_API_URL}/${group.groupImage}`);
		}
	}, [groupData, user, router]);

	// Handle groupId from URL
	useEffect(() => {
		if (router.query.groupId) {
			setGroupId(router.query.groupId as string);
		}
	}, [router.query.groupId]);

	/** HANDLERS */
	const uploadImage = async (image: File) => {
		try {
			const formData = new FormData();
			formData.append(
				"operations",
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
					variables: {
						file: null,
						target: "group",
					},
				}),
			);
			formData.append(
				"map",
				JSON.stringify({
					"0": ["variables.file"],
				}),
			);
			formData.append("0", image);

			const response = await axios.post(`${NEXT_PUBLIC_API_GRAPHQL_URL}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					"apollo-require-preflight": true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.imageUploader;
			const imageUrl = `${NEXT_APP_API_URL}/${responseImage}`;

			// Update form data and preview
			setFormData((prev: GroupUpdateInput | null) => {
				if (!prev) return null;
				return { ...prev, groupImage: responseImage };
			});
			setImagePreview(imageUrl);

			return imageUrl;
		} catch (err) {
			console.error("Error uploading image:", err);
			smallError(t(Message.UPLOAD_FAILED));
			return null;
		}
	};

	const imageChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setTempImageUrl(imageUrl);
			setIsCropperOpen(true);
		}
	};

	const cropCompleteHandler = async (croppedFile: File) => {
		try {
			const imageUrl = await uploadImage(croppedFile);
			if (imageUrl) {
				setImagePreview(imageUrl);
				setTempImageUrl(null);
			}
		} catch (err) {
			console.error("Error handling cropped image:", err);
			smallError(t(Message.IMAGE_PROCESSING_FAILED));
		}
	};

	const submitHandler = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			if (!user._id || !token) throw new Error(Message.NOT_AUTHENTICATED);
			if (!formData) throw new Error(t(Message.INVALID_FORM_DATA));
			if (!formData.groupName) throw new Error(t(Message.GROUP_NAME_REQUIRED));
			if (!formData.groupDesc) throw new Error(t(Message.GROUP_DESCRIPTION_REQUIRED));
			if (selectedCategories.length === 0) throw new Error(t(Message.GROUP_CATEGORY_REQUIRED));
			if (!formData.groupImage) throw new Error(t(Message.GROUP_IMAGE_REQUIRED));

			const updatedFormData = {
				...formData,
				groupCategories: selectedCategories,
			};

			await updateGroup({
				variables: { input: updatedFormData },
			});

			await smallSuccess(t(Message.GROUP_UPDATED_SUCCESSFULLY));
			router.push(`/group/detail?groupId=${formData._id}`);
		} catch (error: any) {
			console.log(error?.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const inputHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;

		setFormData((prev) => {
			if (!prev) return null;
			return {
				...prev,
				[name]: value,
			};
		});
	};

	const categoryHandler = (category: GroupCategory) => {
		if (selectedCategories.includes(category)) {
			// If category is already selected, remove it
			setSelectedCategories((prev) => prev.filter((c) => c !== category));
		} else if (selectedCategories.length < 3) {
			// If category is not selected and we haven't reached the limit, add it
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
						onClick={() => router.push(`/group/detail?groupId=${formData._id}`)}
						className="flex items-center gap-2 text-primary hover:text-primary-foreground hover:bg-primary border-primary hover:border-primary/80 transition-colors duration-200"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="h-4 w-4"
						>
							<path d="m15 18-6-6 6-6" />
						</svg>
						{t("Back to Group")}
					</Button>
				</div>

				<Card className="p-6 bg-card text-card-foreground">
					<h1 className="text-3xl font-semibold text-foreground mb-6">{t("Update Group")}</h1>

					<form onSubmit={submitHandler} className="space-y-6">
						{/* Group Name */}
						<div className="space-y-2">
							<label htmlFor="groupName" className="text-sm font-medium text-foreground">
								{t("Group Name")}
							</label>
							<Input
								id="groupName"
								name="groupName"
								value={formData.groupName}
								onChange={inputHandler}
								placeholder={t("Enter group name")}
								className="bg-input text-input-foreground border-input"
								required
							/>
						</div>

						{/* Group Description */}
						<div className="space-y-2">
							<label htmlFor="groupDesc" className="text-sm font-medium text-foreground">
								{t("Description")}
							</label>
							<Textarea
								id="groupDesc"
								name="groupDesc"
								value={formData.groupDesc}
								onChange={inputHandler}
								placeholder={t("Enter group description")}
								className="min-h-[120px] bg-input text-input-foreground border-input"
								required
							/>
						</div>

						{/* Categories */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground">{t("Categories (Select up to 3)")}</label>
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
								{Object.values(GroupCategory).map((category) => (
									<Button
										key={category}
										type="button"
										variant={selectedCategories.includes(category) ? "default" : "outline"}
										onClick={() => categoryHandler(category)}
										disabled={selectedCategories.length >= 3 && !selectedCategories.includes(category)}
										className={`h-10 transition-all duration-200 ${
											selectedCategories.includes(category)
												? "bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90"
												: "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
										} disabled:opacity-50 disabled:cursor-not-allowed`}
									>
										{category.charAt(0) + category.slice(1).toLowerCase().replace("_", " ")}
									</Button>
								))}
							</div>
						</div>

						{/* Image Section */}
						<div className="space-y-4">
							<label className="text-sm font-medium text-foreground">{t("Group Image")}</label>
							<div className="relative aspect-[16/9] w-full max-w-2xl mx-auto rounded-xl overflow-hidden bg-muted/50 rounded-t-xl">
								{imagePreview ? (
									<>
										<Image src={imagePreview} alt="Group preview" className="object-contain" fill />
										<label
											htmlFor="image"
											className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors duration-200 cursor-pointer group"
										>
											<div className="flex items-center gap-2 bg-white/90 text-foreground px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
												<RefreshCw className="h-4 w-4" />
												<span className="font-medium">{t("Change Image")}</span>
											</div>
										</label>
									</>
								) : (
									<label
										htmlFor="image"
										className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 hover:bg-muted/60 transition-colors duration-200 cursor-pointer"
									>
										<ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
										<span className="text-muted-foreground font-medium">{t("Click to upload image")}</span>
									</label>
								)}
								<input
									id="image"
									name="image"
									type="file"
									accept={imageTypes}
									onChange={imageChangeHandler}
									className="hidden"
								/>
								<p className="text-sm text-muted-foreground mt-1">{t("Only JPG, JPEG, and PNG files are allowed")}</p>
							</div>
						</div>

						{/* Image Cropper Modal */}
						<ImageCropper
							isOpen={isCropperOpen}
							onClose={() => {
								setIsCropperOpen(false);
								setTempImageUrl(null);
							}}
							onCropComplete={cropCompleteHandler}
							imageUrl={tempImageUrl || ""}
						/>

						{/* Submit Button */}
						<div className="flex justify-end">
							<Button
								type="submit"
								size="lg"
								disabled={isSubmitting || selectedCategories.length === 0}
								className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-8"
							>
								{isSubmitting ? t("Updating...") : t("Update Group")}
							</Button>
						</div>
					</form>
				</Card>
			</div>
		</div>
	);
};

export default withBasicLayout(GroupUpdatePage);
