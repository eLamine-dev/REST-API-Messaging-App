import { useContext } from "react";
import axios from "axios";
import { AppContext } from "../utils/AppContext";

export default function useFriendActions() {
  const { authState, friendsState, friendsDispatch } = useContext(AppContext);

  const sendFriendRequest = async (userId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/friends",
        { receiverId: userId },
        { headers: { Authorization: authState.token } }
      );
      friendsDispatch({ type: "SEND_FRIEND_REQUEST", payload: response.data });
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

  const deleteFriendship = async (requestId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/friends/delete/${requestId}`,
        { headers: { Authorization: authState.token } }
      );
      friendsDispatch({ type: "DELETE_FRIEND_REQUEST", payload: requestId });
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  const searchUsers = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/search?query=${searchQuery}`,
        { headers: { Authorization: authState.token } }
      );

      return response.data;
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const openUserDetails = async (userId) => {
    friendsDispatch({ type: "SET_SELECTED_USER", payload: userId });
  };

  return {
    sendFriendRequest,
    acceptRequest,
    deleteFriendship,
    searchUsers,
    openUserDetails,
  };
}
