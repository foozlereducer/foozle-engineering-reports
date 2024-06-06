import axios from "axios";

export const sendLog = async (status, message, severity, stack='') => {
    const url = import.meta.env.VITE_BACKEND_URL + '/v1/auth/verifyUser'
    try {
        const response = await axios.post(
            verifyUserUrl,
            { "email": eml }
        )
    } catch(error) {
        console.log('sendLog had a problem sending the log with this error', error)
    }
}