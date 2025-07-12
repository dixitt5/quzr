import { Link } from "react-router-dom";
import Tag from "../Tag/Tag";
import "./QuestionItem.css";

const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

const createExcerpt = (content, limit = 180) => {
  if (!content) return "";
  const plainText = stripHtml(content);
  if (plainText.length <= limit) return plainText;
  return plainText.substring(0, limit) + "...";
};

const QuestionItem = ({ question }) => {
  const excerpt = createExcerpt(question.content);
  const answerCount = question._count?.answers || 0;
  const hasAnswers = answerCount > 0;

  return (
    <div className="question-item">
      <div className="question-stats">
        <div className={`question-answers-count ${hasAnswers ? 'has-answers' : ''}`}>
          <span>{answerCount}</span>
          <p>{answerCount === 1 ? 'answer' : 'answers'}</p>
        </div>
      </div>
      <div className="question-summary">
        <h3 className="question-title">
          <Link to={`/questions/${question.id}`}>{question.title}</Link>
        </h3>
        {excerpt && <div className="question-excerpt">{excerpt}</div>}
        <div className="question-meta">
          <div className="question-tags">
            {question.tags?.map((tag) => (
              <Tag key={tag.id} name={tag.name} />
            ))}
          </div>
          <div className="question-author">
            asked by <span>{question.author?.username || 'Unknown'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;
