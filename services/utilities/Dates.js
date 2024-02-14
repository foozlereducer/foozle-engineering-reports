export class Dates {
    getNow() {
        const now = new Date(); // Create a new Date object representing the current date and time
        return now.toISOString(); // Convert the date to an ISO string in UTC format
    }

    isValidUTCDate(dateString) {
        // Regular expression to match a valid ISO 8601 date string
        const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;
        
        // Check if the string matches the ISO 8601 format
        if (!iso8601Regex.test(dateString)) {
            return false;
        }
        
        // Attempt to create a Date object from the string
        const dateObject = new Date(dateString);
        
        // Check if the Date object is invalid (NaN) or not
        return !isNaN(dateObject);
    }
}