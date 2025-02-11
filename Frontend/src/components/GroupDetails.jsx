import { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../utils/AppContext";

function GroupDetails() {
  const { authState, chatState, chatDispatch } = useContext(AppContext);
  const group = chatState.selectedConversation;
  const { selectedConversation } = chatState;

  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState(selectedConversation.name);

  const isAdmin = selectedConversation.adminId === authState.user.id;

  const handleAddMember = async () => {
    if (!newMember.trim()) return;

    try {
      await axios.post(
        `http://localhost:5000/api/conversations/members/${selectedConversation.id}`,
        { userId: newMember },
        { headers: { Authorization: authState.token } }
      );

      chatDispatch({
        type: "SET_CONVERSATIONS",
        payload: {
          private: chatState.privateConversations,
          group: chatState.groupConversations.map((g) =>
            g.id === group.id
              ? { ...g, members: [...g.members, { id: newMember }] }
              : g
          ),
        },
      });

      setNewMember("");
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/conversations/members/remove/${selectedConversation.id}`,
        { userId: memberId },
        { headers: { Authorization: authState.token } }
      );

      chatDispatch({
        type: "SET_CONVERSATIONS",
        payload: {
          private: chatState.privateConversations,
          group: chatState.groupConversations.map((g) =>
            g.id === selectedConversation.id
              ? { ...g, members: g.members.filter((m) => m.id !== memberId) }
              : g
          ),
        },
      });
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/conversations/delete-group/${selectedConversation.id}`,
        { headers: { Authorization: authState.token } }
      );

      chatDispatch({
        type: "SET_CONVERSATIONS",
        payload: {
          private: chatState.privateConversations,
          group: chatState.groupConversations.filter(
            (g) => g.id !== selectedConversation.id
          ),
        },
      });
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/conversations/leave/${selectedConversation.id}`,
        {},
        { headers: { Authorization: authState.token } }
      );

      chatDispatch({
        type: "SET_CONVERSATIONS",
        payload: {
          private: chatState.privateConversations,
          group: chatState.groupConversations.filter(
            (g) => g.id !== selectedConversation.id
          ),
        },
      });
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

  const handleRenameGroup = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/conversations/rename/${group.id}`,
        { name: groupName },
        { headers: { Authorization: authState.token } }
      );

      chatDispatch({
        type: "SET_CONVERSATIONS",
        payload: {
          private: chatState.privateConversations,
          group: chatState.groupConversations.map((g) =>
            g.id === group.id ? { ...g, name: groupName } : g
          ),
        },
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error renaming group:", error);
    }
  };

  return (
    <div className="group-details">
      <button
        onClick={() =>
          chatDispatch({ type: "SET_SELECTED_CONVERSATION", payload: null })
        }
      >
        Close
      </button>

      {isEditing ? (
        <>
          <input
            type="text"
            value={selectedConversation.name}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button onClick={handleRenameGroup}>Save</button>
        </>
      ) : (
        <h2>
          {selectedConversation.name}{" "}
          {isAdmin && <button onClick={() => setIsEditing(true)}>✏️</button>}
        </h2>
      )}

      <h3>Members</h3>
      <ul>
        {selectedConversation.members.map((member) => (
          <li key={member.id}>
            {member.username}
            {isAdmin && member.id !== authState.user.id && (
              <button onClick={() => handleRemoveMember(member.id)}>
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>

      {isAdmin && (
        <>
          <button onClick={handleDeleteGroup}>Delete Group</button>
          <button onClick={handleAddMember}>Add Members</button>
        </>
      )}

      {!isAdmin && <button onClick={handleLeaveGroup}>Leave Group</button>}
    </div>
  );
}

export default GroupDetails;
