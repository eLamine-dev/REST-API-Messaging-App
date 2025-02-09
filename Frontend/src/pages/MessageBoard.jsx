import { useContext, useEffect } from "react";
import axios from "axios";
import ChatArea from "../components/ChatArea";
import ConversationList from "../components/ConversationList";
import { AppContext } from "../utils/AppContext";

function MessageBoard() {
  const { authState, chatState, chatDispatch, uiState, setUiState } =
    useContext(AppContext);

  useEffect(() => {
    if (!authState.token || chatState.chatRoom) return;

    const fetchChatRoom = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/conversations/chatroom",
          {
            headers: { Authorization: authState.token },
          }
        );
        chatDispatch({ type: "SET_CHATROOM", payload: response.data });
        chatDispatch({
          type: "SET_CURRENT_CONVERSATION",
          payload: response.data,
        });
      } catch (error) {
        console.error("Error fetching chat room:", error);
      }
    };

    fetchChatRoom();
  }, [authState.token]);

  const handleConversationClick = (conversation) => {
    chatDispatch({ type: "SET_SELECTED_CONVERSATION", payload: conversation });
  };

  return (
    <div className="message-board">
      <ConversationList onConversationClick={handleConversationClick} />
      <ChatArea />
    </div>
  );
}

export default MessageBoard;
