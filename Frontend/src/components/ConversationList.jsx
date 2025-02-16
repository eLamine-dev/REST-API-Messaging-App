import { useContext } from "react";
import useConversations from "../hooks/useConversations";
import { AppContext } from "../utils/AppContext";

function ConversationList() {
  const { chatState } = useContext(AppContext);
  const { privateConversations, groupConversations } = chatState;
  const { openConversation } = useConversations();

  return (
    <div className="conversation-list">
      <h3>Private Conversations</h3>
      {privateConversations.length === 0 ? (
        <p>No private conversations.</p>
      ) : (
        privateConversations.map((conversation) => (
          <div
            key={conversation.id}
            className="conversation-item"
            onClick={() => openConversation(conversation)}
          >
            <p>
              {conversation.name ||
                conversation.members.map((m) => m.username).join(", ")}
            </p>
          </div>
        ))
      )}

      <h3>Group Conversations</h3>
      {groupConversations.length === 0 ? (
        <p>No group conversations.</p>
      ) : (
        groupConversations.map((conversation) => (
          <div
            key={conversation.id}
            className="conversation-item"
            onClick={() => openConversation(conversation)}
          >
            <p>{conversation.name}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ConversationList;
