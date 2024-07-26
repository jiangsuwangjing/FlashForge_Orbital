import { useParams } from "react-router-dom";
import { React, useEffect, useState } from "react";
import Deck from "../components/flashcards/Deck";
import { Hero } from "../registration/Hero";
import AutoCreateCardFromHighlights from "../components/flashcards/AutoCreateCardFromHighlights";
import ShareDeck from "../components/flashcards/ShareDeck";
import useGetDeckList from "../hooks/useGetDeckList";
import useLibraryStore from "../store/libraryStore";
import useAuthStore from "../store/authStore";
import { doc, collection } from "firebase/firestore";
import { db } from "../config/firebase";


export default function DeckPage() {
  const { deckId } = useParams();

  const [showPopup, setShowPopup] = useState(false);
  const [autoPopup, setAutoPopup] = useState(false);

  const { deckList } = useLibraryStore();
  // console.log(deckList)
  const user = useAuthStore((state) => state.user);
  const userRef = doc(db, "users", user.uid);
  const libraryRef = collection(userRef, "library");
  const deckRef = doc(libraryRef, deckId); 

  const currentDeck = deckList.find((deck) => deck.id === deckId);
  const deckName = currentDeck ? currentDeck.deckName : "Loading";

  const handleShowPopup = () => {
    setShowPopup(true);
  };
  const handleShowAutoPopup = () => {
    setAutoPopup(true);
  };
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const handleCloseAutoPopup = () => {
    setAutoPopup(false);
  };
  return (
    <div>
      {showPopup && deckRef && (
        <div
          style={{
            position: "absolute",
            left: "0",
            top: "0",
            bottom: "0",
            right: "0",
            zIndex: "1",
          }}
        >
          <Hero deckRef={deckRef} onClose={handleClosePopup} />
        </div>
      )}
      {autoPopup && deckRef && (
        <div
          style={{
            position: "absolute",
            left: "0",
            top: "0",
            bottom: "0",
            right: "0",
            zIndex: "1",
          }}
        >
          <AutoCreateCardFromHighlights
            deckRef={deckRef}
            onClose={handleCloseAutoPopup}
          />
        </div>
      )}
      <div style={{ color: "white", marginLeft: "20px" }}>
        <h1>{deckName}</h1>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          width: "131.3vh",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: "18px" }}>Cards</div>
        <div>
          <button onClick={handleShowPopup}>Create Card</button>
          <button onClick={handleShowAutoPopup}>Automatic Create</button>
        </div>
      </div>
      <Deck deckId={deckId} />
      {currentDeck && <ShareDeck deckDoc={currentDeck} /> }
    </div>
  );
}
