import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState, useContext } from "react";
import useAuth from "../hooks/useAuth";
import { AppContext } from "../utils/AppContext";

function Layout() {
  const { fetchUserProfile } = useAuth();
  const { authState } = useContext(AppContext);
  const [selectedTab, setSelectedTab] = useState("messages");

  useEffect(() => {
    if (!authState.token) {
      return;
    }
    fetchUserProfile(authState.token);
  }, [authState.token]);

  return (
    <div className="app-layout">
      <Navbar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="content">
        <Outlet />
      </div>
      <Sidebar />
    </div>
  );
}

export default Layout;
