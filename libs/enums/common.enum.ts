// ===== Messages =====
export enum Message {
	// ===== General Messages =====
	SOMETHING_WENT_WRONG = 'Something went wrong. Please try again later.',
	NO_DATA_FOUND = 'No data found for your request.',
	CREATE_FAILED = 'Failed to create the record. Please try again.',
	UPDATE_FAILED = 'Failed to update the record. Please try again.',
	REMOVE_FAILED = 'Failed to remove the record. Please try again.',
	UPLOAD_FAILED = 'Failed to upload the file. Please try again.',
	BAD_REQUEST = 'Invalid request. Please check your input.',

	// ===== Member Related Messages =====
	USERNAME_REQUIRED = 'Username is required',
	PASSWORD_REQUIRED = 'Password is required',
	LOGIN_FAILED = 'Login failed. Please try again.',
	EMAIL_REQUIRED = 'Email is required',
	INVALID_EMAIL = 'Please enter a valid email address',
	FULL_NAME_REQUIRED = 'Full name is required',
	PASSWORD_TOO_SHORT = 'Password must be at least 8 characters',
	CONFIRM_PASSWORD_REQUIRED = 'Please confirm your password',
	PASSWORDS_DONT_MATCH = 'Passwords do not match',
	NOT_AUTHENTICATED = 'You are not authenticated',

	// ===== Event Related Messages =====
	EVENT_NOT_FOUND = 'Event not found',
	INVALID_TIME_SELECTION = 'Invalid time selection',

	// ===== Group Related Messages =====
	GROUP_NOT_FOUND = 'Group not found',
	CATEGORY_NOT_FOUND = 'Category not found',

	// ===== Ticket Related Messages =====

	// ===== Comment Related Messages =====
	COMMENT_REF_ID_REQUIRED = 'Comment ref id is required',
	COMMENT_CONTENT_REQUIRED = 'Comment content is required',
}

// ===== Direction =====
export enum Direction {
	ASC = 'ASC',
	DESC = 'DESC',
}
