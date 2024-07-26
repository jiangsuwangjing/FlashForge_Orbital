import { useEffect, useState } from "react";
import { doc, collection, getDocs, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import useAuthStore from "../store/authStore";
import useSharedDeckStore from "../store/sharedDeckStore";

const useGetEditableSharedDeckList = () => {
  const user = useAuthStore((state) => state.user);
  const userRef = doc(db, "users", user.uid);
  const [deckList, setDeckList] = useState([])

  const { editableDecksList, setEditableDecksList } = useSharedDeckStore();

  useEffect(() => {
    if (editableDecksList.length === 0 && user) {
      const unsubscribe = onSnapshot(
        userRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.data();
            const editableSharedDeckList = userData.canEdit || [];
            setEditableDecksList(editableSharedDeckList);
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

  console.log(editableDecksList);
  return editableDecksList;
};

export default useGetEditableSharedDeckList;
