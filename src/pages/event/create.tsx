import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { userVar } from "@/apollo/store";
import { format } from "date-fns";
import { ImageIcon, RefreshCw, CalendarIcon, ArrowLeft } from "lucide-react";

import { Button } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";
import { Textarea } from "@/libs/components/ui/textarea";
import { Card } from "@/libs/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/libs/components/ui/select";
import { Calendar } from "@/libs/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/libs/components/ui/popover";
import { ScrollArea } from "@/libs/components/ui/scroll-area";
import withBasicLayout from "@/libs/components/layout/LayoutBasic";
import { ImageCropper } from "@/libs/components/common/ImageCropper";

import { EventCategory, EventStatus, EventType } from "@/libs/enums/event.enum";
import { GET_MY_GROUPS } from "@/apollo/user/query";
import { CREATE_EVENT } from "@/apollo/user/mutation";
import { cn } from "@/libs/utils";
import { EventInput } from "@/libs/types/event/event.input";
import { Group } from "@/libs/types/group/group";
import { smallError, smallSuccess } from "@/libs/alert";
import { Message } from "@/libs/enums/common.enum";
import { getJwtToken } from "@/libs/auth";
import { imageTypes, REACT_APP_API_URL, REACT_APP_API_GRAPHQL_URL } from "@/libs/config";

export const getStaticProps = async ({ locale }: { locale: string }) => ({
	props: {
		...(await serverSideTranslations(locale, ["common"])),
	},
});

