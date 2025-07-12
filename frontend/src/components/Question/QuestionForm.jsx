import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import QuestionService from '../../services/question.service';
import './QuestionForm.css';

const schema = yup.object().shape({
  title: yup.string().required('Title is required').min(5, 'Title must be at least 5 characters'),
  content: yup.string().required('Content is required').min(20, 'Content must be at least 20 characters')
});

const QuestionForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [originalQuestion, setOriginalQuestion] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  });

  // If editing, load the original question
  useEffect(() => {
    if (isEdit && id) {
      const fetchQuestion = async () => {
        try {
          const question = await QuestionService.getQuestionById(id);
          setOriginalQuestion(question);
          
          // Check if the current user is the author
          if (currentUser?.id !== question.authorId) {
            navigate('/');
            return;
          }
          
          // Set form values
          reset({
            title: question.title,
            content: question.content
          });
        } catch (error) {
          console.error('Error fetching question:', error);
          navigate('/');
        }
      };
      
      fetchQuestion();
    }
  }, [isEdit, id, currentUser, reset, navigate]);

  const onSubmit = async (data) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    setApiError('');
    
    try {
      if (isEdit) {
        await QuestionService.updateQuestion(id, data);
        navigate(`/questions/${id}`);
      } else {
        // Add authorId to the data
        const questionData = {
          ...data,
          authorId: currentUser.id
        };
        
        const newQuestion = await QuestionService.createQuestion(questionData);
        navigate(`/questions/${newQuestion.id}`);
      }
    } catch (error) {
      console.error('Error submitting question:', error);
      setApiError(
        error.response?.data?.message || 
        `Failed to ${isEdit ? 'update' : 'create'} question. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="question-form-container">
      <div className="question-form-card">
        <h2>{isEdit ? 'Edit' : 'Create'} Article</h2>
        <p className="subtitle">
          {isEdit 
            ? 'Update your article with the latest information'
            : 'Share your knowledge with the community'
          }
        </p>
        
        {apiError && <div className="error-message form-error">{apiError}</div>}
        
        <form onSubmit={handleSubmit(onSubmit)} className="question-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className={errors.title ? 'error' : ''}
              placeholder="Enter a descriptive title"
            />
            {errors.title && <p className="error-message">{errors.title.message}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              rows={10}
              {...register('content')}
              className={errors.content ? 'error' : ''}
              placeholder="Write your article content here..."
            />
            {errors.content && <p className="error-message">{errors.content.message}</p>}
          </div>
          
          <div className="form-actions">
            <Link 
              to={isEdit && originalQuestion ? `/questions/${id}` : '/'} 
              className="cancel-button"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? isEdit ? 'Updating...' : 'Creating...' 
                : isEdit ? 'Update Article' : 'Create Article'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm; 