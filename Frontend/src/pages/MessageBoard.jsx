import axios from "axios";
import { useState } from "react";
import ChatArea from "../components/ChatArea";
import FriendList from "../components/FriendList";
import ConversationList from "../components/ConversationList";
import { useContext, useEffect } from "react";

import { AppContext } from "../utils/AppContext";

import { useNavigate } from "react-router-dom";

function MessageBoard() {
  const { state, setState } = useContext(AppContext);
  const [conversation, setConversation] = useState({
    type: "chat-room",
    id: null,
    chatRoomId: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const getChatRoomId = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/conversations/get-chatroom",
          { headers: { Authorization: `${state.token}` } }
        );

        setConversation({
          type: "chat-room",
          id: response.data,
          chatRoomId: response.data,
        });
      } catch (error) {
        console.error("Error fetching chat room ID:", error);
      }
    };
    if (conversation.type === "chat-room" && conversation.chatRoomId === null) {
      getChatRoomId();
    }
  });

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
      <ChatArea conversation={conversation} />
    </div>
  );
}

export default MessageBoard;
