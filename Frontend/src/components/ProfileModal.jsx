import PropTypes from "prop-types";
import axios from "axios";
import { useState, useContext } from "react";
import { AppContext } from "../utils/AppContext";

function ProfileModal({ userId, onClose }) {
  const [userInfo, setUserInfo] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { state } = useContext(AppContext);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/profile/${userId}`,
        { headers: { Authorization: `${state.token}` } }
      );
      setUserInfo(response.data);
      setIsFriend(response.data.isFriend);
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendFriendRequest = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/friends",
        { receiverId: userId },
        { headers: { Authorization: `${state.token}` } }
      );
      alert("Friend request sent!");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  useState(() => {
    fetchUserInfo();
  }, [userId]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="profile-modal">
      <button className="close-btn" onClick={onClose}>
        Close
      </button>
      {userInfo ? (
        <div>
          <h2>{userInfo.username}</h2>
          <p>Email: {userInfo.email}</p>
          <p>Status: {userInfo.status}</p>
          <p>Bio: {userInfo.bio || "No bio available"}</p>
          {!isFriend && (
            <button onClick={sendFriendRequest}>Send Friend Request</button>
          )}
        </div>
      ) : (
        <p>User not found.</p>
      )}
    </div>
  );
}

ProfileModal.propTypes = {
  userId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProfileModal;
