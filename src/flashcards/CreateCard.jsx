import React from 'react'
import { useEffect, useState } from 'react';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase'

const CreateCard = () => {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const userDocRef = doc(db, "users", auth.currentUser.email);
  const DeckRef = collection(userDocRef, "test");
  
  const onSubmitCard = async () => {
    try {
      await addDoc(DeckRef, {
        front: front,
        back: back,
        mastery: 0,
        userId: auth?.currentUser?.uid
      })
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