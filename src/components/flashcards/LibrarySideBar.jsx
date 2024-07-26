import React from "react";
import useGetDeckList from "../../hooks/useGetDeckList";
import "../../styles/Library.css";
import useGetSharedDeckList from "../../hooks/useGetSharedDeckList";
import { useParams } from "react-router-dom";
import { Trash } from "../../icons";
//Library is a collection containing the docs of decks
const LibrarySideBar = () => {
  const { deckId } = useParams();
  const deckList = useGetDeckList();
  const sharedDeckList = useGetSharedDeckList();
  console.log(deckList);
  return (
    <div
      style={{ width: "200px", maxHeight: "500px", overflowY: "scroll" }}
      className="flex flex-col gap-4"
    >
      {deckList.map((deck, index) => (
        <a key={index} href={`/library/owned/${deck.id}`}>
          <div
            key={deck.id}
            style={{
              textAlign: "center",
              border: "1px solid " + deck.color,
              color: "#fff",
              width: "180px",
              padding: "22px",
              borderRadius: "10px",
            }}
            className="relative overflow-hidden relative"
          >
            {deck.deckName}
            <div
              className={`w-full h-full absolute left-0 top-0 -z-10 ${
                deckId == deck.id ? "opacity-100" : "opacity-5"
              }`}
              style={{
                background: deck.color,
              }}
            ></div>
          </div>
        </a>
      ))}
      {sharedDeckList.map((deck, index) => (
        <a key={index} href={`/library/shared/${deck.id}`}>
          <div
            key={deck.id}
            style={{
              textAlign: "center",
              border: "1px solid " + deck.color,
              color: "#fff",
              width: "180px",
              padding: "22px",
              borderRadius: "10px",
            }}
            className="relative overflow-hidden"
          >
            {deck.deckName}
            <div
              className={`w-full h-full absolute left-0 top-0 -z-10 ${
                deckId == deck.id ? "opacity-100" : "opacity-5"
              }`}
              style={{
                background: deck.color,
              }}
            ></div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default LibrarySideBar;
