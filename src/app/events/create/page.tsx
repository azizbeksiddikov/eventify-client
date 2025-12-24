"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import Loading from "@/libs/components/common/Loading";

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
	const { t } = useTranslation(["events", "groups", "errors"]);
	const user = useReactiveVar(userVar);

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
							<label className="text-sm font-medium text-foreground">{t("event_type")} (opt)</label>
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
								{t("select_group")} (opt)
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
											className="py-3 hover:bg-accent hover:text-accent-foreground"
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
								className="bg-input text-input-foreground border-input"
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
								className="min-h-[120px] bg-input text-input-foreground border-input"
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
										className={`h-10 transition-all duration-200 ${
											formSelection.selectedCategories.includes(category)
												? "bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90"
												: "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
										} disabled:opacity-50 disabled:cursor-not-allowed`}
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
								name="eventTags"
								value={formSelection.eventTags}
								onChange={(e) => setFormSelection((prev) => ({ ...prev, eventTags: e.target.value }))}
								placeholder={t("e_g_networking_workshop_conference")}
								className="bg-input text-input-foreground border-input"
							/>
						</div>

						{/* Is Real Event */}
						<div className="flex items-center space-x-2">
							<Checkbox
								id="isRealEvent"
								checked={formData.isRealEvent ?? true}
								onCheckedChange={(checked) => {
									setFormData((prev) => ({ ...prev, isRealEvent: checked as boolean }));
								}}
							/>
							<label
								htmlFor="isRealEvent"
								className="text-sm font-medium text-foreground cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								{t("real_event")}
							</label>
						</div>

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
										{t("recurrence_end_date")} (opt)
									</label>
									<Input
										id="recurrenceEndDate"
										type="date"
										value={
											recurrenceState.recurrenceEndDate
												? new Date(recurrenceState.recurrenceEndDate).toISOString().split("T")[0]
												: ""
										}
										onChange={(e) =>
											setRecurrenceState((prev) => ({
												...prev,
												recurrenceEndDate: e.target.value ? new Date(e.target.value) : undefined,
											}))
										}
										min={new Date().toISOString().split("T")[0]}
										className="bg-input text-input-foreground border-input"
									/>
								</div>
							</div>
						)}

						{/* Event Date and Time */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* Start Date and Time */}
							<div className="space-y-4">
								<div className="space-y-2">
									<label htmlFor="eventStartDate" className="text-sm font-medium text-foreground">
										{t("start_date")} *
									</label>
									<Input
										id="eventStartDate"
										type="date"
										value={new Date(formData.eventStartAt).toISOString().split("T")[0]}
										onChange={(e) => {
											const selectedDate = e.target.value ? new Date(e.target.value) : new Date();
											const currentTime = new Date(formData.eventStartAt);
											selectedDate.setHours(currentTime.getHours());
											selectedDate.setMinutes(currentTime.getMinutes());
											const newStartDate = selectedDate;

											// If end date is before or equal to new start date, adjust it
											if (formData.eventEndAt <= newStartDate) {
												const newEndDate = new Date(newStartDate);
												newEndDate.setHours(newEndDate.getHours() + 1); // Add 1 hour to end date
												setFormData((prev) => ({ ...prev, eventStartAt: newStartDate, eventEndAt: newEndDate }));
											} else {
												setFormData((prev) => ({ ...prev, eventStartAt: newStartDate }));
											}
										}}
										min={new Date().toISOString().split("T")[0]}
										className="bg-input text-input-foreground border-input"
									/>
								</div>
								<div className="space-y-2">
									<label htmlFor="eventStartTime" className="text-sm font-medium text-foreground">
										{t("start_time")} *
									</label>
									<div className="flex gap-2">
										<Select
											value={formData.eventStartAt.getHours().toString().padStart(2, "0")}
											onValueChange={(hour) => {
												const currentTime = new Date(formData.eventStartAt);
												currentTime.setHours(Number(hour));
												const newStartDate = currentTime;

												// If end date is before or equal to new start date, adjust it
												if (formData.eventEndAt <= newStartDate) {
													const newEndDate = new Date(newStartDate);
													newEndDate.setHours(newEndDate.getHours() + 1); // Add 1 hour to end date
													setFormData((prev) => ({ ...prev, eventStartAt: newStartDate, eventEndAt: newEndDate }));
												} else {
													setFormData((prev) => ({ ...prev, eventStartAt: newStartDate }));
												}
											}}
										>
											<SelectTrigger className="w-20 bg-input text-input-foreground border-input hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
												<SelectValue placeholder="HH" />
											</SelectTrigger>
											<SelectContent className="bg-popover text-popover-foreground  ">
												<ScrollArea className="h-[200px]">
													{[...Array(24)].map((_, i) => (
														<SelectItem
															key={i}
															value={i.toString().padStart(2, "0")}
															className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
														>
															{i.toString().padStart(2, "0")}
														</SelectItem>
													))}
												</ScrollArea>
											</SelectContent>
										</Select>
										<Select
											value={formData.eventStartAt.getMinutes().toString().padStart(2, "0")}
											onValueChange={(minute) => {
												const currentTime = new Date(formData.eventStartAt);
												currentTime.setMinutes(Number(minute));
												const newStartDate = currentTime;

												// If end date is before or equal to new start date, adjust it
												if (formData.eventEndAt <= newStartDate) {
													const newEndDate = new Date(newStartDate);
													newEndDate.setMinutes(newEndDate.getMinutes() + 30); // Add 30 minutes to end date
													setFormData((prev) => ({ ...prev, eventStartAt: newStartDate, eventEndAt: newEndDate }));
												} else {
													setFormData((prev) => ({ ...prev, eventStartAt: newStartDate }));
												}
											}}
										>
											<SelectTrigger className="w-20 bg-input text-input-foreground border-input hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
												<SelectValue placeholder="MM" />
											</SelectTrigger>
											<SelectContent className="bg-popover text-popover-foreground  ">
												<ScrollArea className="h-[200px]">
													{[...Array(12)].map((_, i) => {
														const minute = (i * 5).toString().padStart(2, "0");
														return (
															<SelectItem
																key={minute}
																value={minute}
																className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
															>
																{minute}
															</SelectItem>
														);
													})}
												</ScrollArea>
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>
							{/* End Date and Time */}
							<div className="space-y-4">
								<div className="space-y-2">
									<label htmlFor="eventEndDate" className="text-sm font-medium text-foreground">
										{t("end_date")} *
									</label>
									<Input
										id="eventEndDate"
										type="date"
										value={new Date(formData.eventEndAt).toISOString().split("T")[0]}
										onChange={(e) => {
											const selectedDate = e.target.value ? new Date(e.target.value) : new Date();
											const currentTime = new Date(formData.eventEndAt);
											selectedDate.setHours(currentTime.getHours());
											selectedDate.setMinutes(currentTime.getMinutes());
											const newEndDate = selectedDate;

											// If end date is before or equal to start date, adjust it
											if (newEndDate <= formData.eventStartAt) {
												const adjustedEndDate = new Date(formData.eventStartAt);
												adjustedEndDate.setHours(adjustedEndDate.getHours() + 1); // Add 1 hour to start date
												setFormData((prev) => ({ ...prev, eventEndAt: adjustedEndDate }));
											} else {
												setFormData((prev) => ({ ...prev, eventEndAt: newEndDate }));
											}
										}}
										min={new Date(formData.eventStartAt).toISOString().split("T")[0]}
										className={`bg-input text-input-foreground border-input ${
											formData.eventEndAt <= formData.eventStartAt ? "border-destructive" : ""
										}`}
									/>
									{formData.eventEndAt <= formData.eventStartAt && (
										<p className="text-sm text-destructive mt-1">{t("end_date_must_be_after_start_date")}</p>
									)}
								</div>
								<div className="space-y-2">
									<label htmlFor="eventEndTime" className="text-sm font-medium text-foreground">
										{t("end_time")} *
									</label>
									<div className="flex gap-2">
										<Select
											value={formData.eventEndAt.getHours().toString().padStart(2, "0")}
											onValueChange={(hour) => {
												const currentTime = new Date(formData.eventEndAt);
												currentTime.setHours(Number(hour));
												const newEndDate = currentTime;

												// If end date is before or equal to start date, adjust it
												if (newEndDate <= formData.eventStartAt) {
													const adjustedEndDate = new Date(formData.eventStartAt);
													adjustedEndDate.setHours(adjustedEndDate.getHours() + 1); // Add 1 hour to start date
													setFormData((prev) => ({ ...prev, eventEndAt: adjustedEndDate }));
												} else {
													setFormData((prev) => ({ ...prev, eventEndAt: newEndDate }));
												}
											}}
										>
											<SelectTrigger className="w-20 bg-input text-input-foreground border-input hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
												<SelectValue placeholder="HH" />
											</SelectTrigger>
											<SelectContent className="bg-popover text-popover-foreground  ">
												<ScrollArea className="h-[200px]">
													{[...Array(24)].map((_, i) => (
														<SelectItem
															key={i}
															value={i.toString().padStart(2, "0")}
															className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
														>
															{i.toString().padStart(2, "0")}
														</SelectItem>
													))}
												</ScrollArea>
											</SelectContent>
										</Select>
										<Select
											value={formData.eventEndAt.getMinutes().toString().padStart(2, "0")}
											onValueChange={(minute) => {
												const currentTime = new Date(formData.eventEndAt);
												currentTime.setMinutes(Number(minute));
												const newEndDate = currentTime;

												// If end date is before or equal to start date, adjust it
												if (newEndDate <= formData.eventStartAt) {
													const adjustedEndDate = new Date(formData.eventStartAt);
													adjustedEndDate.setMinutes(adjustedEndDate.getMinutes() + 30); // Add 30 minutes to start date
													setFormData((prev) => ({ ...prev, eventEndAt: adjustedEndDate }));
												} else {
													setFormData((prev) => ({ ...prev, eventEndAt: newEndDate }));
												}
											}}
										>
											<SelectTrigger className="w-20 bg-input text-input-foreground border-input hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
												<SelectValue placeholder="MM" />
											</SelectTrigger>
											<SelectContent className="bg-popover text-popover-foreground  ">
												<ScrollArea className="h-[200px]">
													{[...Array(12)].map((_, i) => {
														const minute = (i * 5).toString().padStart(2, "0");
														return (
															<SelectItem
																key={minute}
																value={minute}
																className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
															>
																{minute}
															</SelectItem>
														);
													})}
												</ScrollArea>
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>
						</div>

						{/* Location Type */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground">{t("location_type")} *</label>
							<Select
								value={formSelection.locationType}
								onValueChange={(value: EventLocationType) => {
									setFormSelection((prev) => ({ ...prev, locationType: value }));
								}}
							>
								<SelectTrigger className="w-full bg-input text-input-foreground border-input">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="bg-popover text-popover-foreground">
									<SelectItem value={EventLocationType.ONLINE}>{t("online")}</SelectItem>
									<SelectItem value={EventLocationType.OFFLINE}>{t("offline")}</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Location - Only show for offline events */}
						{formSelection.locationType === EventLocationType.OFFLINE && (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<label htmlFor="eventCity" className="text-sm font-medium text-foreground">
										{t("city")} (opt)
									</label>
									<Input
										id="eventCity"
										name="eventCity"
										value={formData.eventCity || ""}
										onChange={inputHandler}
										placeholder={t("enter_city")}
										className="bg-input text-input-foreground border-input"
									/>
								</div>
								<div className="space-y-2">
									<label htmlFor="eventAddress" className="text-sm font-medium text-foreground">
										{t("address")} *
									</label>
									<Input
										id="eventAddress"
										name="eventAddress"
										value={formData.eventAddress || ""}
										onChange={inputHandler}
										placeholder={t("enter_address")}
										className="bg-input text-input-foreground border-input"
									/>
								</div>
							</div>
						)}

						{/* Capacity and Price */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label htmlFor="eventCapacity" className="text-sm font-medium text-foreground">
									{t("capacity_number")} (opt)
								</label>
								<Input
									id="eventCapacity"
									name="eventCapacity"
									type="number"
									value={formData.eventCapacity === undefined ? "" : String(formData.eventCapacity)}
									onChange={inputHandler}
									placeholder={t("event_capacity_placeholder")}
									className="bg-input text-input-foreground border-input"
								/>
							</div>
							<div className="space-y-2">
								<label htmlFor="eventPrice" className="text-sm font-medium text-foreground">
									{t("price")} (opt)
								</label>
								<div className="flex gap-2">
									<Input
										id="eventPrice"
										name="eventPrice"
										type="number"
										min="0"
										// Convert to string and strip leading zeros when displaying
										value={formData.eventPrice === undefined ? "" : String(formData.eventPrice)}
										onChange={inputHandler}
										placeholder={t("enter_event_price")}
										className="bg-input text-input-foreground border-input"
									/>
									<Select
										value={formData.eventCurrency || Currency.USD}
										onValueChange={(currency) => {
											setFormData((prev) => ({ ...prev, eventCurrency: currency as Currency }));
										}}
									>
										<SelectTrigger className="w-24 bg-input text-input-foreground border-input hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
											<SelectValue placeholder={t("currency")} />
										</SelectTrigger>
										<SelectContent className="bg-popover text-popover-foreground">
											{Object.values(Currency).map((currency) => (
												<SelectItem
													key={currency}
													value={currency}
													className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
												>
													{currency}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>

						{/* Image Section */}
						<div className="space-y-4">
							<label className="text-sm font-medium text-foreground">{t("event_image")} *</label>
							<div className="relative aspect-video w-full max-w-2xl mx-auto rounded-xl overflow-hidden bg-muted/50 rounded-t-xl">
								{uiState.imagePreview ? (
									<>
										<Image src={uiState.imagePreview} alt={t("event_preview")} className="w-full h-full" fill />

										<label
											htmlFor="image"
											className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors duration-200 cursor-pointer"
										>
											<div className="flex items-center gap-2 bg-white/90 text-foreground px-4 py-2 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200">
												<RefreshCw className="h-4 w-4" />
												<span className="font-medium">{t("reset_image")}</span>
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
								<input
									id="image"
									name="image"
									type="file"
									accept={imageTypes}
									onChange={imageChangeHandler}
									className="hidden"
								/>
								<p className="text-sm text-muted-foreground mt-1">{t("only_jpg_jpeg_png_allowed")}</p>
							</div>
						</div>

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
