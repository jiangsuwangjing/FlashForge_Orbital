import React from "react";
import CreateCard from "../components/flashcards/CreateCard";

export const Hero = ({ deckRef, onClose }) => {
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
      <CreateCard deckRef={deckRef} onClose={onClose} />;
    </div>
  );
};
