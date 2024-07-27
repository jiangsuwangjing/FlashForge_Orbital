import React from "react";
import useGetDeckList from "../../hooks/useGetDeckList";
import "../../styles/Library.css";
import useGetViewOnlySharedDeckList from "../../hooks/useGetViewOnlySharedDecks";
import useGetEditableSharedDeckList from "../../hooks/useGetEditableSharedDeckList";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Trash } from "../../icons/trash";
import { Edit } from "../../icons/edit";
//Library is a collection containing the docs of decks
const LibrarySideBar = () => {
  const { deckId } = useParams();
  const deckList = useGetDeckList();
  const viewOnlySharedDeckList = useGetViewOnlySharedDeckList();
  const editableSharedDeckList = useGetEditableSharedDeckList();
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  console.log(deckList);
  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("scroll", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("scroll", handleClick);
    };
  }, [contextMenu]);
  const handleClick = () => {
    setContextMenu({ visible: false, x: 0, y: 0 });
  };
  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.pageX,
      y: event.pageY,
    });
  };
  const handleDelete = (event) => {
    event.stopPropagation();
    console.log("delete");
  };
  return (
    <div
      style={{ width: "200px", maxHeight: "500px", overflowY: "scroll" }}
      className="flex flex-col gap-4"
    >
      {deckList.map((deck, index) => (
        <a key={index} href={`/library/owned/${deck.id}`}>
          <div
            onContextMenu={handleContextMenu}
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
          {contextMenu.visible && (
            <div
              style={{
                position: "absolute",
                width: "130px",
                backgroundColor: "#383838",
                borderRadius: "5px",
                boxSizing: "border-box",
                top: contextMenu.y,
                left: contextMenu.x - 70,
                zIndex: 10,
                padding: "10px",
              }}
            >
              <ul>
                <li>
                  <div className="flex justify-normal my-2">
                    <Edit />
                    <div className="w-full flex justify-center">Rename</div>
                  </div>
                </li>
                <hr className="h-1" />
                <li onClick={(e) => handleDelete(e)}>
                  <div className="flex justify-normal my-2">
                    <Trash />
                    <div className="w-full flex justify-center">Delete</div>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </a>
      ))}
      {viewOnlySharedDeckList.map((deck, index) => (
        <a key={index} href={`/library/viewonly/${deck.deckId}`}>
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
                deckId == deck.deckId ? "opacity-100" : "opacity-5"
              }`}
              style={{
                background: deck.color,
              }}
            ></div>
          </div>
        </a>
      ))}
      {editableSharedDeckList.map((deck, index) => (
        <a key={index} href={`/library/editable/${deck.deckId}`}>
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
                deckId == deck.deckId ? "opacity-100" : "opacity-5"
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
