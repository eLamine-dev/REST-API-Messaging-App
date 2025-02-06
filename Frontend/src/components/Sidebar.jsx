import { useContext } from "react";
import { AppContext } from "../utils/AppContext";

import FriendList from "./FriendList";
import UserDetail from "./UserDetails";
import GroupDetails from "./GroupDetails";

function Sidebar({}) {
  const { selectedUser, setSelectedUser, selectedGroup, setSelectedGroup } =
    useContext(AppContext);
  return (
    <div className="sidebar">
      {selectedGroup ? (
        <GroupDetails
          group={selectedGroup}
          setSelectedGroup={setSelectedGroup}
        />
      ) : selectedUser ? (
        <UserDetail user={selectedUser} setSelectedUser={setSelectedUser} />
      ) : (
        <FriendList setSelectedUser={setSelectedUser} />
      )}
    </div>
  );
}

export default Sidebar;
