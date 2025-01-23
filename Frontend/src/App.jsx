import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

import AuthPage from "./pages/Auth";
import MessageBoard from "./pages/MessageBoard";
import { useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "./utils/AppContext";

function App() {
  const { state, setState } = useContext(AppContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={state.token ? <Navigate to="/messages" /> : <AuthPage />}
        />

        <Route
          path="/messages"
          element={state.token ? <MessageBoard /> : <Navigate to="/auth" />}
        />

        <Route
          path="/"
          element={<Navigate to={state.token ? "/messages" : "/auth"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
