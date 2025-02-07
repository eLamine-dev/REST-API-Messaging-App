import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

function Layout() {
  const [selectedTab, setSelectedTab] = useState("messages");

  const [isAddingMembers, setAddingMembers] = useState(false);
  const [isRemovingMembers, setRemovingMembers] = useState(false);

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
      <Sidebar
        isAddingMembers={isAddingMembers}
        isRemovingMembers={isRemovingMembers}
        setAddingMembers={setAddingMembers}
        setRemovingMembers={setRemovingMembers}
      />
    </div>
  );
}

export default Layout;
