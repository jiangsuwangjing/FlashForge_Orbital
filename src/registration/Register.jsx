import { auth, googleProvider, db } from '../config/firebase.js';
import { useState, useEffect } from 'react';
import { Login } from './Login';
import { Hero } from './Hero';
import { Navigate } from "react-router-dom";
import '../styles/App.css';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import useAuthStore from "../store/authStore.js";
import useShowToast from '../hooks/useShowToast.js';

function Register() {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasAccount, setHasAccount] = useState(false);
  const [username, setUsername] = useState('');

  const showToast = useShowToast();
  
  const clearInputs = () => {
    setEmail("");
    setPassword("");
    setUsername("");
  };

  const loginUser = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    const userCred = await signInWithEmailAndPassword(auth, email, password)
      .catch(err => {
        switch (err.code) {
          case "auth/invalid-email":
            showToast("Error", "Invalid email format!", "error");
            break;
          case "auth/user-disabled":
            showToast("Error", "User has been disabled!", "error");
            break;
          case "auth/user-not-found":
            showToast("Error", "User not found!", "error");
            break;
          case "auth/invalid-credential":
            showToast("Error", "Incorrect password or email!", "error");
            break;
          default: console.log(err.message);
        }
      });
    
      if (userCred) {
        try {
          const docRef = doc(db, "users", userCred.user.uid);
          const docSnap = await getDoc(docRef);
          localStorage.setItem("user-info", JSON.stringify(docSnap.data()));
          loginUser(docSnap.data());
        } catch (err) {
          console.log(err.message)
        }
			}
  };  

  const handleSignup = async () => {
    await createUserWithEmailAndPassword(auth, email, password)
      .catch(err => {
        switch (err.code) {
          case "auth/email-already-in-use":
            showToast("Error", "Email has been taken!", "error");
            break;
          case "auth/invalid-email":
            showToast("Error", "Invalid email format!", "error");
            break;
          case "auth/weak-password":
            showToast("Error", "Password is too weak!", "error");
            break;
          }
        })
        .then(async (userCredential) => {
          console.log('User signed up:', userCredential.user);
  
          const userRef = doc(db, "users", userCredential.user.uid);
          const defaultProfilePicURL = "https://i.pinimg.com/736x/cb/45/72/cb4572f19ab7505d552206ed5dfb3739.jpg";
          const userDoc = {
            uid: userCredential.user.uid,
            email: email,
            username: username,
            profilePicURL: defaultProfilePicURL,
            createdAt: Date.now(),
          }
          await setDoc(userRef, userDoc);

          localStorage.setItem("user-info", JSON.stringify(userDoc));
          loginUser(userDoc);
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
          loginUser(userDoc);
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
          {user && loginUser ? (
            <Navigate to="/home" replace={true} />
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
