import React, { useState, useEffect, useRef } from "react";
import NotificationService from "../../services/notification.service";
import NotificationPanel from "./NotificationPanel";
import { FaBell } from "react-icons/fa";
import "./NotificationBell.css";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const data = await NotificationService.getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async () => {
    setIsOpen((prev) => !prev);
    if (!isOpen && unreadCount > 0) {
      try {
        await NotificationService.markAllAsRead();
        setUnreadCount(0);
        // Refresh notifications list to show all as read
        fetchNotifications();
      } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [panelRef]);

  return (
    <div className="notification-bell" ref={panelRef}>
      <button onClick={handleToggle} className="notification-button">
        <FaBell color="black" />
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
      </button>
      {isOpen && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
