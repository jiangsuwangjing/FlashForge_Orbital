import { useEffect, useState } from "react";
import "../../styles/App.css";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import ReactQuill from "react-quill";
import EditCardPreview from "./EditCardPreview";
import { arrayRemove } from "firebase/firestore";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const FlipCard = ({ card, deckRef, isFlipped, onFlip }) => {
  const cardId = card[2];
  const cardRef = doc(deckRef, "cards", cardId);

  const [popUp, setPopUp] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const handleContextMenu = (event) => {
    console.log("right click");
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.pageX,
      y: event.pageY,
    });
  };

  const handleClick = () => {
    setContextMenu({ visible: false, x: 0, y: 0 });
  };
  const handleClosePopup = () => {
    setPopUp(false);
  };

  const rephraseOption = async (event) => {
    event.stopPropagation();
    const input = card[0];
    try {
      const apiUrl = "https://api.openai.com/v1/chat/completions";
      const apiKey = "rubbish";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };

      const requestBody = {
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: `Rephrase this sentence: ${input}` },
        ],
      };

      const { data } = await axios.post(apiUrl, requestBody, { headers });

      const response = data.choices[0].message.content;
      console.log(response);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const editOption = (event) => {
    event.stopPropagation();
    console.log("edit");
    setPopUp(true);
  };

  const deleteOption = async () => {
    try {
      await deleteDoc(cardRef);
      await updateDoc(deckRef, {
        cardIds: arrayRemove(cardId),
      });

      console.log(`Card with ID ${cardId} deleted successfully`);
    } catch (error) {
      console.error("Delete error" + error.message);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("scroll", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("scroll", handleClick);
    };
  }, [contextMenu]);

  return (
    <>
      {popUp && (
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
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            }}
          >
            <EditCardPreview
              card={card}
              cardRef={cardRef}
              onClose={handleClosePopup}
            />
          </div>
        </div>
      )}
      <div
        onContextMenu={handleContextMenu}
        onClick={onFlip}
        style={{
          height: "250px",
          width: "200px",
          backgroundColor: "white",
          color: "black",
          padding: "10px",
          margin: "10px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <ReactQuill
          value={card[isFlipped ? 1 : 0]}
          readOnly={true}
          theme="bubble"
        />
        {contextMenu.visible && (
          <div
            style={{
              position: "absolute",
              width: "200px",
              backgroundColor: "#383838",
              borderRadius: "10px",
              boxSizing: "border-box",
              top: contextMenu.y,
              left: contextMenu.x - 70,
            }}
            zindex={10}
          >
            <ul
              style={{
                listStyle: "none",
                padding: "10px",
                margin: "0",
                boxSizing: "border-box",
                backgroundColor: "lightgray",
                borderRadius: "10px",
              }}
            >
              <li style={styles.li} onClick={(e) => rephraseOption(e)}>
                Rephrase
              </li>
              <li onClick={(e) => editOption(e)} style={styles.li}>
                Edit
              </li>
              <li onClick={deleteOption} style={styles.li}>
                Delete
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
const styles = {
  li: {
    position: "sticky",
    fontSize: "14px",
    color: "black",
    padding: "12px 8px",
    ":hover": {
      backgroundColor: "black", // Example hover effect
      cursor: "pointer",
    },
  },
};

export default FlipCard;
