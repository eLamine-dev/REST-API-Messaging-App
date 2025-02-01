import { useState, useEffect, useContext } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { AppContext } from "../utils/AppContext";
import UserCard from "./UserCard";

function FriendList({
  setSelectedUser,
  isAddingMembers,
  isRemovingMembers,
  onAddMember,
  onRemoveMember,
}) {
  const [friends, setFriends] = useState([]);
  const { state } = useContext(AppContext);

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
            <p onClick={() => setSelectedUser(friend)}>{friend.username}</p>
            {isAddingMembers && (
              <button onClick={() => onAddMember(friend.id)}>+</button>
            )}
            {isRemovingMembers && (
              <button onClick={() => onRemoveMember(friend.id)}>-</button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default FriendList;
