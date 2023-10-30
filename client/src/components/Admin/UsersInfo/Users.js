import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pagination } from "@mantine/core";
import { Button, Spinner } from "@chakra-ui/react";
import "./Users.css";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [userData, setUserData] = useState([]);
  const [pageFocus, setPageFocus] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const usersPerPage = 8;
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get("https://quiz-app-zainabidinov-api.onrender.com/api/account/getUsers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(res.data.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const pageSwitchHandler = (value) => {
    setPageFocus(value);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      setIsLoading(true);
      const res = await axios.delete(`https://quiz-app-zainabidinov-api.onrender.com/api/account/deleteUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        fetchUserData();
      } else {
        console.log(res.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      setIsLoading(false);
    }
  };

  const lastIndex = pageFocus * usersPerPage;
  const firstIndex = lastIndex - usersPerPage;
  const currentUsers = userData.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(userData.length / usersPerPage);

  return (
    <div className="users--container">
      <div className="users--content">
        {isLoading ? (
          <div className="loading--container">
            <Spinner size="xl" color="teal.500" />
          </div>
        ) : (
          <>
            <div className="users--content__header">All Users</div>

            <table className="users--table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>User Role</th>
                  <th>Email</th>
                  <th>Remove User</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => {
                  if (user.admin) {
                    return null;
                  }
                  return (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.userType}</td>
                      <td>{user.email}</td>
                      <td>
                        <Button
                          colorScheme="red"
                          borderRadius="8px"
                          size="sm"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                <Button
                  mt={4}
                  colorScheme="teal"
                  borderRadius="8px"
                  size="sm"
                  onClick={() => navigate("/signup")}
                >
                  Add user
                </Button>
                <div className="paginationContainer">
                  <Pagination
                    style={{ marginTop: "16px" }}
                    size="sm"
                    total={totalPages}
                    perPage={1}
                    value={pageFocus}
                    onChange={pageSwitchHandler}
                    nextLabel={pageFocus === totalPages ? null : "Next"}
                    prevLabel={pageFocus === 1 ? null : "Previous"}
                    nextDisabled={pageFocus === totalPages}
                    prevDisabled={pageFocus === 1}
                  />
                </div>
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default Users;
