import React, { useState } from "react";
import Header from "../components/profile/Header";
import Popup from "../components/flashcards/Popup";
import LibrarySideBar from "../components/flashcards/LibrarySideBar";
import CreateDeck from "../components/flashcards/CreateDeck";
import "../styles/Library.css";
import { Outlet } from "react-router-dom";
import { Hero } from "../registration/Hero";

export default function Library() {
  const [decks, setDecks] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [id, setId] = useState(0);
  const handleShowPopup = () => {
    console.log("psdsa");
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const addDeck = (text) => {
    const newDeck = {
      id: Date,
      text: text,
    };
    setDecks([...decks, newDeck]);
  };
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Header />
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <div>
          <h1
            style={{
              margin: "20px",
              display: "flex",
              justifyContent: "center",
              fontSize: "50px",
            }}
          >
            Library
          </h1>
          {/* <CreateDeck /> */}
          <LibrarySideBar />
          <CreateDeck />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
