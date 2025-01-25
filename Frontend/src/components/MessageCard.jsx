import PropTypes from "prop-types";

function MessageCard({ message, isCurrentUser }) {
  return (
    <div className={`message-card ${isCurrentUser ? "current-user" : ""}`}>
      <p className="message-sender">{message.sender.username}</p>
      <p className="message-content">{message.content}</p>
    </div>
  );
}

MessageCard.propTypes = {
  message: PropTypes.shape({
    sender: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  isCurrentUser: PropTypes.bool,
};

export default MessageCard;
