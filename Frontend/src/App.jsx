import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { useContext } from "react";

import Layout from "./pages/Layout";
import AuthPage from "./pages/Auth";
import MessageBoard from "./pages/MessageBoard";
import FriendsPage from "./pages/FriendsPage";
import GroupsPage from "./pages/GroupsPage";

import { AppContext } from "./utils/AppContext";

function App() {
  const { state } = useContext(AppContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={state.token ? <Navigate to="/messages" /> : <AuthPage />}
        />

        {state.token && (
          <Route element={<Layout />}>
            <Route path="/messages" element={<MessageBoard />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="*" element={<Navigate to="/messages" />} />
          </Route>
        )}

        {!state.token && <Route path="*" element={<Navigate to="/auth" />} />}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
