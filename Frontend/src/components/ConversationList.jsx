import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { AppContext } from '../utils/AppContext';

function ConversationList({}) {
   const [privateConversations, setPrivateConversations] = useState([]);
   const [groupConversations, setGroupConversations] = useState([]);
   const { state, setState } = useContext(AppContext);

   useEffect(() => {
      const fetchConversations = async () => {
         try {
            const token = localStorage.getItem('token');

            const response = await axios.get(
               'http://localhost:5000/api/conversations/user/',

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
                        setState((prevState) => ({
                           ...prevState,
                           conversation: {
                              type: 'private',
                              id: conversation.data.id,
                              isGroup: false,
                              name: conversation.name,
                           },
                        }))
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
                        setState((prevState) => ({
                           ...prevState,
                           conversation: {
                              type: 'group',
                              id: conversation.data.id,
                              isGroup: false,
                              name: conversation.name,
                           },
                        }))
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

export default ConversationList;
