import { useParams } from "react-router-dom";
import { React, useEffect, useState } from "react";
import Deck from "../components/flashcards/Deck";
import { Hero } from "../registration/Hero";
import AutoCreateCardFromHighlights from "../components/flashcards/AutoCreateCardFromHighlights";
import ShareDeck from "../components/flashcards/ShareDeck";
import "../styles/Deck.css";
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
    <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
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
      <div
        style={{
          color: "white",
          marginLeft: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <h1>{deckName}</h1>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",

          justifyContent: "flex-end",
          width: "131.3vh",
          alignItems: "center",
        }}
      >
        {/* <div style={{ fontSize: "18px" }}>Cards</div> */}
        <div style={{ display: "flex", width: "100%" }}>
          <ShareDeck deckName={deckName} />
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <div style={{ width: "100%" }}>
              <button onClick={handleShowPopup} className="button">
                Create Card
              </button>
              <button onClick={handleShowAutoPopup} className="button">
                Automatic Create
              </button>
            </div>
          </div>
        </div>
      </div>
      <Deck deckName={deckName} />
    </div>
  );
}
// const buttonStyle = {
//   padding: "10px 20px",
//   fontSize: "16px",
//   color: "white",
//   backgroundColor: isHovered ? "darkgray" : "black",
//   border: "none",
//   borderRadius: "5px",
//   cursor: "pointer",
//   transition: "background-color 0.3s ease, transform 0.3s ease",
//   transform: isHovered ? "scale(1.05)" : "scale(1)",
// };
