import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

function Layout() {
  const [selectedTab, setSelectedTab] = useState("messages");

  return (
    <div className="app-layout">
      <Navbar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="content">
        <Outlet
          context={{
            isAddingMembers,
            setAddingMembers,
            isRemovingMembers,
            setRemovingMembers,
          }}
        />
      </div>
      <Sidebar />
    </div>
  );
}

export default Layout;
