import { useEffect, useState } from "react";
import { doc, collection, getDocs, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import useAuthStore from "../store/authStore";
import useLibraryStore from "../store/libraryStore";
import useSharedDeckStore from "../store/sharedDeckStore";

const useGetViewOnlySharedDeckList = () => {
  const user = useAuthStore((state) => state.user);
  const userRef = doc(db, "users", user.uid);
  const [deckList, setDeckList] = useState([])

  const { viewOnlyDecksList, setViewOnlyDecksList } = useSharedDeckStore();

  useEffect(() => {
    if (viewOnlyDecksList.length === 0 && user) {
      const unsubscribe = onSnapshot(
        userRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.data();
            const viewOnlyDeckList = userData.canView || [];
            setViewOnlyDecksList(viewOnlyDeckList);
            console.log("shared decks loaded")
          } else {
            console.error("User document does not exist");
          }
        },
        (error) => {
          console.error("Error fetching real-time updates:", error);
        }
      );

      return () => unsubscribe();
    }
  }, []);

  console.log(viewOnlyDecksList);
  return viewOnlyDecksList;
};

export default useGetViewOnlySharedDeckList;
