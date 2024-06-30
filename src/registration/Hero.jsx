import React from "react";
import CreateDeck from "../flashcards/CreateDeck";
import CreateCard from "../flashcards/CreateCard";
import Deck from "../flashcards/Deck";

export const Hero = ({ deckName, onClose }) => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
      }}
    >
      <CreateCard deckName={deckName} onClose={onClose} />;
    </div>
  );
};
