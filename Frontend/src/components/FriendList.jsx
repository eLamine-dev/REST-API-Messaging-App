import { useState, useEffect, useContext } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { AppContext } from "../utils/AppContext";
import UserCard from "./UserCard";

function FriendList({ setConversation }) {
  const [friends, setFriends] = useState([]);
  const { state } = useContext(AppContext);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/friends",

          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        setFriends(response.data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends();
  }, []);

  const handleClickOnUser = async (friendId) => {
    console.log("friendId", friendId);
    try {
      const conversation = await axios.get(
        `http://localhost:5000/api/conversations/getFriendConversation/${friendId}`,
        { headers: { Authorization: `${state.token}` } }
      );

      setConversation((prev) => ({
        ...prev,
        type: "private",
        id: conversation.data.id,
      }));
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  return (
    <div className="friend-list">
      <h3>Friends</h3>
      {friends.length === 0 ? (
        <p>No friends to display.</p>
      ) : (
        friends.map((friend) => (
          <UserCard
            key={friend.id}
            user={friend}
            onClick={() => handleClickOnUser(friend.id)}
          />
        ))
      )}
    </div>
  );
}

export default FriendList;
