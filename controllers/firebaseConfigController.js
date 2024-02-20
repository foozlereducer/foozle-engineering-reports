import { GetAppConfig } from '../services/GetAppConfig.js'
export const firebaseConfigGet = async (req, res) => {
    const GAC = new GetAppConfig;
    const config = await GAC.run();
    const firebaseConfig = {};
    firebaseConfig.apiKey = GAC.findValueByKey(config, 'FirebaseApiKey');
    firebaseConfig.authDomain = GAC.findValueByKey(config, 'FirebaseAuthDomain');
    firebaseConfig.projectId = GAC.findValueByKey(config, 'FirebaseProjId');
    firebaseConfig.storageBucket = GAC.findValueByKey(config, 'FirebaseStorageBucket');
    firebaseConfig.messagingSenderId = GAC.findValueByKey(config, 'FirebaseMsgSenderId');
    firebaseConfig.appId = GAC.findValueByKey(config, 'FirebaseAppId');
    // firebaseConfig.url = window.location.pathname
    res.send(firebaseConfig);
}