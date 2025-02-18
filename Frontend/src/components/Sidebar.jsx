import { useContext, useEffect } from "react";
import { AppContext } from "../utils/AppContext";
import FriendList from "./FriendList";
import UserDetail from "./UserDetails";
import GroupDetails from "./GroupDetails";

function Sidebar() {
  const { chatState, friendsState, chatDispatch, friendsDispatch, setUiState } =
    useContext(AppContext);
  const { selectedConversationId } = chatState;
  const { selectedUserId } = friendsState;

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
      {selectedConversationId && <GroupDetails />}
      {selectedUserId && <UserDetail />}
      <FriendList />
    </div>
  );
}

export default Sidebar;
