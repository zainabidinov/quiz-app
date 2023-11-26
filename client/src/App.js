import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import Signup from "./components/Admin/Signup/Signup";
import Login from "./components/Shared/Login/Login";
import Home from "./components/Shared/Home/Home";
import ExamSession from "./components/Student/ExamSession/ExamSession";

function App() {
  return (
    <React.Fragment>
      <ChakraProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="exam-session/:id" element={<ExamSession />} />
            <Route path="/home/*" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </React.Fragment>
  );
}

export default App;
