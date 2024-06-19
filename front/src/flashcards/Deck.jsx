import { useEffect, useState } from 'react';
import '../styles/App.css'
import { db, auth } from '../config/firebase';
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import CreateCard from './CreateCard'
import CardBack from './InReview/CardBack';

const Deck = () => {
  const [cardList, setCardList] = useState([]);

  // extract all user info
  const userDocRef = doc(db, "users", auth.currentUser.email);
  // extract the collection of the deck
  const deckRef = collection(userDocRef, "test");
  
  const getCardList = async () => {
    try {
      //  extract data
      const data = await getDocs(deckRef);
      // turn into array
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }));
      setCardList(filteredData);
    } catch (err) {
      console.error(err);
    }
  }

  const data = getDocs(deckRef);
  const cardDocs = data.docs;

  useEffect(() => {
    if (deckRef) {
      getCardList();
    }
  }, [deckRef]);

  return (
    <div>
      {cardList.map((card) =>
        <div key={card.id}>
          Front: {card.front} Back: {card.back} 
        </div>
      )}
    </div>
  );
};

export default Deck