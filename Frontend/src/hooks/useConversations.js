import { useContext } from "react";
import axios from "axios";
import { AppContext } from "../utils/AppContext";

export default function useConversations() {
  const { authState, chatState, chatDispatch } = useContext(AppContext);

  const createConversation = async (name, isGroup) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/conversations",
        { name, isGroup },
        { headers: { Authorization: authState.token } }
      );
      chatDispatch({ type: "CREATE_CONVERSATION", payload: response.data });
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

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

  const fetchConversationMessages = async (conversationId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/conversations/messages/${conversationId}`,
        { headers: { Authorization: authState.token } }
      );

      chatDispatch({
        type: "UPDATE_CONVERSATION_MESSAGES",
        payload: { conversationId, messages: response.data.messages },
      });

      chatDispatch({
        type: "SET_CURRENT_CONVERSATION",
        payload: conversationId,
      });
    } catch (error) {
      console.error("Error fetching conversation messages:", error);
    }
  };

  const openConversation = async (conversation) => {
    chatDispatch({
      type: "SET_CURRENT_CONVERSATION",
      payload: conversation.id,
    });
  };

  const sendMessage = async (conversationId, content) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/messages/send/${conversationId}`,
        { content },
        { headers: { Authorization: authState.token } }
      );

      chatDispatch({
        type: "ADD_MESSAGE",
        payload: { conversationId, message: response.data },
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const fetchChatRoom = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/conversations/chatroom",
        {
          headers: { Authorization: authState.token },
        }
      );

      chatDispatch({ type: "SET_CHATROOM", payload: response.data });
    } catch (error) {
      console.error("Error fetching chat room:", error);
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/conversations/delete/${conversationId}`,
        {},
        {
          headers: { Authorization: authState.token },
        }
      );

      chatDispatch({ type: "DELETE_CONVERSATION", payload: conversationId });
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const leaveGroup = async (groupId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/conversations/leave/${groupId}`,
        {},
        {
          headers: { Authorization: authState.token },
        }
      );

      chatDispatch({ type: "LEAVE_GROUP", payload: groupId });
    } catch (error) {
      console.error("Error leaving group:", error);
    }
  };

  const joinGroup = async (groupId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/conversations/members/${groupId}`,
        {},
        {
          headers: { Authorization: authState.token },
        }
      );
      chatDispatch({
        type: "ADD_MEMBER",
        payload: { groupId, userId: authState.user.id },
      });
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  const addMember = async (groupId, user) => {
    // const group = chatState.groupConversations.find((g) => g.id === groupId);
    // if (group.members.some((member) => member.id === user.id)) {
    //   console.warn("User is already a member.");
    //   return;
    // }
    try {
      await axios.post(
        `http://localhost:5000/api/conversations/members/${groupId}`,
        { userId: user.id },
        {
          headers: { Authorization: authState.token },
        }
      );

      chatDispatch({ type: "ADD_MEMBER", payload: { groupId, user } });
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const removeMember = async (groupId, userId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/conversations/members/remove/${groupId}`,
        { userId },
        {
          headers: { Authorization: authState.token },
        }
      );

      chatDispatch({ type: "REMOVE_MEMBER", payload: { groupId, userId } });
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  const renameGroup = async (groupId, newName) => {
    try {
      await axios.put(
        `http://localhost:5000/api/conversations/rename/${groupId}`,
        { name: newName },
        {
          headers: { Authorization: authState.token },
        }
      );
      chatDispatch({
        type: "SET_CONVERSATIONS",
        payload: {
          private: chatState.privateConversations,
          group: chatState.groupConversations.map((g) =>
            g.id === groupId ? { ...g, name: newName } : g
          ),
        },
      });
    } catch (error) {
      console.error("Error renaming group:", error);
    }
  };

  return {
    fetchConversations,
    fetchChatRoom,
    deleteConversation,
    leaveGroup,
    addMember,
    removeMember,
    createConversation,
    joinGroup,
    renameGroup,
    sendMessage,
    fetchConversationMessages,
    openConversation,
  };
}
