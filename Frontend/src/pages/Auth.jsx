import { useState } from 'react';
import Register from '../components/forms/Register';
import Login from '../components/forms/Login';

function AuthPage() {
   const [isLogin, setIsLogin] = useState(true);

   const toggleForm = () => {
      setIsLogin(!isLogin);
   };

   return (
      <div className="auth-page">
         {isLogin ? (
            <Login toggleForm={toggleForm} />
         ) : (
            <Register toggleForm={toggleForm} />
         )}
      </div>
   );
}

export default AuthPage;
