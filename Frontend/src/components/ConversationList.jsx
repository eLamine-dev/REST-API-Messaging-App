import { useContext, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../utils/AppContext";
import useConversations from "../hooks/useConversations";

function ConversationList() {
  const { authState, chatState, chatDispatch } = useContext(AppContext);
  const { privateConversations, groupConversations } = chatState;

  const { fetchConversations } = useConversations();

  useEffect(() => {
    if (authState.token) {
      fetchConversations();
    }
  }, [authState.token]);

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
            onClick={() =>
              chatDispatch({
                type: "SET_CURRENT_CONVERSATION",
                payload: conversation,
              })
            }
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
            onClick={() =>
              chatDispatch({
                type: "SET_CURRENT_CONVERSATION",
                payload: conversation,
              })
            }
          >
            <p>{conversation.name}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ConversationList;
