import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Library from "./pages/Library.jsx";
import DeckPage from "./pages/DeckPage.jsx";
import ProfilePage from "./pages/ProfilePage";
import SharedDeckPage from "./pages/SharedDeckPage";
import "./styles/index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/library",
    element: <Library />,
    children: [
      {
        path: "/library/owned/:deckId",
        element: <DeckPage />,
      },
      {
        path: "/library/viewonly/:deckId",
        element: <SharedDeckPage viewOnly={true}/>,
      },
      {
        path: "/library/editable/:deckId",
        element: <SharedDeckPage viewOnly={false}/>,
      },
    ],
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
