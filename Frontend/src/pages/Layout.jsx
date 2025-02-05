import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

function Layout() {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState("messages");

  return (
    <div className="app-layout">
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
