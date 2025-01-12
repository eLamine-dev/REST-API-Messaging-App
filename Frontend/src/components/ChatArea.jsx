import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { AppContext } from '../utils/AppContext';

function ChatArea({ chat }) {
   const [messages, setMessages] = useState([]);
   const { state, setState } = useContext(AppContext);

   useEffect(() => {
      const fetchConversationMessages = async () => {
         try {
            const response = await axios.get(
               `http://localhost:5000/api/conversations/messages/:id${state.conversation.id}`
            );

            setMessages(response.data.messages);
         } catch (error) {
            console.error('Error fetching conversation:', error);
         }
      };
      fetchConversationMessages();
   }, [state.conversation.id]);

   const handleSendMessage = async (e) => {
      e.preventDefault();
      const content = e.target.elements.message.value;

      try {
         const response = await axios.post(`/messages`, {
            content,
            conversationId: chat.id,
         });
         setMessages([...messages, response.data]);
         e.target.reset();
      } catch (error) {
         console.error('Error sending message:', error);
      }
   };

   return (
      <div className="chat-area">
         {state.conversation.id && (
            <>
               <div className="conversation-header">
                  <h2>{state.conversation.name}</h2>
                  {state.conversation.isGroup && <p>Group Chat</p>}
               </div>
               <div className="messages">
                  {messages.length === 0 ? (
                     <p>No messages yet.</p>
                  ) : (
                     messages.map((msg) => (
                        <div key={msg.id} className="message">
                           {msg.imageUrl ? (
                              <img src={msg.imageUrl} alt="Sent" />
                           ) : (
                              <p>{msg.content}</p>
                           )}
                        </div>
                     ))
                  )}
               </div>
               <form onSubmit={handleSendMessage}>
                  <input
                     type="text"
                     name="message"
                     placeholder="Type a message"
                     required
                  />
                  <button type="submit">Send</button>
               </form>
            </>
         )}
      </div>
   );
}

export default ChatArea;
