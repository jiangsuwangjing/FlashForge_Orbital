import { useEffect, useState } from "react";
import "../../styles/App.css";
import { updateDoc, getDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import useAuthStore from "../../store/authStore";
import { SimpleGrid } from "@chakra-ui/react";
import "react-quill/dist/quill.snow.css";
import FlipCard from "../flashcards/FlipCard";
import useGetSharedCardList from "../../hooks/useGetSharedCardList";
import ReviewModeShared from "../flashcards/ReviewModeShared";

const SharedDeck = ({ deckDoc, viewOnly }) => {
  const user = useAuthStore((state) => state.user);
  // const deckRef = doc(db, "users", user.uid, "shared", deckId);
  const deckRef = deckDoc.deckRef;
  const lastReviewed = deckDoc.lastReviewed;
  const uid = user.uid;

  const { cardList, loading, averageDecayedMastery } = useGetSharedCardList(
    deckRef,
    lastReviewed,
    uid
  );

  const [averageMastery, setAverageMastery] = useState(
    isNaN(averageDecayedMastery) ? 0 : averageDecayedMastery
  );
  useEffect(() => {
    if (!isNaN(averageDecayedMastery)) {
      setAverageMastery(averageDecayedMastery);
    }
  }, [averageDecayedMastery]);

  const updateSharedUserMap = async (newOverallMastery) => {
    try {
      const deckDoc = await getDoc(deckRef);
      if (!deckDoc.exists()) {
        console.error("Document not found");
        return;
      }
      const deckData = deckDoc.data();
      console.log(deckData);
      const sharedList = viewOnly ? deckData.viewers : deckData.editors;

      // Find the index of the map that contains the email key
      const userInfo = sharedList.find((user) => user.uid === uid);

      if (viewOnly) {
        await updateDoc(deckRef, {
          viewers: arrayRemove(userInfo),
        });

        userInfo.lastReviewed = Date.now();
        userInfo.overallMastery = newOverallMastery;

        await updateDoc(deckRef, {
          viewers: arrayUnion(userInfo),
        });
      } else {
        await updateDoc(deckRef, {
          editors: arrayRemove(userInfo),
        });

        userInfo.lastReviewed = Date.now();
        userInfo.overallMastery = newOverallMastery;

        await updateDoc(deckRef, {
          editors: arrayUnion(userInfo),
        });
      }

      // if (mapIndex === -1) {
      //   console.error("Email not found in shared user array");
      //   return;
      // }

      // Construct the field path for the map to be updated
      // const mapPath = viewOnly ? `viewers.${mapIndex}` : `editors.${mapIndex}`;
      // const lastReviewedPath = `${mapPath}.lastReviewed`
      // const overallMasteryPath = `${mapPath}.overallMastery`
      // console.log(lastReviewedPath);
      // console.log(overallMasteryPath);

      // // Update the document with new values for the specific map
      // await updateDoc(deckRef, {
      //   [lastReviewedPath]: Date.now(),
      //   [overallMasteryPath]: newOverallMastery,
      // });

      console.log("Document updated successfully");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const [flippedCards, setFlippedCards] = useState({});
  const [pop, setPop] = useState(false);
  const popOn = () => {
    setPop(true);
  };
  const popOff = async (overallMastery) => {
    setPop(false);
    try {
      await updateSharedUserMap(overallMastery);
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
          <ReviewModeShared deckId={deckId} cards={cardList} popOff={popOff} />
        </div>
      )}
      <h2 className="text-2xl font-bold text-white-800 mb-4">
        {" "}
        Overall Mastery: {Math.round(averageMastery * 100) / 100}%
      </h2>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            overflowY: "auto",
            flexGrow: 1,
            padding: "15px",
            height: "60vh",
            width: "100%",
          }}
          className="flex flex-row flex-wrap"
        >
          {cardList.length == 0 && (
            <div className="flex items-start justify-start w-full">
              <h2 className="text-2xl font-bold text-white-800 mb-4 text-center algin-middle">
                Create Your First Card!
              </h2>
            </div>
          )}
          {cardList
            .map(
              ({
                front,
                back,
                id,
                frontImageUrl,
                backImageUrl,
                frontAudioUrl,
                backAudioUrl,
                mastery,
              }) => [
                front,
                back,
                id,
                frontImageUrl,
                backImageUrl,
                frontAudioUrl,
                backAudioUrl,
                mastery,
              ]
            )
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

export default SharedDeck;
