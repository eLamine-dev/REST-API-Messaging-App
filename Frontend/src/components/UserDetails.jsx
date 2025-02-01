import { useState, useContext, useEffect } from "react";
import { AppContext } from "../utils/AppContext";
import axios from "axios";

function UserDetail({ user, setSelectedUser }) {
  const { state } = useContext(AppContext);
  const [userDetails, setUserDetails] = useState({});
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${user.id}`,
          { headers: { Authorization: `${state.token}` } }
        );
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [user]);

  const sendFriendRequest = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/friends",
        { receiverId: user.id },
        {
          headers: { Authorization: `${state.token}` },
        }
      );
      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const startConversation = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/conversations/getFriendConversation/${user.id}`,
        {
          headers: { Authorization: `${state.token}` },
        }
      );
      alert("Conversation started!");
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  if (isloading) return <div>Loading...</div>;

  return (
    <div className="user-detail">
      {/* <img src={user.profilePic || "default.png"} alt="Profile" /> */}

      <div>
        <h2>{userDetails.username}</h2>
        <p>Email: {userDetails.email}</p>
        <p>Status: {userDetails.status}</p>
        <p>Bio: {userDetails.bio || "No bio available"}</p>
        {userDetails.isFriend ? (
          <button>Remove Friend</button>
        ) : (
          <button onClick={sendFriendRequest}>Send Friend Request</button>
        )}
        <button onClick={startConversation}>Start Conversation</button>
        <button onClick={() => setSelectedUser(null)}>Close</button>
      </div>
    </div>
  );
}

export default UserDetail;
