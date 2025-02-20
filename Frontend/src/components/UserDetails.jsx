import { useState, useContext, useEffect } from "react";
import { AppContext } from "../utils/AppContext";
import axios from "axios";
import useFriendActions from "../hooks/useFriendActions";

function UserDetail() {
  const { authState, friendsState, friendsDispatch } = useContext(AppContext);
  const { selectedUserId, friends, pendingRequests } = friendsState;
  const {
    sendFriendRequest,
    acceptRequest,
    cancelRequest,
    rejectRequest,
    deleteFriend,
  } = useFriendActions();

  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedUserId) return;

    let user =
      friends.find((f) => f.id === selectedUserId) ||
      pendingRequests.sent.find((r) => r.receiver.id === selectedUserId)
        ?.receiver ||
      pendingRequests.received.find((r) => r.sender.id === selectedUserId)
        ?.sender;

    if (user) {
      setSelectedUser(user);
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${selectedUserId}`,
          { headers: { Authorization: authState.token } }
        );
        setSelectedUser(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [selectedUserId, friends, pendingRequests, authState.token]);

  if (isLoading) return <div>Loading...</div>;
  if (!selectedUser) return <div>User not found</div>;

  const isFriend = friends.some((f) => f.id === selectedUserId);
  const sentRequest = pendingRequests.sent.find(
    (r) => r.receiver.id === selectedUser.id
  );
  const receivedRequest = pendingRequests.received.find(
    (r) => r.sender.id === selectedUser.id
  );

  return (
    <div className="user-detail">
      <h2>{selectedUser.username}</h2>
      <p>Email: {selectedUser.email}</p>
      <p>Status: {selectedUser.status}</p>
      <p>Bio: {selectedUser.bio || "No bio available"}</p>

      {isFriend && (
        <button onClick={() => deleteFriend(selectedUserId)}>Unfriend</button>
      )}
      {receivedRequest && (
        <>
          <button onClick={() => acceptRequest(receivedRequest.id)}>
            Accept Friend Request
          </button>
          <button onClick={() => rejectRequest(receivedRequest.id)}>
            Reject
          </button>
        </>
      )}
      {sentRequest && (
        <button onClick={() => cancelRequest(sentRequest.id)}>
          Cancel Request
        </button>
      )}
      {!isFriend && !sentRequest && !receivedRequest && (
        <button onClick={() => sendFriendRequest(selectedUser.id)}>
          Send Friend Request
        </button>
      )}

      <button
        onClick={() =>
          friendsDispatch({ type: "SET_SELECTED_USER", payload: null })
        }
      >
        Close
      </button>
    </div>
  );
}

export default UserDetail;
