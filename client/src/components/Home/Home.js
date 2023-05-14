import React from "react";
import "./Home.css";
import Navigation from "../Navigation/Navigation";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser } from "../Auth/userAuth";
import { setCurrentUser } from "../../redux/userSlice";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user);
  const dispatch = useDispatch();

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
        <Navigation currentUser={currentUser} />
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
        <div className="home-content"></div>
      </div>
    </div>
  );
};

export default Home;
