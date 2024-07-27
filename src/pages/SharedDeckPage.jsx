import { useParams } from "react-router-dom";
import { React, useEffect, useState } from "react";
import Deck from "../components/flashcards/Deck";
import { Hero } from "../registration/Hero";
import AutoCreateCardFromHighlights from "../components/flashcards/AutoCreateCardFromHighlights";
import SharedDeck from "../components/flashcards/SharedDeck";
import useSharedDeckStore from "../store/sharedDeckStore";
import { doc, collection } from "firebase/firestore";

export default function SharedDeckPage({ viewOnly }) {
  const { deckId } = useParams();
  const { viewOnlyDecksList, editableDecksList } = useSharedDeckStore();
  const deckList = viewOnly ? viewOnlyDecksList : editableDecksList;
  const deckDoc = deckList.find((deck) => deck.deckId === deckId);
  const deckName = deckDoc ? deckDoc.deckName : "loading";
  const deckRef = deckDoc ? deckDoc.deckRef : "";

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
      {showPopup && !viewOnly && deckDoc && (
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
      {autoPopup && !viewOnly && deckDoc && (
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
        <div className="h-10"></div>
        {!viewOnly && (
          <div>
            <button onClick={handleShowPopup}>Create Card</button>
            <button onClick={handleShowAutoPopup}>Automatic Create</button>
          </div>
        )}
      </div>
      {deckDoc && <SharedDeck deckDoc={deckDoc} viewOnly={viewOnly} />}
    </div>
  );
}
