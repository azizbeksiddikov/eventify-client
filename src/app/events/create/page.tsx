"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client/react";
import { useTranslation } from "next-i18next";
import { userVar } from "@/apollo/store";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { format, Locale } from "date-fns";
import { enUS, ko, ru, uz } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/libs/components/ui/popover";
import { Calendar } from "@/libs/components/common/calendar";
import { Input } from "@/libs/components/ui/input";

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

import { EventCategory, EventStatus, EventType, EventLocationType, RecurrenceType } from "@/libs/enums/event.enum";
import { GET_MY_GROUPS } from "@/apollo/user/query";
import { CREATE_EVENT, CREATE_RECURRING_EVENT } from "@/apollo/user/mutation";
import { EventInput, EventRecurrenceInput } from "@/libs/types/event/event.input";
import { Group } from "@/libs/types/group/group";
import { smallError, smallSuccess } from "@/libs/alert";
import { Currency } from "@/libs/enums/common.enum";
import { imageTypes, NEXT_APP_API_URL } from "@/libs/config";
import { uploadImage } from "@/libs/upload";

const EventCreatePage = () => {
	const router = useRouter();
	const { t, i18n } = useTranslation(["events", "groups", "errors"]);
	const user = useReactiveVar(userVar);

	const localeMap: Record<string, Locale> = {
		en: enUS,
		ko: ko,
		ru: ru,
		uz: uz,
	};

	const currentLocale = localeMap[i18n.language] || enUS;

	const [groups, setGroups] = useState<Group[]>([]);

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
		selectedGroup: null as Group | null,
		eventType: EventType.ONCE as EventType,
		locationType: EventLocationType.OFFLINE as EventLocationType,
		eventTags: "",
	});

	// Recurring Event State
	const [recurrenceState, setRecurrenceState] = useState({
		recurrenceType: "" as RecurrenceType | "",
		recurrenceInterval: undefined as number | undefined,
		recurrenceDaysOfWeek: [] as number[],
		recurrenceDayOfMonth: undefined as number | undefined,
		recurrenceEndDate: undefined as Date | undefined,
	});

	// Main Form Data
	const [formData, setFormData] = useState<EventInput>({
		eventType: EventType.ONCE,
		eventName: "",
		eventDesc: "",
		eventImages: [],
		eventStartAt: new Date(),
		eventEndAt: new Date(),
		locationType: EventLocationType.OFFLINE,
		eventCity: "",
		eventAddress: "",
		eventStatus: EventStatus.UPCOMING,
		groupId: "",
		eventCategories: [],
		eventTags: [],
		eventCurrency: Currency.USD,
		isRealEvent: true,
	});

	// Sync locationType with formData
	useEffect(() => {
		setFormData((prev) => ({ ...prev, locationType: formSelection.locationType }));
	}, [formSelection.locationType]);

	// Sync eventType with formData
	useEffect(() => {
		setFormData((prev) => ({ ...prev, eventType: formSelection.eventType }));
	}, [formSelection.eventType]);

	/** APOLLO REQUESTS **/
	const [createEvent] = useMutation(CREATE_EVENT);
	const [createRecurringEvent] = useMutation(CREATE_RECURRING_EVENT);

	const { data: groupsData, loading: groupsLoading } = useQuery(GET_MY_GROUPS, {
		fetchPolicy: "cache-and-network",
		skip: !user._id,
		notifyOnNetworkStatusChange: true,
	});

	useEffect(() => {
		if (groupsData?.getMyGroups) setGroups(groupsData.getMyGroups);
	}, [groupsData]);

	/** HANDLERS */

	const handleImageUpload = async (image: File) => {
		try {
			const responseImage = await uploadImage(image, "event");
			const imageUrl = `${NEXT_APP_API_URL}/${responseImage}`;

			// Update form data and preview
			setFormData((prev) => ({ ...prev, eventImages: [responseImage] }));
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
		setUiState((prev) => ({ ...prev, isSubmitting: true }));

		try {
			if (!user._id) throw new Error(t("errors:not_authenticated"));
			if (!formData) throw new Error(t("errors:invalid_form_data"));

			// Validate in order of form appearance
			if (!formData?.groupId) throw new Error(t("please_select_group"));
			if (!formData?.eventName || formData.eventName.trim() === "") throw new Error(t("please_enter_event_name"));
			if (!formData?.eventDesc || formData.eventDesc.trim() === "")
				throw new Error(t("please_enter_event_description"));
			if (formSelection.selectedCategories.length === 0) throw new Error(t("please_select_at_least_one_category"));
			if (!formSelection.eventTags || formSelection.eventTags.trim() === "")
				throw new Error(t("please_enter_event_tags"));
			if (!formData.eventStartAt) throw new Error(t("please_select_event_start_date_time"));
			if (!formData.eventEndAt) throw new Error(t("please_select_event_end_date_time"));
			if (formData.eventEndAt <= formData.eventStartAt) {
				throw new Error(t("end_date_must_be_after_start_date"));
			}
			if (formSelection.locationType === EventLocationType.OFFLINE) {
				if (!formData.eventAddress || formData.eventAddress.trim() === "")
					throw new Error(t("please_enter_event_address"));
			}
			if (formData.eventCapacity !== undefined && formData.eventCapacity < 1) {
				throw new Error(t("event_capacity_must_be_at_least_1"));
			}
			if (formData.eventPrice !== undefined && formData.eventPrice < 0) throw new Error(t("price_cannot_be_negative"));
			if (!formData.eventImages.length) throw new Error(t("please_upload_event_image"));

			// Parse event tags from comma-separated string
			const tagsArray = formSelection.eventTags
				.split(",")
				.map((tag) => tag.trim())
				.filter((tag) => tag.length > 0);

			// Set default price to 0 if not provided
			if (formData.eventPrice === undefined) formData.eventPrice = 0;

			// 2. Prepare Shared Data (fields common to both inputs)
			const commonData = {
				eventName: formData.eventName,
				eventDesc: formData.eventDesc,
				eventImages: formData.eventImages,
				eventStartAt: formData.eventStartAt,
				eventEndAt: formData.eventEndAt,
				locationType: formSelection.locationType,
				eventCity: formData.eventCity,
				eventAddress: formData.eventAddress,
				eventCapacity: formData.eventCapacity,
				eventPrice: formData.eventPrice,
				eventCurrency: formData.eventCurrency,
				eventStatus: formData.eventStatus,
				eventCategories: formSelection.selectedCategories,
				eventTags: tagsArray,
				isRealEvent: formData.isRealEvent ?? true,
				groupId: formData.groupId,
			};

			if (formSelection.eventType === EventType.RECURRING) {
				// Validate recurring event fields
				if (!recurrenceState.recurrenceType) throw new Error(t("please_select_recurrence_type"));
				if (recurrenceState.recurrenceType === RecurrenceType.INTERVAL && !recurrenceState.recurrenceInterval) {
					throw new Error(t("please_enter_recurrence_interval"));
				}
				if (
					recurrenceState.recurrenceType === RecurrenceType.DAYS_OF_WEEK &&
					recurrenceState.recurrenceDaysOfWeek.length === 0
				) {
					throw new Error(t("please_select_at_least_one_day_of_week"));
				}
				if (recurrenceState.recurrenceType === RecurrenceType.DAY_OF_MONTH && !recurrenceState.recurrenceDayOfMonth) {
					throw new Error(t("please_enter_day_of_month"));
				}

				const recurringEventInput: EventRecurrenceInput = {
					...commonData,
					recurrenceType: recurrenceState.recurrenceType as RecurrenceType,
					recurrenceInterval: recurrenceState.recurrenceInterval,
					recurrenceDaysOfWeek:
						recurrenceState.recurrenceType === RecurrenceType.DAYS_OF_WEEK
							? recurrenceState.recurrenceDaysOfWeek
							: undefined,
					recurrenceDayOfMonth:
						recurrenceState.recurrenceType === RecurrenceType.DAY_OF_MONTH
							? recurrenceState.recurrenceDayOfMonth
							: undefined,
					recurrenceEndDate: recurrenceState.recurrenceEndDate,
				};

				await createRecurringEvent({
					variables: { input: recurringEventInput },
				});

				await smallSuccess(t("event_created_successfully"));
				router.push(`/events`);
			} else {
				const eventInput: EventInput = {
					...commonData,
					eventType: EventType.ONCE,
				};

				const { data: createEventData } = await createEvent({
					variables: { input: eventInput },
				});

				await smallSuccess(t("event_created_successfully"));
				router.push(`/events/${createEventData?.createEvent?._id}`);
			}
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : t("errors:something_went_wrong");
			smallError(errorMessage);
			console.log(errorMessage);
		} finally {
			setUiState((prev) => ({ ...prev, isSubmitting: false }));
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
				smallError(t("invalid_number"));
				return;
			}

			// Prevent negative values for price
			if (name === "eventPrice" && numberValue < 0) {
				smallError(t("price_cannot_be_negative"));
				return;
			}

			setFormData((prev) => ({ ...prev, [name]: numberValue }));
		} else {
			setFormData((prev) => ({ ...prev, [name]: value }));
		}
	};

	const categoryHandler = (category: EventCategory) => {
		if (formSelection.selectedCategories.includes(category)) {
			// If category is already selected, remove it
			setFormSelection((prev) => ({
				...prev,
				selectedCategories: prev.selectedCategories.filter((c) => c !== category),
			}));
		} else if (formSelection.selectedCategories.length < 3) {
			// If category is not selected and we haven't reached the limit, add it
			setFormSelection((prev) => ({
				...prev,
				selectedCategories: [...prev.selectedCategories, category],
			}));
		}
	};

	// Show loading state while fetching groups
	if (groupsLoading) return <Loading />;

	if (groups.length === 0 && groupsData) {
		return (
			<div className="min-h-screen bg-background">
				<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="mb-8">
						<Button
							variant="outline"
							onClick={() => router.push("/events")}
							className="flex items-center gap-2 text-primary hover:text-primary-foreground hover:bg-primary border-primary hover:border-primary/80 transition-colors duration-200"
						>
							<ArrowLeft className="h-4 w-4" />
							{t("back_to_events")}
						</Button>
					</div>

					<Card className="p-6 bg-card text-card-foreground">
						<div className="text-center py-8">
							<h2 className="text-2xl font-semibold text-foreground mb-4">{t("no_groups_found")}</h2>
							<p className="text-muted-foreground mb-6">
								{t("you_need_to_create_a_group_first_before_creating_events")}
							</p>
							<Button
								onClick={() => router.push("/groups/create")}
								className="bg-primary text-primary-foreground hover:bg-primary/90"
							>
								{t("groups:create_group")}
							</Button>
						</div>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<Button
						variant="outline"
						onClick={() => router.push("/events")}
						className="flex items-center gap-2 text-primary hover:text-primary-foreground hover:bg-primary border-primary hover:border-primary/80 transition-colors duration-200"
					>
						<ArrowLeft className="h-4 w-4" />
						{t("back_to_events")}
					</Button>
				</div>

				<Card className="p-6 bg-card text-card-foreground">
					<h1 className="text-3xl font-semibold text-foreground mb-6">{t("create_new_event")}</h1>

					<form onSubmit={submitHandler} className="space-y-6">
						{/* Event Type Selection */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground">
								{t("event_type")} {t("events:optional")}
							</label>
							<Select
								value={formSelection.eventType}
								onValueChange={(value: EventType) => {
									setFormSelection((prev) => ({ ...prev, eventType: value }));
									if (value === EventType.ONCE) {
										// Reset recurring fields when switching to ONCE
										setRecurrenceState({
											recurrenceType: "",
											recurrenceInterval: undefined,
											recurrenceDaysOfWeek: [],
											recurrenceDayOfMonth: undefined,
											recurrenceEndDate: undefined,
										});
									}
								}}
							>
								<SelectTrigger className="w-full bg-input text-input-foreground border-input">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-popover text-popover-foreground">
									<SelectItem value={EventType.ONCE}>{t("one_time_event")}</SelectItem>
									<SelectItem value={EventType.RECURRING}>{t("recurring_event")}</SelectItem>
								</SelectContent>
							</Select>
						</div>
						{/* Group Selection */}
						<div className="space-y-2">
							<label htmlFor="groupId" className="text-sm font-medium text-foreground">
								{t("select_group")} {t("events:optional")}
							</label>
							<Select
								value={formData.groupId}
								onValueChange={(value: string) => {
									const selectedGroup = groups.find((group) => group._id === value);
									if (selectedGroup) {
										setFormSelection((prev) => ({ ...prev, selectedGroup }));
										setFormData((prev) => ({ ...prev, groupId: value }));
									}
								}}
							>
								<SelectTrigger className="w-full bg-input text-input-foreground border-input">
									<SelectValue placeholder={t("select_a_group")}>
										{formData.groupId && (
											<div className="flex items-center space-x-3">
												<div className="relative h-8 w-8 rounded-full overflow-hidden">
													<Image
														src={`${NEXT_APP_API_URL}/${formSelection.selectedGroup?.groupImage}`}
														alt={t("group_preview")}
														className="object-cover w-full h-full"
														fill
													/>
												</div>
												<span className="text-foreground">{formSelection.selectedGroup?.groupName}</span>
											</div>
										)}
									</SelectValue>
								</SelectTrigger>
								<SelectContent className="bg-popover text-popover-foreground  ">
									{groups.map((group: Group) => (
										<SelectItem
											key={group._id}
											value={group._id}
											className="py-3 hover:bg-primary/10 hover:text-primary"
										>
											<div className="flex items-center space-x-4">
												<div className="relative h-10 w-10 rounded-full overflow-hidden">
													<Image
														src={`${NEXT_APP_API_URL}/${group.groupImage}`}
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
						<EventNameField
							value={formData.eventName}
							onChange={inputHandler}
							className="bg-input text-input-foreground border-input"
						/>

						{/* Event Description */}
						<EventDescriptionField
							value={formData.eventDesc}
							onChange={inputHandler}
							className="bg-input text-input-foreground border-input"
						/>

						{/* Categories */}
						<EventCategoriesField
							selectedCategories={formSelection.selectedCategories}
							onCategoryToggle={categoryHandler}
						/>

						{/* Event Tags */}
						<EventTagsField
							value={formSelection.eventTags}
							onChange={(e) => setFormSelection((prev) => ({ ...prev, eventTags: e.target.value }))}
							className="bg-input text-input-foreground border-input"
						/>

						{/* Is Real Event */}
						<IsRealEventCheckbox
							checked={formData.isRealEvent ?? true}
							onCheckedChange={(checked) => {
								setFormData((prev) => ({ ...prev, isRealEvent: checked }));
							}}
						/>

						{/* Recurring Event Fields */}
						{formSelection.eventType === EventType.RECURRING && (
							<div className="space-y-4 p-4 border rounded-lg bg-muted/30">
								<h3 className="text-lg font-semibold text-foreground">{t("recurrence_settings")}</h3>

								{/* Recurrence Type */}
								<div className="space-y-2">
									<label className="text-sm font-medium text-foreground">{t("recurrence_type")} *</label>
									<Select
										value={recurrenceState.recurrenceType}
										onValueChange={(value: RecurrenceType) => {
											setRecurrenceState((prev) => ({
												...prev,
												recurrenceType: value,
												recurrenceInterval: undefined,
												recurrenceDaysOfWeek: [],
												recurrenceDayOfMonth: undefined,
											}));
										}}
									>
										<SelectTrigger className="w-full bg-input text-input-foreground border-input">
											<SelectValue placeholder={t("select_recurrence_type")} />
										</SelectTrigger>
										<SelectContent className="bg-popover text-popover-foreground">
											<SelectItem value={RecurrenceType.INTERVAL}>{t("every_n_days")}</SelectItem>
											<SelectItem value={RecurrenceType.DAYS_OF_WEEK}>{t("weekly_on_specific_days")}</SelectItem>
											<SelectItem value={RecurrenceType.DAY_OF_MONTH}>{t("monthly_on_specific_day")}</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{/* Recurrence Interval */}
								{recurrenceState.recurrenceType === RecurrenceType.INTERVAL && (
									<div className="space-y-2">
										<label htmlFor="recurrenceInterval" className="text-sm font-medium text-foreground">
											{t("repeat_every_days")} *
										</label>
										<Input
											id="recurrenceInterval"
											type="number"
											min="1"
											value={
												recurrenceState.recurrenceInterval === undefined
													? ""
													: String(recurrenceState.recurrenceInterval)
											}
											onChange={(e) =>
												setRecurrenceState((prev) => ({
													...prev,
													recurrenceInterval: e.target.value ? Number(e.target.value) : undefined,
												}))
											}
											placeholder={t("e_g_7_for_weekly")}
											className="bg-input text-input-foreground border-input"
										/>
									</div>
								)}

								{/* Days of Week */}
								{recurrenceState.recurrenceType === RecurrenceType.DAYS_OF_WEEK && (
									<div className="space-y-2">
										<label className="text-sm font-medium text-foreground">{t("days_of_week")} *</label>
										<div className="grid grid-cols-7 gap-2">
											{[
												{ value: 0, label: t("sun") },
												{ value: 1, label: t("mon") },
												{ value: 2, label: t("tue") },
												{ value: 3, label: t("wed") },
												{ value: 4, label: t("thu") },
												{ value: 5, label: t("fri") },
												{ value: 6, label: t("sat") },
											].map((day) => (
												<Button
													key={day.value}
													type="button"
													variant={recurrenceState.recurrenceDaysOfWeek.includes(day.value) ? "default" : "outline"}
													onClick={() => {
														if (recurrenceState.recurrenceDaysOfWeek.includes(day.value)) {
															setRecurrenceState((prev) => ({
																...prev,
																recurrenceDaysOfWeek: prev.recurrenceDaysOfWeek.filter((d) => d !== day.value),
															}));
														} else {
															setRecurrenceState((prev) => ({
																...prev,
																recurrenceDaysOfWeek: [...prev.recurrenceDaysOfWeek, day.value],
															}));
														}
													}}
													className={`h-10 ${
														recurrenceState.recurrenceDaysOfWeek.includes(day.value)
															? "bg-primary text-primary-foreground"
															: "bg-transparent"
													}`}
												>
													{day.label}
												</Button>
											))}
										</div>
									</div>
								)}

								{/* Day of Month */}
								{recurrenceState.recurrenceType === RecurrenceType.DAY_OF_MONTH && (
									<div className="space-y-2">
										<label htmlFor="recurrenceDayOfMonth" className="text-sm font-medium text-foreground">
											{t("day_of_month")} *
										</label>
										<Input
											id="recurrenceDayOfMonth"
											type="number"
											min="1"
											max="31"
											value={
												recurrenceState.recurrenceDayOfMonth === undefined
													? ""
													: String(recurrenceState.recurrenceDayOfMonth)
											}
											onChange={(e) =>
												setRecurrenceState((prev) => ({
													...prev,
													recurrenceDayOfMonth: e.target.value ? Number(e.target.value) : undefined,
												}))
											}
											placeholder={t("e_g_15_for_15th_of_each_month")}
											className="bg-input text-input-foreground border-input"
										/>
									</div>
								)}

								{/* Recurrence End Date */}
								<div className="space-y-2">
									<label htmlFor="recurrenceEndDate" className="text-sm font-medium text-foreground">
										{t("recurrence_end_date")} {t("events:optional")}
									</label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className="w-full justify-start text-left font-normal bg-input text-input-foreground border-input"
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{recurrenceState.recurrenceEndDate
													? format(recurrenceState.recurrenceEndDate, "PPP", { locale: currentLocale })
													: t("pick_a_date")}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={recurrenceState.recurrenceEndDate}
												onSelect={(date) => {
													setRecurrenceState((prev) => ({
														...prev,
														recurrenceEndDate: date,
													}));
												}}
												initialFocus
												locale={currentLocale}
												disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
											/>
										</PopoverContent>
									</Popover>
								</div>
							</div>
						)}

						{/* Event Date and Time */}
						<EventDateAndTimePicker
							startDate={formData.eventStartAt}
							endDate={formData.eventEndAt}
							onStartDateChange={(date) => setFormData((prev) => ({ ...prev, eventStartAt: date }))}
							onEndDateChange={(date) => setFormData((prev) => ({ ...prev, eventEndAt: date }))}
							onStartTimeChange={(date) => setFormData((prev) => ({ ...prev, eventStartAt: date }))}
							onEndTimeChange={(date) => setFormData((prev) => ({ ...prev, eventEndAt: date }))}
							locale={i18n.language}
							useCalendar={true}
							className="bg-input text-input-foreground border-input bg-popover text-popover-foreground data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
						/>

						{/* Location Type and Fields */}
						<LocationFields
							city={formData.eventCity || ""}
							address={formData.eventAddress || ""}
							locationType={formSelection.locationType}
							onCityChange={inputHandler}
							onAddressChange={inputHandler}
							showLocationType={true}
							onLocationTypeChange={(value) => {
								setFormSelection((prev) => ({ ...prev, locationType: value }));
							}}
							className="bg-input text-input-foreground border-input bg-popover text-popover-foreground"
						/>

						{/* Capacity and Price */}
						<CapacityAndPriceFields
							capacity={formData.eventCapacity}
							price={formData.eventPrice}
							currency={formData.eventCurrency || Currency.USD}
							onCapacityChange={inputHandler}
							onPriceChange={inputHandler}
							onCurrencyChange={(currency) => {
								setFormData((prev) => ({ ...prev, eventCurrency: currency }));
							}}
							className="bg-input text-input-foreground border-input bg-popover text-popover-foreground"
						/>

						{/* Image Section */}
						<EventImageUpload
							imagePreview={uiState.imagePreview}
							onImageChange={imageChangeHandler}
							className="rounded-t-xl"
						/>

						{/* Image Cropper Modal */}
						<ImageCropper
							isOpen={uiState.isCropperOpen}
							onClose={() => {
								setUiState((prev) => ({ ...prev, isCropperOpen: false, tempImageUrl: null }));
							}}
							onCropComplete={cropCompleteHandler}
							imageUrl={uiState.tempImageUrl || ""}
						/>

						{/* Submit Button */}
						<div className="flex justify-end">
							<Button
								type="submit"
								size="lg"
								disabled={uiState.isSubmitting}
								className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-8"
							>
								{uiState.isSubmitting ? t("creating") : t("create_event")}
							</Button>
						</div>
					</form>
				</Card>
			</div>
		</div>
	);
};

export default EventCreatePage;
