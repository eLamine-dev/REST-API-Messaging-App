import { useState, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { AppContext } from "../utils/AppContext";

function ProfileModal({ user, onClose, onUpdate }) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const { state } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        "http://localhost:5000/api/users/profile",
        { username, email },
        { headers: { Authorization: `${state.token}` } }
      );
      onUpdate({ username, email });
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="profile-modal">
      <div className="modal-content">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

ProfileModal.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default ProfileModal;
