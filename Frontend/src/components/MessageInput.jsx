import { useState, useContext } from "react";
import useConversations from "../hooks/useConversations";
import { AppContext } from "../utils/AppContext";

function MessageInput() {
  const [message, setMessage] = useState("");
  const { chatState } = useContext(AppContext);
  const { sendMessage } = useConversations();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    await sendMessage(chatState.currConversation.id, message);
    setMessage("");
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

export default MessageInput;
