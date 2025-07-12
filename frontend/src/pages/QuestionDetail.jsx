import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import QuestionService from '../services/question.service';
import DOMPurify from 'dompurify';
import './QuestionDetail.css';

const QuestionDetail = () => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const data = await QuestionService.getQuestionById(id);
        setQuestion(data);
      } catch (err) {
        console.error('Error fetching question:', err);
        setError('Failed to load the question. It may have been deleted or does not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      try {
        await QuestionService.deleteQuestion(id);
        navigate('/');
      } catch (err) {
        console.error('Error deleting question:', err);
        setError('Failed to delete the question. Please try again later.');
      }
    }
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
        <Link to="/" className="back-button">Back to Home</Link>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="question-detail-container not-found">
        <h2>Question Not Found</h2>
        <p>The question you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link to="/" className="back-button">Back to Home</Link>
      </div>
    );
  }

  const isAuthor = currentUser && currentUser.id === question.authorId;
  const formattedDate = question.createdAt ? format(new Date(question.createdAt), 'MMM d, yyyy') : '';

  // Sanitize the HTML content to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(question.content);

  return (
    <div className="question-detail-container">
      <Link to="/" className="back-link">← Back to all questions</Link>

      <article className="question-content">
        <header>
          <h1>{question.title}</h1>
          <div className="question-meta">
            <div className="author-info">
              <span>Posted by </span>
              <strong>{question.author?.username || 'Unknown User'}</strong>
            </div>
            <div className="question-date">{formattedDate}</div>
          </div>
        </header>

        <div className="question-body">
          <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </div>

        {isAuthor && (
          <div className="author-actions">
            <Link to={`/questions/${id}/edit`} className="edit-button">Edit</Link>
            <button onClick={handleDelete} className="delete-button">Delete</button>
          </div>
        )}
      </article>
    </div>
  );
};

export default QuestionDetail; 