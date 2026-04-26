import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Building, ArrowRight, User } from 'lucide-react';
import api from '../api';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', organizationId: '' });
  const [error, setError] = useState('');
  const [role, setRole] = useState('Supplier');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Backend might ignore role/organizationId for now unless you update the model
      const payload = { ...formData, role };
      const res = await api.post('/auth/signup', payload);
      localStorage.setItem('token', res.data.token);
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
            JOIN THE GLOBAL<br/>PROCUREMENT NETWORK.
          </h1>
          
          <p className="text-slate-300 max-w-md text-sm font-medium leading-relaxed">
            Create an account to gain access to enterprise-grade RFQ management and a competitive bidding environment.
          </p>
        </div>
      </div>

      {/* Right Half: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative bg-white overflow-y-auto">
        <div className="w-full max-w-[420px]">
          
          <div className="mb-10">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Create Account</h2>
            <p className="text-sm text-slate-500 font-medium">Set up your credentials to join the platform.</p>
          </div>

          <div className="flex bg-[#F4F5F7] p-1 rounded-lg mb-8">
            <button 
              type="button"
              onClick={() => setRole('Supplier')}
              className={`flex-1 py-2 text-sm font-bold rounded-md shadow-sm transition-all ${role === 'Supplier' ? 'bg-white text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Supplier
            </button>
            <button 
              type="button"
              onClick={() => setRole('Admin')}
              className={`flex-1 py-2 text-sm font-bold rounded-md shadow-sm transition-all ${role === 'Admin' ? 'bg-white text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Admin
            </button>
          </div>

          <div className="flex space-x-6 border-b border-gray-200 mb-8 pb-3">
            <Link to="/login" className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600">Sign In</Link>
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-3 -mb-3">Create Account</span>
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
                  <input required name="organizationId" value={formData.organizationId} onChange={handleChange} placeholder="e.g. ORG-2024" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all outline-none text-sm font-medium" />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input required name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all outline-none text-sm font-medium" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Professional Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="operator@company.com" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all outline-none text-sm font-medium" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Create Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all outline-none text-sm font-medium" />
              </div>
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-lg flex items-center justify-between px-6 hover:bg-slate-800 transition-colors mt-6 shadow-md">
              <span className="text-[13px] tracking-widest uppercase">Create Platform Access</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
      
    </div>
  );
};

export default Signup;
