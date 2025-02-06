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
  setAddingMembers,
  setRemovingMembers,
  isAddingMembers,
  isRemovingMembers,
  conversation,
  setConversation,
}) {
  const { state } = useContext(AppContext);

  const fetchMessages = async (isMounted) => {
    if (!currConversationId) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/conversations/messages/${currConversationId}`,
        { headers: { Authorization: `${state.token}` } }
      );
      if (isMounted) {
        setConversation(response.data);
      }
    } catch (error) {
      console.error("Error fetching conversation messages:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    fetchMessages(isMounted);

    return () => {
      isMounted = false;
    };
  }, [currConversationId, state.token]);

  const handleSend = async () => {
    await fetchMessages();
  };

  if (!conversation) {
    return <p>Loading chat...</p>;
  }

  //TODO: move management of groups to group details component
  const deleteGroup = async (groupId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/conversations/delete-group/${groupId}`,
        { headers: { Authorization: `${state.token}` } }
      );

      setUserConversations((prev) => ({
        ...prev,
        groupConversations: prev.groupConversations.filter(
          (conversation) => conversation.id !== groupId
        ),
      }));

      setCurrConversationId(chatRoomId);
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const leaveGroup = async (groupId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/conversations/leave/${groupId}`,
        {},
        { headers: { Authorization: `${state.token}` } }
      );

      setUserConversations((prev) => ({
        ...prev,
        groupConversations: prev.groupConversations.filter(
          (conversation) => conversation.id !== groupId
        ),
      }));

      setCurrConversationId(chatRoomId);
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
              <button
                onClick={() => {
                  setAddingMembers(!isAddingMembers);
                  setRemovingMembers(false);
                }}
              >
                {isAddingMembers ? "Cancel Add Member" : "Add Member"}
              </button>
              <button
                onClick={() => {
                  setRemovingMembers(!isRemovingMembers);
                  setAddingMembers(false);
                }}
              >
                {isRemovingMembers ? "Cancel Remove Member" : "Remove Member"}
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
