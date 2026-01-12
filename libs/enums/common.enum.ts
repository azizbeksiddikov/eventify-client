// ===== Messages =====
export enum Message {
	// ===== General Messages =====
	SOMETHING_WENT_WRONG = "Something went wrong. Please try again later.",
	NO_DATA_FOUND = "No data found for your request.",
	CREATE_FAILED = "Failed to create the record. Please try again.",
	UPDATE_FAILED = "Failed to update the record. Please try again.",
	REMOVE_FAILED = "Failed to remove the record. Please try again.",
	UPLOAD_FAILED = "Failed to upload the file. Please try again.",
	BAD_REQUEST = "Invalid request. Please check your input.",
	INVALID_SORT_OPTION = "Invalid sort option",
	INVALID_FORM_DATA = "Invalid form data",

	// ===== Member Related Messages =====
	USERNAME_REQUIRED = "Username is required",
	PASSWORD_REQUIRED = "Password is required",
	LOGIN_FAILED = "Login failed. Please try again.",
	EMAIL_REQUIRED = "Email is required",
	INVALID_EMAIL = "Please enter a valid email address",
	FULL_NAME_REQUIRED = "Full name is required",
	PASSWORD_TOO_SHORT = "Password must be at least 8 characters",
	CONFIRM_PASSWORD_REQUIRED = "Please confirm your password",
	PASSWORDS_DONT_MATCH = "Passwords do not match",
	NOT_AUTHENTICATED = "You are not authenticated",
	NOT_AUTHORIZED = "You are not authorized",
	SIGNUP_FAILED = "Signup failed. Please try again.",
	MEMBER_UPDATED_SUCCESSFULLY = "Member updated successfully",
	// ===== Event Related Messages =====

	EVENT_NOT_FOUND = "Event not found",
	INVALID_TIME_SELECTION = "Invalid time selection",
	EVENT_NAME_REQUIRED = "Event name is required",
	EVENT_DESCRIPTION_REQUIRED = "Event description is required",
	EVENT_CATEGORY_REQUIRED = "Select at least one category",
	EVENT_DATE_REQUIRED = "Event date is required",
	EVENT_START_TIME_REQUIRED = "Start time is required",
	EVENT_END_TIME_REQUIRED = "End time is required",
	EVENT_CAPACITY_REQUIRED = "Capacity is required",
	EVENT_CAPACITY_MIN_REQUIRED = "Capacity must be at least 1",
	EVENT_ADDRESS_REQUIRED = "Address is required",
	EVENT_CITY_REQUIRED = "City is required",
	EVENT_PRICE_MIN_REQUIRED = "Price must be at least 0",
	EVENT_IMAGE_REQUIRED = "Event image is required",
	EVENT_CREATED_SUCCESSFULLY = "Event created successfully",

	// ===== Group Related Messages =====
	GROUP_NOT_FOUND = "Group not found",
	GROUP_UPDATED_SUCCESSFULLY = "Group updated successfully",
	GROUP_CREATED_SUCCESSFULLY = "Group created successfully",
	GROUP_NAME_REQUIRED = "Group name is required",
	GROUP_DESCRIPTION_REQUIRED = "Group description is required",
	GROUP_IMAGE_REQUIRED = "Group image is required",
	GROUP_CATEGORY_REQUIRED = "Group category is required",

	// ===== Ticket Related Messages =====
	TICKET_CANCELLED_SUCCESSFULLY = "Ticket cancelled successfully",

	// ===== Comment Related Messages =====
	COMMENT_REF_ID_REQUIRED = "Comment ref id is required",
	COMMENT_CONTENT_REQUIRED = "Comment content is required",

	// ===== Image Related Messages =====
	IMAGE_PROCESSING_FAILED = "Failed to process image",
}

// ===== Direction =====
export enum Direction {
	ASC = "ASC",
	DESC = "DESC",
}
