import { useState, useContext, useEffect } from "react";
import { AppContext } from "../utils/AppContext";
import useFriendActions from "../hooks/useFriendActions";

function UserDetail() {
  const { authState, friendsState, friendsDispatch } = useContext(AppContext);
  const { selectedUserId, userCache, friendRequests } = friendsState;
  const { sendFriendRequest, acceptRequest, deleteFriendship } =
    useFriendActions();

  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedUserId) return;

    let user =
      userCache[selectedUserId] ||
      friendRequests.find((r) => r.sender.id === selectedUserId)?.sender ||
      friendRequests.find((r) => r.receiver.id === selectedUserId)?.receiver;

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
        friendsDispatch({ type: "CACHE_USER_DETAILS", payload: response.data });
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [selectedUserId, friendRequests, userCache]);

  if (isLoading) return <div>Loading...</div>;
  if (!selectedUser) return <div>User not found</div>;

  const acceptedRequest = friendRequests.find(
    (req) =>
      req.status === "ACCEPTED" &&
      (req.sender.id === selectedUser.id || req.receiver.id === selectedUser.id)
  );
  const sentRequest = friendRequests.find(
    (req) => req.status === "PENDING" && req.sender.id === selectedUser.id
  );
  const receivedRequest = friendRequests.find(
    (req) => req.status === "PENDING" && req.receiver.id === selectedUser.id
  );

  return (
    <div className="user-detail">
      <h2>{selectedUser.username}</h2>
      <p>Email: {selectedUser.email}</p>
      {acceptedRequest && (
        <button onClick={() => deleteFriendship(acceptedRequest.id)}>
          Unfriend
        </button>
      )}
      {receivedRequest && (
        <>
          <button onClick={() => acceptRequest(receivedRequest.id)}>
            Accept
          </button>
          <button onClick={() => deleteFriendship(receivedRequest.id)}>
            Reject
          </button>
        </>
      )}
      {!acceptedRequest && !sentRequest && !receivedRequest && (
        <button onClick={() => sendFriendRequest(selectedUser.id)}>
          Send Friend Request
        </button>
      )}
    </div>
  );
}

export default UserDetail;
