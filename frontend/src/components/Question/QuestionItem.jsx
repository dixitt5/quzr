import React from "react";
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

  return (
    <div className="question-item">
      <div className="question-stats">
        <div className="question-answers-count">
          <span>{question._count.answers}</span>
          <p>answers</p>
        </div>
      </div>
      <div className="question-summary">
        <h3 className="question-title">
          <Link to={`/questions/${question.id}`}>{question.title}</Link>
        </h3>
        <div className="question-excerpt">{excerpt}</div>
        <div className="question-meta">
          <div className="question-tags">
            {question.tags.map((tag) => (
              <Tag key={tag.id} name={tag.name} />
            ))}
          </div>
          <div className="question-author">
            <span>{question.author.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;
