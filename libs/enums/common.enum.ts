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

  // ===== Member Related Messages =====


  // ===== Event Related Messages =====


  // ===== Group Related Messages =====


  // ===== Ticket Related Messages =====

}

// ===== Direction =====
export enum Direction {
  ASC = 1,
  DESC = -1,
}
