import { useContext } from "react";
import { AppContext } from "../utils/AppContext";
import axios from "axios";

function UserDetail({ user, setSelectedUser }) {
  const { state } = useContext(AppContext);

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

  return (
    <div className="user-detail">
      {/* <img src={user.profilePic || "default.png"} alt="Profile" /> */}
      <h3>{user.username}</h3>
      <p>Status: {user.status}</p>
      <button onClick={sendFriendRequest}>Send Friend Request</button>
      <button onClick={startConversation}>Start Conversation</button>
      <button onClick={() => setSelectedUser(null)}>Close</button>
    </div>
  );
}

export default UserDetail;
