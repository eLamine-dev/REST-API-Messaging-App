import { useContext, useEffect } from "react";
import { AppContext } from "../utils/AppContext";

import FriendList from "./FriendList";
import UserDetail from "./UserDetails";
import GroupDetails from "./GroupDetails";

function Sidebar({
  setAddingMembers,
  setRemovingMembers,
  isAddingMembers,
  isRemovingMembers,
}) {
  const {
    selectedUser,
    setSelectedUser,
    selectedConversation,
    setSelectedConversation,
  } = useContext(AppContext);

  useEffect(() => {
    if (selectedUser) {
      setSelectedConversation(null);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedConversation) {
      setSelectedUser(null);
    }
  }, [selectedConversation]);

  return (
    <div className="sidebar">
      {selectedConversation && (
        <GroupDetails
          group={selectedConversation}
          setSelectedConversation={setSelectedConversation}
        />
      )}
      {selectedUser && (
        <UserDetail user={selectedUser} setSelectedUser={setSelectedUser} />
      )}

      <FriendList
        setSelectedUser={setSelectedUser}
        isAddingMembers={isAddingMembers}
        isRemovingMembers={isRemovingMembers}
        setAddingMembers={setAddingMembers}
        setRemovingMembers={setRemovingMembers}
      />
    </div>
  );
}

export default Sidebar;
