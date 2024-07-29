import React from "react";
import useGetDeckList from "../../hooks/useGetDeckList";
import "../../styles/Library.css";
import useGetViewOnlySharedDeckList from "../../hooks/useGetViewOnlySharedDecks";
import useGetEditableSharedDeckList from "../../hooks/useGetEditableSharedDeckList";

/**
 * Keeps all the decks in the library
 * @returns deck buttons
 */
const LibrarySideBar = () => {
  const deckList = useGetDeckList();
  const viewOnlySharedDeckList = useGetViewOnlySharedDeckList();
  const editableSharedDeckList = useGetEditableSharedDeckList();

  console.log(deckList);
  return (
    <div style={{ width: "300px", maxHeight: "500px", overflowY: "scroll" }}>
      {deckList.map((deck, index) => (
        <a key={index} href={`/library/owned/${deck.id}`}>
          <div
            key={deck.id}
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
      {viewOnlySharedDeckList.map((deck, index) => (
        <a key={index} href={`/library/viewonly/${deck.deckId}`}>
          <div
            key={deck.id}
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
      {editableSharedDeckList.map((deck, index) => (
        <a key={index} href={`/library/editable/${deck.deckId}`}>
          <div
            key={deck.deckId}
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
