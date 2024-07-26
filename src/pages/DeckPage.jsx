import { useParams } from "react-router-dom";
import { React, useEffect, useState } from "react";
import Deck from "../components/flashcards/Deck";
import { Hero } from "../registration/Hero";
import AutoCreateCardFromHighlights from "../components/flashcards/AutoCreateCardFromHighlights";
import ShareDeck from "../components/flashcards/ShareDeck";
import useGetDeckList from "../hooks/useGetDeckList";
import useLibraryStore from "../store/libraryStore";

export default function DeckPage() {
  const { deckId } = useParams();

  const [showPopup, setShowPopup] = useState(false);
  const [autoPopup, setAutoPopup] = useState(false);

  const { deckList } = useLibraryStore();
  console.log(deckList);
  const currentDeck = deckList.find((deck) => deck.id === deckId);

  // Make sure to check if currentDeck is found
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
          <Hero deckId={deckId} onClose={handleClosePopup} />
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
            deckId={deckId}
            onClose={handleCloseAutoPopup}
          />
        </div>
      )}
      <div className="container h-5/6">
        <div className="text-3xl font-semibold pb-4">{deckName}</div>
        <div className="flex justify-end items-center w-full">
          <div className="flex flex-row gap-4">
            <button onClick={handleShowPopup}>Create Card</button>
            <button onClick={handleShowAutoPopup}>Automatic Create</button>
          </div>
        </div>
        <Deck deckId={deckId} />
      </div>
      <ShareDeck deckId={deckId} />
    </div>
  );
}
