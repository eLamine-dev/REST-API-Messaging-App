import FriendList from "./FriendList";
import UserDetail from "./UserDetails";
import GroupDetails from "./GroupDetails";

function Sidebar({
  selectedUser,
  setSelectedUser,
  selectedGroup,
  setSelectedGroup,
}) {
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
