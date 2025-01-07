import { useState } from 'react';
import axios from 'axios';

function Register({ toggleForm }) {
   const [email, setEmail] = useState('');
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         await axios.post('http://localhost:5000/api/auth/register', {
            email,
            username,
            password,
         });
         alert('Account created! Please log in.');
         toggleForm();
      } catch (error) {
         alert('User already exists');
      }
   };

   return (
      <div className="auth-form">
         <h2>Register</h2>
         <form onSubmit={handleSubmit}>
            <input
               type="text"
               placeholder="Username"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               required
            />
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
            <button type="submit">Register</button>
         </form>
         <p>
            Already have an account? <span onClick={toggleForm}>Login</span>
         </p>
      </div>
   );
}

export default Register;
