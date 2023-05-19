import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Home from "./components/Shared/Home/Home";
import MyProfile from "./components/Shared/MyProfile/MyProfile";
import ManageExams from "./components/Instructor/ManageExams/ManageExams";
import StudentResults from "./components/Instructor/StudentResults/StudentResults";
import Students from "./components/Instructor/StudentsInfo/Students";
import MyResults from "./components/Student/MyResults/MyResults";
import CreateExams from "./components/Instructor/ManageExams/CreateExams";
import EditExam from "./components/Instructor/ManageExams/EditExam";

function App() {
  return (
    <React.Fragment>
      <ChakraProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home/" element={<Home />}>
              <Route path="profile" element={<MyProfile />} />
              <Route path="quizzes" element={<ManageExams />} />
              <Route path="quizzes/create" element={<CreateExams />} />
              <Route path="student-results" element={<StudentResults />} />
              <Route path="student-info" element={<Students />} />
              <Route path="exam-results" element={<MyResults />} />
              <Route path="quizzes/edit-exam/:id" element={<EditExam />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </React.Fragment>
  );
}

export default App;
