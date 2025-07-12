import AnswerItem from "./AnswerItem";
import AnswerForm from "./AnswerForm";
import { useAuth } from "../../contexts/AuthContext";
import AnswerService from "../../services/answer.service";
import "./Answers.css";

const Answers = ({ question, onAnswerUpdate }) => {
  const { currentUser } = useAuth();

  const handleAnswerSubmitted = async (content) => {
    try {
      const newAnswer = await AnswerService.createAnswer(content, question.id);
      onAnswerUpdate(newAnswer.data);
    } catch (error) {
      console.error("Failed to post answer:", error);
      throw error;
    }
  };

  return (
    <section className="answers-section">
      <h2 className="answers-header">
        {question.answers.length}{" "}
        {question.answers.length === 1 ? "Answer" : "Answers"}
      </h2>
      <div className="answers-list">
        {question.answers.map((answer) => (
          <AnswerItem key={answer.id} answer={answer} />
        ))}
      </div>
      {currentUser ? (
        <AnswerForm
          questionId={question.id}
          onAnswerSubmitted={handleAnswerSubmitted}
        />
      ) : (
        <p className="login-prompt">You must be logged in to post an answer.</p>
      )}
    </section>
  );
};

export default Answers;
