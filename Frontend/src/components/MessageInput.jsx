import { useState, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { AppContext } from "../utils/AppContext";

function MessageInput({ conversationId, onSend }) {
  const [message, setMessage] = useState("");
  const { state } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await axios.post(
        `http://localhost:5000/api/messages/send/${conversationId}`,
        { content: message },
        { headers: { Authorization: `${state.token}` } }
      );
      onSend();
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

MessageInput.propTypes = {
  conversationId: PropTypes.number.isRequired,
  onSend: PropTypes.func.isRequired,
};

export default MessageInput;
