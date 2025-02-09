import { useContext, useEffect } from "react";
import { AppContext } from "../utils/AppContext";
import MessageCard from "./MessageCard";
import MessageInput from "./MessageInput";

function ChatArea() {
  const { authState, chatState, chatDispatch } = useContext(AppContext);
  const { currConversation } = chatState;

  useEffect(() => {
    if (!currConversation) {
      chatDispatch({
        type: "SET_CURRENT_CONVERSATION",
        payload: chatState.chatRoom,
      });
    }
  }, [authState.token, currConversation]);

  if (!currConversation) {
    return <div className="chat-area">Loading...</div>;
  }

  return (
    <div className="chat-area">
      <h2>{currConversation.name}</h2>
      <div className="messages">
        {currConversation.messages.map((msg) => (
          <MessageCard key={msg.id} message={msg} />
        ))}
      </div>
      <MessageInput conversationId={currConversation.id} />
    </div>
  );
}

export default ChatArea;
