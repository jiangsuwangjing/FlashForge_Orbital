import React, { useState } from "react";
import "./styles/Library.css";
export default function Popup(props) {
  const [localInputValue, setLocalInputValue] = useState("");
  const handleInputChange = (e) => {
    setLocalInputValue(e.target.value);
  };

  const handleClose = () => {
    setLocalInputValue("");
    props.onClose();
  };
  const handleAdd = () => {
    setLocalInputValue("");
    props.onClose();
    props.onAdd(localInputValue);
  };
  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Enter a value</h2>
        <form>
          <input
            type="text"
            required
            value={localInputValue}
            onChange={handleInputChange}
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
