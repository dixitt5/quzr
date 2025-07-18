import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import DOMPurify from "dompurify";
import VoteService from "../../services/vote.service";
import AnswerService from "../../services/answer.service";
import "./AnswerItem.css";

const AnswerItem = ({ answer, questionAuthorId, onAnswerAccepted }) => {
  const { currentUser } = useAuth();
  const [voteCount, setVoteCount] = useState(
    answer.votes.reduce((acc, vote) => {
      if (vote.type === "UPVOTE") return acc + 1;
      if (vote.type === "DOWNVOTE") return acc - 1;
      return acc;
    }, 0)
  );
  const [userVote, setUserVote] = useState(
    answer.votes.find((v) => v.userId === currentUser?.id)?.type || null
  );

  const isQuestionAuthor = currentUser && currentUser.id === questionAuthorId;

  const handleUpvote = async () => {
    if (!currentUser) {
      alert("You must be logged in to vote.");
      return;
    }
    try {
      await VoteService.upvoteAnswer(answer.id);
      // Optimistically update the UI
      if (userVote === "UPVOTE") {
        setVoteCount(voteCount - 1);
        setUserVote(null);
      } else if (userVote === "DOWNVOTE") {
        setVoteCount(voteCount + 2);
        setUserVote("UPVOTE");
      } else {
        setVoteCount(voteCount + 1);
        setUserVote("UPVOTE");
      }
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  const handleAccept = async () => {
    try {
      const { data } = await AnswerService.acceptAnswer(answer.id);
      onAnswerAccepted(data);
    } catch (error) {
      console.error("Error accepting answer:", error);
      alert("Failed to accept answer. Please try again.");
    }
  };

  const sanitizedContent = DOMPurify.sanitize(answer.content);

  return (
    <div className={`answer-item ${answer.isAccepted ? "accepted" : ""}`}>
      <div className="vote-control">
        <button
          onClick={handleUpvote}
          className={`vote-btn upvote ${userVote === "UPVOTE" ? "voted" : ""}`}
          aria-label="Upvote"
        >
          ▲
        </button>
        <span className="vote-count">{voteCount}</span>
        {answer.isAccepted && (
          <div className="accepted-badge" title="Accepted Answer">
            ✓
          </div>
        )}
      </div>
      <div className="answer-content">
        <div
          className="answer-body"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />
        <div className="answer-meta">
          <span>Answered by </span>
          <strong>{answer.author?.username || "Unknown User"}</strong>
        </div>
        {isQuestionAuthor && !answer.isAccepted && (
          <button onClick={handleAccept} className="accept-answer-btn">
            Accept Answer
          </button>
        )}
      </div>
    </div>
  );
};

export default AnswerItem;
