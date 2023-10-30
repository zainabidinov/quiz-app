import React, { useEffect, useState } from "react";
import "./MyResults.css";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import { InfoIcon } from "@chakra-ui/icons";
import { Pagination } from "@mantine/core";

const MyResults = ({ activeNavItem, onNavItemClick }) => {
  const [myResults, setMyResults] = useState([]);
  const [pageFocus, setPageFocus] = useState(1);
  const reportsPerPage = 8;

  useEffect(() => {
    const fetchTheStudentResult = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://quiz-app-zainabidinov-api.onrender.com/api/quizzes/results/getMyResults",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMyResults(res.data.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchTheStudentResult();
  }, []);

  const onClick = (id) => {
    const navItem = `exam-feedback/${id}`;
    onNavItemClick(navItem);
  };

  const pageSwitchHandler = (value) => {
    setPageFocus(value);
  };

  const lastIndex = pageFocus * reportsPerPage;
  const firstIndex = lastIndex - reportsPerPage;
  const currentReports = myResults.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(myResults.length / reportsPerPage);

  return (
    <div className="results--container">
      <div className="results--content">
        <div className="results--content__header">My Results</div>

        <table className="results--table">
          <thead>
            <tr>
              <th>Exam</th>
              <th>Subject</th>
              <th>Score</th>
              <th>Correct Answers</th>
              <th>View Feedback</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.map((exam, index) => (
              <tr key={index}>
                <td>{exam.examName}</td>
                <td>{exam.examSubject}</td>
                <td>{Math.round(exam.score)}%</td>
                <td>
                  {exam.numCorrect}/{Object.keys(exam.report).length}
                </td>
                <td>
                  <Button
                    leftIcon={<InfoIcon size="sm" />}
                    colorScheme="teal"
                    borderRadius="20px"
                    size="sm"
                    className={
                      activeNavItem === "exam-feedback/:id" ? "active" : ""
                    }
                    onClick={() => onClick(exam._id)}
                  >
                    View Feedback
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      </div>
    </div>
  );
};

export default MyResults;
