import { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { AppContext } from "../utils/AppContext";
import MessageCard from "./MessageCard";
import MessageInput from "./MessageInput";

function ChatArea({
  chatRoomId,
  currConversationId,
  setCurrConversationId,
  setUserConversations,
}) {
  const [conversation, setConversation] = useState(null);

  const { state } = useContext(AppContext);

  useEffect(() => {
    if (!currConversationId && chatRoomId) {
      console.log("Setting chat room as default conversation:", chatRoomId);
      setCurrConversationId(chatRoomId);
    }
  }, [chatRoomId, currConversationId]);

  const fetchMessages = async () => {
    if (!currConversationId) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/conversations/messages/${currConversationId}`,
        { headers: { Authorization: `${state.token}` } }
      );
      console.log(response.data);

      setConversation(response.data);
    } catch (error) {
      console.error("Error fetching conversation messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [currConversationId, state.token]);

  const handleSend = async () => {
    await fetchMessages();
  };

  if (!conversation) {
    return <p>Loading chat...</p>;
  }

  const deleteGroup = async (groupId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/conversations/group/delete/${groupId}`,
        { headers: { Authorization: `${state.token}` } }
      );

      setUserConversations((prev) => ({
        ...prev,
        groupConversations: prev.groupConversations.filter(
          (conversation) => conversation.id !== groupId
        ),
      }));

      console.log("Group deleted, switching back to chat room:", chatRoomId);

      setCurrConversationId(() => chatRoomId);
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const leaveGroup = async (groupId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/conversations/group/leave/${groupId}`,
        { headers: { Authorization: `${state.token}` } }
      );

      setConversation(null);
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

  return (
    <div className="chat-area">
      {conversation.isGroup && (
        <div className="group-controls">
          {conversation.adminId == state.user.id ? (
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
      {conversation ? (
        <>
          <h2>{conversation.name}</h2>
          <div className="messages">
            {conversation.messages.map((msg) => (
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

// ChatArea.propTypes = {
//   conversation: PropTypes.shape({
//     id: PropTypes.number,
//   }).isRequired,
// };

export default ChatArea;
