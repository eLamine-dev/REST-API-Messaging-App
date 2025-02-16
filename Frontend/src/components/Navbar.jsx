import { useContext, useEffect, useState } from "react";
import { AppContext } from "../utils/AppContext";
import useAuth from "../hooks/useAuth";
import {
  FaComment,
  FaPhone,
  FaUserFriends,
  FaUser,
  FaSignOutAlt,
  FaUsers,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Navbar({ selectedTab, setSelectedTab }) {
  const { authDispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    messages: 0,
    requests: 0,
  });

  const { logout } = useAuth();

  const handleNavigate = (tab, path) => {
    setSelectedTab(tab);
    navigate(path);
  };

  return (
    <div className="Navbar">
      <div
        className={`icon ${selectedTab === "messages" ? "active" : ""}`}
        onClick={() => handleNavigate("messages", "/messages")}
      >
        <FaComment />
        {notifications.messages > 0 && (
          <span className="badge">{notifications.messages}</span>
        )}
      </div>
      <div
        className={`icon ${selectedTab === "calls" ? "active" : ""}`}
        onClick={() => handleNavigate("calls", "/calls")}
      >
        <FaPhone />
      </div>
      <div
        className={`icon ${selectedTab === "friends" ? "active" : ""}`}
        onClick={() => handleNavigate("friends", "/friends")}
      >
        <FaUserFriends />
        {notifications.requests > 0 && (
          <span className="badge">{notifications.requests}</span>
        )}
      </div>
      <div
        className={`icon ${selectedTab === "groups" ? "active" : ""}`}
        onClick={() => handleNavigate("groups", "/groups")}
      >
        <FaUsers />
      </div>
      <div
        className={`icon ${selectedTab === "profile" ? "active" : ""}`}
        onClick={() => handleNavigate("profile", "/profile")}
      >
        <FaUser />
      </div>
      <div className="icon logout" onClick={logout}>
        <FaSignOutAlt />
      </div>
    </div>
  );
}

export default Navbar;
