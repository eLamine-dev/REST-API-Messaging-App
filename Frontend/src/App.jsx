import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from './utils/AppContext';
import AuthPage from './pages/Auth';
import MessageBoard from './pages/MessageBoard';

function App() {
   const { state } = useContext(AppContext);
   const { token } = state;

   return (
      <BrowserRouter>
         <Routes>
            <Route
               path="/auth"
               element={token ? <Navigate to="/messages" /> : <AuthPage />}
            />

            <Route
               path="/messages"
               element={token ? <MessageBoard /> : <Navigate to="/auth" />}
            />

            <Route
               path="/"
               element={<Navigate to={token ? '/messages' : '/auth'} />}
            />
         </Routes>
      </BrowserRouter>
   );
}

export default App;
