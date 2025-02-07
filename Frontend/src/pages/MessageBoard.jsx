import axios from "axios";
import { useState } from "react";
import ChatArea from "../components/ChatArea";

import ConversationList from "../components/ConversationList";

import { useContext, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

import { AppContext } from "../utils/AppContext";

function MessageBoard() {
  const {
    state,
    userConversations,
    setUserConversations,
    setCurrConversation,
    currConversation,
  } = useContext(AppContext);

  const {
    setAddingMembers,
    setRemovingMembers,
    isAddingMembers,
    isRemovingMembers,
  } = useOutletContext();

  const [chatRoom, setChatRoom] = useState(null);

  useEffect(() => {
    if (chatRoom) return;

    const getChatRoom = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/conversations/chatroom",
          { headers: { Authorization: `${state.token}` } }
        );
        console.log("Fetched chat room :", response.data);

        setChatRoom(response.data);
        setCurrConversation(response.data);
      } catch (error) {
        console.error("Error fetching chat room ID:", error);
      }
    };

    getChatRoom();
  }, [state.token]);

  useEffect(() => {
    if (!currConversation) {
      setCurrConversation(chatRoom);
    }
  }, [currConversation]);

  const handleConversationClick = async (conversationId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/conversations/messages/${conversationId}`,
        { headers: { Authorization: `${state.token}` } }
      );

      setCurrConversation(response.data);
    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
  };

  // const fetchMessages = async (isMounted) => {
  //   if (!currConversationId) return;
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:5000/api/conversations/messages/${currConversationId}`,
  //       { headers: { Authorization: `${state.token}` } }
  //     );
  //     if (isMounted) {
  //       setConversation(response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching conversation messages:", error);
  //   }
  // };

  return (
    <div className="message-board">
      <ConversationList
        onConversationClick={handleConversationClick}
        userConversations={userConversations}
        setUserConversations={setUserConversations}
      />

      <ChatArea
        setUserConversations={setUserConversations}
        setAddingMembers={setAddingMembers}
        setRemovingMembers={setRemovingMembers}
        isAddingMembers={isAddingMembers}
        isRemovingMembers={isRemovingMembers}
        currConversation={currConversation}
      />
    </div>
  );
}

export default MessageBoard;
