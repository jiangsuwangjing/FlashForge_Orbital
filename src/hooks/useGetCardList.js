import { useEffect, useState, useMemo } from "react";
import { db } from "../config/firebase";
import { onSnapshot, collection, doc } from "firebase/firestore";
import useAuthStore from "../store/authStore";

const useGetCardList = (deckName) => {
  const [cardList, setCardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    const unsubscribe = onSnapshot(
      cardsRef,
      (snapshot) => {
        const cards = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setCardList(cards);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setError("Failed to fetch card list");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [cardsRef]);

  return { cardList, loading, error };
};

export default useGetCardList;
