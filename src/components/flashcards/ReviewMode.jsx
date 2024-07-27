import React, { useState, useEffect } from "react";
import useAuthStore from "../../store/authStore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CardInReview from "./CardInReview";

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
const ReviewMode = ({ deckId, cards, popOff }) => {
  const [cardIds, setCardIds] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [totalMastery, setTotalMastery] = useState(0);
  const user = useAuthStore((state) => state.user);
  const deckRef = doc(db, "users", user.uid, "library", deckId);

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
  }, [deckId]);

  const handleFlip = () => {
    setShowBack(!showBack);
  };

  const handleMasteryLevel = async (level) => {
    const currentCardId = cardIds[cardIndex];
    const newTotalMastery = totalMastery + level;
    setTotalMastery(newTotalMastery);
    await updateMasteryLevel(currentCardId, level);
    console.log("new total" + newTotalMastery);
    setShowBack(false);
    if (cardIndex == cards.length - 1) {
      console.log(newTotalMastery / cards.length);
      await popOff(Math.ceil(newTotalMastery / cards.length));
    } else {
      setCardIndex((prevIndex) => prevIndex + 1);
    }
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
        backgroundColor: "rgba(0, 0, 0, 0.85)",
      }}
    >
      <div className="w-full h-full flex align-center justify-center">
        <div className="w-full h-full">
          <CardInReview
            text={
              <ReactQuill
                className="w-full h-full"
                value={showBack ? currentCard.back : currentCard.front}
                readOnly={true}
                theme="bubble"
              />
            }
            handleFlip={handleFlip}
            imageUrl={
              showBack ? currentCard.backImageUrl : currentCard.frontImageUrl
            }
            audioUrl={
              showBack ? currentCard.backAudioUrl : currentCard.frontAudioUrl
            }
          />
        </div>
        {showBack && (
          <div
            style={{ position: "absolute", bottom: "20%" }}
            className="w-1/2 flex justify-center"
          >
            <button
              style={{
                color: "white",
                fontWeight: "600",
                borderColor: "gray",
              }}
              onClick={() => handleMasteryLevel(25)}
            >
              Fail
            </button>
            <button
              style={{
                color: "#white",
                fontWeight: "600",
                borderColor: "gray",
              }}
              onClick={() => handleMasteryLevel(50)}
            >
              Hard
            </button>
            <button
              style={{
                color: "#white",
                fontWeight: "600",
                borderColor: "gray",
              }}
              onClick={() => handleMasteryLevel(75)}
            >
              Good
            </button>
            <button
              style={{
                color: "#white",
                fontWeight: "600",
                borderColor: "gray",
              }}
              onClick={() => handleMasteryLevel(100)}
            >
              Easy
            </button>
          </div>
        )}
      </div>
      {/* <button
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
      </button> */}
    </div>
  );
};

// const Card = ({ text, imageUrl, audioUrl }) => {
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         height: "100%",
//       }}
//     >
//       <audio controls style={{ position: "absolute", top: "22%" }}>
//         <source src={audioUrl} type="audio/mpeg" />
//       </audio>
//       <div
//         style={{
//           height: "250px",
//           minWidth: "250px",
//           backgroundColor: "white",
//           color: "black",
//           padding: "10px",
//           margin: "10px",
//           borderRadius: "10px",
//           boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
//           cursor: "pointer",
//           userSelect: "none",
//           position: "absolute",
//           top: "28%",
//           left: "41.4%",
//         }}
//       >
//         {text}
//       </div>
//       {imageUrl && (
//         <img
//           src={imageUrl}
//           alt="Card visual"
//           style={{ maxHeight: "200px", margin: "10px" }}
//         />
//       )}
//     </div>
//   );
// };
export default ReviewMode;
