import axios from 'axios';
import { useState } from 'react';
import ChatArea from '../components/ChatArea';
import UserList from '../components/UsersList';
import GroupList from '../components/GroupList';

function MessageBoard() {
   const [chat, setChat] = useState({
      type: 'chat-room',
      id: null,
   });

   async function logout() {
      try {
         const token = localStorage.getItem('token');

         await axios.post(
            'http://localhost:5000/api/auth/logout',
            {},
            {
               headers: {
                  Authorization: `${token}`,
               },
            }
         );
         localStorage.removeItem('token');
         window.location.href = '/';
      } catch (error) {
         console.error('Logout failed:', error);
         alert('Logout failed, please try again.');
      }
   }

   return (
      <div className="message-board">
         <div className="header">
            <h1>Message Board</h1>
            <h3>Welcome, {localStorage.getItem('username')}</h3>
            <button onClick={logout}>Logout</button>
         </div>

         <UserList openDM={setChat} />
         <GroupList openGroup={setChat} />
         <ChatArea chat={chat} />
      </div>
   );
}

export default MessageBoard;
