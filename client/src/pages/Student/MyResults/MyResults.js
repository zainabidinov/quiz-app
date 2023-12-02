import React, { useEffect, useState } from "react";
import "./MyResults.css";
import noData from "../../../assets/images/no_data.svg";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import { InfoIcon } from "@chakra-ui/icons";
import { Pagination } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const MyResults = ({ activeNavItem, onNavItemClick }) => {
  const [myResults, setMyResults] = useState([]);
  const [pageFocus, setPageFocus] = useState(1);
  var reportsPerPage = 8;
  const [isTwoColumnLayout, setIsTwoColumnLayout] = useState(false);
  const navigate = useNavigate();

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

  if (isTwoColumnLayout) {
    reportsPerPage = 2;
  }

  const lastIndex = pageFocus * reportsPerPage;
  const firstIndex = lastIndex - reportsPerPage;
  const currentReports = myResults.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(myResults.length / reportsPerPage);

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
    <div className="results--container">
      <div className="results--content">
        <div className="results--content__header">My Results</div>

        {currentReports.length > 0 ? (
          <>
            {isTwoColumnLayout ? (
              <table className="results--table">
                {currentReports.map((exam) => (
                  <tbody key={exam._id} className="results--table-row">
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
                          onClick={() => navigate(`exam-feedback/${exam._id}`)}
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
                            activeNavItem === "exam-feedback/:id"
                              ? "active"
                              : ""
                          }
                          onClick={() => navigate(`exam-feedback/${exam._id}`)}
                        >
                          View Feedback
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        ) : (
          <div className="results--content__empty">
            <img src={noData} alt="no quiz data" />
            <p>You haven't taken any exams yet.</p>
            <p>Results appear after completing exams.</p>
          </div>
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
  );
};

export default MyResults;
