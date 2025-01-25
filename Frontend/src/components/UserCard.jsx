import PropTypes from "prop-types";

function UserCard({ user, onClick }) {
  return (
    <div className="user-card" onClick={onClick}>
      <div
        className={`user-status ${
          user.status === "ONLINE" ? "online" : "offline"
        }`}
      ></div>
      <p>{user.username}</p>
    </div>
  );
}

UserCard.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
};

export default UserCard;
