import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { AppContext } from '../utils/AppContext';

function FriendList() {
   const [friends, setFriends] = useState([]);
   const { state, setState } = useContext(AppContext);

   useEffect(() => {
      const fetchFriends = async () => {
         try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
               'http://localhost:5000/api/friends',

               {
                  headers: {
                     Authorization: `${token}`,
                  },
               }
            );
            setFriends(response.data);
         } catch (error) {
            console.error('Error fetching friends:', error);
         }
      };
      fetchFriends();
   }, []);

   const handleClickOnUser = async (user) => {
      try {
         const conversation = await axios.post(
            'http://localhost:5000/api/conversation/startFriendConversation',
            {
               friendId: user.id,
            }
         );
         setState((prevState) => ({
            ...prevState,
            conversation: { type: 'private', id: conversation.data.id },
         }));
      } catch (error) {
         console.error('Error creating conversation:', error);
      }
   };

   return (
      <div className="friend-list">
         <h3>Friends</h3>
         {friends.length === 0 ? (
            <p>No friends to display.</p>
         ) : (
            friends.map((user) => (
               <div
                  key={user.id}
                  className={`friend-item ${
                     user.status === 'ONLINE' ? 'online' : 'offline'
                  }`}
                  onClick={() => handleClickOnUser(user)}
               >
                  {user.username}
               </div>
            ))
         )}
      </div>
   );
}

export default FriendList;
