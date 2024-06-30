import React from 'react'
import { useEffect, useState } from 'react';
import { doc, addDoc, collection, setDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase'
import useAuthStore from '../store/useAuthStore';
import useLibraryStore from '../store/useLibraryStore';

const CreateDeck = () => {
  // New Deck States
  const [newDeckName, setNewDeckName] = useState("");

  // getReferece to the library
  const user = useAuthStore((state) => state.user);
  const userRef = doc(db, "users", user.uid);
  const libraryRef = collection(userRef, "library");
  const deckDoc = {
    deckName: newDeckName,
    createdAt: Date.now(),
    lastReviewed: Date.now(),
    overallMastery: 0,
  }

  const { deckList, setDeckList, addDeck } = useLibraryStore();
  
  const createNewDeck = async () => {
    try {
      // create a new document for the deck, which contains its information
      await setDoc(doc(libraryRef, newDeckName), deckDoc);
      
      // add the deck to local library store
      addDeck({ ...deckDoc });

      setNewDeckName("");

      console.log(`New deck named ${newDeckName} created successfully.`);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <input 
        placeholder='Deck name:'
        onChange={(e) => setNewDeckName(e.target.value)}
      />
      <button onClick={createNewDeck}>
        Create New Deck
      </button>
    </>
  )
}

export default CreateDeck