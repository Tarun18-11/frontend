import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
const App = () => {
  const userRole = localStorage.getItem('role');

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-dashboard" element={userRole === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/user-dashboard" element={userRole === 'user' ? <UserDashboard /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
