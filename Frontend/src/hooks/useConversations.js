import { useContext } from "react";
import axios from "axios";
import { AppContext } from "../utils/AppContext";

export function useConversations() {
  const { authState, chatState, chatDispatch } = useContext(AppContext);

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

  const selectConversation = (conversation) => {
    chatDispatch({ type: "SET_CURRENT_CONVERSATION", payload: conversation });
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

  const addMember = async (groupId, userId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/conversations/members/${groupId}`,
        { userId },
        {
          headers: { Authorization: authState.token },
        }
      );

      chatDispatch({ type: "ADD_MEMBER", payload: { groupId, userId } });
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

  //  FIXME : THIS
  // const handleRenameGroup = async () => {
  //   try {
  //     await axios.put(
  //       `http://localhost:5000/api/conversations/rename/${group.id}`,
  //       { name: groupName },
  //       { headers: { Authorization: authState.token } }
  //     );

  //     chatDispatch({
  //       type: "SET_CONVERSATIONS",
  //       payload: {
  //         private: chatState.privateConversations,
  //         group: chatState.groupConversations.map((g) =>
  //           g.id === group.id ? { ...g, name: groupName } : g
  //         ),
  //       },
  //     });

  //     setIsEditing(false);
  //   } catch (error) {
  //     console.error("Error renaming group:", error);
  //   }
  // };

  return {
    fetchConversations,
    fetchChatRoom,
    selectConversation,
    deleteConversation,
    leaveGroup,
    addMember,
    removeMember,
  };
}
