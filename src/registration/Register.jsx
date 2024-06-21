import { auth, googleProvider, db } from '../config/firebase.js';
import { useState, useEffect } from 'react';
import { Login } from './Login';
import { Hero } from './Hero';
import '../styles/App.css';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import useAuthStore from "../store/useAuthStore";

function Register() {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [hasAccount, setHasAccount] = useState(false);
  const [username, setUsername] = useState('');

  const clearInputs = () => {
    setEmail("");
    setPassword("");
    setUsername("");
  };

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
  };

  const handleLogin = async () => {
    clearErrors();

    const userCred = await signInWithEmailAndPassword(auth, email, password)
      .catch(err => {
        switch (err.code) {
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            setEmailError(err.message);
            break;
          case "auth/invalid-credential":
            setPasswordError('incorrect password or username');
            break;
          default: console.log(err.message);
        }
      });
    
      if (userCred) {
        try {
          const docRef = doc(db, "users", userCred.user.uid);
          const docSnap = await getDoc(docRef);
          localStorage.setItem("user-info", JSON.stringify(docSnap.data()));
        } catch (err) {
          console.log(err.message)
        }
			}
  };  

  const handleSignup = async () => {
    clearErrors();
    await createUserWithEmailAndPassword(auth, email, password)
      .catch(err => {
        switch (err.code) {
          case "auth/email-already-in-use":
          case "auth/invalid-email":
            setEmailError(err.message);
            break;
          case "auth/weak-password":
            setPasswordError(err.message);
            break;
          }
        })
        .then(async (userCredential) => {
          console.log('User signed up:', userCredential.user);
  
          // Add user data to Firestore
          const userRef = doc(db, "users", userCredential.user.uid);
          const userDoc = {
            uid: userCredential.user.uid,
            email: email,
            username: username,
            profilePicURL: "",
            createdAt: Date.now(),
          }
          await setDoc(userRef, userDoc);

          // after every sign in, ther user info will be downloaded in the localStorage for easy reference
          localStorage.setItem("user-info", JSON.stringify(userDoc));
          console.log("User data added to Firestore and collection created for user");
        }).catch((err) => {
          console.error('Error during signup:', err);
        });
  };

  const handleLogout = async () => {
    await signOut(auth, googleProvider);
    localStorage.removeItem("user-info");
    const logoutUser = useAuthStore((state) => state.logout);
		logoutUser();
  };

  const authListener = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        clearInputs();
        setUser(user);
      } else {
        setUser("");
      }
    });
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
        .then(async (userCredential) => {
          console.log('User signed up:', userCredential.user);

          // Add user data to Firestore
          const userRef = doc(db, "users", userCredential.user.uid);
          const userDoc = {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            username: userCredential.user.displayName,
            profilePicURL: userCredential.user.photoURL,
            createdAt: Date.now(),
          }
          await setDoc(userRef, userDoc);

          const library = collection(userRef, "library");
          await setDoc(doc(library, "initDoc"), {
            initialData: "This is an initial document"
          })
          localStorage.setItem("user-info", JSON.stringify(userDoc));
          console.log("User data added to Firestore and collection created for user");
        })
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    authListener();
  }, []);

  return (
    <div className="App">
      <div className="login">
        <div className="container">
          {user ? (
            <Hero handleLogout={handleLogout} />
          ) : (
            <Login
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleLogin={handleLogin}
              handleSignup={handleSignup}
              hasAccount={hasAccount}
              setHasAccount={setHasAccount}
              emailError={emailError}
              passwordError={passwordError}
              signInWithGoogle={signInWithGoogle}
              username={username}
              setUsername={setUsername}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
