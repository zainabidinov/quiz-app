  import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import Signup from "./components/Admin/Signup/Signup";
import Login from "./components/Shared/Login/Login";
import Home from "./components/Shared/Home/Home";
import MyProfile from "./components/Shared/MyProfile/MyProfile";
import ManageExams from "./components/Instructor/ManageExams/ManageExams";
import StudentResults from "./components/Instructor/StudentResults/StudentResults";
import MyResults from "./components/Student/MyResults/MyResults";
import CreateExams from "./components/Instructor/ManageExams/CreateExams";
import EditExam from "./components/Instructor/ManageExams/EditExam";
import ExamSession from "./components/Student/ExamSession/ExamSession";
import ExamFeedback from "./components/Shared/ExamFeedback/ExamFeedback";
import Users from "./components/Admin/UsersInfo/Users";


function App() {
  return (
    <React.Fragment>
      <ChakraProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="exam-session/:id" element={<ExamSession />} />
            <Route path="/home/" element={<Home />}>
              <Route path="profile" element={<MyProfile />} />
              <Route path="quizzes" element={<ManageExams />} />
              <Route path="quizzes/create" element={<CreateExams />} />
              <Route path="student-results" element={<StudentResults />} />
              <Route path="exam-results" element={<MyResults />} />
              <Route path="quizzes/edit-exam/:id" element={<EditExam />} />
              <Route path="exam-feedback/:id" element={<ExamFeedback />}/>
              <Route path="users-info" element={<Users />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </React.Fragment>
  );
}

export default App;
