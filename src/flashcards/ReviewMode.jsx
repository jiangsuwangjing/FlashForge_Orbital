import React, { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

/**
 * Passing the current deck name and the list of cards to enter the review mode.
 * It's connected to the database but needs some styling and routing.
 * This component rotates through the deck of cards and does not stop.
 * Stopping condition need to be added.
 *
 * Example call:
 * const cards = useGetCardList("fifthdeck").cardList;
 * { cards && <ReviewMode deckName={"fifthdeck"} cards={cards} /> }
 *
 * @param {deckName, cards} param0
 * @returns
 */
const ReviewMode = ({ deckName, cards, popOff }) => {
  const [cardIds, setCardIds] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const user = useAuthStore((state) => state.user);
  const deckRef = doc(db, "users", user.uid, "library", deckName);
  console.log(deckRef);

  const getCardIds = async (deckRef) => {
    try {
      const deckDoc = await getDoc(deckRef);
      if (deckDoc.exists()) {
        const deckData = deckDoc.data();
        return deckData.cardIds;
      } else {
        console.log("No such document!");
        return [];
      }
    } catch (error) {
      console.error("Error fetching deck data: ", error);
      return [];
    }
  };

  const updateMasteryLevel = async (cardId, newMastery) => {
    try {
      const cardDocRef = doc(deckRef, "cards", cardId);
      await updateDoc(cardDocRef, { mastery: newMastery });
      console.log("Mastery level updated successfully.");
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const fetchCardIds = async () => {
      const ids = await getCardIds(deckRef);
      setCardIds(ids);
      console.log(ids);
    };

    fetchCardIds();
  }, [deckName]);

  const handleFlip = () => {
    setShowBack(!showBack);
  };

  const handleMasteryLevel = async (level) => {
    const currentCardId = cardIds[cardIndex];
    console.log(currentCardId);
    await updateMasteryLevel(currentCardId, level);
    setShowBack(false);
    setCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  if (cards.length === 0) {
    return <div>Loading...</div>;
  }

  const currentCard = cards[cardIndex];

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 1)",
      }}
    >
      <div>
        <div onClick={handleFlip}>
          <Card
            text={
              <ReactQuill
                value={showBack ? currentCard.back : currentCard.front}
                readOnly={true}
                theme="bubble"
              />
            }
          />
        </div>
        {showBack && (
          <div>
            <button onClick={() => handleMasteryLevel(25)}>Fail</button>
            <button onClick={() => handleMasteryLevel(50)}>Hard</button>
            <button onClick={() => handleMasteryLevel(75)}>Good</button>
            <button onClick={() => handleMasteryLevel(100)}>Easy</button>
          </div>
        )}
      </div>
      <button
        onClick={popOff}
        style={{
          position: "absolute",
          bottom: "30px",
          left: "87vh",
          borderRadius: "5px",
          borderColor: "white",
        }}
      >
        End Revision
      </button>
    </div>
  );
};
const Card = ({ text }) => {
  return (
    <div
      style={{
        height: "250px",
        minWidth: "250px",
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
      {text}
    </div>
  );
};
export default ReviewMode;
