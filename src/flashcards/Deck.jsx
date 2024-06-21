import { useEffect, useState } from 'react';
import '../styles/App.css'
import { db, auth } from '../config/firebase';
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import CreateCard from './CreateCard'
import CardBack from './InReview/CardBack';
import useAuthStore from '../store/useAuthStore';

const Deck = ({deckName}) => {
  const [cardList, setCardList] = useState([]);

  // get referece to the deck
  const user = useAuthStore((state) => state.user);
  const userRef = doc(db, "users", user.uid);
  const libraryRef = collection(userRef, "library");
  
  // get ref for the cards
  const deckRef = doc(libraryRef, deckName);
  const cardsRef = collection(deckRef, 'cards')
  
  const getCardList = async () => {
    try {
      // extract data
      const data = await getDocs(cardsRef);
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

  // const data = getDocs(cardsRef);
  // const cardDocs = data.docs;

  useEffect(() => {
    if (cardsRef) {
      getCardList();
    }
  }, [cardsRef]);

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