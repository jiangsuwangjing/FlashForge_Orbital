import { useParams } from "react-router-dom";
import { React, useEffect, useState } from "react";
import Deck from "../components/flashcards/Deck";
import { Hero } from "../registration/Hero";
import AutoCreateCardFromHighlights from "../components/flashcards/AutoCreateCardFromHighlights";
import ShareDeck from "../components/flashcards/ShareDeck";
export default function DeckPage() {
  const { deckName } = useParams();
  console.log(deckName);
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
      {showPopup && (
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
          <Hero deckName={deckName} onClose={handleClosePopup} />
        </div>
      )}
      {autoPopup && (
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
            deckName={deckName}
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
      <Deck deckName={deckName} />
      <ShareDeck deckName={deckName} />
    </div>
  );
}
