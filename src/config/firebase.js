import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAotbDh-yYGzxyNsFrmzrGMxgtjL8guNL8",
  authDomain: "flashforge-f292c.firebaseapp.com",
  projectId: "flashforge-f292c",
  storageBucket: "flashforge-f292c.appspot.com",
  messagingSenderId: "463837186358",
  appId: "1:463837186358:web:aa4441776e480247c5cb97",
  measurementId: "G-ZWM2ZSQVGC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;

