import React from "react";
import useGetDeckList from "../../hooks/useGetDeckList";
import "../../styles/Library.css";
import useGetSharedDeckList from "../../hooks/useGetSharedDeckList";
import CreateDeck from "./CreateDeck";
//Library is a collection containing the docs of decks
const LibrarySideBar = () => {
  const deckList = useGetDeckList();
  const sharedDeckList = useGetSharedDeckList();
  return (
    <div
      style={{
        width: "270px",
        maxHeight: "620px",
        overflowY: "scroll",
        backgroundColor: "lightgray",
      }}
    >
      {deckList.map((deck, index) => (
        <a key={index} href={`/library/owned/${deck.deckName}`}>
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
        <a key={index} href={`/library/shared/${deck.deckName}`}>
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
      {/* <CreateDeck style={{ display: "flex", justifyContent: "center" }} /> */}
    </div>
  );
};

export default LibrarySideBar;
