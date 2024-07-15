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

import "react-quill/dist/quill.snow.css";

const FlipCard = ({ card, isFlipped, onFlip }) => {
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
      x: event.clientX,
      y: event.clientY,
    });
  };
  const handleClick = () => {
    setContextMenu({ visible: false, x: 0, y: 0 });
  };
  const handleClosePopup = () => {
    setPopUp(false);
  };
  const editOption = (event) => {
    event.stopPropagation();
    console.log("edit");
    setPopUp(true);
  };
  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
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
            <EditCardPreview card={card} onClose={handleClosePopup} />
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
            }}
            top={contextMenu.y}
            left={contextMenu.x}
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
              <li onClick={(e) => editOption(e)} style={styles.li}>
                Edit
              </li>
              <li style={styles.li}>Delete</li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
const styles = {
  li: {
    color: "white",
    padding: "18px 12px",
    ":hover": {
      backgroundColor: "black", // Example hover effect
      cursor: "pointer",
    },
  },
};
const Deck = ({ deckName }) => {
  const { cardList, averageDecayedMastery } = useGetCardList(deckName);
  const user = useAuthStore((state) => state.user);

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
      const userRef = doc(db, "users", user.uid);
      const libraryRef = collection(userRef, "library");
      const deckRef = doc(libraryRef, deckName);
      await updateDoc(deckRef, {
        lastReviewed: Date.now(),
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
          <SimpleGrid columns={5} spacing="10px" padding="10px">
            {cardList
              .map(({ front, back }) => [front, back])
              .map((card, index) => (
                <>
                  <FlipCard
                    card={card}
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
    </>
  );
};

export default Deck;
