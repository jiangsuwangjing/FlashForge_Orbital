import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { db } from "../../config/firebase";
import useAuthStore from "../../store/authStore";
import {
  doc,
  collection,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

const AutoCreateCardFromHighlights = ({ deckRef, onClose }) => {
  const [editorHtml, setEditorHtml] = useState("");
  const [savedHtml, setSavedHtml] = useState("");

  // get referece to the deck
  const user = useAuthStore((state) => state.user);
  const userRef = doc(db, "users", user.uid);
  const libraryRef = collection(userRef, "library");
  // const deckRef = doc(libraryRef, deckId);
  const cardsRef = collection(deckRef, "cards");

  const onSubmitCard = async () => {
    onClose();
    try {
      const newCardRef = doc(cardsRef);

      // text is processed by replacing highlights with underlines
      const processedContent = replaceHighlightWithUnderline(editorHtml);
      setSavedHtml(processedContent);

      await setDoc(newCardRef, {
        id: newCardRef.id, // Use the generated ID here
        front: processedContent,
        back: editorHtml,
        mastery: 0,
        userId: user.uid,
        lastReviewed: Date.now(),
      });

      // Update the parent deck document to include the new card ID
      await updateDoc(deckRef, {
        cardIds: arrayUnion(newCardRef.id),
      });

      console.log("New card created successfully");
    } catch (error) {
      console.log("Error: " + error.message);
    }
  };

  const replaceHighlightWithUnderline = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const strongs = div.querySelectorAll('strong[style*="background-color"]');
    const spans = div.querySelectorAll('span[style*="background-color"]');
    strongs.forEach((strong) => {
      const underlineLength = strong.textContent.length;
      const underlineText = "_".repeat(underlineLength);
      strong.textContent = underlineText;
      strong.style.textDecoration = "none"; // Ensure text decoration is none
      strong.style.backgroundColor = ""; // Remove background color
    });
    spans.forEach((strong) => {
      const underlineLength = strong.textContent.length;
      const underlineText = "_".repeat(underlineLength);
      strong.textContent = underlineText;
      strong.style.textDecoration = "none"; // Ensure text decoration is none
      strong.style.backgroundColor = ""; // Remove background color
    });
    return div.innerHTML;
  };
  // return (
  //   <div
  //     style={{
  //       height: "100%",
  //       width: "100%",
  //       display: "flex",
  //       alignItems: "center",
  //       justifyContent: "center",
  //       backgroundColor: "rgba(0, 0, 0, 0.6)",
  //     }}
  //   >
  //     <ReactQuill
  //       value={editorHtml}
  //       onChange={setEditorHtml}
  //       theme="snow"
  //       modules={{
  //         clipboard: {
  //           matchVisual: false,
  //         },
  //       }}
  //     />
  //     <button onClick={onSubmitCard}>Save</button>
  //     <h2>Preview</h2>
  //     <ReactQuill value={savedHtml} readOnly={true} theme="bubble" />
  //   </div>
  // );
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
      }}
    >
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
          <button style={ujin} onClick={onClose}>
            Close
          </button>
          <button style={ujin} onClick={onSubmitCard}>
            Save
          </button>
        </div>
        <div style={{ marginBottom: "15px", textAlign: "center" }}>
          New Card
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div>Front</div>
          {/* <textarea
          placeholder="front:"
          onChange={(e) => setFront(e.target.value)}
          style={{ height: "100%", backgroundColor: "white", color: "black" }}
        /> */}
          <ReactQuill
            value={editorHtml}
            onChange={setEditorHtml}
            theme="snow"
            modules={{
              clipboard: {
                matchVisual: false,
              },
            }}
          />
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div>Preview</div>
          {savedHtml && (
            <ReactQuill value={savedHtml} readOnly={true} theme="bubble" />
          )}

          {/* <textarea
          placeholder="back:"
          onChange={(e) => setBack(e.target.value)}
          style={{ height: "100%", backgroundColor: "white", color: "black" }}
        /> */}
        </div>
      </div>
    </div>
  );
};
const ujin = {
  color: "#38b6ff",
  border: "none",
  background: "white",
};
export default AutoCreateCardFromHighlights;
