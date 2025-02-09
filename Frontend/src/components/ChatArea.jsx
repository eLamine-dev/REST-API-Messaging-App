import { useContext } from "react";
import { AppContext } from "../utils/AppContext";
import MessageCard from "./MessageCard";
import MessageInput from "./MessageInput";

function ChatArea() {
  const { authState, chatState, chatDispatch } = useContext(AppContext);
  const { selectedConversation } = chatState;

  if (!selectedConversation) return <p>Loading chat...</p>;

  return (
    <div className="chat-area">
      <h2>{selectedConversation.name}</h2>
      <div className="messages">
        {selectedConversation.messages.map((msg) => (
          <MessageCard key={msg.id} message={msg} />
        ))}
      </div>
      <MessageInput conversationId={selectedConversation.id} />
    </div>
  );
}

export default ChatArea;
