import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

function FriendList({ setConversationType }) {
   const [friends, setFriends] = useState([]);

   useEffect(() => {
      const fetchFriends = async () => {
         try {
            const response = await axios.get(
               'http://localhost:5000/api/friends'
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
         setConversationType({ type: 'private', id: conversation.id });
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

FriendList.propTypes = {
   setConversationType: PropTypes.func.isRequired,
};

export default FriendList;
