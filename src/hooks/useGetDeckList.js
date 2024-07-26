import { useEffect, useState } from "react";
import { doc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import useAuthStore from "../store/authStore";
import useLibraryStore from "../store/libraryStore";

const useGetDeckList = () => {
  const user = useAuthStore((state) => state.user);
  const userRef = doc(db, "users", user.uid);
  const libraryRef = collection(userRef, "library");

  const { deckList, setDeckList } = useLibraryStore();

  useEffect(() => {
    if (deckList.length === 0 && user) {
      const getDeckList = async () => {
        try {
          // extract data
          const data = await getDocs(libraryRef);
          // turn into array
          const filteredData = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setDeckList(filteredData);
          // console.log(filteredData);
        } catch (err) {
          console.error(err);
        }
      };

      getDeckList();
    }
  }, [setDeckList]);

  return deckList;
};

export default useGetDeckList;
