import { auth, googleProvider, db } from "../config/firebase.js";
import { useState, useEffect } from "react";
import { Login } from "./Login";
import { Hero } from "./Hero";
import "../styles/App.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, setDoc, collection } from "firebase/firestore";

function Register() {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [hasAccount, setHasAccount] = useState(true);

  const clearInputs = () => {
    setEmail("");
    setPassword("");
  };

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
  };

  const handleLogin = async () => {
    clearErrors();
    console.log(auth?.currentUser?.email);

    await signInWithEmailAndPassword(auth, email, password).catch((err) => {
      switch (err.code) {
        case "auth/invalid-email":
        case "auth/user-disabled":
        case "auth/user-not-found":
          setEmailError(err.message);
          break;
        case "auth/invalid-credential":
          setPasswordError("incorrect password or username");
          break;
        default:
          console.log(err.message);
      }
    });
  };

  const handleSignup = async () => {
    clearErrors();
    await createUserWithEmailAndPassword(auth, email, password)
      .catch((err) => {
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
        console.log("User signed up:", userCredential.user);

        // Add user data to Firestore
        const userRef = doc(db, "users", userCredential.user.email);
        await setDoc(userRef, {
          email: email,
          createdAt: new Date(),
        });

        // Create a collection for the user
        const userCollectionRef = collection(
          db,
          `users/${userCredential.user.uid}/userData`
        );
        await setDoc(doc(userCollectionRef, "initDoc"), {
          initialData: "This is an initial document.",
        });

        console.log(
          "User data added to Firestore and collection created for user"
        );
      });
  };

  const handleLogout = async () => {
    await signOut(auth, googleProvider);
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
      await signInWithPopup(auth, googleProvider).then(
        async (userCredential) => {
          console.log("User signed up:", userCredential.user);

          // Add user data to Firestore
          const userRef = doc(db, "users", userCredential.user.email);
          await setDoc(userRef, {
            email: userCredential.user.email,
            createdAt: new Date(),
          });

          // Create a collection for the user
          const userCollectionRef = collection(
            db,
            `users/${userCredential.user.uid}/userData`
          );
          await setDoc(doc(userCollectionRef, "initDoc"), {
            initialData: "This is an initial document.",
          });

          console.log(
            "User data added to Firestore and collection created for user"
          );
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

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
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
