export const getErrorSeverity = (httpStatusCode) => {
    if (httpStatusCode >= 200 && httpStatusCode < 300) {
        return 'Success';
    } else if (httpStatusCode >= 400 && httpStatusCode < 500) {
        return 'Client Error';
    } else if (httpStatusCode >= 500 && httpStatusCode < 600) {
        return 'Server Error';
    } else {
        return 'Unknown';
    }
}