import React, { useState } from "react";
import Header from "./Header";
import Popup from "./Popup";
// import { Hero } from "./registration/Hero";
import LibrarySideBar from "./flashcards/LibrarySideBar";
import CreateDeck from "./flashcards/CreateDeck";
import "./styles/Library.css";
import { Outlet } from "react-router-dom";
import { Hero } from "./registration/Hero";
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
      <div style={{ display: "flex" }}>
        <div>
          <h1>Library</h1>
          <LibrarySideBar />
          <CreateDeck />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
