import React from "react";
import "./styles/App.css";
import Register from "./registration/Register";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <Register />
      </div>
    </ChakraProvider>
  );
}

export default App;
