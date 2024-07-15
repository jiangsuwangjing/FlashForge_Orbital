import React from "react";
import { useState } from "react";
import {
  doc,
  collection,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import useAuthStore from "../store/authStore";
import useGetCardList from "../hooks/useGetCardList";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreateCard = ({ deckName, onClose }) => {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  // get referece to the deck
  const user = useAuthStore((state) => state.user);
  const userRef = doc(db, "users", user.uid);
  const libraryRef = collection(userRef, "library");
  const deckRef = doc(libraryRef, deckName);
  const cardsRef = collection(deckRef, "cards");

  const onSubmitCard = async () => {
    try {
      const newCardRef = doc(cardsRef);

      await setDoc(newCardRef, {
        id: newCardRef.id, // Use the generated ID here
        front: front,
        back: back,
        mastery: 0,
        userId: user.uid,
        lastReviewed: Date.now(),
      });

      // Update the parent deck document to include the new card ID
      await updateDoc(deckRef, {
        cardIds: arrayUnion(newCardRef.id),
      });

      console.log("New card created successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "80%",
        width: "40%",
        color: "black",
        borderRadius: "10px",
        backgroundColor: "white",
        padding: "20px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button style={ujin} onClick={onClose}>
          Close
        </button>
        <button
          style={ujin}
          onClick={() => {
            onClose();
            onSubmitCard();
          }}
        >
          Save
        </button>
      </div>
      <div style={{ marginBottom: "15px", textAlign: "center" }}>New Card</div>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div>Front</div>
        <ReactQuill
          value={front}
          onChange={setFront}
          theme="snow"
          modules={{
            clipboard: {
              matchVisual: false,
            },
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div>Back</div>
        <ReactQuill
          value={back}
          onChange={setBack}
          theme="snow"
          modules={{
            clipboard: {
              matchVisual: false,
            },
          }}
        />
      </div>
    </div>
  );
};
const ujin = {
  color: "#38b6ff",
  border: "none",
  background: "white",
};
export default CreateCard;
