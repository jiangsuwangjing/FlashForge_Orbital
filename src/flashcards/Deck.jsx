import { useEffect, useState } from "react";
import "../styles/App.css";
import { db, auth } from "../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

import useGetCardList from "../hooks/useGetCardList";
import ReviewMode from "./ReviewMode";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const FlipCard = ({ card, isFlipped, onFlip }) => {
  return (
    <div
      onClick={onFlip}
      style={{
        height: "250px",
        minWidth: "200px",
        backgroundColor: "white",
        color: "black",
        padding: "10px",
        margin: "10px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <ReactQuill
        value={card[isFlipped ? 1 : 0]}
        readOnly={true}
        theme="bubble"
      />
      {/* {card[isFlipped ? 1 : 0]} */}
    </div>
  );
};

const Deck = ({ deckName }) => {
  const { cardList } = useGetCardList(deckName);

  const totalMastery = cardList.reduce((acc, card) => acc + card.mastery, 0);
  const averageMastery = cardList.length > 0 ? totalMastery / cardList.length : 0;
  // await updateDoc(deckRef, { overallMastery: averageMastery });

  const [flippedCards, setFlippedCards] = useState({});
  const [pop, setPop] = useState(false);
  const popOn = () => {
    setPop(true);
  };
  const popOff = () => {
    setPop(false);
  };
  const handleFlip = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      {pop && (
        <div
          style={{
            position: "absolute",
            left: "0",
            top: "0",
            bottom: "0",
            right: "0",
            zIndex: "1",
          }}
        >
          <ReviewMode deckName={deckName} cards={cardList} popOff={popOff} />
        </div>
      )}
      <h2> Overall Mastery: {averageMastery}%</h2>
      <div
        style={{
          display: "flex",
          overflowX: "scroll",
          width: "70vw",
        }}
      >
        {cardList
          .map(({ front, back }) => [front, back])
          .map((card, index) => (
            <>
              <FlipCard
                card={card}
                key={index}
                isFlipped={!!flippedCards[index]}
                onFlip={() => handleFlip(index)}
              />
            </>
          ))}
      </div>
      <button
        onClick={popOn}
        style={{
          position: "absolute",
          bottom: "30px",
          left: "87vh",
          borderRadius: "5px",
          borderColor: "white",
        }}
      >
        Start Revision
      </button>
    </>
  );
};

export default Deck;
