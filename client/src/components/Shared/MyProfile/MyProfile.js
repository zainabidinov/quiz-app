import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../../../redux/userSlice";
import { Button, useToast } from "@chakra-ui/react";
import "./MyProfile.css";

const MyProfile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const toast = useToast();

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
  }, [dispatch, toast]);

  return (
    <div className="container">
      <div className="profile-pic">
        <img src={user.profilePic} alt="Profile Picture" />

        <Button mt={4} colorScheme="teal" size="sm" onClick={() => {}}>
          Change Profile Picture
        </Button>
      </div>
      <div className="user-details">
        <h1>My Info</h1>
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
  );
};

export default MyProfile;
