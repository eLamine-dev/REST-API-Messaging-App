import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';

import AuthPage from './pages/Auth';
import MessageBoard from './pages/MessageBoard';
import { useEffect, useContext } from 'react';
import axios from 'axios';
import { AppContext } from './utils/AppContext';

function App() {
   const token = localStorage.getItem('token');
   const { state, setState } = useContext(AppContext);

   useEffect(() => {
      const validateToken = async () => {
         const token = localStorage.getItem('token');

         if (!token) return;

         try {
            const response = await axios.get(
               'http://localhost:5000/api/auth/validate-token',
               {
                  headers: {
                     Authorization: `${token}`,
                  },
               }
            );

            setState((prevState) => ({
               ...prevState,
               token,
               user: response.data.user,
            }));
         } catch (error) {
            localStorage.removeItem('token');

            console.error('Error validating token:', error);
         }
      };
      validateToken();
   }, []);

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
