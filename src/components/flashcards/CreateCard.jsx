import React from "react";
import { useState } from "react";
import { doc, collection, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from "../../config/firebase";
import useAuthStore from "../../store/authStore";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase";
import { v4 as uuidv4 } from 'uuid';
import { AudioRecorder } from "react-audio-voice-recorder";

const CreateCard = ({ deckId, onClose }) => {
  const user = useAuthStore((state) => state.user);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [frontImage, setFrontImage] = useState(null); // State to store the selected image
  const [backImage, setBackImage] = useState(null); // State to store the selected image
  const [frontAudioUrl, setFrontAudioUrl] = useState('');
  const [backAudioUrl, setBackAudioUrl] = useState('');
  // get referece to the deck
  const userRef = doc(db, "users", user.uid);
  const libraryRef = collection(userRef, "library");
  const deckRef = doc(libraryRef, deckId);
  const cardsRef = collection(deckRef, "cards");
  
  // Image Handling
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

  // Audio Handling
  const uploadAudio = async (audioBlob) => {
    const storageRef = ref(storage, `cardAudios/${user.uid}`);
    const audioRef = ref(storageRef, `${uuidv4()}`);
    await uploadBytes(audioRef, audioBlob);
    const audioUrl = await getDownloadURL(audioRef);
    console.log(audioUrl);
    return audioUrl;
  };

  const addFrontAudioElement = async (blob) => {
    console.log("clicked")
    const audioUrl = await uploadAudio(blob);
    setFrontAudioUrl(audioUrl);
  };

  const addBackAudioElement = async (blob) => {
    const audioUrl = await uploadAudio(blob);
    setBackAudioUrl(audioUrl);
  };


  const onSubmitCard = async () => {
    try {
      let frontImageUrl = '';
      let backImageUrl = '';

      if (frontImage) {
        frontImageUrl = await uploadImage(frontImage); // Upload image and get the URL
      }
      if (backImage) {
        backImageUrl = await uploadImage(backImage); // Upload image and get the URL
      }

      const newCardRef = doc(cardsRef);

      await setDoc(newCardRef, {
        id: newCardRef.id, // Use the generated ID here
        front: front,
        back: back,
        frontImageUrl: frontImageUrl, // Store the image URL
        backImageUrl: backImageUrl,
        frontAudioUrl: frontAudioUrl, 
        backAudioUrl: backAudioUrl,
        mastery: 0,
        userId: user.uid,
        lastReviewed: Date.now()
      });

      // Update the parent deck document to include the new card ID
      await updateDoc(deckRef, {
        cardIds: arrayUnion(newCardRef.id)
      });
    
      console.log('New card created successfully')
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
            onClose();
            onSubmitCard();
          }}
        >
          Save
        </button>
      </div>
      <div style={{ marginBottom: "15px", textAlign: "center" }}>New Card</div>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div>Front</div>
        {/* <textarea
          placeholder="front:"
          onChange={(e) => setFront(e.target.value)}
          style={{ height: "100%", backgroundColor: "white", color: "black" }}
        /> */}
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
        <div>
          <div>Front Audio</div>
          <AudioRecorder onRecordingComplete={addFrontAudioElement} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div>Back</div>
        {/* <textarea
          placeholder="back:"
          onChange={(e) => setBack(e.target.value)}
          style={{ height: "100%", backgroundColor: "white", color: "black" }}
        /> */}
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
        <div>
          <div>Back Audio</div>
          <AudioRecorder onRecordingComplete={addBackAudioElement} />
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
export default CreateCard;
