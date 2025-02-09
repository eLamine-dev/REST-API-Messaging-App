import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../utils/AppContext";

function FriendsPage() {
  const { authState, friendsState, friendsDispatch } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/friends/requests",
          {
            headers: { Authorization: authState.token },
          }
        );
        friendsDispatch({
          type: "SET_FRIEND_REQUESTS",
          payload: response.data,
        });
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    fetchFriendRequests();
  }, [authState.token]);

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/search?query=${searchQuery}`,
        { headers: { Authorization: authState.token } }
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/friends",
        { receiverId: userId },
        { headers: { Authorization: authState.token } }
      );
      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  return (
    <div className="friends-page">
      <h2>Find Friends</h2>
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={searchUsers}>Search</button>

      <h3>Search Results</h3>
      {searchResults.map((user) => (
        <div key={user.id} className="user-item">
          <p>{user.username}</p>
          <button onClick={() => sendFriendRequest(user.id)}>
            Send Friend Request
          </button>
        </div>
      ))}

      <h2>Your Friends</h2>
      {friendsState.friends.length === 0 ? (
        <p>No friends yet</p>
      ) : (
        friendsState.friends.map((friend) => (
          <div
            key={friend.id}
            className="friend-item"
            onClick={() =>
              friendsDispatch({ type: "SET_SELECTED_USER", payload: friend })
            }
          >
            <p>{friend.username}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default FriendsPage;
