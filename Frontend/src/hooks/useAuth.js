import { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../utils/AppContext";

const useAuth = () => {
  const { authDispatch } = useContext(AppContext);
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
      navigate("/messages");
    } catch (error) {
      alert("Invalid credentials");
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
      toggleForm(); // Switch to login form
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
      authDispatch({ type: "LOGOUT" });
      navigate("/auth");
    }
  };

  return { login, register, logout };
};

export default useAuth;
