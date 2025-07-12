import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import QuestionService from '../services/question.service';
import './Home.css';

// Helper function to strip HTML tags and extract plain text
const stripHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

// Helper function to create excerpt with character limit
const createExcerpt = (content, limit = 150) => {
  if (!content) return '';
  
  const plainText = stripHtml(content);
  if (plainText.length <= limit) return plainText;
  return plainText.substring(0, limit) + '...';
};

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await QuestionService.getAllQuestions();
        setQuestions(data);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Super-Blogs</h1>
        <p>Discover amazing articles and share your thoughts with the world</p>
        
        {currentUser && (
          <Link to="/questions/new" className="create-question-btn">
            Create New Post
          </Link>
        )}
      </div>
      
      <div className="blogs-container">
        <h2>Latest Articles</h2>
        
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading articles...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : questions.length === 0 ? (
          <div className="no-questions">
            <p>No articles found. Be the first to create one!</p>
            {currentUser && (
              <Link to="/questions/new" className="create-question-btn">
                Create New Post
              </Link>
            )}
          </div>
        ) : (
          <div className="blog-grid">
            {questions.map(question => {
              const formattedDate = question.createdAt 
                ? format(new Date(question.createdAt), 'MMM d, yyyy')
                : '';

              const excerpt = createExcerpt(question.content, 150);

              return (
                <div className="blog-card" key={question.id}>
                  <div className="blog-content">
                    <h3>
                      <Link to={`/questions/${question.id}`} className="question-title-link">
                        {question.title}
                      </Link>
                    </h3>
                    <p className="blog-excerpt">{excerpt}</p>
                    <div className="blog-meta">
                      <span className="blog-author">
                        By {question.author?.username || 'Unknown User'}
                      </span>
                      <span className="blog-date">{formattedDate}</span>
                    </div>
                    <Link to={`/questions/${question.id}`} className="read-more-btn">
                      Read More
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home; 