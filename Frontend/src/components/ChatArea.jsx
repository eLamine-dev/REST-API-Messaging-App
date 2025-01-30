import { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { AppContext } from "../utils/AppContext";
import MessageCard from "./MessageCard";
import MessageInput from "./MessageInput";

function ChatArea({ conversation }) {
  const [messages, setMessages] = useState([]);
  const { state } = useContext(AppContext);
  console.log(state);

  // const isAdmin = conversation.adminId === state.user.id;

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
      {conversation.isGroup && (
        <div className="group-controls">
          {isAdmin ? (
            <>
              <button onClick={() => addMember(conversation.id)}>
                Add Member
              </button>
              <button onClick={() => removeMember(conversation.id)}>
                Remove Member
              </button>
              <button onClick={() => deleteGroup(conversation.id)}>
                Delete Group
              </button>
            </>
          ) : (
            <button onClick={() => leaveGroup(conversation.id)}>
              Leave Group
            </button>
          )}
        </div>
      )}
      {conversation.id ? (
        <>
          <h2>{conversation.type == "chat-room" && "Chat Room"}</h2>
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
