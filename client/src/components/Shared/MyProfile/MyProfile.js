import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../../../redux/userSlice";
import { Button, useToast } from "@chakra-ui/react";
import defaultProfilePic from "../../../assets/images/default-profile-pic.png";
import "./MyProfile.css";

const MyProfile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const toast = useToast();
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const retrieveUser = async () => {
      try {
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
      }
    };

    retrieveUser();
  }, [dispatch, toast]);

  const getAltText = () => {
    if (profilePic) {
      return "Profile Picture";
    }
    return "Default Profile Picture";
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(
        "https://quiz-app-zainabidinov-api.onrender.com/api/account/uploadProfilePic",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.status === 200 && data.success) {
        setProfilePic(data.imageUrl);
        toast({
          title: "Profile Picture Updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          description: data.message,
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        description: error.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div className="container">
      <div className="box">
        <div className="profile-pic">
          <img
            src={profilePic || user.profilePic || defaultProfilePic}
            alt={getAltText()}
          />
        </div>
        
        <div className="user-details">
        <label htmlFor="profilePicUpload" className="profile-pic-label">
          <Button mb={2} colorScheme="teal" size="sm" as="span">
            Change Profile Picture
          </Button>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            id="profilePicUpload"
          />
        </label>
          <h1>
            <strong>About Me</strong>
          </h1>
          <div className="user-details__contents">
            <p>
              <strong>First Name:</strong> {user.firstName}
            </p>
            <p>
              <strong>Last Name:</strong> {user.lastName}
            </p>
            <p>
              <strong>User Role:</strong> {user.userType}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
