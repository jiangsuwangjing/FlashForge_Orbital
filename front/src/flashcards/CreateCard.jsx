import React from "react";
import { useEffect, useState } from "react";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { createEditor } from "slate";

import { Slate, Editable, withReact } from "slate-react";
const CreateCard = () => {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const userDocRef = doc(db, "users", auth.currentUser.email);
  const deckRef = collection(userDocRef, "test");
  const onSubmitCard = async () => {
    try {
      await addDoc(deckRef, {
        front: front,
        back: back,
        mastery: 0,
        userId: auth?.currentUser?.uid,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "80%",
        width: "40%",
        color: "black",
        borderRadius: "10px",
        backgroundColor: "white",
        padding: "20px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button style={ujin}>Close</button>
        <button style={ujin} onClick={onSubmitCard}>
          Save
        </button>
      </div>
      <div style={{ marginBottom: "15px", textAlign: "center" }}>New Card</div>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div>Front</div>
        <textarea
          placeholder="back:"
          onChange={(e) => setBack(e.target.value)}
          style={{ height: "100%", backgroundColor: "white" }}
        />
        {/* placeholder="front:"
          onChange={(e) => setFront(e.target.value)}
          style={{ height: "100%", backgroundColor: "white" }}
        /> */}
      </div>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div>Back</div>
        <textarea
          placeholder="back:"
          onChange={(e) => setBack(e.target.value)}
          style={{ height: "100%", backgroundColor: "white" }}
        />
      </div>
    </div>
  );
};
const ujin = {
  color: "#38b6ff",
  border: "none",
  background: "white",
};

export default CreateCard;
