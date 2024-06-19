import React from 'react'
import { useEffect, useState } from 'react';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db, auth } from '../config/firebase'

const CreateDeck = () => {
  // New Deck States
  const [newDeckName, setNewDeckName] = useState("");

  // reference to the document of a user
  const userDocRef = doc(db, "users", auth.currentUser.email);

  console.log(auth.currentUser.email);

  
  const createNewDeck = async () => {
    try {
      // create a new collection named by newDeckName
      const newDeckRef = collection(userDocRef, newDeckName);
      await setDoc(doc(newDeckRef), { initialized: true });

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