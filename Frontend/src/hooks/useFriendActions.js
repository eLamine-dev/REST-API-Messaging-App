import { useContext } from "react";
import axios from "axios";
import { AppContext } from "../utils/AppContext";

export default function useFriendActions() {
  const { authState, friendsDispatch } = useContext(AppContext);

  const sendFriendRequest = async (userId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/friends",
        { receiverId: userId },
        { headers: { Authorization: authState.token } }
      );

      friendsDispatch({ type: "SET_FRIEND_REQUESTS", payload: response.data });
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/friends/accept/${requestId}`,
        {},
        { headers: { Authorization: authState.token } }
      );
      friendsDispatch({
        type: "ACCEPT_FRIEND_REQUEST",
        payload: response.data,
      });
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const deleteRequest = async (requestId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/friends/delete/${requestId}`,
        {
          headers: { Authorization: authState.token },
        }
      );

      friendsDispatch({ type: "REJECT_FRIEND_REQUEST", payload: requestId });
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  const deleteFriend = async (friendId, requestId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/friends/delete/${requestId}`,
        {
          headers: { Authorization: authState.token },
        }
      );
      friendsDispatch({ type: "DELETE_FRIEND", payload: friendId });
    } catch (error) {
      console.error("Error deleting friend:", error);
    }
  };

  return { sendFriendRequest, acceptRequest, deleteRequest, deleteFriend };
}
