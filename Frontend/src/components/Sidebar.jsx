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
  const { selectedUser, setSelectedUser, selectedGroup, setSelectedGroup } =
    useContext(AppContext);

  useEffect(() => {
    if (selectedUser) {
      setSelectedGroup(null);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedGroup) {
      setSelectedUser(null);
    }
  }, [selectedGroup]);

  return (
    <div className="sidebar">
      {selectedGroup && (
        <GroupDetails
          group={selectedGroup}
          setSelectedGroup={setSelectedGroup}
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
