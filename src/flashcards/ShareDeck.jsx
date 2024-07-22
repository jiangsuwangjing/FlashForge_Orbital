import { useState, useEffect, useRef } from "react";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import useAuthStore from "../store/authStore";
import useGetCardList from "../hooks/useGetCardList";
import { Await } from "react-router-dom";
import UnshareDeck from "./UnshareDeck";
import "../styles/ShareDeck.css";
const getUserProfileByEmail = async (email) => {
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("User does not exist");
      return null;
    }

    let userDoc;
    querySnapshot.forEach((doc) => {
      userDoc = doc.data();
    });

    return userDoc;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

const ShareDeck = ({ deckName }) => {
  const srcUser = useAuthStore((state) => state.user);
  const srcDeckRef = doc(db, "users", srcUser.uid, "library", deckName);
  const { cardList, sharedTo } = useGetCardList(deckName, srcDeckRef);

  const [destUserEmail, setDestUserEmail] = useState("");
  const [destUserList, setDestUserList] = useState([]);
  const [popShareDeck, setPopShareDeck] = useState(false);
  useEffect(() => {
    setDestUserList(sharedTo);
  }, [sharedTo]);
  console.log(destUserList);

  const onShareDeck = async () => {
    try {
      const destUser = await getUserProfileByEmail(destUserEmail);
      const srcDeckDoc = await getDoc(srcDeckRef);
      const srcDeckData = srcDeckDoc.data();

      if (!destUser) {
        alert("Destination user not found.");
        return;
      }

      // Add the destination user to the sharedTo array in the source deck
      await updateDoc(srcDeckRef, {
        sharedTo: arrayUnion(destUser.uid),
      });

      setDestUserList([...destUserList, destUser.uid]);
      // Copy the deck to the destination user's library
      const destDeckRef = doc(db, "users", destUser.uid, "shared", deckName);
      await setDoc(destDeckRef, srcDeckData);

      const destCardsRef = collection(destDeckRef, "cards");

      cardList.forEach(async (card) => {
        const newCardRef = doc(destCardsRef, card.id);
        await setDoc(newCardRef, { ...card, mastery: 0 });
      });

      alert("Deck shared successfully.");
    } catch (error) {
      console.error("Error sharing deck:", error);
      alert("An error occurred while sharing the deck.");
    }
  };
  const buttonRef = useRef(null);
  const popupRef = useRef(null);
  const handleDocumentClick = (event) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setPopShareDeck(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);
  const handlePop = () => {
    setPopShareDeck(!popShareDeck);
  };
  return (
    <div>
      {popShareDeck && (
        <div
          style={{
            position: "absolute",
            left: "0",
            top: "0",
            bottom: "0",
            right: "0",
            zIndex: "1",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "0",
              top: "0",
              bottom: "0",
              right: "0",
              zIndex: "1",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div ref={popupRef} className="dialog">
              <div className="dialog-header">
                <span className="dialog-title">
                  Share your deck with your friends!
                </span>
                <button className="dialog-close" onClick={handlePop}>
                  ×
                </button>
              </div>
              <div className="dialog-body">
                <input
                  type="text"
                  className="dialog-input"
                  placeholder="Enter targer user email"
                  onChange={(e) => setDestUserEmail(e.target.value)}
                />
                <div className="access-section">
                  <div className="access-title">People you shared with</div>
                  <div className="access-item">
                    <div className="access-avatar"></div>
                    <div className="access-info">
                      <span className="access-email">{srcUser.email}</span>
                      <span className="access-role">Owner</span>
                    </div>
                  </div>
                  <ul>
                    {destUserList &&
                      destUserList.length > 0 &&
                      destUserList.map((uid) => (
                        <UnshareDeck
                          key={uid}
                          deckName={deckName}
                          deckRef={srcDeckRef}
                          destUid={uid}
                        />
                      ))}
                  </ul>
                </div>
              </div>
              <div className="dialog-footer">
                <button className="dialog-done-button" onClick={onShareDeck}>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <button ref={buttonRef} onClick={handlePop}>
        Share Deck
      </button>
      {/* <ul>
        {destUserList &&
          destUserList.length > 0 &&
          destUserList.map((uid) => (
            <UnshareDeck
              key={uid}
              deckName={deckName}
              deckRef={srcDeckRef}
              destUid={uid}
            />
          ))}
      </ul> */}
    </div>
  );
};

export default ShareDeck;
