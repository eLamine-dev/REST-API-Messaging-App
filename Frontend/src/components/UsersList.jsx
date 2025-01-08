import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

function UserList({ setConversationType }) {
   const [friends, setFriends] = useState([]);

   useEffect(() => {
      const fetchFriends = async () => {
         try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
               'http://localhost:5000/api/users/friends',
               {
                  headers: {
                     Authorization: `Bearer ${token}`,
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

   return (
      <div className="user-list">
         <h3>Friends</h3>
         {friends.map((user) => (
            <div
               key={user.id}
               className={`user-item ${
                  user.status === 'online' ? 'online' : 'offline'
               }`}
               onClick={() =>
                  setConversationType({ type: 'private', id: user.id })
               }
            >
               {user.username}
            </div>
         ))}
      </div>
   );
}

UserList.propTypes = {
   setConversationType: PropTypes.func.isRequired,
};

export default UserList;
