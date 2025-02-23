import { useContext, useEffect, useState } from "react";
import { AppContext } from "../utils/AppContext";
import FriendList from "./FriendList";
import UserDetail from "./UserDetails";
import GroupDetails from "./GroupDetails";
import axios from "axios";

function Sidebar() {
  const {
    authState,
    chatState,
    friendsState,
    chatDispatch,
    friendsDispatch,
    setUiState,
  } = useContext(AppContext);
  const { selectedConversationId, privateConversations, groupConversations } =
    chatState;
  const { selectedUserId } = friendsState;
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    const conversation =
      privateConversations.find((conv) => conv.id === selectedConversationId) ||
      groupConversations.find((conv) => conv.id === selectedConversationId) ||
      null;

    const fetchConversation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${selectedUserId}`,
          {
            headers: { Authorization: authState.token },
          }
        );
        setSelectedConversation(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (conversation) {
      setSelectedConversation(conversation);
      return;
    }

    fetchConversation();
  }, [selectedConversationId, privateConversations, groupConversations]);

  useEffect(() => {
    if (selectedUserId) {
      chatDispatch({ type: "SET_SELECTED_CONVERSATION", payload: null });
      setUiState({ isAddingMembers: false });
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (selectedConversationId)
      friendsDispatch({ type: "SET_SELECTED_USER", payload: null });
  }, [selectedConversationId]);

  return (
    <div className="sidebar">
      {selectedConversation && (
        <GroupDetails selectedConversation={selectedConversation} />
      )}
      {selectedUserId && <UserDetail />}
      <FriendList selectedConversation={selectedConversation} />
    </div>
  );
}

export default Sidebar;
