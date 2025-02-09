import { useContext, useEffect } from "react";
import axios from "axios";
import { AppContext } from "../utils/AppContext";

function ConversationList() {
  const { authState, chatState, chatDispatch } = useContext(AppContext);
  const { privateConversations, groupConversations } = chatState;

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/conversations/user",
          {
            headers: { Authorization: authState.token },
          }
        );
        chatDispatch({
          type: "SET_CONVERSATIONS",
          payload: {
            private: response.data.privateConversations,
            group: response.data.groupConversations,
          },
        });
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
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
