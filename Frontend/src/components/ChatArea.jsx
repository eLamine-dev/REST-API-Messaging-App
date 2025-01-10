import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

function ChatArea({ chat }) {
   const [conversation, setConversation] = useState(null);
   const [messages, setMessages] = useState([]);

   useEffect(() => {
      const fetchConversation = async () => {
         try {
            const response = await axios.get(`/conversation/${chat.id}`);
            setConversation(response.data);
            setMessages(response.data.messages);
         } catch (error) {
            console.error('Error fetching conversation:', error);
         }
      };
      fetchConversation();
   }, [chat.id]);

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
         {conversation && (
            <>
               <div className="conversation-header">
                  <h2>{conversation.name}</h2>
                  {conversation.isGroup && <p>Group Chat</p>}
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

ChatArea.propTypes = {
   chat: PropTypes.shape({
      type: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
   }).isRequired,
};

export default ChatArea;
