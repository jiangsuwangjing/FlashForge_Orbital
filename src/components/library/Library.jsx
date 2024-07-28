import React from 'react'
import { useState, useEffect } from 'react';
import { doc, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import useAuthStore from '../store/useAuthStore';
import useLibraryStore from '../store/useLibraryStore';

//Library is a collection containing the docs of decks
const Library = () => {
  // const [deckList, setDeckList] = useState([]);

  const user = useAuthStore((state) => state.user);
  const userRef = doc(db, "users", user.uid);
  const libraryRef = collection(userRef, "library");

  const { deckList, setDeckList } = useLibraryStore();

  const getDeckList = async () => {
    try {
      // extract data
      const data = await getDocs(libraryRef);
      // turn into array
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        // id: doc.id
      }));
      setDeckList(filteredData);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (libraryRef) {
      getDeckList();
    }
  }, [libraryRef]);

  return (
    <div>
      {deckList.map((deck) =>
        <div key={deck.deckName}>
          { deck.deckName }
        </div>
      )}
    </div>
  );
}

export default Library