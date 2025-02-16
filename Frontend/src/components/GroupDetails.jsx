import { useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../utils/AppContext";
import useConversations from "../hooks/useConversations";

function GroupDetails() {
  const { authState, chatState, chatDispatch, setUiState } =
    useContext(AppContext);

  const { selectedConversation } = chatState;
  const { renameGroup, removeMember } = useConversations();

  const [isEditing, setIsEditing] = useState(false);
  const [groupName, setGroupName] = useState(selectedConversation.name);

  const isAdmin = selectedConversation.adminId === authState.user.id;

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
          <button onClick>Delete Group</button>
          <button
            onClick={() =>
              setUiState((prev) => ({ ...prev, isAddingMembers: true }))
            }
          >
            Add Members
          </button>
        </>
      )}

      {!isAdmin && <button onClick>Leave Group</button>}
    </div>
  );
}

export default GroupDetails;
