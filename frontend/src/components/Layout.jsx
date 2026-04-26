import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Gavel, FileText, Users, BarChart2, Bell, HelpCircle, Settings, Plus, Search } from 'lucide-react';

const Layout = ({ children, user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Gavel, label: 'Auctions', path: '/' },
    { icon: FileText, label: 'Bids', path: '/bids' },
    { icon: Users, label: 'Vendors', path: '/vendors' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  ];

  return (
    <div className="flex h-screen bg-[#F5F7FA] font-sans">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex z-10 shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
        <div>
          {/* Logo Area */}
          <div className="p-6 flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 text-white" strokeWidth="2">
                <rect x="3" y="8" width="18" height="12" rx="2" />
                <path d="M7 8V6a2 2 0 012-2h6a2 2 0 012 2v2" />
              </svg>
            </div>
            <div>
              <h1 className="text-[17px] font-black text-slate-900 leading-tight">Bharat <br/>Procurement</h1>
              <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mt-1">Logistics Command Center</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/' && location.pathname.includes('/rfq'));
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-[14px] font-semibold transition-all ${
                    isActive 
                      ? 'bg-[#F4F5F7] text-slate-900 border-l-4 border-slate-900' 
                      : 'text-slate-500 hover:bg-gray-50 hover:text-slate-900 border-l-4 border-transparent'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* New Auction Button */}
        <div className="p-6">
          <button 
            onClick={() => navigate('/create')}
            className="w-full bg-slate-900 text-white font-semibold flex items-center justify-center space-x-2 py-3.5 rounded-lg hover:bg-slate-800 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>New Auction</span>
          </button>
        </div>
      </aside>

      {/* Main Layout Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
          {/* Search Bar */}
          <div className="relative w-96 hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search auctions, vendors, or routes..."
              className="w-full pl-10 pr-4 py-2 bg-[#F4F5F7] border-transparent rounded-lg text-sm focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-slate-200 transition-all outline-none"
            />
          </div>
          <div className="md:hidden font-black text-slate-900">Bharat Procurement</div>

          {/* Right Header Icons */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-gray-400">
              <button className="hover:text-slate-700 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="hover:text-slate-700 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </button>
              <button className="hover:text-slate-700 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-8 w-px bg-gray-200"></div>

            {user ? (
              <div className="flex items-center space-x-3 cursor-pointer group" onClick={onLogout}>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">{user.name}</p>
                  <p className="text-[11px] font-medium text-slate-500">Procurement Head</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900">Sign In</Link>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto bg-[#F5F7FA] p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
