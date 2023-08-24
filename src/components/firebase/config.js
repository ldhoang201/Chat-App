import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { FacebookAuthProvider, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD4L53WZeRHsxKXvtM-8nFW69TWKBHkDbM",
    authDomain: "realtime-chat-b3b51.firebaseapp.com",
    projectId: "realtime-chat-b3b51",
    storageBucket: "realtime-chat-b3b51.appspot.com",
    messagingSenderId: "282675893493",
    appId: "1:282675893493:web:f1e4acf52b9124039aa1bc",
    measurementId: "G-0VDSN8EVDK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const fbProvider = new FacebookAuthProvider();
const ggProvider = new GoogleAuthProvider();

export { auth, fbProvider, ggProvider }



