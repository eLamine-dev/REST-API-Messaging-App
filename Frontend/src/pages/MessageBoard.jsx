import { useContext, useEffect, useState } from "react";
import axios from "axios";
import ChatArea from "../components/ChatArea";
import ConversationList from "../components/ConversationList";
import { AppContext } from "../utils/AppContext";
import { useOutletContext } from "react-router-dom";

function MessageBoard() {
  const { authState, chatState, chatDispatch } = useContext(AppContext);
  const {
    setAddingMembers,
    setRemovingMembers,
    isAddingMembers,
    isRemovingMembers,
  } = useOutletContext();
  const [chatRoom, setChatRoom] = useState(null);

  useEffect(() => {
    if (chatRoom) return;

    const fetchChatRoom = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/conversations/chatroom",
          {
            headers: { Authorization: authState.token },
          }
        );

        setChatRoom(response.data);
        chatDispatch({ type: "SET_CHATROOM", payload: response.data });
      } catch (error) {
        console.error("Error fetching chat room:", error);
      }
    };

    fetchChatRoom();
  }, [authState.token]);

  const handleConversationClick = async (conversation) => {
    chatDispatch({ type: "SET_SELECTED_CONVERSATION", payload: conversation });
  };

  return (
    <div className="message-board">
      <ConversationList onConversationClick={handleConversationClick} />
      <ChatArea
        setAddingMembers={setAddingMembers}
        setRemovingMembers={setRemovingMembers}
        isAddingMembers={isAddingMembers}
        isRemovingMembers={isRemovingMembers}
      />
    </div>
  );
}

export default MessageBoard;
