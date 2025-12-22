"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client/react";
import { useTranslation } from "next-i18next";
import { userVar } from "@/apollo/store";
import { ImageIcon, RefreshCw, ArrowLeft } from "lucide-react";

import { Button } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";
import { Textarea } from "@/libs/components/ui/textarea";
import { Card } from "@/libs/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/libs/components/ui/select";
import { ScrollArea } from "@/libs/components/ui/scroll-area";
import { Checkbox } from "@/libs/components/ui/checkbox";
import { ImageCropper } from "@/libs/components/common/ImageCropper";

import { EventCategory, EventStatus, EventLocationType } from "@/libs/enums/event.enum";
import { GET_EVENT } from "@/apollo/user/query";
import { UPDATE_EVENT_BY_ORGANIZER } from "@/apollo/user/mutation";
import { EventUpdateInput } from "@/libs/types/event/event.update";
import { smallError, smallSuccess } from "@/libs/alert";
import { Message, Currency } from "@/libs/enums/common.enum";
import { imageTypes } from "@/libs/config";
import { uploadImage } from "@/libs/upload";
import { getImageUrl } from "@/libs/utils";

const EventUpdatePage = () => {
	const router = useRouter();
	const params = useParams();
	const { t } = useTranslation(["events", "errors"]);
	const user = useReactiveVar(userVar);
	const eventId = params?.id as string;

	// UI State
	const [uiState, setUiState] = useState({
		isSubmitting: false,
		imagePreview: null as string | null,
		isCropperOpen: false,
		tempImageUrl: null as string | null,
	});

	// Form Selection State
	const [formSelection, setFormSelection] = useState({
		selectedCategories: [] as EventCategory[],
		locationType: EventLocationType.OFFLINE as EventLocationType,
		eventTags: "",
	});

	// Main Form Data
	const [formData, setFormData] = useState<EventUpdateInput | null>(null);

	/** APOLLO REQUESTS **/
	const [updateEventByOrganizer] = useMutation(UPDATE_EVENT_BY_ORGANIZER);

	const { data: eventData, loading: eventLoading } = useQuery(GET_EVENT, {
		variables: { input: eventId },
		fetchPolicy: "cache-and-network",
		skip: !eventId,
	});

	useEffect(() => {
		if (eventData?.getEvent) {
			const event = eventData.getEvent;

			// Check if user is authorized to update the event
			if (event.memberId !== user?._id) {
				smallError(t("errors:not_authorized_to_update_event"));
				router.push(`/events/${event._id}`);
				return;
			}

			setFormData({
				_id: event._id,
				eventName: event.eventName,
				eventDesc: event.eventDesc,
				eventCategories: event.eventCategories,
				eventStartAt: new Date(event.eventStartAt),
				eventEndAt: new Date(event.eventEndAt),
				locationType: event.locationType,
				eventCity: event.eventCity,
				eventAddress: event.eventAddress,
				eventCapacity: event.eventCapacity,
				eventPrice: event.eventPrice,
				eventImages: event.eventImages,
				eventStatus: event.eventStatus,
				eventTags: event.eventTags || [],
				isRealEvent: event.isRealEvent,
				eventCurrency: event.eventCurrency,
			});

			setFormSelection({
				selectedCategories: event.eventCategories || [],
				locationType: event.locationType || EventLocationType.OFFLINE,
				eventTags: (event.eventTags || []).join(", "),
			});

			setUiState((prev) => ({
				...prev,
				imagePreview: getImageUrl(event.eventImages?.[0] || "", "event", event.origin),
			}));
		}
	}, [eventData, user?._id, router, t]);

	/** HANDLERS */

	const handleImageUpload = async (image: File) => {
		try {
			const responseImage = await uploadImage(image, "event");
			const imageUrl = getImageUrl(responseImage, "event");

			// Update form data and preview
			setFormData((prev) => (prev ? { ...prev, eventImages: [responseImage] } : null));
			setUiState((prev) => ({ ...prev, imagePreview: imageUrl }));

			return imageUrl;
		} catch (err) {
			console.error("Error uploading image:", err);
			smallError(t("failed_to_upload_image"));
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
			// Validation
			if (!formData._id) throw new Error(t("errors:event_not_found"));
			if (!user._id) throw new Error(t("errors:not_authenticated"));
			if (!formData.eventName?.trim()) throw new Error(t("please_enter_event_name"));
			if (!formData.eventDesc?.trim()) throw new Error(t("please_enter_event_description"));
			if (formSelection.selectedCategories.length === 0) throw new Error(t("please_select_at_least_one_category"));
			if (!formData.eventStartAt) throw new Error(t("please_select_event_start_date_time"));
			if (!formData.eventEndAt) throw new Error(t("please_select_event_end_date_time"));
			if (formData.eventEndAt <= formData.eventStartAt) {
				throw new Error(t("end_date_must_be_after_start_date"));
			}
			if (formSelection.locationType === EventLocationType.OFFLINE) {
				if (!formData.eventAddress?.trim()) throw new Error(t("please_enter_event_address"));
			}
			if (formData.eventCapacity !== undefined && formData.eventCapacity < 1) {
				throw new Error(t("event_capacity_must_be_at_least_1"));
			}
			if (formData.eventPrice !== undefined && formData.eventPrice < 0) throw new Error(t("price_cannot_be_negative"));
			if (!formData.eventImages?.length) throw new Error(t("please_upload_event_image"));

			// Parse event tags
			const tagsArray = formSelection.eventTags
				.split(",")
				.map((tag) => tag.trim())
				.filter((tag) => tag.length > 0);

			const updatedInput: EventUpdateInput = {
				...formData,
				eventCategories: formSelection.selectedCategories,
				eventTags: tagsArray,
				locationType: formSelection.locationType,
			};

			await updateEventByOrganizer({
				variables: { input: updatedInput },
			});

			await smallSuccess(t("event_updated_successfully"));
			router.push(`/events/${formData._id}`);
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : t("errors:failed_to_update");
			smallError(errorMessage);
		} finally {
			setUiState((prev) => ({ ...prev, isSubmitting: false }));
		}
	};

	const inputHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;

		if (name === "eventCapacity" || name === "eventPrice") {
			if (value === "") {
				setFormData((prev) => (prev ? { ...prev, [name]: undefined } : null));
				return;
			}
			const cleanedValue = value.replace(/^0+/, "") || "0";
			const numberValue = Number(cleanedValue);
			if (isNaN(numberValue)) return;
			setFormData((prev) => (prev ? { ...prev, [name]: numberValue } : null));
		} else {
			setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
		}
	};

	const categoryHandler = (category: EventCategory) => {
		if (formSelection.selectedCategories.includes(category)) {
			setFormSelection((prev) => ({
				...prev,
				selectedCategories: prev.selectedCategories.filter((c) => c !== category),
			}));
		} else if (formSelection.selectedCategories.length < 3) {
			setFormSelection((prev) => ({
				...prev,
				selectedCategories: [...prev.selectedCategories, category],
			}));
		}
	};

	if (eventLoading || !formData) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p className="text-muted-foreground">{t("loading")}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8 flex items-center justify-between">
					<Button
						variant="outline"
						onClick={() => router.push(`/events/${formData._id}`)}
						className="flex items-center gap-2 text-primary hover:text-primary-foreground hover:bg-primary border-primary transition-colors duration-200"
					>
						<ArrowLeft className="h-4 w-4" />
						{t("back_to_event")}
					</Button>
				</div>

				<Card className="p-6 bg-card text-card-foreground">
					<h1 className="text-3xl font-semibold text-foreground mb-6">{t("update_event")}</h1>

					<form onSubmit={submitHandler} className="space-y-6">
						{/* Event Name */}
						<div className="space-y-2">
							<label htmlFor="eventName" className="text-sm font-medium text-foreground">
								{t("event_name")} *
							</label>
							<Input
								id="eventName"
								name="eventName"
								value={formData.eventName}
								onChange={inputHandler}
								placeholder={t("enter_event_name")}
							/>
						</div>

						{/* Event Description */}
						<div className="space-y-2">
							<label htmlFor="eventDesc" className="text-sm font-medium text-foreground">
								{t("description")} *
							</label>
							<Textarea
								id="eventDesc"
								name="eventDesc"
								value={formData.eventDesc}
								onChange={inputHandler}
								placeholder={t("describe_your_event")}
								className="min-h-[120px]"
							/>
						</div>

						{/* Categories */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground">{t("categories_select_up_to_3")} *</label>
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
								{Object.values(EventCategory).map((category) => (
									<Button
										key={category}
										type="button"
										variant={formSelection.selectedCategories.includes(category) ? "default" : "outline"}
										onClick={() => categoryHandler(category)}
										disabled={
											formSelection.selectedCategories.length >= 3 &&
											!formSelection.selectedCategories.includes(category)
										}
										className="h-10"
									>
										{t(category.toLowerCase())}
									</Button>
								))}
							</div>
						</div>

						{/* Event Tags */}
						<div className="space-y-2">
							<label htmlFor="eventTags" className="text-sm font-medium text-foreground">
								{t("tags")} * <span className="text-muted-foreground text-xs">({t("comma-separated")})</span>
							</label>
							<Input
								id="eventTags"
								value={formSelection.eventTags}
								onChange={(e) => setFormSelection((prev) => ({ ...prev, eventTags: e.target.value }))}
								placeholder={t("e_g_networking_workshop_conference")}
							/>
						</div>

						{/* Is Real Event */}
						<div className="flex items-center space-x-2">
							<Checkbox
								id="isRealEvent"
								checked={formData.isRealEvent ?? true}
								onCheckedChange={(checked) => {
									setFormData((prev) => (prev ? { ...prev, isRealEvent: checked as boolean } : null));
								}}
							/>
							<label
								htmlFor="isRealEvent"
								className="text-sm font-medium text-foreground cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								{t("real_event")}
							</label>
						</div>

						{/* Event Dates */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* Start Date & Time */}
							<div className="space-y-4">
								<div className="space-y-2">
									<label className="text-sm font-medium text-foreground">{t("start_date")} *</label>
									<Input
										type="date"
										value={formData.eventStartAt ? new Date(formData.eventStartAt).toISOString().split("T")[0] : ""}
										onChange={(e) => {
											const selectedDate = e.target.value ? new Date(e.target.value) : new Date();
											const current = new Date(formData.eventStartAt || Date.now());
											selectedDate.setHours(current.getHours());
											selectedDate.setMinutes(current.getMinutes());
											const newStart = selectedDate;

											if (formData.eventEndAt && formData.eventEndAt <= newStart) {
												const newEnd = new Date(newStart);
												newEnd.setHours(newEnd.getHours() + 1);
												setFormData((prev) => (prev ? { ...prev, eventStartAt: newStart, eventEndAt: newEnd } : null));
											} else {
												setFormData((prev) => (prev ? { ...prev, eventStartAt: newStart } : null));
											}
										}}
									/>
								</div>
								<div className="flex gap-2">
									<Select
										value={formData.eventStartAt?.getHours().toString().padStart(2, "0")}
										onValueChange={(h) => {
											const d = new Date(formData.eventStartAt || Date.now());
											d.setHours(Number(h));
											const newStart = d;
											if (formData.eventEndAt && formData.eventEndAt <= newStart) {
												const newEnd = new Date(newStart);
												newEnd.setHours(newEnd.getHours() + 1);
												setFormData((prev) => (prev ? { ...prev, eventStartAt: newStart, eventEndAt: newEnd } : null));
											} else {
												setFormData((prev) => (prev ? { ...prev, eventStartAt: newStart } : null));
											}
										}}
									>
										<SelectTrigger className="w-20">
											<SelectValue placeholder="HH" />
										</SelectTrigger>
										<SelectContent>
											<ScrollArea className="h-[200px]">
												{[...Array(24)].map((_, i) => (
													<SelectItem key={i} value={i.toString().padStart(2, "0")}>
														{i.toString().padStart(2, "0")}
													</SelectItem>
												))}
											</ScrollArea>
										</SelectContent>
									</Select>
									<Select
										value={formData.eventStartAt?.getMinutes().toString().padStart(2, "0")}
										onValueChange={(m) => {
											const d = new Date(formData.eventStartAt || Date.now());
											d.setMinutes(Number(m));
											const newStart = d;
											if (formData.eventEndAt && formData.eventEndAt <= newStart) {
												const newEnd = new Date(newStart);
												newEnd.setMinutes(newEnd.getMinutes() + 30);
												setFormData((prev) => (prev ? { ...prev, eventStartAt: newStart, eventEndAt: newEnd } : null));
											} else {
												setFormData((prev) => (prev ? { ...prev, eventStartAt: newStart } : null));
											}
										}}
									>
										<SelectTrigger className="w-20">
											<SelectValue placeholder="MM" />
										</SelectTrigger>
										<SelectContent>
											<ScrollArea className="h-[200px]">
												{[...Array(12)].map((_, i) => (
													<SelectItem key={i * 5} value={(i * 5).toString().padStart(2, "0")}>
														{(i * 5).toString().padStart(2, "0")}
													</SelectItem>
												))}
											</ScrollArea>
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* End Date & Time */}
							<div className="space-y-4">
								<div className="space-y-2">
									<label className="text-sm font-medium text-foreground">{t("end_date")} *</label>
									<Input
										type="date"
										value={formData.eventEndAt ? new Date(formData.eventEndAt).toISOString().split("T")[0] : ""}
										onChange={(e) => {
											const selectedDate = e.target.value ? new Date(e.target.value) : new Date();
											const current = new Date(formData.eventEndAt || Date.now());
											selectedDate.setHours(current.getHours());
											selectedDate.setMinutes(current.getMinutes());
											setFormData((prev) => (prev ? { ...prev, eventEndAt: selectedDate } : null));
										}}
									/>
								</div>
								<div className="flex gap-2">
									<Select
										value={formData.eventEndAt?.getHours().toString().padStart(2, "0")}
										onValueChange={(h) => {
											const d = new Date(formData.eventEndAt || Date.now());
											d.setHours(Number(h));
											setFormData((prev) => (prev ? { ...prev, eventEndAt: d } : null));
										}}
									>
										<SelectTrigger className="w-20">
											<SelectValue placeholder="HH" />
										</SelectTrigger>
										<SelectContent>
											<ScrollArea className="h-[200px]">
												{[...Array(24)].map((_, i) => (
													<SelectItem key={i} value={i.toString().padStart(2, "0")}>
														{i.toString().padStart(2, "0")}
													</SelectItem>
												))}
											</ScrollArea>
										</SelectContent>
									</Select>
									<Select
										value={formData.eventEndAt?.getMinutes().toString().padStart(2, "0")}
										onValueChange={(m) => {
											const d = new Date(formData.eventEndAt || Date.now());
											d.setMinutes(Number(m));
											setFormData((prev) => (prev ? { ...prev, eventEndAt: d } : null));
										}}
									>
										<SelectTrigger className="w-20">
											<SelectValue placeholder="MM" />
										</SelectTrigger>
										<SelectContent>
											<ScrollArea className="h-[200px]">
												{[...Array(12)].map((_, i) => (
													<SelectItem key={i * 5} value={(i * 5).toString().padStart(2, "0")}>
														{(i * 5).toString().padStart(2, "0")}
													</SelectItem>
												))}
											</ScrollArea>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>

						{/* Location Details */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label htmlFor="eventCity" className="text-sm font-medium text-foreground">
									{t("city")} *
								</label>
								<Input
									id="eventCity"
									name="eventCity"
									value={formData.eventCity}
									onChange={inputHandler}
									placeholder={t("enter_city")}
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor="eventAddress" className="text-sm font-medium text-foreground">
									{t("address")} *
								</label>
								<Input
									id="eventAddress"
									name="eventAddress"
									value={formData.eventAddress}
									onChange={inputHandler}
									placeholder={t("enter_address")}
								/>
							</div>
						</div>

						{/* Capacity and Price */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label htmlFor="eventCapacity" className="text-sm font-medium text-foreground">
									{t("event_capacity_label")}
								</label>
								<Input
									id="eventCapacity"
									name="eventCapacity"
									type="number"
									value={formData.eventCapacity === undefined ? "" : String(formData.eventCapacity)}
									onChange={inputHandler}
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor="eventPrice" className="text-sm font-medium text-foreground">
									{t("price")}
								</label>
								<div className="flex gap-2">
									<Input
										id="eventPrice"
										name="eventPrice"
										type="number"
										min="0"
										value={formData.eventPrice === undefined ? "" : String(formData.eventPrice)}
										onChange={inputHandler}
									/>
									<Select
										value={formData.eventCurrency || Currency.USD}
										onValueChange={(cur: Currency) =>
											setFormData((prev) => (prev ? { ...prev, eventCurrency: cur } : null))
										}
									>
										<SelectTrigger className="w-24">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{Object.values(Currency).map((cur) => (
												<SelectItem key={cur} value={cur}>
													{cur}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>

						{/* Status */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground">{t("status")}</label>
							<Select
								value={formData.eventStatus}
								onValueChange={(val: EventStatus) =>
									setFormData((prev) => (prev ? { ...prev, eventStatus: val } : null))
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.values(EventStatus).map((status) => (
										<SelectItem key={status} value={status}>
											{status}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Image Upload */}
						<div className="space-y-4">
							<label className="text-sm font-medium text-foreground">{t("event_image")} *</label>
							<div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted/50 border-2">
								{uiState.imagePreview ? (
									<>
										<Image src={uiState.imagePreview} alt="Event preview" className="object-contain" fill />
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
								{uiState.isSubmitting ? t("updating") : t("update_event")}
							</Button>
						</div>
					</form>
				</Card>
			</div>
		</div>
	);
};

export default EventUpdatePage;
