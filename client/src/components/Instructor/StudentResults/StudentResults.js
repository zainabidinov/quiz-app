import React, { useEffect, useState } from "react";
import "./StudentResults.css";
import { Button } from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import axios from "axios";
import { Pagination } from "@mantine/core";

const StudentResults = ({ activeNavItem, onNavItemClick }) => {
  const [examResults, setExamResults] = useState([]);
  const [pageFocus, setPageFocus] = useState(1);
  const reportsPerPage = 8;

  const fetchStudentResults = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("https://quiz-app-zainabidinov-api.onrender.com/api/quizzes/results/getAllExamResults", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  const lastIndex = pageFocus * reportsPerPage;
  const firstIndex = lastIndex - reportsPerPage;
  const currentReports = examResults.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(examResults.length / reportsPerPage);

  return (
    <div className="results--container">
      <div className="results--content">
        <div className="results--content__header">Students Exam Results</div>

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
                      activeNavItem === "exam-feedback/:id" ? "active" : ""
                    }
                    onClick={() => onNavItemClick(`exam-feedback/${exam._id}`)}
                  >
                    View Feedback
                  </Button>
                </td>
              </tr>
            ))}
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
      </div>
    </div>
  );
};

export default StudentResults;
