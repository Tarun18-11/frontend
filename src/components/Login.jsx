import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [aadharNo, setAadharNo] = useState(''); // Updated to store Aadhar number
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send aadharNo and password for login
      const response = await axios.post('/api/login', { aadharNo, password });

      setMessage(response.data.message);

      // Store token, user role, and aadharNo in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.user.role);
      localStorage.setItem('aadharNo', response.data.user.aadharNo); // Storing Aadhar number as well

      // Redirect based on user role
      if (response.data.user.role === 'admin') {
        navigate('/admin-dashboard'); // Admin's dashboard route
      } else {
        navigate('/user-dashboard'); // User's dashboard route
      }
    } catch (error) {
      setMessage('Login failed: ' + (error.response?.data?.message || 'An error occurred'));
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="aadharNo">Aadhar Number</label>
          <input
            type="text"
            id="aadharNo"
            placeholder="Enter Aadhar Number"
            value={aadharNo}
            onChange={(e) => setAadharNo(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
