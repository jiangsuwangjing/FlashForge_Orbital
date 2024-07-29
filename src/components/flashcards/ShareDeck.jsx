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
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import useAuthStore from "../../store/authStore";
import useGetCardList from "../../hooks/useGetCardList";
import UnshareDeck from "./UnshareDeck";
import "../../styles/ShareDeck.css";

const getUserProfileByEmail = async (email) => {
  try {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("User does not exist");
      return null;
    }

    let userData;
    querySnapshot.forEach((doc) => {
      userData = doc.data();
    });

    return userData;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

/**
 * The window that manages permissions of deck sharing
 * @param deckDoc the information of the deck to be shared 
 * @returns a window
 */
const ShareDeck = ({ deckDoc }) => {
  const deckId = deckDoc.id;
  const deckName = deckDoc.deckName
  const srcUser = useAuthStore((state) => state.user);
  const srcDeckRef = doc(db, "users", srcUser.uid, "library", deckId);
  const { cardList, viewerList, editorList } = useGetCardList(srcDeckRef);

  const [destUserEmail, setDestUserEmail] = useState("");
  // const [destUser, setDestUser] = useState("")
  const [popShareDeck, setPopShareDeck] = useState(false);
  // const [destUserList, setDestUserList] = useState([]);
  const [viewers, setViewers] = useState([]);
  const [editors, setEditors] = useState([]);

  // const destUserRef = doc(db, "users", destUser.uid);

  useEffect(() => {
    setViewers(viewerList || []);
    setEditors(editorList || []);
  }, [viewerList, editorList]);

  // const onShareDeck = async () => {
  //   try {
  //     const destUser = await getUserProfileByEmail(destUserEmail);
  //     const srcDeckDoc = await getDoc(srcDeckRef);
  //     const srcDeckData = srcDeckDoc.data();

  //     if (!destUser) {
  //       alert("Destination user not found.");
  //       return;
  //     }

  //     // Add the destination user to the sharedTo array in the source deck
  //     await updateDoc(srcDeckRef, {
  //       sharedTo: arrayUnion(destUser.uid),
  //     });

  //     // setDestUserList([...destUserList, destUser.uid]);
  //     // Copy the deck to the destination user's library
  //     const destDeckRef = doc(db, "users", destUser.uid, "shared", deckName);
  //     await setDoc(destDeckRef, srcDeckData);

  //     const destCardsRef = collection(destDeckRef, "cards");

  //     cardList.forEach(async (card) => {
  //       const newCardRef = doc(destCardsRef, card.id);
  //       await setDoc(newCardRef, { ...card, mastery: 0 });
  //     });

  //     alert("Deck shared successfully.");
  //   } catch (error) {
  //     console.error("Error sharing deck:", error);
  //     alert("An error occurred while sharing the deck.");
  //   }
  // };

  // const onSelectViewer = async (uid) => {
  //   try {
  //     const destUserRef = doc(db, "users", uid);

  //     await updateDoc(srcDeckRef, {
  //       viewers: arrayUnion(user),
  //       editors: arrayRemove(uid)
  //     });

  //     setViewers([...viewers, uid]);
  //     setEditors(editors.filter((id) => id !== uid));
      
  //     await updateDoc(destUserRef, {
  //       canView: arrayUnion(srcDeckRef),
  //       canEdit: arrayRemove(srcDeckRef)
  //     });

  //     console.log("Updated permission to viewer successfully")
  //     console.log("viewer: " + viewers);
  //     console.log("editor: " + editors);
  //   } catch (error) {
  //     console.error("Error setting viewer:", error);
  //   }
  // }
  const onSelectViewer = async (uid) => {
    try {
      const destUserRef = doc(db, "users", uid);
      const userDoc = editors.find(user => user.uid == uid);

      await updateDoc(srcDeckRef, {
        editors: arrayRemove(userDoc)
      });
      setEditors(editors.filter((doc) => doc !== userDoc));

      await updateDoc(destUserRef, {
        canEdit: arrayRemove(userDoc)
      });

      userDoc.isViewer = true;

      await updateDoc(srcDeckRef, {
        viewers: arrayUnion(userDoc),
      });

      setViewers([...viewers, userDoc]);
      
      await updateDoc(destUserRef, {
        canView: arrayUnion(userDoc),
      });

      console.log("Updated permission to viewer successfully")
    } catch (error) {
      console.error("Error setting viewer:", error);
    }
  }

  const onSelectEditor = async (uid) => {
    try {
      const destUserRef = doc(db, "users", uid);
      const userDoc = viewers.find(user => user.uid == uid);

      await updateDoc(srcDeckRef, {
        viewers: arrayRemove(userDoc)
      });
      setViewers(viewers.filter((doc) => doc !== userDoc))

      await updateDoc(destUserRef, {
        canView: arrayRemove(userDoc)
      });

      userDoc.isViewer = false;
      await updateDoc(srcDeckRef, {
        editors: arrayUnion(userDoc),
      });
      setEditors([...editors, userDoc]);

      await updateDoc(destUserRef, {
        canEdit: arrayUnion(userDoc),
      });

      console.log("Updated permission to editor successfully");
      console.log("viewer: " + viewers);
      console.log("editor: " + editors);
    } catch (error) {
      console.error("Error setting editor:", error);
    }
  };

  const onUnshareDeck = async (uid, isViewer) => {
    try {
      const destUserRef = doc(db, "users", uid);
      const userDoc = isViewer ? viewers.find(user => user.uid == uid) : editors.find(user => user.uid == uid);

      if (isViewer) {
        await updateDoc(srcDeckRef, {
          viewers: arrayRemove(userDoc)
        });
        setViewers(viewers.filter((doc) => doc.uid !== userDoc.uid))
        await updateDoc(destUserRef, {
          canView: arrayRemove(userDoc)
        });
      } else {
        await updateDoc(srcDeckRef, {
          editors: arrayRemove(userDoc)
        });
        setViewers(editors.filter((doc) => doc.uid !== userDoc.uid))
        await updateDoc(destUserRef, {
          canEdit: arrayRemove(userDoc)
        });
      }
      console.log(viewers)

      console.log("Unshare success")
    } catch (error) {
      console.log(error.message);
    }
  }

  const onShareDeck = async () => {
    try {
      const destUser = await getUserProfileByEmail(destUserEmail);
      const destUserRef = doc(db, "users", destUser.uid);

      const newUserDoc = {
        uid: destUser.uid,
        isViewer: true,
        email: destUserEmail,
        lastReviewed: Date.now(),
        overallMastery: 0,
        deckRef: srcDeckRef,
        deckId: deckId,
        deckName: deckName,
        color: deckDoc.color
      }

      await updateDoc(srcDeckRef, {
        viewers: arrayUnion(newUserDoc),
      });
      setViewers([...viewers, newUserDoc]);
      await updateDoc(destUserRef, {
        canView: arrayUnion(newUserDoc),
      });
      // await onSelectViewer(newUserDoc);
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

                  {/* {viewers &&
                    viewers.length > 0 &&
                    viewers.map((uid) => (
                      <UnshareDeck
                        key={uid}
                        deckName={deckId}
                        deckRef={srcDeckRef}
                        destUid={uid}
                        isViewer={true}
                        onChangeStatus={onSelectEditor}
                      />
                    ))} */}
                  {viewers &&
                    viewers.length > 0 &&
                    viewers.map((userDoc) => (
                      <UnshareDeck
                        key={userDoc.email}
                        userDoc={userDoc}
                        deckRef={srcDeckRef}
                        // destUid={uid}
                        // isViewer={true}
                        onChangeStatus={onSelectEditor}
                        onUnshareDeck={onUnshareDeck}
                      />
                    ))}
                  {editors &&
                    editors.length > 0 &&
                    editors.map((userDoc) => (
                      <UnshareDeck
                        key={userDoc.email}
                        userDoc={userDoc}
                        deckRef={srcDeckRef}
                        // destUid={uid}
                        // isViewer={false}
                        onChangeStatus={onSelectViewer}
                        onUnshareDeck={onUnshareDeck}
                      />
                    ))}
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
