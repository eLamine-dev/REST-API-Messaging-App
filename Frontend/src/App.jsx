import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth';
import MessageBoard from './pages/MessageBoard';

import './App.css';

function App() {
   const token = localStorage.getItem('token');

   return (
      <BrowserRouter>
         <Routes>
            <Route path="/auth" element={<AuthPage />} />

            <Route
               path="/messages"
               element={token ? <MessageBoard /> : <Navigate to="/auth" />}
            />
            <Route
               path="/"
               element={
                  token ? <Navigate to="/messages" /> : <Navigate to="/auth" />
               }
            />
         </Routes>
      </BrowserRouter>
   );
}

export default App;
