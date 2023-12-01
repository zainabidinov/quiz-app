import React from "react";
import "./Home.css";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../../redux/userSlice";
import { useEffect, useState } from "react";

import { useToast, Spinner } from "@chakra-ui/react";

import ExamFeedback from "../ExamFeedback/ExamFeedback";
import CreateExam from "../Instructor/CreateExam/CreateExam";
import EditExam from "../Instructor/EditExam/EditExam";
import ManageExams from "../Instructor/ManageExams/ManageExams";
import StudentResults from "../Instructor/StudentResults/StudentResults";
import MyProfile from "../MyProfile/MyProfile";
import ExamSession from "../Student/ExamSession/ExamSession";
import MyResults from "../Student/MyResults/MyResults";
import TestBank from "../Student/TestBank/TestBank";
import MobileMenu from "../../components/MobileMenu/MobileMenu";

const Home = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [activeNavItem, setActiveNavItem] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderContent = () => {
    if (currentUser && currentUser.admin === true) {
      return (
        <div>
          {location.pathname === "/home" && <TestBank />}
          {location.pathname === "/home/quizzes" && <ManageExams />}
        </div>
      );
    } else {
      if (currentUser && currentUser.userType === "student") {
        return (
          <div>
            {location.pathname === "/home" && <TestBank />}
            {location.pathname === "/home/student-results" && <MyResults />}
            {location.pathname === "/home/profile" && <MyProfile />}
            {location.pathname.startsWith("/home/exam-feedback") && (
              <ExamFeedback />
            )}
            {location.pathname.startsWith("/exam-session") && <ExamSession />}
          </div>
        );
      } else if (currentUser && currentUser.userType === "teacher") {
        return (
          <div>
            {location.pathname === "/home" && <ManageExams />}

            {location.pathname === "/home/exam-results" && <StudentResults />}

            {location.pathname === "/home/profile" && <MyProfile />}

            {location.pathname === "/home/quizzes/create" && <CreateExam />}

            {location.pathname.startsWith("/home/quizzes/edit-exam/") && (
              <EditExam />
            )}

            {location.pathname.startsWith("/home/exam-feedback/") && (
              <ExamFeedback />
            )}
          </div>
        );
      }
    }
  };

  useEffect(() => {
    const retrieveUser = async () => {
      try {
        setIsLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch(
          "https://quiz-app-zainabidinov-api.onrender.com/api/account/accountInfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (response.status === 200 && data.success) {
          dispatch(setCurrentUser(data.data));
        } else {
          toast({
            description: data.message,
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
          console.log("No user found");
        }
      } catch (error) {
        toast({
          description: error,
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        alert("No user found");
      } finally {
        setIsLoading(false);
      }
    };

    retrieveUser();
  }, [dispatch, navigate]);

  return (
    <div className="home">
      {/* Loading Spinner */}
      {isLoading && (
        <div className="loading--container">
          <Spinner size="xl" color="teal.500" />
        </div>
      )}

      {/* Sidebar */}
      <div className="sidebar">
        <nav>
          <h1 onClick={() => navigate("")}>ONEQUIZ</h1>
          {currentUser && currentUser.admin === true ? (
            <ul>
              <li
                className={activeNavItem === "home" ? "active" : ""}
                // onClick={() => handleNavItemClick("home")}
              >
                <span className="mdi mdi-account-multiple-outline"></span> Users
              </li>
              <li
                className={activeNavItem === "quizzes" ? "active" : ""}
                // onClick={() => handleNavItemClick("quizzes")}
              >
                <span className="mdi mdi-account-circle"></span> Exams
              </li>
            </ul>
          ) : (
            <>
              {currentUser && currentUser.userType === "student" && (
                <ul>
                  <li
                    className={location.pathname === "/home" ? "active" : ""}
                    onClick={() => navigate("")}
                  >
                    <span className="mdi mdi-home"></span> Home
                  </li>

                  <li
                    className={
                      location.pathname === "/home/student-results"
                        ? "active"
                        : ""
                    }
                    onClick={() => navigate("student-results")}
                  >
                    <span className="mdi mdi-list-status"></span> My Results
                  </li>
                  <li
                    className={
                      location.pathname === "/home/profile" ? "active" : ""
                    }
                    onClick={() => navigate("profile")}
                  >
                    <span className="mdi mdi-account-circle"></span> My Profile
                  </li>
                </ul>
              )}
              {currentUser && currentUser.userType === "teacher" && (
                <ul>
                  <li
                    className={
                      location.pathname === "/home" ||
                      location.pathname.startsWith("/home/quizzes/edit-exam")
                        ? "active"
                        : ""
                    }
                    onClick={() => navigate("")}
                  >
                    <span className="mdi mdi-home"></span> Manage Exams
                  </li>

                  <li
                    className={
                      location.pathname === "/home/exam-results" ? "active" : ""
                    }
                    onClick={() => navigate("exam-results")}
                  >
                    <span className="mdi mdi-monitor-multiple"></span> Student
                    Results
                  </li>

                  <li
                    className={
                      location.pathname === "/home/profile" ? "active" : ""
                    }
                    onClick={() => navigate("profile")}
                  >
                    <span className="mdi mdi-account-circle"></span> My Profile
                  </li>
                </ul>
              )}
            </>
          )}
        </nav>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          Log out
        </button>
      </div>

      <div className="hero-section">
        {/* Header */}
        <div className="header">
          {!isMenuOpen ? (
            <div className="mobile-menu-closed"></div>
          ) : (
            <div className="mobile-menu-open mobile-sidebar">
              <MobileMenu currentUser={currentUser} onToggleMenu={toggleMenu} />
            </div>
          )}

          <span class="mdi mdi-menu header-icon" onClick={toggleMenu}></span>
          {/* <h1>ONEQUIZ</h1> */}
          <p>
            {currentUser && !currentUser.admin && (
              <div>
                {currentUser.firstName} {""}{currentUser.lastName} |{" "}
                {currentUser.userType[0].toUpperCase() +
                  currentUser.userType.slice(1)}
              </div>
            )}
          </p>
        </div>

        <div className="hero">
          {/* <HomeHero /> */}
          {renderContent()}
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Home;
