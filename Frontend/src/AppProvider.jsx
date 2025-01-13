import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { AppContext } from './utils/AppContext';

export const AppProvider = ({ children }) => {
   const [state, setState] = useState({
      token: null,
      user: null,
      conversation: { type: 'chat-room', id: null },
   });

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
               user: response.data,
            }));
         } catch (error) {
            localStorage.removeItem('token');

            console.error('Error validating token:', error);
         }
      };
      validateToken();
   }, []);

   return (
      <AppContext.Provider value={{ state, setState }}>
         {children}
      </AppContext.Provider>
   );
};
AppProvider.propTypes = {
   children: PropTypes.node.isRequired,
};

export default AppProvider;
