import React, { useState } from "react";
import Header from "../components/profile/Header";
import Popup from "../components/flashcards/Popup";
import LibrarySideBar from "../components/library/LibrarySideBar";
import CreateDeck from "../components/flashcards/CreateDeck";
import "../styles/Library.css";
import { Outlet } from "react-router-dom";
import { Hero } from "../registration/Hero";
import { Container, Heading } from "@chakra-ui/react";

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
      <div style={{ paddingTop: "90px", height: "100vh" }}>
        <div className="container mx-4 md:mx-auto h-full w-full">
          <div className="flex flex-row gap-4 h-full" style={{ width: "100%" }}>
            <div className="flex flex-col gap-4 mb-10">
              <div className="text-xl font-semibold">Library</div>
              <CreateDeck />
              <LibrarySideBar />
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
