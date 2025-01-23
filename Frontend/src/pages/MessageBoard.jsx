import axios from "axios";
import { useState } from "react";
import ChatArea from "../components/ChatArea";
import FriendList from "../components/FriendList";
import ConversationList from "../components/ConversationList";
import { useContext } from "react";

import { AppContext } from "../utils/AppContext";

import { useNavigate } from "react-router-dom";

function MessageBoard() {
  const { state, setState } = useContext(AppContext);

  const navigate = useNavigate();

  async function logout() {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      setState({
        token: null,
        user: null,
        conversation: { type: "chat-room", id: null },
      });
      navigate("/auth");
    }
  }

  return (
    <div className="message-board">
      <div className="header">
        <h1>Message Board</h1>
        {/* <h3>Welcome, {state.user.username}</h3> */}
        <button onClick={logout}>Logout</button>
      </div>

      <FriendList />
      <ConversationList />
      <ChatArea />
    </div>
  );
}

export default MessageBoard;
