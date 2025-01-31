import axios from "axios";
import { useState } from "react";
import ChatArea from "../components/ChatArea";
import FriendList from "../components/FriendList";
import ConversationList from "../components/ConversationList";
import Sidebar from "../components/Sidebar";
import UserDetail from "../components/UserDetails";
import { useContext, useEffect } from "react";

import { AppContext } from "../utils/AppContext";

function MessageBoard() {
  const [selectedTab, setSelectedTab] = useState("messages");
  const [selectedUser, setSelectedUser] = useState(null);
  const { state } = useContext(AppContext);
  const [currConversationId, setCurrConversationId] = useState(null);
  const [userConversations, setUserConversations] = useState({
    privateConversations: [],
    groupConversations: [],
  });

  useEffect(() => {
    if (currConversationId !== null) return;

    const getChatRoomId = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/conversations/get-chatroom",
          { headers: { Authorization: `${state.token}` } }
        );
        console.log("Fetched chat room ID:", response.data);
        setCurrConversationId(response.data);
      } catch (error) {
        console.error("Error fetching chat room ID:", error);
      }
    };

    getChatRoomId();
  }, [currConversationId, state.token]);

  return (
    <div className="message-board">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

      <ConversationList
        setCurrConversationId={setCurrConversationId}
        userConversations={userConversations}
        setUserConversations={setUserConversations}
      />

      <ChatArea
        currConversationId={currConversationId}
        setCurrConversationId={setCurrConversationId}
        setUserConversations={setUserConversations}
      />
      {selectedUser ? (
        <UserDetail user={selectedUser} setSelectedUser={setSelectedUser} />
      ) : (
        <FriendList setSelectedUser={setSelectedUser} />
      )}
    </div>
  );
}

export default MessageBoard;
