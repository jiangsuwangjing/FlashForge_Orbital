import React, { useState } from "react";
import "../../styles/Library.css";
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
      <form
        className="w-80 flex flex-col gap-4 bg-black py-5 px-6 rounded-xl"
        onSubmit={handleAdd}
      >
        <div className="text-lg font-semibold">Enter a deck name</div>
        <input
          type="text"
          value={localInputValue}
          onChange={handleInputChange}
          className="w-full py-2 text-white bg-[#353839] outline-none p-2 rounded-md"
          required
        />
        <div className="flex flex-row gap-4 justify-between">
          <button
            className="flex-1 bg-transparent underline"
            onClick={handleClose}
          >
            Close
          </button>
          <button
            className="flex-1 bg-[#0070ff] hover:bg[#0056b3]"
            type="submit"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
