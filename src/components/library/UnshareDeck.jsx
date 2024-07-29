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
} from "@chakra-ui/react";
import React from "react";
import { db } from "../../config/firebase";
import { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";
import "../../styles/ShareDeck.css";
import { ChevronDownIcon } from "@chakra-ui/icons";

const UnshareDeck = ({
  // deckId, destUid,
  userDoc,
  deckRef,
  onChangeStatus,
  onUnshareDeck,
}) => {
  const [destEmail, setDestEmail] = useState("");
  const [destProfilePic, setDestProfilePic] = useState("");

  useEffect(() => {
    setDestEmail(userDoc.email);
    setDestProfilePic(userDoc.profilePicURL);
  }, [userDoc]);
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

  console.log(userDoc.profilePicURL);
  return (
    <div className="access-item">
      <img className="access-avatar" src={destProfilePic} />
      <div className="access-info">
        <span className="access-email">{destEmail}</span>
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
        <Menu className="bg-white">
          <MenuButton
            isActive={userDoc.isViewer}
            as={Button}
            rightIcon={<ChevronDownIcon />}
            className="bg-white text-black"
            px={4}
            py={2}
            transition="all 0.2s"
            borderRadius="md"
            borderWidth="1px"
            _hover={{ bg: "gray.400" }}
            _expanded={{ bg: "red.400" }}
            _focus={{ boxShadow: "outline" }}
          >
            {userDoc.isViewer ? "Viewer" : "Editor"}
          </MenuButton>
          <MenuList className="text-black bg-white">
            <MenuItem
              onClick={() => onChangeStatus(userDoc.uid)}
              className="bg-white flex justify-center"
            >
              {userDoc.isViewer ? "Editor" : "Viewer"}
            </MenuItem>
            <MenuDivider />
            <MenuItem className="bg-white p-0 flex justify-center hover:bg-red-700">
              <button
                style={{
                  color: "black",
                  // border: "none",
                  borderRadius: "8px",
                  // fontSize: "16px",
                  // fontWeight: "bold",
                  // boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                className="p-1 rounded-{25px} bg-transparent border-[0px] text-black ml-0 my-1"
                onClick={() => onUnshareDeck(userDoc.uid, userDoc.isViewer)}
              >
                Unshare
              </button>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  );
};

export default UnshareDeck;
