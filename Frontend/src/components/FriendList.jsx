import { useState, useEffect, useContext } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { AppContext } from "../utils/AppContext";
import UserCard from "./UserCard";

function FriendList({
  isAddingMembers,
  isRemovingMembers,
  onAddMember,
  onRemoveMember,
  conversationMembers,
}) {
  const [friends, setFriends] = useState([]);
  const { state, setSelectedUser } = useContext(AppContext);

  const isMember = (userId) => {
    return conversationMembers.some((member) => member.id === userId);
  };

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/friends", {
          headers: { Authorization: `${state.token}` },
        });
        setFriends(response.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends();
  }, [state.token]);

  return (
    <div className="friend-list">
      <h3>Friends</h3>
      {friends.length === 0 ? (
        <p>No friends to display.</p>
      ) : (
        friends.map((friend) => (
          <div key={friend.id} className="friend-item">
            <p onClick={() => setSelectedUser(friend)}>
              <span>{friend.status === "ONLINE" ? "🟢" : "⚪"}</span>
              {friend.username}
            </p>
            {isAddingMembers && !isMember(friend.id) && (
              <button onClick={() => onAddMember(friend)}>+</button>
            )}
            {isRemovingMembers && isMember(friend.id) && (
              <button onClick={() => onRemoveMember(friend)}>-</button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default FriendList;
