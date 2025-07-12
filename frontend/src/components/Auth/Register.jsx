import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import './Register.css';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password')
});

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // In a real application, this would call an API endpoint
      console.log('Form data submitted:', data);
      // For now, we're just simulating a successful registration
      alert('Registration successful! You can now login.');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create an Account</h2>
        <p className="subtitle">Join super-blogs to share your thoughts and read amazing content</p>
        
        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              id="username"
              type="text"
              {...register('username')}
              className={errors.username ? 'error' : ''}
              placeholder="johndoe123"
            />
            {errors.username && <p className="error-message">{errors.username.message}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? 'error' : ''}
              placeholder="your@email.com"
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              type="password"
              {...register('password')}
              className={errors.password ? 'error' : ''}
              placeholder="••••••••"
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
          </div>
          
          <button 
            type="submit" 
            className="register-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <p className="login-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 