import axios from 'axios';

export const validateSession = async () => {
    try {
        const response = await axios.get(
            import.meta.env.VITE_BACKEND_URL + '/v1/auth/validateSession',
            { withCredentials: true }
        );
        return { isValid: response.data.isValid, user: response.data.user };
    } catch (error) {
        console.error('Session validation failed:', error);
        return { isValid: false, user: null };
    }
};
