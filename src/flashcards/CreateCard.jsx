import React from 'react'
import { useEffect, useState } from 'react';
import { doc, setDoc, collection, addDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase'
import useAuthStore from '../store/useAuthStore';

const CreateCard = ({deckName}) => {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  // get referece to the deck
  const user = useAuthStore((state) => state.user);
  const userRef = doc(db, "users", user.uid);
  const libraryRef = collection(userRef, "library");
  const deckRef = doc(libraryRef, deckName);
  const cardsRef = collection(deckRef, "cards")

  const onSubmitCard = async () => {
    try {
      await addDoc(cardsRef, {
        front: front,
        back: back,
        mastery: 0,
        userId: auth?.currentUser?.uid,
        lastReviewed: Date.now()
      })
      
      console.log('New card created successfully')
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <input 
        placeholder='front:'
        onChange={(e) => setFront(e.target.value)}
      />
      <input 
        placeholder='back:'
        onChange={(e) => setBack(e.target.value)}
      />
      <button onClick={onSubmitCard}>
        Add
      </button>
    </div>
  )
}

export default CreateCard