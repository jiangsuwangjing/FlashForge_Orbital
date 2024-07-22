import React from "react";
import { useState, useEffect } from "react";
import { doc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import useAuthStore from "../store/authStore";
import useLibraryStore from "../store/libraryStore";
import useGetDeckList from "../hooks/useGetDeckList";
import "../styles/Library.css";
import useGetSharedDeckList from "../hooks/useGetSharedDeckList";
//Library is a collection containing the docs of decks
const LibrarySideBar = () => {
  const deckList = useGetDeckList();
  const sharedDeckList = useGetSharedDeckList();
  return (
    <div style={{ width: "300px", maxHeight: "500px", overflowY: "scroll" }}>
      {deckList.map((deck, index) => (
        <a key={index} href={`/library/${deck.deckName}`}>
          <div
            key={deck.deckName}
            style={{
              textAlign: "center",
              backgroundColor: deck.color,
              color: "#fff",
              width: "180px",
              padding: "22px",
              borderRadius: "10px",
              marginLeft: "20px",
              marginTop: "8px",
            }}
          >
            {deck.deckName}
          </div>
        </a>
      ))}
      {sharedDeckList.map((deck, index) => (
        <a key={index} href={`/library/${deck.deckName}`}>
          <div
            key={deck.deckName}
            style={{
              textAlign: "center",
              backgroundColor: deck.color,
              color: "#fff",
              width: "180px",
              padding: "22px",
              borderRadius: "10px",
              marginLeft: "20px",
              marginTop: "8px",
            }}
          >
            {deck.deckName}
          </div>
        </a>
      ))}
    </div>
  );
};

export default LibrarySideBar;
