import React, { useEffect, useState } from "react";
import "./StudentResults.css";
import { Button } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import axios from "axios";
import { Pagination } from "@mantine/core";

const StudentResults = ({ activeNavItem, onNavItemClick }) => {
  const [examResults, setExamResults] = useState([]);
  const [pageFocus, setPageFocus] = useState(1);
  var reportsPerPage = 8;
  const [isTwoColumnLayout, setIsTwoColumnLayout] = useState(false);

  const fetchStudentResults = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://quiz-app-zainabidinov-api.onrender.com/api/quizzes/results/getAllExamResults",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setExamResults(res.data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchStudentResults();
  }, []);

  const pageSwitchHandler = (value) => {
    setPageFocus(value);
  };

  if (isTwoColumnLayout) {
    reportsPerPage = 2;
  }

  const lastIndex = pageFocus * reportsPerPage;
  const firstIndex = lastIndex - reportsPerPage;
  const currentReports = examResults.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(examResults.length / reportsPerPage);

  const checkTwoColumnLayout = () => {
    setIsTwoColumnLayout(window.innerWidth <= 598);
  };

  useEffect(() => {
    checkTwoColumnLayout(); 
    window.addEventListener("resize", checkTwoColumnLayout); 

    return () => {
      window.removeEventListener("resize", checkTwoColumnLayout); 
    };
  }, []);

  return (
    <div className="results">
      <div className="results--container">
        <div className="results--content">
          <div className="results--content__header">Students Exam Results</div>

          {isTwoColumnLayout ? (
            // Render a two-column layout for small screens
            <table className="results--table">
              {currentReports.map((exam) => (
                <tbody key={exam._id} className="results--table-row">
                  <tr>
                    <td>Student:</td>{" "}
                    <td>
                      {" "}
                      {exam.user.firstName} {exam.user.lastName}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td>Exam:</td> <td>{exam.examName}</td>
                  </tr>
                  <tr>
                    <td>Subject:</td> <td>{exam.examSubject}</td>
                  </tr>
                  <tr>
                    <td>Score:</td> <td>{Math.round(exam.score)}% </td>
                  </tr>
                  <tr>
                    <td>Correct Answers:</td>{" "}
                    <td>
                      {exam.numCorrect}/{Object.keys(exam.report).length}
                    </td>
                  </tr>
                  <tr>
                    <td>Feedback</td>
                    <td style={{ marginBottom: "10px" }}>
                      <Button
                        leftIcon={<InfoIcon size="sm" />}
                        colorScheme="teal"
                        borderRadius="20px"
                        size="sm"
                        className={
                          activeNavItem === `exam-feedback/${exam._id}`
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          onNavItemClick(`exam-feedback/${exam._id}`)
                        }
                      >
                        View Feedback
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="last-row"
                      colSpan="2"
                      style={{
                        height: "10px",
                        backgroundColor: "#edf1f5",
                        border: "none",
                      }}
                    ></td>
                  </tr>
                </tbody>
              ))}
            </table>
          ) : (
            // Render the original table layout for larger screens
            <table className="results--table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Exam</th>
                  <th>Subject</th>
                  <th>Score</th>
                  <th>Correct Answers</th>
                  <th>View Feedback</th>
                </tr>
              </thead>
              <tbody>
                {currentReports.map((exam) => (
                  <tr key={exam._id}>
                    <td>
                      {exam.user.firstName} {exam.user.lastName}
                    </td>
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
                          activeNavItem === `exam-feedback/${exam._id}`
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          onNavItemClick(`exam-feedback/${exam._id}`)
                        }
                      >
                        View Feedback
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

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

export default StudentResults;
