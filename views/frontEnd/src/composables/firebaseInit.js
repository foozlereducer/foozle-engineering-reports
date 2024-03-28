import { initializeApp } from 'firebase/app';
import axios from 'axios';

export const getFirebase = async () => {
    // Call your backend route to get the Firebase config
    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/metrics/firebaseConfig');
            
    // Assuming your backend returns the Firebase config in the response.data
    let firebaseConfig = response.data;
    
    console.log('firebase config',firebaseConfig)
    // Change auth url to local front end server
    //firebaseConfig.FirebaseAuthDomain = import.meta.env.FRONTEND_URL + '/__/auth/'

    console.log(firebaseConfig)

    // Initialize Firebase app with the config
    return await initializeApp(firebaseConfig);
}