import UserList from '../components/UserList';
import Messages from '../components/forms/Messages';

function MessageBoard() {
   return (
      <div className="message-board">
         <UserList />
         <Messages />
      </div>
   );
}

export default MessageBoard;
