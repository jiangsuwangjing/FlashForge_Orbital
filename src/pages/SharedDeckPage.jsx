import { useParams } from "react-router-dom";
import { React, useEffect, useState } from "react";
import Deck from "../components/flashcards/Deck";
import { Hero } from "../registration/Hero";
import AutoCreateCardFromHighlights from "../components/flashcards/AutoCreateCardFromHighlights";
import SharedDeck from "../components/flashcards/SharedDeck";

export default function SharedDeckPage() {
  const { deckId } = useParams();
  console.log(deckId);
  const [showPopup, setShowPopup] = useState(false);
  const [autoPopup, setAutoPopup] = useState(false);
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
      <div style={{ color: "white", marginLeft: "20px" }}>
        <h1>{id}</h1>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: "18px" }}>Cards</div>
      </div>
<<<<<<< HEAD
      <SharedDeck deckName={deckName} />
=======
      <SharedDeck deckId={deckId} />
>>>>>>> b018cae946b39c6994877dfc4ce6cfc90916aa47
    </div>
  );
}
