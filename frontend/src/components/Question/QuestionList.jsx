import React, { useState, useEffect } from "react";
import QuestionService from "../../services/question.service";
import QuestionItem from "./QuestionItem";
import "./QuestionList.css";

const QuestionList = ({ filter, tags }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filter) {
          params.filter = filter;
        }
        if (tags && tags.length > 0) {
          params.tags = tags;
        }
        const data = await QuestionService.getAllQuestions(params);
        setQuestions(data);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [filter, tags]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="no-questions-message">
        <p>No questions found. Why not ask one?</p>
      </div>
    );
  }

  return (
    <div className="question-list">
      {questions.map((question) => (
        <QuestionItem key={question.id} question={question} />
      ))}
    </div>
  );
};

export default QuestionList;
