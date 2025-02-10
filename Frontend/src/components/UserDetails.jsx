import { useState, useContext, useEffect } from "react";
import { AppContext } from "../utils/AppContext";
import axios from "axios";
import useFriendActions from "../hooks/useFriendActions";

function UserDetail() {
  const { authState, friendsState, friendsDispatch } = useContext(AppContext);
  const { selectedUser } = friendsState;
  const { sendFriendRequest, acceptRequest, deleteRequest, deleteFriend } =
    useFriendActions();
  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${selectedUser.id}`,
          { headers: { Authorization: authState.token } }
        );
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [selectedUser, authState.token]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="user-detail">
      <h2>{userDetails.username}</h2>
      <p>Email: {userDetails.email}</p>
      <p>Status: {userDetails.status}</p>
      <p>Bio: {userDetails.bio || "No bio available"}</p>

      {userDetails.friendship?.status === "ACCEPTED" && (
        <button
          onClick={() =>
            deleteFriend(userDetails.id, userDetails.friendship.id)
          }
        >
          Unfriend
        </button>
      )}

      {userDetails.friendship?.status === "PENDING" && (
        <>
          <button onClick={() => deleteRequest(userDetails.friendship.id)}>
            {userDetails.friendship.senderId === userDetails.id
              ? "Reject Friend Request"
              : "Cancel Friend Request"}
          </button>
          {userDetails.friendship.receiverId !== userDetails.id && (
            <button onClick={() => acceptRequest(userDetails.friendship.id)}>
              Accept Friend Request
            </button>
          )}
        </>
      )}

      {!userDetails.friendship?.status && (
        <button onClick={sendFriendRequest}>Send Friend Request</button>
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
