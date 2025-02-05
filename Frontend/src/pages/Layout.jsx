import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

function Layout() {
  const [selectedTab, setSelectedTab] = useState("messages");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // const { state, setState } = useContext(AppContext);
  // const location = useLocation();

  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (!state.token) return;

  //   const fetchUserData = async () => {
  //     try {
  //       const [friendsRes, friendRequestsRes, groupsRes] = await Promise.all([
  //         axios.get("http://localhost:5000/api/friends", {
  //           headers: { Authorization: state.token },
  //         }),
  //         axios.get("http://localhost:5000/api/friends/requests", {
  //           headers: { Authorization: state.token },
  //         }),
  //         axios.get("http://localhost:5000/api/conversations/user-groups", {
  //           headers: { Authorization: state.token },
  //         }),
  //       ]);

  //       setState((prev) => ({
  //         ...prev,
  //         friends: friendsRes.data,
  //         friendRequests: friendRequestsRes.data,
  //         conversations: {
  //           ...prev.conversations,
  //           groupConversations: groupsRes.data,
  //         },
  //       }));
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   fetchUserData();
  // }, [state.token, setState]);

  return (
    <div className="app-layout">
      <Navbar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="content">
        <Outlet />
      </div>
      <Sidebar
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
      />
    </div>
  );
}

export default Layout;
