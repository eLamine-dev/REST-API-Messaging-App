import { useState, useContext, useEffect } from "react";
import { AppContext } from "../utils/AppContext";
import axios from "axios";

function UserDetail() {
  const { authState, friendsState, friendsDispatch } = useContext(AppContext);
  const { selectedUser } = friendsState;
  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedUser) return;

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${selectedUser.id}`,
          { headers: { Authorization: `${authState.token}` } }
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

  const sendFriendRequest = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/friends",
        { receiverId: selectedUser.id },
        { headers: { Authorization: `${authState.token}` } }
      );
      alert("Friend request sent!");
      const response = await axios.get(
        "http://localhost:5000/api/friends/requests",
        {
          headers: { Authorization: authState.token },
        }
      );
      friendsDispatch({ type: "SET_FRIEND_REQUESTS", payload: response.data });
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="user-detail">
      <h2>{userDetails.username}</h2>
      <p>Email: {userDetails.email}</p>
      <p>Status: {userDetails.status}</p>
      <p>Bio: {userDetails.bio || "No bio available"}</p>
      {userDetails.isFriend ? (
        <button>Remove Friend</button>
      ) : (
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
