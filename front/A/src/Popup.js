import React, { useState } from "react";
import "./styles/Library.css";
export default function Popup(props) {
  const [localInputValue, setLocalInputValue] = useState(props.inputValue);
  const handleInputChange = (e) => {
    setLocalInputValue(e.target.value);
    props.onInputChange(e.target.value);
  };

  const handleClose = () => {
    props.onClose();
  };
  const handleAdd = () => {
    props.onClose();
  };
  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Enter a value</h2>
        <input
          type="text"
          value={localInputValue}
          onChange={handleInputChange}
        />
        <div className="popup-buttons">
          <button onClick={handleAdd}>Close</button>
          <button onClick={handleClose}>Add</button>
        </div>
      </div>
    </div>
  );
}
