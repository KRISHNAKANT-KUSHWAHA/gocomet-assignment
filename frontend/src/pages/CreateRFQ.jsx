import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, Calendar, Clock, Settings, Zap, ChevronLeft } from 'lucide-react';
import api from '../api';

const CreateRFQ = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    referenceId: '',
    name: '',
    pickupDate: '',
    bidStartDate: '',
    bidCloseDate: '',
    forcedBidCloseDate: '',
    isBritishAuction: false,
    triggerWindowMinutes: 10,
    extensionDurationMinutes: 5,
    extensionTriggerType: 'ANY_BID'
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (new Date(formData.forcedBidCloseDate) <= new Date(formData.bidCloseDate)) {
      setError('Forced Bid Close Time must be greater than Bid Close Time');
      return;
    }
    
    try {
      await api.post('/rfqs', formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating RFQ');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Navigation */}
      <div className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-widest gap-2">
        <Link to="/" className="hover:text-slate-900 transition-colors">Auctions</Link>
        <span>&gt;</span>
        <span className="text-slate-900">New Auction</span>
      </div>

      <div>
        <h1 className="text-2xl font-black text-slate-900">Create New RFQ</h1>
        <p className="text-sm text-slate-500 mt-1">Configure your auction parameters.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm font-semibold">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Reference ID</label>
              <input required name="referenceId" value={formData.referenceId} onChange={handleChange} className="w-full px-4 py-3 bg-[#F4F5F7] border-transparent rounded-lg focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-slate-200 transition-all outline-none text-sm font-medium" placeholder="e.g. AUC-001" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">RFQ Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-[#F4F5F7] border-transparent rounded-lg focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-slate-200 transition-all outline-none text-sm font-medium" placeholder="e.g. Mumbai to Delhi Load" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" /> Pickup / Service Date
            </label>
            <input type="date" required name="pickupDate" value={formData.pickupDate} onChange={handleChange} className="w-full md:w-1/2 px-4 py-3 bg-[#F4F5F7] border-transparent rounded-lg focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-slate-200 transition-all outline-none text-sm font-medium" />
          </div>

          <div className="p-6 bg-[#F8FAFC] rounded-xl border border-gray-100 space-y-6">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-widest">
              <Clock className="w-4 h-4 text-slate-500" /> Auction Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Bid Start Time</label>
                <input type="datetime-local" required name="bidStartDate" value={formData.bidStartDate} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-200 transition-all outline-none text-sm font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Bid Close Time</label>
                <input type="datetime-local" required name="bidCloseDate" value={formData.bidCloseDate} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-200 transition-all outline-none text-sm font-medium" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-red-500 uppercase tracking-wider mb-2">Forced Close Time</label>
                <input type="datetime-local" required name="forcedBidCloseDate" value={formData.forcedBidCloseDate} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-red-200 rounded-lg focus:ring-2 focus:ring-red-200 transition-all outline-none text-sm font-medium" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input type="checkbox" name="isBritishAuction" checked={formData.isBritishAuction} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 text-slate-900 focus:ring-slate-900" />
              <span className="text-slate-900 font-bold text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-slate-500" /> Enable British Auction Features
              </span>
            </label>
          </div>

          {formData.isBritishAuction && (
            <div className="bg-[#EBF4FF] border border-blue-100 p-6 rounded-xl space-y-6">
              <h3 className="font-bold text-blue-900 flex items-center gap-2 text-sm uppercase tracking-widest">
                <Settings className="w-4 h-4" /> British Auction Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-2">Trigger Window (Minutes)</label>
                  <input type="number" name="triggerWindowMinutes" value={formData.triggerWindowMinutes} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all outline-none text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-2">Extension Duration (Minutes)</label>
                  <input type="number" name="extensionDurationMinutes" value={formData.extensionDurationMinutes} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all outline-none text-sm font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-2">Extension Trigger Event</label>
                <select name="extensionTriggerType" value={formData.extensionTriggerType} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-200 transition-all outline-none text-sm font-medium text-slate-800">
                  <option value="ANY_BID">Bid Received in Trigger Window</option>
                  <option value="ANY_RANK_CHANGE">Any Supplier Rank Change</option>
                  <option value="L1_RANK_CHANGE">Lowest Bidder (L1) Rank Change</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button type="submit" className="px-8 flex justify-center items-center gap-2 bg-slate-900 text-white font-bold py-3 rounded-lg shadow-md hover:bg-slate-800 transition-all">
              <PlusCircle className="w-4 h-4" /> Launch Auction
            </button>
            <Link to="/" className="px-8 flex justify-center items-center gap-2 bg-white border border-gray-300 text-slate-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition-all">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRFQ;
