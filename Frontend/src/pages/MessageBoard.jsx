import { useState } from 'react';
import axios from 'axios';
import ChatArea from '../components/ChatArea';
import FriendList from '../components/FriendList';
import ConversationList from '../components/ConversationList';

function MessageBoard() {
   const [chat, setChat] = useState({ type: 'private', id: null });

   const handleLogout = async () => {
      try {
         await axios.post('http://localhost:5000/api/auth/logout');
         localStorage.removeItem('token');
         window.location.href = '/';
      } catch (error) {
         console.error('Logout failed:', error);
         alert('Logout failed, please try again.');
      }
   };

   return (
      <div className="message-board">
         <div className="header">
            <h1>Message Board</h1>
            <button onClick={handleLogout}>Logout</button>
         </div>
         <div className="main-content">
            <FriendList setConversationType={setChat} />
            <ConversationList setConversationType={setChat} />
            <ChatArea chat={chat} />
         </div>
      </div>
   );
}

export default MessageBoard;
