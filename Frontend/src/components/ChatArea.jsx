import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../utils/AppContext";

function ChatArea() {
  const [messages, setMessages] = useState([]);
  const { state } = useContext(AppContext);

  useEffect(() => {
    if (!state.conversation) return;

    const fetchConversationMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/conversations/messages/${state.conversation.id}`,
          { headers: { Authorization: `${state.token}` } }
        );

        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching conversation messages:", error);
      }
    };

    fetchConversationMessages();
  }, [state.conversation, state.token]);

  if (!state.conversation?.id) {
    return <p>Loading chat room...</p>;
  }

  return (
    <div className="chat-area">
      {state.conversation.id ? (
        <>
          <h2>Chat Room</h2>
          <div className="messages">
            {messages.map((msg) => (
              <div key={msg.id} className="message">
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Loading chat room...</p>
      )}
    </div>
  );
}

export default ChatArea;
