import { useContext, useEffect } from "react";
import axios from "axios";
import ChatArea from "../components/ChatArea";
import ConversationList from "../components/ConversationList";
import { AppContext } from "../utils/AppContext";

function MessageBoard() {
  const { authState, chatState, chatDispatch } = useContext(AppContext);

  useEffect(() => {
    if (!chatState.currentConversation) {
      chatDispatch({
        type: "SET_CURRENT_CONVERSATION",
        payload: chatState.chatRoom,
      });
    }
  }, [chatState.currentConversation]);

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
          payload: response.data.id,
        });
      } catch (error) {
        console.error("Error fetching chat room:", error);
      }
    };

    fetchChatRoom();
  }, [authState.token]);

  return (
    <div className="message-board">
      <ConversationList />
      <ChatArea />
    </div>
  );
}

export default MessageBoard;
