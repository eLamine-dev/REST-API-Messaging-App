import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../../utils/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ toggleForm }) {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const { state, setState } = useContext(AppContext);
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      e.preventDefault();

      try {
         const response = await axios.post(
            'http://localhost:5000/api/auth/login',
            {
               email,
               password,
            }
         );

         setState((prevState) => ({
            ...prevState,
            user: response.data.user,
         }));

         localStorage.setItem('token', response.data.token);
         navigate('/messages');
      } catch (e) {
         alert('Invalid credentials', e);
      }
   };

   return (
      <div className="auth-form">
         <h2>Login</h2>
         <form onSubmit={handleSubmit}>
            <input
               type="email"
               placeholder="Email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
            />
            <input
               type="password"
               placeholder="Password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
            />
            <button type="submit">Login</button>
         </form>
         <p>
            Don't have an account? <span onClick={toggleForm}>Register</span>
         </p>
      </div>
   );
}

export default Login;
