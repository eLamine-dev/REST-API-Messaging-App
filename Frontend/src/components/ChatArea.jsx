import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

function ChatArea({ chat }) {
   const [messages, setMessages] = useState([]);

   useEffect(() => {
      const fetchMessages = async () => {
         try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
               `http://localhost:5000/api/messages/${chat.type}/${chat.id}`,
               {
                  headers: {
                     Authorization: `Bearer ${token}`,
                  },
               }
            );
            setMessages(response.data);
         } catch (error) {
            console.error('Error fetching messages:', error);
         }
      };
      fetchMessages();
   }, [chat]);

   return (
      <div className="messages">
         <h2>Messages</h2>
         {messages.map((msg) => (
            <div key={msg.id} className="message">
               <p>{msg.content}</p>
            </div>
         ))}
      </div>
   );
}
ChatArea.propTypes = {
   chat: PropTypes.shape({
      type: PropTypes.string.isRequired,
      id: PropTypes.string,
   }).isRequired,
};

export default ChatArea;
