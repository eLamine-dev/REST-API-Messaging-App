import { useContext, useEffect, useState } from "react";
import { AppContext } from "../utils/AppContext";
import {
  FaComment,
  FaPhone,
  FaUserFriends,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Sidebar({ selectedTab, setSelectedTab }) {
  const { state, setState } = useContext(AppContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    messages: 0,
    requests: 0,
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/notifications",
          {
            headers: { Authorization: `${state.token}` },
          }
        );
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          headers: { Authorization: `${state.token}` },
        }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      setState({ token: null, user: null });
      navigate("/auth");
    }
  };

  return (
    <div className="sidebar">
      <div
        className={`icon ${selectedTab === "messages" ? "active" : ""}`}
        onClick={() => setSelectedTab("messages")}
      >
        <FaComment />
        {notifications.messages > 0 && (
          <span className="badge">{notifications.messages}</span>
        )}
      </div>
      <div
        className={`icon ${selectedTab === "calls" ? "active" : ""}`}
        onClick={() => setSelectedTab("calls")}
      >
        <FaPhone />
      </div>
      <div
        className={`icon ${selectedTab === "friends" ? "active" : ""}`}
        onClick={() => setSelectedTab("friends")}
      >
        <FaUserFriends />
        {notifications.requests > 0 && (
          <span className="badge">{notifications.requests}</span>
        )}
      </div>
      <div
        className={`icon ${selectedTab === "profile" ? "active" : ""}`}
        onClick={() => setSelectedTab("profile")}
      >
        <FaUser />
      </div>
      <div className="icon logout" onClick={logout}>
        <FaSignOutAlt />
      </div>
    </div>
  );
}

export default Sidebar;
