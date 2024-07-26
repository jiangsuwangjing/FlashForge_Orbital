// Take the deck ref and user email, retrieve the correct field in the deckDoc
import { useEffect, useState, useMemo } from "react";
import { db } from "../config/firebase";
import { onSnapshot, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import useAuthStore from "../store/authStore";

const useGetSharedCardList = (deckRef, lastReviewed, uid) => {
  const [cardList, setCardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalMastery, setTotalMastery] = useState(0);
  const [sharedTo, setSharedTo] = useState([]);
  const [viewerList, setViewerList] = useState([]);
  const [editorList, setEditorList] = useState([]);

  const cardsRef = useMemo(
    () => (deckRef ? collection(deckRef, "cards") : null),
    [deckRef]
  );

  useEffect(() => {
    if (!deckRef || !cardsRef) return;

    const unsubscribeDeck = onSnapshot(
      deckRef,
      (deckDoc) => {
        let accumulatedMastery = 0;
        const currentTime = Date.now();
        const timeDifferenceInMin = (currentTime - lastReviewed) / (1000 * 60);

        const unsubscribeCards = onSnapshot(
          cardsRef,
          (snapshot) => {
            const cards = snapshot.docs.map((doc) => {
              const cardData = doc.data();
              const mastery = cardData[uid] ?? 0;
              const decayedMastery = getNewDecayedMastery(
                mastery,
                timeDifferenceInMin
              );

              cardData[uid] = decayedMastery;
              accumulatedMastery += decayedMastery;

              return {
                ...cardData,
                id: doc.id,
              };
            });

            setCardList(cards);
            setTotalMastery(accumulatedMastery);
            setLoading(false);
            console.log("Successfully fetched cards and deck info");
          },
          (error) => {
            console.error(error);
            setError("Failed to fetch card list");
            setLoading(false);
          }
        );

        return () => unsubscribeCards();
      },
      (error) => {
        console.error("Error fetching deck document:", error);
        setError("Failed to fetch deck document");
        setLoading(false);
      }
    );

    return () => unsubscribeDeck();
  }, []);


  const averageDecayedMastery = Math.ceil(totalMastery / cardList.length);
  return { cardList, loading, error, averageDecayedMastery };
};

const getNewDecayedMastery = (prevMastery, t) => {
  const mu1 = 0.704;
  const a1 = 0.000319;
  const mu2 = 0.000145;
  const a2 = 1.791e-7;

  const part1 = mu1 * Math.exp(-a1 * t);
  const part2 = mu1 * mu2 * (Math.exp(-a2 * t) - Math.exp(-a1 * t)) / (mu1 - mu2);

  const decayRatio = part1 + part2;

  return prevMastery * decayRatio;
}

export default useGetSharedCardList;
