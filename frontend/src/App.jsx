import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import RFQList from './pages/RFQList';
import CreateRFQ from './pages/CreateRFQ';
import RFQDetails from './pages/RFQDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Layout from './components/Layout';
import api from './api';
import Bids from './pages/Bids';
import Vendors from './pages/Vendors';
import Analytics from './pages/Analytics';
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<RFQList />} />
        <Route path="/dashboard" element={<RFQList />} />
        <Route path="/create" element={<CreateRFQ />} />
        <Route path="/rfq/:id" element={<RFQDetails />} />
        {/* <Route path="/bids" element={<RFQList />} /> */}
        <Route path="/bids" element={<Bids />} />
        {/* <Route path="/vendors" element={<RFQList />} /> */}
        <Route path="/vendors" element={<Vendors/>} />
        {/* <Route path="/analytics" element={<RFQList />} /> */}
         <Route path="/analytics" element={<Analytics/>} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
