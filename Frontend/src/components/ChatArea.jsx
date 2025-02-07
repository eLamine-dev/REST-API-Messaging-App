import { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { AppContext } from "../utils/AppContext";
import MessageCard from "./MessageCard";
import MessageInput from "./MessageInput";

function ChatArea({
  setUserConversations,
  setAddingMembers,
  setRemovingMembers,
  isAddingMembers,
  isRemovingMembers,
}) {
  const {
    state,
    currConversation,
    setCurrConversation,
    setSelectedConversation,
  } = useContext(AppContext);

  // const fetchMessages = async (isMounted) => {
  //   if (!currConversationId) return;
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:5000/api/conversations/messages/${currConversationId}`,
  //       { headers: { Authorization: `${state.token}` } }
  //     );
  //     if (isMounted) {
  //       setConversation(response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching conversation messages:", error);
  //   }
  // };

  // useEffect(() => {
  //   let isMounted = true;

  //   fetchMessages(isMounted);

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [currConversationId, state.token]);

  const handleSend = async () => {
    // await fetchMessages();
  };

  if (!currConversation) {
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

      setCurrConversation(null);
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
      {currConversation.isGroup && (
        <div className="group-controls">
          {currConversation.adminId == state.user.id ? (
            <>
              <button onClick={() => deleteGroup(currConversation.id)}>
                Delete Group
              </button>
            </>
          ) : (
            <button onClick={() => leaveGroup(currConversation.id)}>
              Leave Group
            </button>
          )}
        </div>
      )}

      <button onClick={() => setSel(currConversation.id)}>Settings</button>
      {currConversation ? (
        <>
          <h2>{currConversation.name}</h2>
          <div className="messages">
            {currConversation.messages.map((msg) => (
              <MessageCard
                key={msg.id}
                message={msg}
                // isCurrentUser={msg.sender.id === state.user.id}
              />
            ))}
          </div>
          <MessageInput
            conversationId={currConversation.id}
            onSend={handleSend}
          />
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
