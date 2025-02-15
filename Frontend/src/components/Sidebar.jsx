import { useContext, useEffect } from "react";
import { AppContext } from "../utils/AppContext";
import FriendList from "./FriendList";
import UserDetail from "./UserDetails";
import GroupDetails from "./GroupDetails";

function Sidebar() {
  const { chatState, friendsState, chatDispatch, friendsDispatch, setUiState } =
    useContext(AppContext);
  const { selectedConversation } = chatState;
  const { selectedUser } = friendsState;

  useEffect(() => {
    if (selectedUser) {
      chatDispatch({ type: "SET_SELECTED_CONVERSATION", payload: null });
      setUiState({ isAddingMembers: false });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedConversation)
      friendsDispatch({ type: "SET_SELECTED_USER", payload: null });
  }, [selectedConversation]);

  return (
    <div className="sidebar">
      {selectedConversation && <GroupDetails />}
      {selectedUser && <UserDetail />}
      <FriendList />
    </div>
  );
}

export default Sidebar;
