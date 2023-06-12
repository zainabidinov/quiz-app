import React from "react";
import "./Home.css";
import Navigation from "../../Navigation/Navigation";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../../../redux/userSlice";
import { useEffect, useState } from "react";
import ManageExams from "../../Instructor/ManageExams/ManageExams";
import StudentResults from "../../Instructor/StudentResults/StudentResults";
import MyProfile from "../MyProfile/MyProfile";
import MyResults from "../../Student/MyResults/MyResults";
import CreateExams from "../../Instructor/ManageExams/CreateExams";
import { useToast } from "@chakra-ui/react";
import EditExam from "../../Instructor/ManageExams/EditExam";
import TestBank from "../../Student/TestBank/TestBank";
import ExamSession from "../../Student/ExamSession/ExamSession";
import ExamFeedback from "../ExamFeedback/ExamFeedback";
import Users from "../../Admin/UsersInfo/Users";

const Home = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [activeNavItem, setActiveNavItem] = useState("home");

  const handleNavItemClick = (navItem) => {
    if (navItem !== "home") {
      if (navItem.startsWith("quizzes/edit-exam")) {
        setActiveNavItem("quizzes/edit-exam/:id");
        navigate(`/home/${navItem}`);
      } else if (navItem.startsWith("exam-feedback")) {
        setActiveNavItem("exam-feedback/:id");
        navigate(`/home/${navItem}`);
      } else if (navItem.startsWith("exam-session")) {
        setActiveNavItem("exam-session/:id");
        navigate(`/${navItem}`);
      } else {
        setActiveNavItem(navItem);
        navigate(`/home/${navItem}`);
      }
    } else {
      setActiveNavItem("home");
      navigate("/home");
    }
  };

  const renderContent = () => {
    if (currentUser && currentUser.admin === true) {
      return (
        <div>
          {activeNavItem === "home" && (
            <Users
              activeNavItem={activeNavItem}
              onNavItemClick={handleNavItemClick}
            />
          )}
          {activeNavItem === "quizzes" && (
            <ManageExams
              activeNavItem={activeNavItem}
              onNavItemClick={handleNavItemClick}
            />
          )}
        </div>
      );
    } else {
      if (currentUser && currentUser.userType === "student") {
        return (
          <div>
            {activeNavItem === "home" && (
              <TestBank
                activeNavItem={activeNavItem}
                onNavItemClick={handleNavItemClick}
              />
            )}
            {activeNavItem === "student-results" && (
              <MyResults
                activeNavItem={activeNavItem}
                onNavItemClick={handleNavItemClick}
              />
            )}
            {activeNavItem === "profile" && <MyProfile />}
            {activeNavItem === "exam-session/:id" && <ExamSession />}
            {activeNavItem === "exam-feedback/:id" && <ExamFeedback />}
          </div>
        );
      } else if (currentUser && currentUser.userType === "teacher") {
        return (
          <div>
            {activeNavItem === "home" && (
              <ManageExams
                activeNavItem={activeNavItem}
                onNavItemClick={handleNavItemClick}
              />
            )}

            {activeNavItem === "quizzes/create" && <CreateExams />}
            {activeNavItem === "exam-results" && (
              <StudentResults
                activeNavItem={activeNavItem}
                onNavItemClick={handleNavItemClick}
              />
            )}
            {activeNavItem === "profile" && <MyProfile />}
            {activeNavItem === "quizzes/edit-exam/:id" && <EditExam />}
            {activeNavItem === "exam-feedback/:id" && <ExamFeedback />}
          </div>
        );
      }
    }
  };

  useEffect(() => {
    const retrieveUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch("/api/account/accountInfo", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
      }
    };

    retrieveUser();
  }, [dispatch, navigate]);

  return (
    <div className="home">
      <div className="home-sidebar">
        <h1>ONEQUIZ</h1>
        <Navigation
          currentUser={currentUser}
          activeNavItem={activeNavItem}
          onNavItemClick={handleNavItemClick}
        />
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
      <div className="main-content">
        <div className="home-header-content">
          <p>
            {currentUser
              ? `${currentUser.firstName}  ${currentUser.lastName}`
              : "Not Found"}
            {" | "}
            {currentUser
              ? `${currentUser.userType[0].toUpperCase()}${currentUser.userType.slice(
                  1
                )}`
              : "Not Found"}
          </p>
        </div>
        <div className="home-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Home;
