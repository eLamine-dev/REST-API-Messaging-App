import { useEffect, useState, useContext } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { AppContext } from "../utils/AppContext";

function ConversationList({ setConversation }) {
  const { state } = useContext(AppContext);
  const [privateConversations, setPrivateConversations] = useState([]);
  const [groupConversations, setGroupConversations] = useState([]);
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
        setPrivateConversations(response.data.privateConversations);
        setGroupConversations(response.data.groupConversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  const handleConversationClick = (conversationId, conversationType) => {
    console.log(conversationId, conversationType);

    setConversation((prev) => ({
      ...prev,
      type: conversationType,
      id: conversationId,
    }));
  };

  const createGroup = async () => {
    if (!groupName.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/api/conversations/create-group",
        { name: groupName, memberIds: [] },
        { headers: { Authorization: `${state.token}` } }
      );

      setGroupName("");
      alert("Group created!");
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <div className="conversation-list">
      <div className="section">
        <h3>Private Conversations</h3>
        {privateConversations.length === 0 ? (
          <p>No private conversations.</p>
        ) : (
          privateConversations.map((conversation) => (
            <div
              key={conversation.id}
              className="conversation-item"
              onClick={() =>
                handleConversationClick(conversation.id, "private")
              }
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
        {groupConversations.length === 0 ? (
          <p>No group conversations.</p>
        ) : (
          groupConversations.map((conversation) => (
            <div
              key={conversation.id}
              className="conversation-item"
              onClick={() => handleConversationClick(conversation.id, "group")}
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
