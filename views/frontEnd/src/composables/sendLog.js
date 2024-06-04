import axios from 'axios';

export const sendLog = async (status = 200, message='ok', severity='low', stack='') => {
    const url  = import.meta.env.VITE_BACKEND_URL + '/v1/api/log';
    try {
        return await axios.post(url, {
            "status": status,
            "message": message,
            "severity": severity,
            "stack": stack
        })
    } catch(error) {
        console.log(error)
        return {}
    }
}