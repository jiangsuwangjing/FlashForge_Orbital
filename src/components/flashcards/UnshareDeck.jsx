import {
  arrayRemove,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from '@chakra-ui/react'
import React from "react";
import { db } from "../../config/firebase";
import { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";
import "../../styles/ShareDeck.css";
import { ChevronDownIcon } from "@chakra-ui/icons";

const UnshareDeck = ({ 
  // deckId, destUid, 
  userDoc, deckRef, onChangeStatus, onUnshareDeck }) => {
  const [destEmail, setDestEmail] = useState("");
  const [destProfilePic, setDestProfilePic] = useState("");
  // const destUserRef = doc(db, "users", userDoc.uid);

  // useEffect(() => {
  //   const fetchDestUserEmail = async () => {
  //     try {
  //       const destUserDoc = await getDoc(destUserRef);
  //       if (destUserDoc.exists()) {
  //         const destData = destUserDoc.data();
  //         setDestEmail(destData.email);
  //         setDestProfilePic(destData.profilePicUrl);
  //       } else {
  //         console.log("Destination user does not exist");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching destination user email:", error);
  //     }
  //   };

  //   fetchDestUserEmail();
  // }, [destUid]);

  // const onUnshareDeck = async () => {
  //   try {
  //     // const destDeckRef = doc(destUserRef, "library", deckId);
  //     // // await deleteDoc(destDeckRef);
  //     // await updateDoc(deckRef, {
  //     //   sharedTo: arrayRemove(destUid),
  //     // });
  //     alert("unshared successfully");
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  console.log(userDoc.email);
  return (
    <div className="access-item">
      <div className="access-avatar"></div>
      <div className="access-info">
        <span className="access-email">{userDoc.email}</span>
        <span className="access-role">
        {userDoc.isViewer ? "Viewer" : "Editor"}
        </span>
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
          onClick={() => onUnshareDeck(userDoc.uid, userDoc.isViewer)}
        >
          Unshare
        </button>
        <Menu>
          <MenuButton isActive={userDoc.isViewer} as={Button} rightIcon={<ChevronDownIcon />}>
            {userDoc.isViewer ? "Viewer" : "Editor"}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => onChangeStatus(userDoc.uid)}>
              {userDoc.isViewer ? "Editor" : "Viewer"}
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  );
};

export default UnshareDeck;