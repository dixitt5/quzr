import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import NotificationBell from "../Notification/NotificationBell";
import "./Navbar.css";

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          quzr
        </Link>
        <div className="nav-buttons">
          {currentUser ? (
            <>
              <span className="welcome-text">
                Welcome, {currentUser.username || currentUser.email}!
              </span>
              <NotificationBell />
              <button onClick={logout} className="logout-button">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Log In
              </Link>
              <Link to="/register" className="auth-button">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
