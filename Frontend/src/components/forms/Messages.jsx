import { useEffect, useState } from 'react';
import axios from 'axios';

function Messages() {
   const [messages, setMessages] = useState([]);

   useEffect(() => {
      const fetchMessages = async () => {
         const token = localStorage.getItem('token');
         const response = await axios.get(
            'http://localhost:5000/api/messages',
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );
         setMessages(response.data);
      };
      fetchMessages();
   }, []);

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

export default Messages;
