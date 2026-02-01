"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client/react";
import { useTranslation } from "next-i18next";
import { userVar } from "@/apollo/store";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/libs/components/ui/button";
import { Card } from "@/libs/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/libs/components/ui/select";
import { ImageCropper } from "@/libs/components/common/ImageCropper";
import Loading from "@/libs/components/common/Loading";
import { EventNameField } from "@/libs/components/events/EventNameField";
import { EventDescriptionField } from "@/libs/components/events/EventDescriptionField";
import { EventCategoriesField } from "@/libs/components/events/EventCategoriesField";
import { EventTagsField } from "@/libs/components/events/EventTagsField";
import { IsRealEventCheckbox } from "@/libs/components/events/IsRealEventCheckbox";
import { EventDateAndTimePicker } from "@/libs/components/events/EventDateAndTimePicker";
import { LocationFields } from "@/libs/components/events/LocationFields";
import { CapacityAndPriceFields } from "@/libs/components/events/CapacityAndPriceFields";
import { EventImageUpload } from "@/libs/components/events/EventImageUpload";

import { EventCategory, EventStatus, EventLocationType } from "@/libs/enums/event.enum";
import { GET_EVENT } from "@/apollo/user/query";
import { UPDATE_EVENT_BY_ORGANIZER } from "@/apollo/user/mutation";
import { EventUpdateInput } from "@/libs/types/event/event.update";
import { smallError, smallSuccess } from "@/libs/alert";
import { uploadImage } from "@/libs/upload";
import { getImageUrl } from "@/libs/utils";

const EventUpdatePage = () => {
	const router = useRouter();
	const params = useParams();
	const { t, i18n } = useTranslation(["events", "errors"]);
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
				throw new Error(t("end_time_must_be_after_start_time"));
			}
			if (formSelection.locationType === EventLocationType.OFFLINE) {
				if (!formData.eventAddress?.trim()) throw new Error(t("please_enter_event_address"));
			}
			if (formData.eventCapacity !== undefined && formData.eventCapacity < 0) {
				throw new Error(t("event_capacity_cannot_be_negative"));
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
				eventCurrency: formData.eventCurrency || undefined,
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

			// Prevent negative values for capacity and price
			if (name === "eventCapacity" && numberValue < 0) {
				smallError(t("event_capacity_cannot_be_negative"));
				return;
			}
			if (name === "eventPrice" && numberValue < 0) {
				smallError(t("price_cannot_be_negative"));
				return;
			}

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
		return <Loading />;
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
						<EventNameField value={formData.eventName || ""} onChange={inputHandler} />

						{/* Event Description */}
						<EventDescriptionField value={formData.eventDesc || ""} onChange={inputHandler} />

						{/* Categories */}
						<EventCategoriesField
							selectedCategories={formSelection.selectedCategories}
							onCategoryToggle={categoryHandler}
						/>

						{/* Event Tags */}
						<EventTagsField
							value={formSelection.eventTags}
							onChange={(e) => setFormSelection((prev) => ({ ...prev, eventTags: e.target.value }))}
						/>

						{/* Is Real Event */}
						<IsRealEventCheckbox
							checked={formData.isRealEvent ?? true}
							onCheckedChange={(checked) => {
								setFormData((prev) => (prev ? { ...prev, isRealEvent: checked } : null));
							}}
						/>

						{/* Event Dates */}
						{formData && formData.eventStartAt && formData.eventEndAt && (
							<EventDateAndTimePicker
								startDate={formData.eventStartAt}
								endDate={formData.eventEndAt}
								onStartDateChange={(date) => setFormData((prev) => (prev ? { ...prev, eventStartAt: date } : null))}
								onEndDateChange={(date) => setFormData((prev) => (prev ? { ...prev, eventEndAt: date } : null))}
								onStartTimeChange={(date) => setFormData((prev) => (prev ? { ...prev, eventStartAt: date } : null))}
								onEndTimeChange={(date) => setFormData((prev) => (prev ? { ...prev, eventEndAt: date } : null))}
								locale={i18n.language}
								useCalendar={false}
							/>
						)}

						{/* Location Details */}
						{formData && (
							<LocationFields
								city={formData.eventCity || ""}
								address={formData.eventAddress || ""}
								locationType={formSelection.locationType}
								onCityChange={inputHandler}
								onAddressChange={inputHandler}
								showLocationType={false}
							/>
						)}

						{/* Capacity and Price */}
						{formData && (
							<CapacityAndPriceFields
								capacity={formData.eventCapacity}
								price={formData.eventPrice}
								currency={formData.eventCurrency || ""}
								onCapacityChange={inputHandler}
								onPriceChange={inputHandler}
								onCurrencyChange={(currency) => {
									setFormData((prev) => (prev ? { ...prev, eventCurrency: currency } : null));
								}}
							/>
						)}

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
						<EventImageUpload
							imagePreview={uiState.imagePreview}
							onImageChange={imageChangeHandler}
							changeLabel={t("change_image")}
						/>

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
