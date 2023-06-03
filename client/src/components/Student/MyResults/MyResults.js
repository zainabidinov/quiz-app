import React, { useEffect, useState } from "react";
import "./MyResults.css";
import { Button } from "@chakra-ui/react";
import axios from "axios";

const MyResults = () => {
  const [myResults, setMyResults] = useState([]);
  console.log("myResults content", myResults);
  useEffect(() => {
    const fetchTheStudentResult = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("/api/quizzes/results/getMyResults", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMyResults(res.data.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchTheStudentResult();
  }, []);

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
            {myResults.map((exam, index) => (
              <tr key={index}>
                <td>{exam.examName}</td>
                <td>{exam.examSubject}</td>
                <td>{Math.round(exam.score)}%</td>
                <td>
                  {exam.numCorrect}/{Object.keys(exam.report).length}
                </td>
                <td>
                  <Button>View Feedback</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyResults;
