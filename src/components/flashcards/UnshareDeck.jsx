import {
  arrayRemove,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import React from "react";
import { db } from "../../config/firebase";
import { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";
import "../../styles/ShareDeck.css";
const UnshareDeck = ({ deckName, deckRef, destUid }) => {
  const [destEmail, setDestEmail] = useState("");
  const [destProfilePic, setDestProfilePic] = useState("");
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
        console.error("Error fetching destination user email:", error);
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
      });
      alert("unshared successfully");
    } catch (error) {
      console.log(error.message);
    }
  };

  console.log(destEmail);
  return (
    <div className="access-item">
      <div className="access-avatar"></div>
      <div className="access-info">
        <span className="access-email">{destEmail}</span>
        <span className="access-role">Viewer</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginLeft: "auto",
        }}
      >
        <button
          style={{
            backgroundColor: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "25px",
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: "bold",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          Unshare
        </button>
      </div>
    </div>
  );
};

export default UnshareDeck;
