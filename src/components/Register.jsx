import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [aadharNo, setAadharNo] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      
      const response = await axios.post('/api/register', { aadharNo, password });
      setMessage(response.data.message);

      navigate('/login');
    } catch (error) {
      setMessage('Registration failed: ' + (error.response?.data?.message || 'An error occurred'));
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Aadhar Number</label>
          <input
            type="text"
            placeholder="Enter Aadhar Number"
            value={aadharNo}
            onChange={(e) => setAadharNo(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Register</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
