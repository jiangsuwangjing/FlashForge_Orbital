import { arrayRemove, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import React from 'react'
import { db } from '../config/firebase'
import { useState, useEffect } from 'react'

const UnshareDeck = ({deckName, deckRef, destUid }) => {
  const [destEmail, setDestEmail] = useState('');
  const destUserRef = doc(db, "users", destUid);

  useEffect(() => {
    const fetchDestUserEmail = async () => {
      try {
        const destUserDoc = await getDoc(destUserRef);
        if (destUserDoc.exists()) {
          const destData = destUserDoc.data();
          setDestEmail(destData.email);
        } else {
          console.log("Destination user does not exist");
        }
      } catch (error) {
        console.error('Error fetching destination user email:', error);
      }
    };

    fetchDestUserEmail();
  }, [destUid]);


  const onUnshareDeck = async () => {
    try {
      const destDeckRef = doc(destUserRef, "library", deckName);
      await deleteDoc(destDeckRef);
      await updateDoc(deckRef, {
        sharedTo: arrayRemove(destUid),
      })
      console.log("unshared successfully");
    } catch (error) {
      console.log(error.message);
    }
  }

  console.log(destEmail);
  return (
    <div>
      <li>
        {destEmail}
      </li>
      <button onClick={onUnshareDeck}>
        Unshare
      </button>
    </div>
  )
}

export default UnshareDeck