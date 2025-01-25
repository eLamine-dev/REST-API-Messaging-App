import PropTypes from "prop-types";
import axios from "axios";

function FriendRequest({ request, onUpdate }) {
  const handleAccept = async () => {
    try {
      await axios.post(`http://localhost:5000/api/friends/accept`, {
        friendId: request.id,
      });
      onUpdate();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDecline = async () => {
    try {
      await axios.post(`http://localhost:5000/api/friends/decline`, {
        friendId: request.id,
      });
      onUpdate();
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  return (
    <div className="friend-request">
      <p>{request.username} wants to be your friend.</p>
      <button onClick={handleAccept}>Accept</button>
      <button onClick={handleDecline}>Decline</button>
    </div>
  );
}

FriendRequest.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default FriendRequest;
