import { arrayRemove, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore'
import React from 'react'
import { db } from '../config/firebase'
import { useState, useEffect } from 'react'

const UnshareDeck = ({deckName, deckRef, destUid }) => {
  const [destEmail, setDestEmail] = useState('');
  const [destProfilePic, setDestProfilePic] = useState('')
  const destUserRef = doc(db, "users", destUid);

  useEffect(() => {
    const fetchDestUserEmail = async () => {
      try {
        const destUserDoc = await getDoc(destUserRef);
        if (destUserDoc.exists()) {
          const destData = destUserDoc.data();
          setDestEmail(destData.email);
          setDestProfilePic(destData.profilePicUrl);
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
      alert("unshared successfully");
    } catch (error) {
      console.log(error.message);
    }
  }

  console.log(destEmail);
  return (
    <div>
      {/* <li>
        {destEmail}
      </li>
      <button onClick={onUnshareDeck}>
        Unshare
      </button> */}
      <div className="access-item">
        <div className="access-avatar"></div>
        <div className="access-info">
          <span className="access-email">{destEmail}</span>
          <span className="access-role">Viewer</span>
        </div>
        <button onClick={onUnshareDeck}>
          Unshare
        </button>
      </div>
    </div>
  )
}

export default UnshareDeck