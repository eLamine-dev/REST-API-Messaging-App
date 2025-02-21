import { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../utils/AppContext";

const useAuth = () => {
  const { authDispatch, chatDispatch, friendsDispatch } =
    useContext(AppContext);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;

      authDispatch({ type: "LOGIN", payload: { token, user } });

      fetchUserProfile(token);

      navigate("/messages");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/profile",
        {
          headers: { Authorization: token },
        }
      );
      console.log(response.data);

      const { acceptedRequests, pendingRequests, conversations } =
        response.data;

      friendsDispatch({
        type: "SET_FRIEND_REQUESTS",
        payload: { acceptedRequests, pendingRequests },
      });

      chatDispatch({
        type: "SET_CONVERSATIONS",
        payload: {
          private: conversations.filter((c) => !c.isGroup),
          group: conversations.filter((c) => c.isGroup),
        },
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const register = async (email, username, password, toggleForm) => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        email,
        username,
        password,
      });
      alert("Account created! Please log in.");
      toggleForm();
    } catch (error) {
      alert("User already exists");
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { headers: { Authorization: localStorage.getItem("token") } }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      chatDispatch({ type: "RESET_CHAT_STATE" });
      friendsDispatch({ type: "RESET_FRIENDS_STATE" });
      authDispatch({ type: "LOGOUT" });
      navigate("/auth");
    }
  };

  return { login, register, logout, fetchUserProfile };
};

export default useAuth;
