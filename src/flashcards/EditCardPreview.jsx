import { useState, react } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
export default function EditCardPreview({ card, onClose }) {
  const [front, setFront] = useState(card[0]);
  const [back, setBack] = useState(card[1]);
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
      </div>
    </div>
  );
}
const ujin = {
  color: "#38b6ff",
  border: "none",
  background: "white",
};
