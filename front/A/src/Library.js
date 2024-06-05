// function TodoList() {
//   const [tasks, setTasks] = useState([
//     {
//       id: 1,
//       text: "Doctor Appointment",
//       completed: true,
//     },
//     {
//       id: 2,
//       text: "Meeting at School",
//       completed: false,
//     },
//   ]);

//   const [text, setText] = useState("");
//   function addTask(text) {
//     const newTask = {
//       id: Date.now(),
//       text,
//       completed: false,
//     };
//     setTasks([...tasks, newTask]);
//     setText("");
//   }
//   function deleteTask(id) {
//     setTasks(tasks.filter((task) => task.id !== id));
//   }
//   function toggleCompleted(id) {
//     setTasks(
//       tasks.map((task) => {
//         if (task.id === id) {
//           return { ...task, completed: !task.completed };
//         } else {
//           return task;
//         }
//       })
//     );
//   }
//   return (
//     <div className="todo-list">
//       {tasks.map((task) => (
//         <TodoItem
//           key={task.id}
//           task={task}
//           deleteTask={deleteTask}
//           toggleCompleted={toggleCompleted}
//         />
//       ))}
//       <input value={text} onChange={(e) => setText(e.target.value)} />
//       <button onClick={() => addTask(text)}>Add</button>
//     </div>
//   );
// }
// export default TodoList;
import React, { useState } from "react";
import Header from "./Header";
import Popup from "./Popup";
import "./styles/Library.css";
export default function Library() {
  const [folders, setFolders] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const handleShowPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const addFolder = (text) => {};
  return (
    <div>
      <Header />
      <div>
        <h1>Library</h1>
        <button onClick={handleShowPopup} className="addFolder">
          Add Folder
        </button>
        <button onClick={handleShowPopup} className="addDeck">
          Add Deck
        </button>
        {showPopup && (
          <Popup
            onClose={handleClosePopup}
            onInputChange={handleInputChange}
            inputValue={inputValue}
          />
        )}
      </div>
    </div>
  );
}
