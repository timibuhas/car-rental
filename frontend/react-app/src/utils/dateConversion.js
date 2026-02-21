// src/utils/dateUtils.js

export function toLocalDateTimeString(dateString) {
    if (!dateString) return ""; // Handle empty or null values
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Handle invalid dates
    return date.toISOString().slice(0, 16); // Format to yyyy-MM-ddTHH:mm
  }
  