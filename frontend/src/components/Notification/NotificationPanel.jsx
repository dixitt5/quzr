import { Link } from "react-router-dom";
import TimeAgo from "react-timeago";
import "./NotificationPanel.css";

const NotificationPanel = ({ notifications, onClose }) => {
  const getNotificationMessage = (notification) => {
    const actor = <strong>{notification.actor.username}</strong>;
    switch (notification.type) {
      case "NEW_ANSWER":
        return (
          <>
            {actor} answered your question: &quot;{notification.question.title}&quot;
          </>
        );
      case "ACCEPTED_ANSWER":
        return (
          <>
            {actor} accepted your answer on: &quot;{notification.question.title}&quot;
          </>
        );
      case "NEW_VOTE":
        return (
          <>
            {actor} upvoted your post: &quot;{notification.question.title}&quot;
          </>
        );
      default:
        return "You have a new notification.";
    }
  };

  return (
    <div className="notification-panel">
      <div className="notification-panel-header">
        <h3>Notifications</h3>
        <button onClick={onClose} className="close-button">
          &times;
        </button>
      </div>
      <div className="notification-list">
        {notifications.length === 0 ? (
          <p className="no-notifications">You have no new notifications.</p>
        ) : (
          notifications.map((n) => (
            <Link
              to={`/questions/${n.question.id}`}
              key={n.id}
              className={`notification-item ${n.read ? "" : "unread"}`}
              onClick={onClose}
            >
              <div className="notification-content">
                <p>{getNotificationMessage(n)}</p>
                <span className="notification-time">
                  <TimeAgo date={n.createdAt} />
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
