import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";

function App() {
  return (
    <React.Fragment>
      <ChakraProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </React.Fragment>
  );
}

export default App;
