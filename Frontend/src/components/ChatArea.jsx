import { useContext, useEffect } from "react";
import { AppContext } from "../utils/AppContext";
import MessageCard from "./MessageCard";
import MessageInput from "./MessageInput";
import useConversations from "../hooks/useConversations";

function ChatArea() {
  const { chatState, chatDispatch } = useContext(AppContext);
  const { currConversationId, privateConversations, groupConversations } =
    chatState;
  const { fetchConversationMessages, openConversationDetails } =
    useConversations();

  const currConversation =
    privateConversations.find((conv) => conv.id === currConversationId) ||
    groupConversations.find((conv) => conv.id === currConversationId);

  useEffect(() => {
    if (!currConversationId) return;
    fetchConversationMessages(currConversationId);
  }, [currConversationId]);

  if (!currConversation) {
    return (
      <div className="chat-area">Select a conversation to start chatting</div>
    );
  }

  return (
    <div className="chat-area">
      <h2>{currConversation.name}</h2>
      <button onClick={() => openConversationDetails(currConversation)}>
        settings
      </button>
      <div className="messages">
        {currConversation.messages?.map((msg) => (
          <MessageCard key={msg.id} message={msg} />
        ))}
      </div>
      <MessageInput conversationId={currConversation.id} />
    </div>
  );
}

export default ChatArea;
