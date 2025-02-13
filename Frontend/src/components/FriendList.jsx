import { useContext } from "react";
import { AppContext } from "../utils/AppContext";
import useFriendActions from "../hooks/useFriendActions";
import useConversations from "../hooks/useConversations";

function FriendList() {
  const { friendsState, uiState, chatState } = useContext(AppContext);
  const { openUserDetails } = useFriendActions();
  const { addMember } = useConversations();
  const { friends } = friendsState;

  return (
    <div className="friend-list">
      <h3>Friends</h3>
      {friends.length === 0 ? (
        <p>No friends to display.</p>
      ) : (
        friends.map((friend) => (
          <>
            <div key={friend.id} className="friend-item">
              <p>
                {/* <span onClick={() => openUserDetails(friend.id)}> */}
                <span>{friend.status === "ONLINE" ? "🟢" : "⚪"}</span>
                {friend.username}
              </p>
            </div>
            {uiState.isAddingMembers && (
              <button
                onClick={() =>
                  addMember(chatState.selectedConversation.id, friend)
                }
              >
                +
              </button>
            )}
          </>
        ))
      )}
    </div>
  );
}

export default FriendList;
