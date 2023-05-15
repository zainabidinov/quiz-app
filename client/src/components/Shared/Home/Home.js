import React from "react";
import "./Home.css";
import Navigation from "../../Navigation/Navigation";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../../../redux/userSlice";
import { useEffect, useState } from "react";
import ManageExams from "../../Instructor/ManageExams/ManageExams";
import Students from "../../Instructor/StudentsInfo/Students";
import StudentResults from "../../Instructor/StudentResults/StudentResults";
import MyProfile from "../MyProfile/MyProfile";
import MyResults from "../../Student/MyResults/MyResults";

const Home = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [activeNavItem, setActiveNavItem] = useState("home");

  const handleNavItemClick = (navItem) => {
    setActiveNavItem(navItem);
    if (navItem !== "home") {
      navigate(`/home/${navItem}`);
    }
  };

  const renderContent = () => {
    if (currentUser && currentUser.userType === "student") {
      return (
        <div>
          {/* Render the content for student */}
          {activeNavItem === "home" && <h2>Home Page Content for Student</h2>}
          {/* {activeNavItem === "testBank" && <TestBank />} */}
          {activeNavItem === "student-results" && <MyResults />}
          {activeNavItem === "profile" && <MyProfile />}
        </div>
      );
    } else if (currentUser && currentUser.userType === "teacher") {
      return (
        <div>
          {/* Render the content for teacher */}
          {activeNavItem === "home" && <h2>Home Page Content for Teacher</h2>}
          {/* {activeNavItem === "testBank" && <TestBank />} */}
          {activeNavItem === "student-info" && <Students />}
          {activeNavItem === "manage-exams" && <ManageExams />}
          {activeNavItem === "exam-results" && <StudentResults />}
          {activeNavItem === "profile" && <MyProfile />}
        </div>
      );
    }
  };

  useEffect(() => {
    const retrieveUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch("/api/users/user/info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.status === 200 && data.success) {
          dispatch(setCurrentUser(data.data));
        } else {
          console.log("No user found");
        }
      } catch (error) {
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
            navigate("/login");
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
            {"\n"}
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