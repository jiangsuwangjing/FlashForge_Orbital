import React, { useState } from "react";
import "./styles/Library.css";
export default function Popup(props) {
  const [localInputValue, setLocalInputValue] = useState("");
  const handleClose = () => {
    props.onClose();
  };
  const handleAdd = () => {
    props.onAdd();
    props.onClose();
  };

  const handleInputChange = (event) => {
    setLocalInputValue(event.target.value);
    props.setNewDeckName(event.target.value);
  };
  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Enter a deck name</h2>
        <form>
          <input
            type="text"
            required
            value={localInputValue}
            onChange={handleInputChange}
            style={{ backgroundColor: "white" }}
          />
          <div className="popup-buttons">
            <button onClick={handleClose}>Close</button>
            <button type="submit" onClick={handleAdd}>
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
