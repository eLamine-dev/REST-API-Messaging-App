import { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../utils/AppContext";
import useConversations from "../hooks/useConversations";

function GroupDetails({ selectedConversation }) {
  const { authState, chatState, chatDispatch, setUiState } =
    useContext(AppContext);

  const { selectedConversationId, privateConversations, groupConversations } =
    chatState;
  const { renameGroup, removeMember, leaveGroup, deleteConversation } =
    useConversations();

  const isAdmin = selectedConversation.adminId === authState.user.id;

  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState(selectedConversation.name);

  const handleSave = async () => {
    await renameGroup(selectedConversation.id, groupName);
    setIsEditing(false);
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
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <h2>
          {selectedConversation.name}
          {""}
          {isAdmin && <button onClick={() => setIsEditing(true)}>✏️</button>}
        </h2>
      )}
      {!selectedConversation.isChatRoom && selectedConversation.isGroup && (
        <>
          <h3>Members</h3>
          <ul>
            {selectedConversation.members.map((member) => (
              <li key={member.id}>
                {member.username}
                {isAdmin && member.id !== authState.user.id && (
                  <button
                    onClick={() => {
                      removeMember(selectedConversation.id, member.id);
                    }}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {isAdmin && (
        <>
          <button
            onClick={() => {
              deleteConversation(selectedConversation.id);
              chatDispatch({
                type: "SET_SELECTED_CONVERSATION",
                payload: null,
              });
            }}
          >
            Delete Group
          </button>
          <button
            onClick={() =>
              setUiState((prev) => ({ ...prev, isAddingMembers: true }))
            }
          >
            Add Members
          </button>
        </>
      )}

      {!isAdmin && (
        <button
          onClick={() => {
            leaveGroup(selectedConversationId);
            chatDispatch({ type: "SET_SELECTED_CONVERSATION", payload: null });
          }}
        >
          Leave Group
        </button>
      )}
    </div>
  );
}

export default GroupDetails;
