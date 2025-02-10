import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../utils/AppContext";
import useFriendActions from "../hooks/useFriendActions";

function FriendsPage() {
  const { authState, friendsState, friendsDispatch } = useContext(AppContext);
  const {
    sendFriendRequest,
    acceptRequest,
    cancelRequest,
    rejectRequest,
    deleteFriend,
  } = useFriendActions();

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

      <h3>Pending Requests</h3>
      {friendsState.pendingRequests.sent.length === 0 &&
      friendsState.pendingRequests.received.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <>
          <h4>Sent Requests</h4>
          {friendsState.pendingRequests.sent.map((request) => (
            <div
              key={request.id}
              className="request-item"
              onClick={() => {
                friendsDispatch({
                  type: "SET_SELECTED_USER",
                  payload: request.receiver,
                });
              }}
            >
              <p>{request.receiver.username}</p>
              <button onClick={() => cancelRequest(request.id)}>Cancel</button>
            </div>
          ))}

          <h4>Received Requests</h4>
          {friendsState.pendingRequests.received.map((request) => (
            <div
              key={request.id}
              className="request-item"
              onClick={() =>
                friendsDispatch({
                  type: "SET_SELECTED_USER",
                  payload: request.sender,
                })
              }
            >
              <p>{request.sender.username}</p>
              <button onClick={() => acceptRequest(request.id)}>Accept</button>
              <button onClick={() => rejectRequest(request.id)}>Reject</button>
            </div>
          ))}
        </>
      )}

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
