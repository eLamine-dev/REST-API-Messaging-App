import { useState, useContext, useEffect } from "react";
import { AppContext } from "../utils/AppContext";
import axios from "axios";
import useFriendActions from "../hooks/useFriendActions";

function UserDetail() {
  const { authState, friendsState, friendsDispatch } = useContext(AppContext);
  const { selectedUser } = friendsState;
  const {
    sendFriendRequest,
    acceptRequest,
    cancelRequest,
    rejectRequest,
    deleteFriend,
  } = useFriendActions();
  // const [selectedUser, setselectedUser] = useState({});
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   if (!selectedUser) return;

  //   const fetchselectedUser = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:5000/api/users/${selectedUser.id}`,
  //         { headers: { Authorization: authState.token } }
  //       );
  //       setselectedUser(response.data);
  //     } catch (error) {
  //       console.error("Error fetching user info:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchselectedUser();
  // }, [selectedUser, authState.token]);

  // if (isLoading) return <div>Loading...</div>;

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
