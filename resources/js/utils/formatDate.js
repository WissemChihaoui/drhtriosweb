export const formatDate = (dateString, separator = '-') => {
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date)) {
        return ''; // Return an empty string if the date is invalid
    }

    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad to 2 digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so +1) and pad to 2 digits
    const year = date.getFullYear(); // Get the full year

    // Return formatted date based on the separator
    return `${day}${separator}${month}${separator}${year}`;
};