import { useContext } from "react";
import { AppContext } from "../utils/AppContext";
import useFriendActions from "../hooks/useFriendActions";

function FriendList() {
  const { friendsState, friendsDispatch } = useContext(AppContext);
  const { openUserDetails } = useFriendActions();
  const { friends } = friendsState;

  return (
    <div className="friend-list">
      <h3>Friends</h3>
      {friends.length === 0 ? (
        <p>No friends to display.</p>
      ) : (
        friends.map((friend) => (
          <div
            key={friend.id}
            className="friend-item"
            onClick={() => openUserDetails(friend.id)}
          >
            <p>
              <span>{friend.status === "ONLINE" ? "🟢" : "⚪"}</span>
              {friend.username}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default FriendList;
