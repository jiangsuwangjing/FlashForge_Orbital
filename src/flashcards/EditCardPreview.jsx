import { useState, react } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useAuthStore from "../store/authStore";
import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";
import { v4 as uuidv4 } from 'uuid';

export default function EditCardPreview({ card, cardRef, onClose }) {
  // const user = useAuthStore((state) => state.user);
  // const userRef = doc(db, "users", user.uid);
  // const libraryRef = collection(userRef, "library");
  // const deckRef = doc(libraryRef, deckName);
  // const cardsRef = collection(deckRef, "cards");
  
  // const cardsRef = collection(deckRef, "cards");
  // const cardId = card[2];
  // const cardRef = doc(cardsRef, cardId)
  // const [front, setFront] = useState(card[0]);
  // const [back, setBack] = useState(card[1]);
  const [front, setFront] = useState(card[0]);
  const [back, setBack] = useState(card[1]);
  const [frontImage, setFrontImage] = useState(card[3]);
  const [backImage, setBackImage] = useState(card[4]); 

  const uploadImage = async (imageFile) => {
    const storageRef = ref(storage, `cardPics/${user.uid}`);	// the path to the store
    const imageRef = ref(storageRef, `${uuidv4()}`);
    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);
    return imageUrl;
  };

  const handleFrontImageChange = (e) => {
    if (e.target.files[0]) {
      setFrontImage(e.target.files[0]);
    }
  };
  const handleBackImageChange = (e) => {
    if (e.target.files[0]) {
      setBackImage(e.target.files[0]);
    }
  };

  const onSubmitCard = async () => {
    try {
      let frontImageUrl = '';
      let backImageUrl = '';
      console.log("clicked")

      if (frontImage) {
        frontImageUrl = await uploadImage(frontImage); // Upload image and get the URL
      }
      if (backImage) {
        backImageUrl = await uploadImage(backImage); // Upload image and get the URL
      }

      // Update the existing card document
      await updateDoc(cardRef, {
        front: front,
        back: back,
        ...(frontImageUrl && { frontImageUrl }), // Conditionally include frontImageUrl
        ...(backImageUrl && { backImageUrl }), // Conditionally include backImageUrl
        lastReviewed: Date.now(),
        mastery: 0
      });

      console.log('Card updated successfully');
      onClose(); // Close the edit form
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
        <button style={ujin} onClick={onClose}>
          Close
        </button>
        <button
          style={ujin}
          onClick={() => {
            onSubmitCard();
            onClose();
          }}
        >
          Save
        </button>
      </div>
      <div style={{ marginBottom: "15px", textAlign: "center" }}>Edit Card</div>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div>Front</div>
        <ReactQuill
          value={front}
          onChange={setFront}
          theme="snow"
          modules={{
            clipboard: {
              matchVisual: false,
            },
          }}
        />
        <input type="file" onChange={handleFrontImageChange} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div>Back</div>
        <ReactQuill
          value={back}
          onChange={setBack}
          theme="snow"
          modules={{
            clipboard: {
              matchVisual: false,
            },
          }}
        />
        <input type="file" onChange={handleBackImageChange} />
      </div>
    </div>
  );
}
const ujin = {
  color: "#38b6ff",
  border: "none",
  background: "white",
};
