import axios from 'axios';

export async function verifyUser(email) {
    try {
        const url = import.meta.env.VITE_BACKEND_URL + '/v1/auth/verifyUser';
        const response = await axios.post(url, { email });

        if (response.data && response.data.user) {
            return response.data.user === 'authenticated';
        } else {
            return { status: response.status, message: response.statusText };
        }
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error response:', error.response);
            return { status: error.response.status, message: 'Contact Admin' };
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Error request:', error.request);
            return { status: 500, message: 'No response received' };
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error message:', error.message);
            return { status: 500, message: 'Internal Server Error' };
        }
    }
}
