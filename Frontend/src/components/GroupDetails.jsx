import { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../utils/AppContext";

function GroupDetails({ group }) {
  const { state, setState, setSelectedGroup } = useContext(AppContext);
  const [newMember, setNewMember] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState(group.name);

  const isAdmin = group.adminId === state.user.id;

  // const handleAddMember = async (user) => {
  //   if (!currConversationId) return;

  //   try {
  //     await axios.post(
  //       `http://localhost:5000/api/conversations/members/${currConversationId}`,
  //       { userId: user.id },
  //       { headers: { Authorization: `${state.token}` } }
  //     );
  //   } catch (error) {
  //     console.error("Error adding member:", error);
  //   }

  //   setConversation((prev) => ({
  //     ...prev,
  //     members: [...prev.members, user],
  //   }));
  // };

  // const handleRemoveMember = async (user) => {
  //   if (!currConversationId) return;

  //   try {
  //     await axios.post(
  //       `http://localhost:5000/api/conversations/members/remove/${currConversationId}`,
  //       { userId: user.id },
  //       { headers: { Authorization: `${state.token}` } }
  //     );
  //   } catch (error) {
  //     console.error("Error removing member:", error);
  //   }

  //   setConversation((prev) => ({
  //     ...prev,
  //     members: prev.members.filter((member) => member.id !== user.id),
  //   }));
  // };

  //FIXME: handleAddMember and handleRemoveMember are not updating the conversation state correctly
  const handleAddMember = async () => {
    if (!newMember.trim()) return;
    try {
      await axios.post(
        `http://localhost:5000/api/conversations/members/${group.id}`,
        { userId: newMember },
        { headers: { Authorization: `${state.token}` } }
      );
      setState((prev) => ({
        ...prev,
        conversations: {
          ...prev.conversations,
          groupConversations: prev.conversations.groupConversations.map((g) =>
            g.id === group.id
              ? { ...g, members: [...g.members, { id: newMember }] }
              : g
          ),
        },
      }));
      setNewMember("");
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/conversations/members/remove/${group.id}`,
        { userId: memberId },
        { headers: { Authorization: `${state.token}` } }
      );
      setState((prev) => ({
        ...prev,
        conversations: {
          ...prev.conversations,
          groupConversations: prev.conversations.groupConversations.map((g) =>
            g.id === group.id
              ? { ...g, members: g.members.filter((m) => m.id !== memberId) }
              : g
          ),
        },
      }));
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/conversations/delete-group/${group.id}`,
        { headers: { Authorization: `${state.token}` } }
      );
      setState((prev) => ({
        ...prev,
        conversations: {
          ...prev.conversations,
          groupConversations: prev.conversations.groupConversations.filter(
            (g) => g.id !== group.id
          ),
        },
      }));
      setSelectedGroup(null);
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/conversations/leave/${group.id}`,
        {},
        { headers: { Authorization: `${state.token}` } }
      );
      setState((prev) => ({
        ...prev,
        conversations: {
          ...prev.conversations,
          groupConversations: prev.conversations.groupConversations.filter(
            (g) => g.id !== group.id
          ),
        },
      }));
      setSelectedGroup(null);
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

  const handleRenameGroup = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/conversations/rename/${group.id}`,
        { name: groupName },
        { headers: { Authorization: `${state.token}` } }
      );
      setState((prev) => ({
        ...prev,
        conversations: {
          ...prev.conversations,
          groupConversations: prev.conversations.groupConversations.map((g) =>
            g.id === group.id ? { ...g, name: groupName } : g
          ),
        },
      }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error renaming group:", error);
    }
  };

  return (
    <div className="group-details">
      <button onClick={() => setSelectedGroup(null)}>Close</button>

      {isEditing ? (
        <>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button onClick={handleRenameGroup}>Save</button>
        </>
      ) : (
        <h2>
          {group.name}{" "}
          {isAdmin && <button onClick={() => setIsEditing(true)}>✏️</button>}
        </h2>
      )}

      <h3>Members</h3>
      <ul>
        {group.members.map((member) => (
          <li key={member.id}>
            {member.username}
            {isAdmin && member.id !== state.user.id && (
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
