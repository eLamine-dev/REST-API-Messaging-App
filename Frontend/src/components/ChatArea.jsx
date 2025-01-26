import { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { AppContext } from "../utils/AppContext";
import MessageCard from "./MessageCard";
import MessageInput from "./MessageInput";

function ChatArea({ conversation }) {
  const [messages, setMessages] = useState([]);
  const { state } = useContext(AppContext);

  const fetchMessages = async () => {
    if (!conversation.id) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/conversations/messages/${conversation.id}`,
        { headers: { Authorization: `${state.token}` } }
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching conversation messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [conversation.id, state.token]);

  const handleSend = async () => {
    await fetchMessages(); //
  };

  return (
    <div className="chat-area">
      {conversation.id ? (
        <>
          <h2>Chat Room</h2>
          <div className="messages">
            {messages.map((msg) => (
              <MessageCard
                key={msg.id}
                message={msg}
                // isCurrentUser={msg.sender.id === state.user.id}
              />
            ))}
          </div>
          <MessageInput conversationId={conversation.id} onSend={handleSend} />
        </>
      ) : (
        <p>Loading chat room...</p>
      )}
    </div>
  );
}

ChatArea.propTypes = {
  conversation: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

export default ChatArea;
