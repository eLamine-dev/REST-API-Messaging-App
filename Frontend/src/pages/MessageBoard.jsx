import axios from "axios";
import { useState } from "react";
import ChatArea from "../components/ChatArea";
import FriendList from "../components/FriendList";
import ConversationList from "../components/ConversationList";
import Sidebar from "../components/Navbar";
import UserDetail from "../components/UserDetails";
import { useContext, useEffect } from "react";

import { AppContext } from "../utils/AppContext";

function MessageBoard() {
  const { state, userConversations, setUserConversations } =
    useContext(AppContext);
  const [currConversationId, setCurrConversationId] = useState(null);
  const [conversation, setConversation] = useState(null);

  const [isAddingMembers, setAddingMembers] = useState(false);
  const [isRemovingMembers, setRemovingMembers] = useState(false);

  useEffect(() => {
    if (userConversations.chatRoom) return;
    const getChatRoomId = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/conversations/get-chatroom",
          { headers: { Authorization: `${state.token}` } }
        );
        console.log("Fetched chat room ID:", response.data);

        setUserConversations((prev) => ({
          ...prev,
          chatRoom: response.data,
        }));
        setCurrConversationId((prev) => prev || response.data);
      } catch (error) {
        console.error("Error fetching chat room ID:", error);
      }
    };

    getChatRoomId();
  }, [state.token]);

  const handleAddMember = async (user) => {
    if (!currConversationId) return;

    try {
      await axios.post(
        `http://localhost:5000/api/conversations/members/${currConversationId}`,
        { userId: user.id },
        { headers: { Authorization: `${state.token}` } }
      );
    } catch (error) {
      console.error("Error adding member:", error);
    }

    setConversation((prev) => ({
      ...prev,
      members: [...prev.members, user],
    }));
  };

  const handleRemoveMember = async (user) => {
    if (!currConversationId) return;

    try {
      await axios.post(
        `http://localhost:5000/api/conversations/members/remove/${currConversationId}`,
        { userId: user.id },
        { headers: { Authorization: `${state.token}` } }
      );
    } catch (error) {
      console.error("Error removing member:", error);
    }

    setConversation((prev) => ({
      ...prev,
      members: prev.members.filter((member) => member.id !== user.id),
    }));
  };

  return (
    <div className="message-board">
      <ConversationList
        setCurrConversationId={setCurrConversationId}
        userConversations={userConversations}
        setUserConversations={setUserConversations}
      />

      <ChatArea
        chatRoomId={userConversations.chatRoom}
        currConversationId={currConversationId}
        setCurrConversationId={setCurrConversationId}
        setUserConversations={setUserConversations}
        setAddingMembers={setAddingMembers}
        setRemovingMembers={setRemovingMembers}
        isAddingMembers={isAddingMembers}
        isRemovingMembers={isRemovingMembers}
        conversation={conversation}
        setConversation={setConversation}
      />
    </div>
  );
}

export default MessageBoard;
