import React from "react";
import { useEffect, useState } from "react";
import { doc, addDoc, collection, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import useAuthStore from "../../store/authStore";
import useLibraryStore from "../../store/libraryStore";
import Popup from "./Popup";

const colors = ["#ffbd59", "#38b6ff", "#ff3131", "#ff914d", "#35b81a"];
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
const CreateDeck = () => {
  // New Deck States
  const [newDeckName, setNewDeckName] = useState("");

  // getReferece to the library
  const user = useAuthStore((state) => state.user);
  const userRef = doc(db, "users", user.uid);
  const libraryRef = collection(userRef, "library");

  const newDeckRef = doc(libraryRef);
  const newDeckId = newDeckRef.id;

  const deckDoc = {
    id: newDeckId,
    color: getRandomColor(),
    deckName: newDeckName,
    createdAt: Date.now(),
    lastReviewed: Date.now(),
    overallMastery: 0,
    numberOfCards: 0,
    deckRef: newDeckRef
  };
  const { deckList, setDeckList, addDeck } = useLibraryStore();

  const createNewDeck = async () => {
    try {
      // create a new document for the deck, which contains its information
      await setDoc(newDeckRef, deckDoc);

      // add the deck to local library store
      addDeck({ ...deckDoc });

      setNewDeckName("");

      console.log(`New deck named ${newDeckName} created successfully.`);
    } catch (err) {
      console.error(err);
    }
  };
  const [showPopup, setShowPopup] = useState(false);
  const handleShowPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  return (
    <>
      {showPopup && (
        <Popup
          onClose={handleClosePopup}
          onAdd={createNewDeck}
          setNewDeckName={(text) => setNewDeckName(text)}
        />
      )}
      <button
        onClick={handleShowPopup}
        style={{ position: "absolute", bottom: "10px", left: "10px" }}
      >
        Create New Deck
      </button>
    </>
  );
};

export default CreateDeck;
