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
    <div className="flex-1">
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
      <div className="text-3xl font-semibold pb-4">{deckName}</div>
      <div className="flex justify-between items-center w-full">
        <div className="text-xl font-semibold">Cards</div>
        <div className="flex flex-row gap-4">
          <button onClick={handleShowPopup}>Create Card</button>
          <button onClick={handleShowAutoPopup}>Automatic Create</button>
        </div>
      </div>
      <Deck deckName={deckName} />
      <ShareDeck deckName={deckName} />
    </div>
  );
}
