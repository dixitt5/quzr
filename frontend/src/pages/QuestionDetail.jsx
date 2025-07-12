import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "../contexts/AuthContext";
import QuestionService from "../services/question.service";
import Answers from "../components/Answer/Answers";
import DOMPurify from "dompurify";
import Tag from "../components/Tag/Tag";
import "./QuestionDetail.css";

const QuestionDetail = () => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchQuestion = useCallback(async () => {
    try {
      setLoading(true);
      const data = await QuestionService.getQuestionById(id);
      setQuestion(data);
    } catch (err) {
      console.error("Error fetching question:", err);
      setError(
        "Failed to load the question. It may have been deleted or does not exist."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this question? This action cannot be undone."
      )
    ) {
      try {
        await QuestionService.deleteQuestion(id);
        navigate("/");
      } catch (err) {
        console.error("Error deleting question:", err);
        setError("Failed to delete the question. Please try again later.");
      }
    }
  };

  const handleAnswerUpdate = () => {
    fetchQuestion();
  };

  const handleAnswerAccepted = (acceptedAnswer) => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      answers: prevQuestion.answers.map((answer) => ({
        ...answer,
        isAccepted: answer.id === acceptedAnswer.id
      }))
    }));
  };

  if (loading) {
    return (
      <div className="question-detail-container loading">
        <div className="spinner"></div>
        <p>Loading question...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="question-detail-container error">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/" className="back-button">
          Back to Home
        </Link>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="question-detail-container not-found">
        <h2>Question Not Found</h2>
        <p>
          The question you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link to="/" className="back-button">
          Back to Home
        </Link>
      </div>
    );
  }

  const isAuthor = currentUser && currentUser.id === question.authorId;
  const formattedDate = question.createdAt
    ? format(new Date(question.createdAt), "MMM d, yyyy")
    : "";

  const sanitizedContent = DOMPurify.sanitize(question.content);

  return (
    <div className="question-detail-container">
      <Link to="/" className="back-link">
        ← Back to all posts
      </Link>

      <article className="question-content">
        <header>
          <h1>{question.title}</h1>
          <div className="tags-container detail-tags">
            {question.tags &&
              question.tags.map((tag) => <Tag key={tag.id} name={tag.name} />)}
          </div>
          <div className="question-meta">
            <div className="author-info">
              <span>Posted by </span>
              <strong>{question.author?.username || "Unknown User"}</strong>
            </div>
            <div className="question-date">{formattedDate}</div>
          </div>
        </header>

        <div
          className="question-body"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {isAuthor && (
          <div className="author-actions">
            <Link to={`/questions/${id}/edit`} className="edit-button">
              Edit
            </Link>
            <button onClick={handleDelete} className="delete-button">
              Delete
            </button>
          </div>
        )}
      </article>

      {question.answers && (
        <Answers
          question={question}
          onAnswerUpdate={handleAnswerUpdate}
          onAnswerAccepted={handleAnswerAccepted}
        />
      )}
    </div>
  );
};

export default QuestionDetail;
