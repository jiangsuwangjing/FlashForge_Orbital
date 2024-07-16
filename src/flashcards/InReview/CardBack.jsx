import React from "react";
import { updateDoc } from "firebase/firestore";

const CardBack = ({ CardDoc }) => {
  const back = CardDoc.back;

  const updateMastery = async ({ NewMastery }) => {
    await updateDoc(CardDoc, { mastery: NewMastery });
  };

  return (
    <>
      <div>{back}</div>
      <button onClick={() => updateMastery(25)}>Fail</button>
      <button onClick={() => updateMastery(50)}>Hard</button>
      <button onClick={() => updateMastery(75)}>Good</button>
      <button onClick={() => updateMastery(100)}>Easy</button>
    </>
  );
};

export default CardBack;
