import axios from 'axios';
import { useState } from 'react';
import ChatArea from '../components/ChatArea';
import FriendList from '../components/FriendList';
import ConversationList from '../components/ConversationList';
import { useContext } from 'react';

import { AppContext } from '../utils/AppContext';

import { useNavigate } from 'react-router-dom';

function MessageBoard() {
   const { state, setState } = useContext(AppContext);

   const navigate = useNavigate();

   async function logout() {
      try {
         await axios.post(
            'http://localhost:5000/api/auth/logout',
            {},
            {
               headers: {
                  Authorization: `${state.token}`,
               },
            }
         );

         setState((prevState) => ({
            ...prevState,
            token: null,
            user: null,
         }));

         localStorage.removeItem('token');
         navigate('/auth');
      } catch (error) {
         console.error('Logout failed:', error);
         alert('Logout failed, please try again.');
      }
   }

   return (
      <div className="message-board">
         <div className="header">
            <h1>Message Board</h1>
            {/* <h3>Welcome, {state.user.username}</h3> */}
            <button onClick={logout}>Logout</button>
         </div>

         <FriendList />
         <ConversationList />
         <ChatArea />
      </div>
   );
}

export default MessageBoard;
