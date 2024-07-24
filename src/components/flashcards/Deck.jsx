import { useEffect, useState } from "react";
import "../../styles/App.css";
import { db, auth } from "../../config/firebase";
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
import useAuthStore from "../../store/authStore";
import useGetCardList from "../../hooks/useGetCardList";
import ReviewMode from "./ReviewMode";
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
import ShareDeck from "./ShareDeck";
import FlipCard from "./FlipCard";
import { Spinner } from "@chakra-ui/react";
import "../../styles/Deck.css";
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

  const { cardList, loading, averageDecayedMastery } = useGetCardList(
    deckName,
    deckRef
  );

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
          className="button"
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
