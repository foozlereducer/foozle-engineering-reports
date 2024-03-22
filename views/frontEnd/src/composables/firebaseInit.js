import { initializeApp } from 'firebase/app';

export const getFirebase = async () => {
    // Call your backend route to get the Firebase config
    // const response = await axios.get(import.meta.env.BACKEND_URL + '/api/metrics/firebaseConfig');
            
    // Assuming your backend returns the Firebase config in the response.data
    // let firebaseConfig = response.data;
    let firebaseConfig = {
        apiKey: "AIzaSyB7Pz8c1ROjSYUHk0WTH9Yo_Bmde0mkKcI",
        authDomain: "localhost:3000",
        projectId: "engineering-reports",
        storageBucket: "engineering-reports.appspot.com",
        messagingSenderId: "664561984154",
        appId: "1:664561984154:web:23971fecb654bb3e8a7523"
      };
  
    console.log("firebaseConfig",firebaseConfig)

    // Initialize Firebase app with the config
    return await initializeApp(firebaseConfig);
}