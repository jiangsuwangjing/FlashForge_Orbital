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
  const [id, setId] = useState(0);
  const handleShowPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const ArrowState = () => {
    const [isOpen, setIsOpen] = useState(true);
    const toggle = () => setIsOpen(!isOpen);
    return [isOpen, toggle];
  };
  const addFolder = (text) => {
    const newFolder = {
      open: {},
      id: id,
      text: text,
      decks: [{ id: Date.now(), text: "Default deck" }],
    };
    setFolders([...folders, newFolder]);
    setId(id + 1);
  };
  const deleteFolder = (id) => {
    setFolders(folders.filter((folder) => folder.id !== id));
  };
  const addDeck = (id, text) => {
    setFolders(
      folders.map((folder) => {
        if (folder.id === id) {
          const newDeck = {
            id: Date,
            text: text,
          };
          return { ...folder, decks: [...folder.decks, newDeck] };
        } else {
          return folder;
        }
      })
    );
  };
  return (
    <div>
      <Header />
      <div>
        <h1>Library</h1>
        <div>
          {folders.map((folder) => (
            <div>
              <div
                onClick={() => {
                  folder.open.toggle();
                }}
                style={{ cursor: "pointer" }}
              >
                <span>{folder.open.isOpen ? "▼" : "▶︎"}</span>
                {folder.text}
              </div>
              <div key={folder.id} deleteFolder={deleteFolder}>
                {folder.decks.map((deck) => (
                  <div key={deck.id} className="deck">
                    {deck.text}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleShowPopup} className="addFolder">
          New Folder
        </button>
        <button onClick={handleShowPopup} className="addDeck">
          New Deck
        </button>
        {showPopup && <Popup onClose={handleClosePopup} onAdd={addFolder} />}
      </div>
    </div>
  );
}
