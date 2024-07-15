//UPDATING

import { useEffect, useState, useMemo } from "react";
import { db } from "../config/firebase";
import { onSnapshot, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import useAuthStore from "../store/authStore";

const useGetCardList = (deckName) => {
  const [cardList, setCardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalMastery, setTotalMastery] = useState(0);

  const user = useAuthStore((state) => state.user);

  const userRef = useMemo(
    () => (user ? doc(db, "users", user.uid) : null),
    [user]
  );
  const libraryRef = useMemo(
    () => (userRef ? collection(userRef, "library") : null),
    [userRef]
  );
  const deckRef = useMemo(
    () => (libraryRef ? doc(libraryRef, deckName) : null),
    [libraryRef, deckName]
  );
  const cardsRef = useMemo(
    () => (deckRef ? collection(deckRef, "cards") : null),
    [deckRef]
  );

  useEffect(() => {
    if (!cardsRef) return;

    const fetchDeckAndCards = async () => {
      try {
        const deckDoc = await getDoc(deckRef);
        const deckData = deckDoc.data();
        const lastReviewed = deckData.lastReviewed;
        let accumulatedMastery = 0;

        const currentTime = Date.now();
        const timeDifferenceInMin = (currentTime - lastReviewed) / (1000 * 60);

        const unsubscribe = onSnapshot(
          cardsRef,
          (snapshot) => {
            const cards = snapshot.docs.map((doc) => {
              const cardData = doc.data();
              const decayedMastery = getNewDecayedMastery(cardData.mastery, timeDifferenceInMin);
              // console.log(cardData.mastery);
              // console.log(timeDifferenceInMin);
              cardData.mastery = decayedMastery;
              accumulatedMastery += decayedMastery;

              return {
                ...cardData,
                id: doc.id,
              };
            });

            setCardList(cards);
            setLoading(false);
            setTotalMastery(accumulatedMastery);
          },
          (error) => {
            console.error(error);
            setError("Failed to fetch card list");
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } catch (err) {
        console.error(err);
        setError("Failed to fetch deck or cards");
        setLoading(false);
      }
    };

    fetchDeckAndCards();
  }, [cardsRef]);

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

export default useGetCardList;
