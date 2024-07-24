import axios from "axios";

export const sendLog = async (status, message, severity, stack='') => {
    const url = import.meta.env.VITE_BACKEND_URL + '/v1/api/log'
    try {
        const res = await axios.post(
            url,
            { status: status, message: message, severity: severity, error: stack}
        )

        if ( status && message && severity && stack ) {
            return "success - log written";
        } else {
            return "failed - no log written";
        }
       

    } catch(error) {
        console.log('sendLog had a problem sending the log with this error', error)
    }
}