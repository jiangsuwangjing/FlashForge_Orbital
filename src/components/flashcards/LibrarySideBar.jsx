import React from "react";
import useGetDeckList from "../../hooks/useGetDeckList";
import "../../styles/Library.css";
import useGetSharedDeckList from "../../hooks/useGetSharedDeckList";
import { useParams } from "react-router-dom";
//Library is a collection containing the docs of decks
const LibrarySideBar = () => {
  const deckList = useGetDeckList();
  const sharedDeckList = useGetSharedDeckList();
<<<<<<< HEAD
  const { deckName } = useParams();
=======
  console.log(deckList);
>>>>>>> b018cae946b39c6994877dfc4ce6cfc90916aa47
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
            className="relative overflow-hidden"
          >
            {deck.deckName}
            <div
              className={`w-full h-full absolute left-0 top-0 -z-10 ${
                deckName == deck.deckName ? "opacity-100" : "opacity-5"
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
                deckName == deck.deckName ? "opacity-100" : "opacity-5"
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