const EventCreatePage = () => {
	const router = useRouter();
	const { t } = useTranslation("common");
	const user = useReactiveVar(userVar);
	const token = getJwtToken();

	const [groups, setGroups] = useState<Group[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
	const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
	const [isCropperOpen, setIsCropperOpen] = useState(false);
	const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);

	const [formData, setFormData] = useState<EventInput>({
		eventType: EventType.ONCE,
		eventName: "",
		eventDesc: "",
		eventImages: [],

		// ===== Event Timestamps =====
		eventStartAt: new Date(),
		eventEndAt: new Date(),

		// ===== Event Location =====
		eventCity: "",
		eventAddress: "",

		// ===== Event Capacity and Price =====
		eventCapacity: undefined,
		eventPrice: 0,
		groupId: "",

		// ===== Event Status and Categories =====
		eventStatus: EventStatus.UPCOMING,
		eventCategories: [],
	});

	/** APOLLO REQUESTS **/
	const [createEvent] = useMutation(CREATE_EVENT);

	const { data: groupsData } = useQuery(GET_MY_GROUPS, {
		fetchPolicy: "cache-and-network",
		skip: !user._id,
		notifyOnNetworkStatusChange: true,
	});

	useEffect(() => {
		if (groupsData?.getMyGroups) setGroups(groupsData.getMyGroups);
	}, [groupsData]);

	/** HANDLERS */
	const startTimeChangeHandler = (hour: string, minute: string) => {
		const newStartTime = `${hour}:${minute}`;
		if (formData) setFormData((prev) => ({ ...prev, eventStartTime: newStartTime }));
	};

	const endTimeHandler = (hour: string, minute: string) => {
		const newEndTime = `${hour}:${minute}`;
		if (formData) setFormData((prev) => ({ ...prev, eventEndTime: newEndTime }));
	};

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
						target: "event",
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

			const response = await axios.post(`${REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					"apollo-require-preflight": true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response.data.data.imageUploader;
			const imageUrl = `${REACT_APP_API_URL}/${responseImage}`;

			// Update form data and preview
			setFormData((prev) => ({ ...prev, eventImage: responseImage }));
			setImagePreview(imageUrl);

			return imageUrl;
		} catch (err) {
			console.error("Error uploading image:", err);
			smallError(t("Failed to upload image"));
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
			smallError(t("Failed to process image"));
		}
	};

	const submitHandler = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (!formData) throw new Error(Message.INVALID_FORM_DATA);
			if (!formData?.groupId) throw new Error(Message.GROUP_NOT_FOUND);
			if (!formData?.eventName) throw new Error(t(Message.EVENT_NAME_REQUIRED));
			if (!formData?.eventDesc) throw new Error(t(Message.EVENT_DESCRIPTION_REQUIRED));
			if (selectedCategories.length === 0) throw new Error(t(Message.EVENT_CATEGORY_REQUIRED));
			if (!formData.eventStartAt) throw new Error(t(Message.EVENT_START_TIME_REQUIRED));
			if (!formData.eventEndAt) throw new Error(t(Message.EVENT_END_TIME_REQUIRED));
			if (!formData.eventCity) throw new Error(t(Message.EVENT_CITY_REQUIRED));
			if (!formData.eventAddress) throw new Error(t(Message.EVENT_ADDRESS_REQUIRED));
			if (!formData.eventCapacity) throw new Error(t(Message.EVENT_CAPACITY_REQUIRED));
			if (formData.eventCapacity < 1) throw new Error(t(Message.EVENT_CAPACITY_MIN_REQUIRED));
			if (!formData.eventPrice) formData.eventPrice = 0;
			if (formData.eventPrice < 0) throw new Error(t(Message.EVENT_PRICE_MIN_REQUIRED));
			if (!formData.eventImages.length) throw new Error(t(Message.EVENT_IMAGE_REQUIRED));

			const updatedFormData = {
				...formData,
				eventCategories: selectedCategories,
			};

			const { data: createEventData } = await createEvent({
				variables: { input: updatedFormData },
			});

			await smallSuccess(t(Message.EVENT_CREATED_SUCCESSFULLY));
			router.push(`/event/detail?eventId=${createEventData?.createEvent?._id}`);
		} catch (error: any) {
			console.log(error?.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const inputHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;

		if (name === "eventCapacity" || name === "eventPrice") {
			if (value === "") {
				// Allow empty input for user convenience
				setFormData((prev) => ({ ...prev, [name]: undefined }));
				return;
			}

			const cleanedValue = value.replace(/^0+/, "") || "0";
			const numberValue = Number(cleanedValue);

			if (isNaN(numberValue)) {
				smallError(t("Invalid number"));
				return;
			}

			setFormData((prev) => ({ ...prev, [name]: numberValue }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const categoryHandler = (category: EventCategory) => {
		if (selectedCategories.includes(category)) {
			// If category is already selected, remove it
			setSelectedCategories((prev) => prev.filter((c) => c !== category));
		} else if (selectedCategories.length < 3) {
			// If category is not selected and we haven't reached the limit, add it
			setSelectedCategories((prev) => [...prev, category]);
		}
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<Button
						variant="outline"
						onClick={() => router.push("/event")}
						className="flex items-center gap-2 text-primary hover:text-primary-foreground hover:bg-primary border-primary hover:border-primary/80 transition-colors duration-200"
					>
						<ArrowLeft className="h-4 w-4" />
						{t("Back to Events")}
					</Button>
				</div>

				<Card className="p-6 bg-card text-card-foreground">
					<h1 className="text-3xl font-semibold text-foreground mb-6">{t("Create New Event")}</h1>

					<form onSubmit={submitHandler} className="space-y-6">
						{/* Group Selection */}
						<div className="space-y-2">
							<label htmlFor="groupId" className="text-sm font-medium text-foreground">
								{t("Select Group")}
							</label>
							<Select
								value={formData.groupId}
								onValueChange={(value: string) => {
									const selectedGroup = groups.find((group) => group._id === value);
									if (selectedGroup) {
										setSelectedGroup(selectedGroup);
										setFormData((prev) => ({ ...prev, groupId: value }));
									}
								}}
							>
								<SelectTrigger className="w-full bg-input text-input-foreground border-input">
									<SelectValue placeholder="Select a group">
										{formData.groupId && (
											<div className="flex items-center space-x-3">
												<div className="relative h-8 w-8 rounded-full overflow-hidden">
													<Image
														src={`${REACT_APP_API_URL}/${selectedGroup?.groupImage}`}
														alt="Group preview"
														className="object-cover w-full h-full"
														fill
													/>
												</div>
												<span className="text-foreground">{selectedGroup?.groupName}</span>
											</div>
										)}
									</SelectValue>
								</SelectTrigger>
								<SelectContent className="bg-popover text-popover-foreground border-border">
									{groups.map((group: Group) => (
										<SelectItem
											key={group._id}
											value={group._id}
											className="py-3 hover:bg-accent hover:text-accent-foreground"
										>
											<div className="flex items-center space-x-4">
												<div className="relative h-10 w-10 rounded-full overflow-hidden">
													<Image
														src={`${REACT_APP_API_URL}/${group.groupImage}`}
														alt={group.groupName}
														fill
														className="object-cover w-full h-full"
													/>
												</div>
												<div>
													<div className="font-medium text-foreground">{group.groupName}</div>
													<div className="text-xs text-muted-foreground">
														{group.memberCount} {t("members")}
													</div>
												</div>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Event Name */}
						<div className="space-y-2">
							<label htmlFor="eventName" className="text-sm font-medium text-foreground">
								{t("Event Name")}
							</label>
							<Input
								id="eventName"
								name="eventName"
								value={formData.eventName}
								onChange={inputHandler}
								placeholder={t("Enter event name")}
								className="bg-input text-input-foreground border-input"
							/>
						</div>

						{/* Event Description */}
						<div className="space-y-2">
							<label htmlFor="eventDesc" className="text-sm font-medium text-foreground">
								{t("Description")}
							</label>
							<Textarea
								id="eventDesc"
								name="eventDesc"
								value={formData.eventDesc}
								onChange={inputHandler}
								placeholder={t("Describe your event")}
								className="min-h-[120px] bg-input text-input-foreground border-input"
							/>
						</div>

						{/* Categories */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground">{t("Categories (Select up to 3)")}</label>
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
								{Object.values(EventCategory).map((category) => (
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

						{/* Event Date and Time */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4"></div>
						{/* TODO: Add Event Date and Time */}

						{/* Location */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label htmlFor="eventCity" className="text-sm font-medium text-foreground">
									{t("City")}
								</label>
								<Input
									id="eventCity"
									name="eventCity"
									value={formData.eventCity}
									onChange={inputHandler}
									placeholder={t("Enter city")}
									className="bg-input text-input-foreground border-input"
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor="eventAddress" className="text-sm font-medium text-foreground">
									{t("Address")}
								</label>
								<Input
									id="eventAddress"
									name="eventAddress"
									value={formData.eventAddress}
									onChange={inputHandler}
									placeholder={t("Enter address")}
									className="bg-input text-input-foreground border-input"
								/>
							</div>
						</div>

						{/* Capacity and Price */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label htmlFor="eventCapacity" className="text-sm font-medium text-foreground">
									{t("Capacity (number)")}
								</label>
								<Input
									id="eventCapacity"
									name="eventCapacity"
									type="number"
									value={formData.eventCapacity === undefined ? "" : String(formData.eventCapacity)}
									onChange={inputHandler}
									placeholder={t("Enter event capacity")}
									className="bg-input text-input-foreground border-input"
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor="eventPrice" className="text-sm font-medium text-foreground">
									{t("Price (number)")}
								</label>
								<Input
									id="eventPrice"
									name="eventPrice"
									type="number"
									// Convert to string and strip leading zeros when displaying
									value={formData.eventPrice === undefined ? "" : String(formData.eventPrice)}
									onChange={inputHandler}
									placeholder={t("Enter event price")}
									className="bg-input text-input-foreground border-input"
								/>
							</div>
						</div>

						{/* Image Section */}
						<div className="space-y-4">
							<label className="text-sm font-medium text-foreground">{t("Event Image")}</label>
							<div className="relative aspect-[16/9] w-full max-w-2xl mx-auto rounded-xl overflow-hidden bg-muted/50 rounded-t-xl">
								{imagePreview ? (
									<>
										<Image src={imagePreview} alt="Event preview" className="w-full h-full" fill />

										<label
											htmlFor="image"
											className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors duration-200 cursor-pointer"
										>
											<div className="flex items-center gap-2 bg-white/90 text-foreground px-4 py-2 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200">
												<RefreshCw className="h-4 w-4" />
												<span className="font-medium">{t("Reset Image")}</span>
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
								disabled={
									isSubmitting ||
									selectedCategories.length === 0 ||
									!formData.groupId ||
									!formData.eventStartAt ||
									!formData.eventEndAt ||
									!formData.eventCity ||
									!formData.eventAddress ||
									!formData.eventCapacity ||
									!formData.eventImages.length
								}
								className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-8"
							>
								{isSubmitting ? t("Creating...") : t("Create Event")}
							</Button>
						</div>
					</form>
				</Card>
			</div>
		</div>
	);
};

export default withBasicLayout(EventCreatePage);
