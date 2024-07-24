import { useParams } from "react-router-dom";
import { React, useEffect, useState } from "react";
import Deck from "../components/flashcards/Deck";
import { Hero } from "../registration/Hero";
import AutoCreateCardFromHighlights from "../components/flashcards/AutoCreateCardFromHighlights";

export default function SharedDeckPage() {
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
    <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
      <div
        style={{
          color: "white",
          marginLeft: "20px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <h1>{deckName}</h1>
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
        {/* <div style={{ fontSize: "18px" }}>Cards</div> */}
      </div>
      <Deck deckName={deckName} />
    </div>
  );
}
