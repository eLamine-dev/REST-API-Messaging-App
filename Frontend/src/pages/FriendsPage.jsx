import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../utils/AppContext";

function FriendsPage() {
  const { state, setSelectedUser, friends } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState(null);

  useEffect(() => {
    fetchFriendRequests();
  }, [state.token]);

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/friends/requests",
        {
          headers: { Authorization: `${state.token}` },
        }
      );

      console.log(response.data);

      setFriendRequests(response.data);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/search?query=${searchQuery}`,
        { headers: { Authorization: `${state.token}` } }
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
        { headers: { Authorization: `${state.token}` } }
      );
      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/friends/accept/${requestId}`,
        {},
        {
          headers: { Authorization: `${state.token}` },
        }
      );
      fetchFriendRequests();
      fetchFriends();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/friends/reject/${requestId}`,
        {},
        {
          headers: { Authorization: `${state.token}` },
        }
      );
      fetchFriendRequests();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
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

      {friendRequests && (
        <div>
          {friendRequests.sent.length !== 0 && (
            <div>
              <h2>Sent Requests</h2>
              {friendRequests.sent.map((request) => (
                <div key={request.id} className="friend-request-item">
                  <p>{request.receiver.username} didn&apos;t respont yet</p>
                  <button onClick={() => acceptRequest(request.id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {friendRequests.received.length !== 0 && (
            <div>
              <h2>Received Requests</h2>
              {friendRequests.received.map((request) => (
                <div key={request.id} className="friend-request-item">
                  <p>{request.sender.username} sent you a request</p>
                  <button onClick={() => acceptRequest(request.id)}>
                    Accept
                  </button>
                  <button onClick={() => rejectRequest(request.id)}>
                    Reject
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <h2>Your Friends</h2>
      {friends.length === 0 ? (
        <p>No friends yet</p>
      ) : (
        friends.map((friend) => (
          <div
            key={friend.id}
            className="friend-item"
            onClick={() => setSelectedUser(friend)}
          >
            <p>{friend.username}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default FriendsPage;
