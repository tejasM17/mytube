import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDcJEcH6Sy9WxmeZ1OesPvYxMJ8Ip5ziUM",
    authDomain: "mytube-123-6d7e3.firebaseapp.com",
    projectId: "mytube-123-6d7e3",
    storageBucket: "mytube-123-6d7e3.firebasestorage.app",
    messagingSenderId: "297678385428",
    appId: "1:297678385428:web:a3d69633d133bb0bbb1201"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };