import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./AnswerForm.css";

const AnswerForm = ({ questionId, onAnswerSubmitted }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Answer content cannot be empty.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await onAnswerSubmitted(content, questionId);
      setContent("");
    } catch (err) {
      setError("Failed to submit answer. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="answer-form-container">
      <h3>Your Answer</h3>
      <form onSubmit={handleSubmit}>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          className="rich-text-editor"
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image", "code-block"],
              ["clean"]
            ]
          }}
        />
        {error && <p className="error-message">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="submit-answer-btn"
        >
          {isSubmitting ? "Submitting..." : "Post Your Answer"}
        </button>
      </form>
    </div>
  );
};

export default AnswerForm;
