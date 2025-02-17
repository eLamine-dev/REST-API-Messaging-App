import { useContext, useEffect } from "react";
import { AppContext } from "../utils/AppContext";
import FriendList from "./FriendList";
import UserDetail from "./UserDetails";
import GroupDetails from "./GroupDetails";

function Sidebar() {
  const { chatState, friendsState, chatDispatch, friendsDispatch, setUiState } =
    useContext(AppContext);
  const { selectedConversationId } = chatState;
  const { selectedUser } = friendsState;

  useEffect(() => {
    if (selectedUser) {
      chatDispatch({ type: "SET_SELECTED_CONVERSATION", payload: null });
      setUiState({ isAddingMembers: false });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedConversationId)
      friendsDispatch({ type: "SET_SELECTED_USER", payload: null });
  }, [selectedConversationId]);

  return (
    <div className="sidebar">
      {selectedConversationId && <GroupDetails />}
      {selectedUser && <UserDetail />}
      <FriendList />
    </div>
  );
}

export default Sidebar;
