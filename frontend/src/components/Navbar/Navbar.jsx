import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          super-blogs
        </Link>
        <div className="nav-buttons">
          <Link to="/login" className="nav-link">
            Log In
          </Link>
          <Link to="/register" className="auth-button">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 