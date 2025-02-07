import { useEffect, useState, useContext } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { AppContext } from "../utils/AppContext";

function ConversationList({
  onConversationClick,
  userConversations,
  setUserConversations,
}) {
  const { state } = useContext(AppContext);

  const [groupName, setGroupName] = useState("");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/conversations/user",

          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        setUserConversations(response.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  //TODO: move this groups page
  const createGroup = async () => {
    if (!groupName.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/conversations",
        { name: groupName, isGroup: true, memberIds: [state.user.id] },
        { headers: { Authorization: `${state.token}` } }
      );

      setGroupName("");

      setUserConversations((prev) => ({
        ...prev,
        groupConversations: [
          ...prev.groupConversations,
          { ...response.data, messages: [] },
        ],
      }));
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <div className="conversation-list">
      <div className="section">
        <h3>Private Conversations</h3>
        {userConversations.privateConversations.length === 0 ? (
          <p>No private conversations.</p>
        ) : (
          userConversations.privateConversations.map((conversation) => (
            <div
              key={conversation.id}
              className="conversation-item"
              onClick={() => onConversationClick(conversation.id)}
            >
              <p>
                {conversation.name ||
                  conversation.members.map((m) => m.username).join(", ")}
              </p>
              {conversation.messages[0] && (
                <p className="last-message">
                  {/* {conversation.messages[0].content} */}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      <div className="section">
        <h3>Group Conversations</h3>
        <div className="create-group">
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button onClick={createGroup}>Create Group</button>
        </div>
        {userConversations.groupConversations.length === 0 ? (
          <p>No group conversations.</p>
        ) : (
          userConversations.groupConversations.map((conversation) => (
            <div
              key={conversation.id}
              className="conversation-item"
              onClick={() => onConversationClick(conversation.id)}
            >
              <p>{conversation.name}</p>

              {conversation.messages[0] && (
                <p className="last-message">
                  {/* {conversation.messages[0].content} */}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ConversationList;
