import { useState, useContext, useEffect } from "react";
import { AppContext } from "../utils/AppContext";
import axios from "axios";
import useFriendActions from "../hooks/useFriendActions";

function UserDetail() {
  const { authState, friendsState, friendsDispatch } = useContext(AppContext);
  const { selectedUserId, friends } = friendsState;
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

    // Check if the user exists in friends list
    let user = friends.find((f) => f.id === selectedUserId);

    if (user) {
      setSelectedUser(user);
      setIsLoading(false);
      return;
    }

    // Fetch user details if not found locally
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${selectedUserId}`,
          {
            headers: { Authorization: authState.token },
          }
        );
        setSelectedUser(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [selectedUserId, friends, authState.token]);

  if (isLoading) return <div>Loading...</div>;
  if (!selectedUser) return <div>User not found</div>;

  return (
    <div className="user-detail">
      <h2>{selectedUser.username}</h2>
      <p>Email: {selectedUser.email}</p>
      <p>Status: {selectedUser.status}</p>
      <p>Bio: {selectedUser.bio || "No bio available"}</p>

      {selectedUser.friendship?.status === "ACCEPTED" && (
        <button
          onClick={() =>
            deleteFriend(selectedUser.id, selectedUser.friendship.id)
          }
        >
          Unfriend
        </button>
      )}

      {selectedUser.friendship?.status === "PENDING" &&
        selectedUser.friendship.senderId === selectedUser.id && (
          <button onClick={() => rejectRequest(selectedUser.friendship.id)}>
            Reject Friend Request
          </button>
        )}

      {selectedUser.friendship?.status === "PENDING" &&
        selectedUser.friendship.receiverId === selectedUser.id && (
          <button onClick={() => cancelRequest(selectedUser.friendship.id)}>
            Cancel Friend Request
          </button>
        )}

      {selectedUser.friendship?.status === "PENDING" &&
        selectedUser.friendship.receiverId !== selectedUser.id && (
          <button onClick={() => acceptRequest(selectedUser.friendship.id)}>
            Accept Friend Request
          </button>
        )}

      {!selectedUser.friendship?.status && (
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
