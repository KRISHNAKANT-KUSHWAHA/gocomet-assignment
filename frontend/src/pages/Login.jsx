import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Lock, Mail, Building, ArrowRight } from 'lucide-react';
import api from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('Supplier');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { email, password, role, organizationId };
      const res = await api.post('/auth/login', payload);
      localStorage.setItem('token', res.data.token);
      window.location.href = '/'; 
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="h-screen w-full flex bg-white font-sans text-slate-900 fixed inset-0 z-[100]">
      
      {/* Left Half: Image & Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-[#111827] overflow-hidden flex-col justify-end p-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed7e66a5a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/80 to-transparent"></div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center space-x-3 text-white mb-8">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-8 h-8" strokeWidth="2">
              <rect x="3" y="8" width="18" height="12" rx="2" />
              <path d="M7 8V6a2 2 0 012-2h6a2 2 0 012 2v2" />
            </svg>
            <span className="text-2xl font-black tracking-tight">LogiProcure</span>
          </div>
          
          <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
            PRECISION LOGISTICS<br/>INFRASTRUCTURE.
          </h1>
          
          <p className="text-slate-300 max-w-md text-sm font-medium leading-relaxed">
            Real-time RFQ management, global supplier bidding, and automated procurement workflows for high-stakes enterprise supply chains.
          </p>
          
          <div className="flex space-x-12 pt-8 border-t border-slate-700/50 mt-8">
            <div>
              <p className="text-2xl font-black text-white">14.2k</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Active Nodes</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">$2.4B</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">AUM Volume</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">99.9%</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">SLA Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Half: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative bg-white overflow-y-auto">
        <div className="w-full max-w-[420px]">
          
          <div className="mb-10">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Access Platform</h2>
            <p className="text-sm text-slate-500 font-medium">Enter your credentials to manage your procurement lifecycle.</p>
          </div>

          <div className="flex bg-[#F4F5F7] p-1 rounded-lg mb-8">
            <button 
              type="button"
              onClick={() => setRole('Admin')}
              className={`flex-1 py-2 text-sm font-bold rounded-md shadow-sm transition-all ${role === 'Admin' ? 'bg-white text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Admin
            </button>
            <button 
              type="button"
              onClick={() => setRole('Supplier')}
              className={`flex-1 py-2 text-sm font-bold rounded-md shadow-sm transition-all ${role === 'Supplier' ? 'bg-white text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Supplier
            </button>
          </div>

          <div className="flex space-x-6 border-b border-gray-200 mb-8 pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-3 -mb-3">Sign In</span>
            <Link to="/signup" className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600">Create Account</Link>
          </div>

          {error && <div className="p-3 mb-6 bg-red-50 text-red-600 rounded-lg text-sm font-bold border border-red-100">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {role === 'Admin' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Organization ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-4 w-4 text-gray-400" />
                  </div>
                  <input required value={organizationId} onChange={(e) => setOrganizationId(e.target.value)} placeholder="e.g. ORG-2024" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all outline-none text-sm font-medium" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Professional Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="operator@logiprocure.com" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all outline-none text-sm font-medium" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Access Password</label>
                <a href="#" className="text-[11px] font-bold text-slate-400 hover:text-slate-600">Forgot?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all outline-none text-sm font-medium" />
              </div>
            </div>

            <div className="flex items-center pt-2">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900" />
              <label className="ml-2 text-xs font-medium text-slate-600">Keep me signed in for 24 hours</label>
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-lg flex items-center justify-between px-6 hover:bg-slate-800 transition-colors mt-6 shadow-md">
              <span className="text-[13px] tracking-widest uppercase">Authenticate Access</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              {/* <div className="relative flex justify-center">
                <span className="bg-white px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Federated Identity</span>
              </div> */}
            </div>

            {/* <div className="grid grid-cols-2 gap-4 mt-6">
              <button className="flex items-center justify-center space-x-2 border border-gray-200 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-xs font-bold text-slate-700">Google Workspace</span>
              </button>
              <button className="flex items-center justify-center space-x-2 border border-gray-200 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-xs font-bold text-slate-700">LinkedIn Pro</span>
              </button>
            </div> */}
          </div>

          <div className="mt-12 text-center pb-8 lg:pb-0">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex justify-center items-center gap-1 mb-1">
              <Lock className="w-3 h-3" /> AES-256 Encrypted Connection
            </p>
            <p className="text-[9px] font-medium text-slate-400 max-w-xs mx-auto">
              BY AUTHENTICATING, YOU AGREE TO THE LOGIPROCURE ENTERPRISE MASTER SERVICE AGREEMENT AND DATA PRIVACY ADDENDUM.
            </p>
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default Login;
