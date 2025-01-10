import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

function ConversationList({ setConversationType }) {
   const [privateConversations, setPrivateConversations] = useState([]);
   const [groupConversations, setGroupConversations] = useState([]);

   useEffect(() => {
      const fetchConversations = async () => {
         try {
            const token = localStorage.getItem('token');
            console.log('token:', token);

            const response = await axios.get(
               'http://localhost:5000/api/conversation/user/',

               {
                  headers: {
                     Authorization: `${token}`,
                  },
               }
            );
            setPrivateConversations(response.data.privateConversations);
            setGroupConversations(response.data.groupConversations);
         } catch (error) {
            console.error('Error fetching conversations:', error);
         }
      };

      fetchConversations();
   }, []);

   return (
      <div className="conversation-list">
         <div className="section">
            <h3>Private Conversations</h3>
            {privateConversations.length === 0 ? (
               <p>No private conversations.</p>
            ) : (
               privateConversations.map((conversation) => (
                  <div
                     key={conversation.id}
                     className="conversation-item"
                     onClick={() =>
                        setConversationType({
                           type: 'private',
                           id: conversation.id,
                        })
                     }
                  >
                     <p>
                        {conversation.name ||
                           conversation.members
                              .map((m) => m.username)
                              .join(', ')}
                     </p>
                     {conversation.messages[0] && (
                        <p className="last-message">
                           {conversation.messages[0].content}
                        </p>
                     )}
                  </div>
               ))
            )}
         </div>

         <div className="section">
            <h3>Group Conversations</h3>
            {groupConversations.length === 0 ? (
               <p>No group conversations.</p>
            ) : (
               groupConversations.map((conversation) => (
                  <div
                     key={conversation.id}
                     className="conversation-item"
                     onClick={() =>
                        setConversationType({
                           type: 'group',
                           id: conversation.id,
                        })
                     }
                  >
                     <p>{conversation.name}</p>
                     {conversation.messages[0] && (
                        <p className="last-message">
                           {conversation.messages[0].content}
                        </p>
                     )}
                  </div>
               ))
            )}
         </div>
      </div>
   );
}

ConversationList.propTypes = {
   setConversationType: PropTypes.func.isRequired,
};

export default ConversationList;
