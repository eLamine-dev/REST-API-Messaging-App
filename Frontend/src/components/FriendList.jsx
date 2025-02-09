import { useContext } from "react";
import { AppContext } from "../utils/AppContext";

function FriendList() {
  const { friendsState, friendsDispatch } = useContext(AppContext);
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
            onClick={() =>
              friendsDispatch({ type: "SET_SELECTED_USER", payload: friend })
            }
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
