import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// flashforge
// const firebaseConfig = {
//   apiKey: "AIzaSyAotbDh-yYGzxyNsFrmzrGMxgtjL8guNL8",
//   authDomain: "flashforge-f292c.firebaseapp.com",
//   projectId: "flashforge-f292c",
//   storageBucket: "flashforge-f292c.appspot.com",
//   messagingSenderId: "463837186358",
//   appId: "1:463837186358:web:aa4441776e480247c5cb97",
//   measurementId: "G-ZWM2ZSQVGC"
// };

// flashforge-backup
// const firebaseConfig = {
//   apiKey: "AIzaSyB2XtT4ES_ogBetNWBfFZnCOxEelQYyIXs",
//   authDomain: "flashforge-backup.firebaseapp.com",
//   projectId: "flashforge-backup",
//   storageBucket: "flashforge-backup.appspot.com",
//   messagingSenderId: "382491773198",
//   appId: "1:382491773198:web:3adab2b7143d55d10e2f5f",
// };

// flashforge-canada
const firebaseConfig = {
  apiKey: "AIzaSyC56c_5tHEdjXDYLrfwrN9qvzc8dWK4PUM",
  authDomain: "flashforge-canada.firebaseapp.com",
  projectId: "flashforge-canada",
  storageBucket: "flashforge-canada.appspot.com",
  messagingSenderId: "808884936307",
  appId: "1:808884936307:web:1557b54abbc90955691406"
};

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID
// };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return signInWithEmailAndPassword(auth, email, password);
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  });

export const googleProvider = new GoogleAuthProvider();

export const db = new getFirestore(app);

export const storage = getStorage(app);
