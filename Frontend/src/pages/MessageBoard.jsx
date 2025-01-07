import Messages from '../components/forms/Messages';
import axios from 'axios';

function MessageBoard() {
   async function logout() {
      try {
         const token = localStorage.getItem('token');

         await axios.post('http://localhost:5000/api/auth/logout', {
            headers: {
               Authorization: `${token}`,
            },
         });
         localStorage.removeItem('token');
         window.location.href = '/';
      } catch (error) {
         console.error('Logout failed:', error);
         alert('Logout failed, please try again.');
      }
   }

   return (
      <div className="message-board">
         <h1>Welcome to the Message Board</h1>
         <Messages />
         <button onClick={logout}>Logout</button>
      </div>
   );
}

export default MessageBoard;
