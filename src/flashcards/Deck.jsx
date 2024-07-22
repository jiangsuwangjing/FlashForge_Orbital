import { useEffect, useState } from "react";
import "../styles/App.css";
import { db, auth } from "../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import useAuthStore from "../store/authStore";
import useGetCardList from "../hooks/useGetCardList";
import ReviewMode from "./ReviewMode";
import ReactQuill from "react-quill";
import EditCardPreview from "./EditCardPreview";
import {
  SimpleGrid,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { arrayRemove } from "firebase/firestore";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { left } from "@popperjs/core";
import ShareDeck from "./ShareDeck";
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
    const frontContent = card[0];
    const backContent = card[1];
    try {
      const apiUrl = "https://api.openai.com/v1/chat/completions";
      const apiKey = import.meta.env.VITE_CHATGPT_API_KEY;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      };

      const requestBody = {
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: `This is front (question) of a flashcard: ${frontContent} this is back (answer): ${backContent}. Only return rephrased front that leads to the same back.`},
        ],
      };

      const { data } = await axios.post(apiUrl, requestBody, { headers });

      const response = data.choices[0].message.content;
      await updateDoc(cardRef, {
        front: response,
      });
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
    color: "white",
    padding: "12px 8px",
    ":hover": {
      backgroundColor: "black", // Example hover effect
      cursor: "pointer",
    },
  },
};
const Deck = ({ deckName }) => {
  const user = useAuthStore((state) => state.user);
  const deckRef = doc(db, "users", user.uid, "library", deckName);

  // const deckDoc = getDoc(deckRef);
  // // if (!deckDoc.exists()) {
  // //   alert('Deck not found');
  // //   return;
  // // }
  // const deckData = deckDoc.data();
  // let sharedTo = [];
  // if (deckData.sharedTo) {
  //   sharedTo = deckData.sharedTo;
  // }
  // const ownsThisDeck = !sharedTo.includes(user.uid);

  const { cardList, averageDecayedMastery } = useGetCardList(deckName, deckRef);

  // const totalMastery = cardList.reduce((acc, card) => acc + card.mastery, 0);
  // const averageMastery = cardList.length > 0 ? Math.ceil(totalMastery / cardList.length) : 0;
  // console.log(averageDecayedMastery);
  const [averageMastery, setAverageMastery] = useState(
    isNaN(averageDecayedMastery) ? 0 : averageDecayedMastery
  );
  useEffect(() => {
    if (!isNaN(averageDecayedMastery)) {
      setAverageMastery(averageDecayedMastery);
    }
  }, [averageDecayedMastery]);

  // const initialAverageMastery = averageDecayedMastery == NaN ? 0 : averageDecayedMastery;

  // await updateDoc(deckRef, { overallMastery: averageMastery });

  const [flippedCards, setFlippedCards] = useState({});
  const [pop, setPop] = useState(false);
  const popOn = () => {
    setPop(true);
  };
  const popOff = async (overallMastery) => {
    setPop(false);
    try {
      // const userRef = doc(db, "users", user.uid);
      // const libraryRef = collection(userRef, "library");
      // const deckRef = doc(libraryRef, deckName);
      await updateDoc(deckRef, {
        lastReviewed: Date.now(),
        overallMastery: overallMastery,
      });
      setAverageMastery(overallMastery);
      console.log(averageMastery);
      console.log("Review date updated");
    } catch (error) {
      console.error("Error updating review date:", error);
    }
  };
  const handleFlip = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      {pop && (
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
          <ReviewMode deckName={deckName} cards={cardList} popOff={popOff} />
        </div>
      )}
      <h2> Overall Mastery: {Math.round(averageMastery * 100) / 100}%</h2>
      <div style={{ display: "flex", flexDirection: "column", height: "50vh" }}>
        <div style={{ overflowY: "auto", flexGrow: 1, padding: "10px" }}>
          <SimpleGrid columns={5}>
            {cardList
              .map(({ front, back, id, frontImageUrl, backImageUrl }) => [
                front,
                back,
                id,
                frontImageUrl,
                backImageUrl,
              ])
              .map((card, index) => (
                <>
                  <FlipCard
                    card={card}
                    deckRef={deckRef}
                    key={index}
                    isFlipped={!!flippedCards[index]}
                    onFlip={() => handleFlip(index)}
                  />
                </>
              ))}
          </SimpleGrid>
        </div>
        <button
          onClick={popOn}
          style={{
            position: "absolute",
            bottom: "30px",
            left: "87vh",
            borderRadius: "5px",
            borderColor: "white",
          }}
        >
          Start Revision
        </button>
      </div>
      <ShareDeck deckName={deckName} />
    </>
  );
};

export default Deck;
