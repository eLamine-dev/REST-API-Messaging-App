import { useState, useContext, useEffect } from "react";
import { AppContext } from "../utils/AppContext";
import axios from "axios";
import useFriendActions from "../hooks/useFriendActions";

function UserDetail() {
  const { authState, friendsState, friendsDispatch } = useContext(AppContext);
  const { selectedUserId, acceptedRequests, pendingRequests } = friendsState;
  const {
    sendFriendRequest,
    acceptRequest,
    cancelRequest,
    rejectRequest,
    deleteFriend,
  } = useFriendActions();

  const [selectedUser, setSelectedUser] = useState(null);
  const [relatedRequest, setRelatedRequest] = useState("none");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedUserId) return;

    const findRelatedRequest = () => {
      return (
        acceptedRequests.find(
          (r) =>
            r.receiver?.id === selectedUserId || r.sender?.id === selectedUserId
        ) ||
        pendingRequests.sent.find((r) => r.receiver.id === selectedUserId) ||
        pendingRequests.received.find((r) => r.sender.id === selectedUserId) ||
        null
      );
    };

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${selectedUserId}`,
          {
            headers: { Authorization: authState.token },
          }
        );
        setSelectedUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    setRelatedRequest(findRelatedRequest());
    fetchUserDetails().then(() => setIsLoading(false));
  }, [selectedUserId, acceptedRequests, pendingRequests]);

  if (isLoading) return <div>Loading...</div>;
  if (!selectedUser) return <div>User not found</div>;

  const isFriend = relatedRequest?.status == "ACCEPTED";
  const receivedRequest =
    relatedRequest?.status == "PENDING" &&
    relatedRequest.sender?.id == selectedUserId;
  const sentRequest =
    relatedRequest?.status == "PENDING" &&
    relatedRequest.receiver?.id == selectedUserId;

  return (
    <div className="user-detail">
      <h2>{selectedUser.username}</h2>
      <p>Email: {selectedUser.email}</p>
      <p>Status: {selectedUser.status}</p>
      <p>Bio: {selectedUser.bio || "No bio available"}</p>

      {isFriend && (
        <button onClick={() => deleteFriend(relatedRequest.id)}>
          Unfriend
        </button>
      )}
      {receivedRequest && (
        <>
          <button onClick={() => acceptRequest(relatedRequest.id)}>
            Accept Friend Request
          </button>
          <button onClick={() => rejectRequest(relatedRequest.id)}>
            Reject
          </button>
        </>
      )}
      {sentRequest && (
        <button onClick={() => cancelRequest(relatedRequest.id)}>
          Cancel Request
        </button>
      )}
      {!relatedRequest && (
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
