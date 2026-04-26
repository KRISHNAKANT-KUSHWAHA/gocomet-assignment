import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Clock, Send, ChevronLeft, Info } from 'lucide-react';
import api from '../api';

const RFQDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidForm, setBidForm] = useState({
    carrierName: '', freightCharges: '', originCharges: '', destinationCharges: '', transitTime: '', validityOfQuote: ''
  });
  const [error, setError] = useState('');

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/rfqs/${id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    const interval = setInterval(fetchDetails, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const handleBidChange = (e) => {
    setBidForm({ ...bidForm, [e.target.name]: e.target.value });
  };

  const submitBid = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/bids', { ...bidForm, rfqId: id });
      setBidForm({
        carrierName: '', freightCharges: '', originCharges: '', destinationCharges: '', transitTime: '', validityOfQuote: ''
      });
      fetchDetails();
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting bid');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
    </div>
  );
  if (!data) return <div className="text-center py-20 text-red-500 font-bold">RFQ not found</div>;

  const { rfq, bids, logs } = data;
  const isAuctionActive = rfq.status === 'ACTIVE';

  const calculateTotal = () => {
    return Number(bidForm.freightCharges || 0) + Number(bidForm.originCharges || 0) + Number(bidForm.destinationCharges || 0);
  };

{/** REMIANING TIME LOGIC.................................. */}
  const getRemainingTime = () => {
  const now = new Date().getTime();
  const end = new Date(rfq.bidCloseDate).getTime();

  const diff = end - now;

  if (diff <= 0) return '00:00:00';

  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center text-[11px] font-bold text-slate-500 uppercase tracking-widest gap-2">
        <Link to="/" className="hover:text-slate-900 transition-colors">Auctions</Link>
        <span>&gt;</span>
        <span>{rfq.referenceId}</span>
        <span>&gt;</span>
        <span className="text-slate-900">Submit Quote</span>
      </div>

      <div>
        <h1 className="text-2xl font-black text-slate-900">Quote Submission</h1>
        <p className="text-sm text-slate-500 mt-1">Submit your most competitive logistics bid.</p>
      </div>

      {/* Top Banner */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6 flex justify-between items-center shadow-sm">
          <div>
            <h2 className="text-lg font-black text-slate-900">Route: {rfq.name}</h2>
            <p className="text-[12px] text-slate-500 font-medium mt-1">Pickup: {format(new Date(rfq.pickupDate), 'MMM d, yyyy')}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Lowest Bid</p>
            <p className="text-2xl font-black text-slate-900">
              {bids.length > 0 ? `₹${bids[0].totalCharges.toLocaleString()}` : 'None'}
            </p>
          </div>
        </div>

        <div className="md:w-72 bg-[#1C2536] rounded-xl p-6 text-white shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Time Remaining</p>
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-slate-300" />
            <p className="text-2xl font-black tracking-tight text-white">
              {/* {isAuctionActive ? format(new Date(rfq.bidCloseDate), 'HH:mm:ss') : '00:00:00'} */}
              {isAuctionActive ? getRemainingTime() : '00:00:00'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              Financial Breakdown
            </h3>
            
            {!isAuctionActive && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm font-semibold border border-red-100">
                This auction is closed. You cannot submit new bids.
              </div>
            )}
            {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm font-semibold border border-red-100">{error}</div>}

            <form onSubmit={submitBid} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Carrier Name</label>
                  <input required disabled={!isAuctionActive} name="carrierName" value={bidForm.carrierName} onChange={handleBidChange} className="w-full px-4 py-3 bg-[#F4F5F7] border-transparent rounded-lg focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-slate-200 transition-all outline-none text-sm font-medium" placeholder="e.g. Maersk" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Transit Time (Days)</label>
                  <input required disabled={!isAuctionActive} name="transitTime" value={bidForm.transitTime} onChange={handleBidChange} className="w-full px-4 py-3 bg-[#F4F5F7] border-transparent rounded-lg focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-slate-200 transition-all outline-none text-sm font-medium" placeholder="Enter number of days" />
                </div>
              </div>

              <div className="p-6 bg-[#F8FAFC] rounded-xl border border-gray-100 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Freight Charges (₹)</label>
                    <input type="number" required disabled={!isAuctionActive} name="freightCharges" value={bidForm.freightCharges} onChange={handleBidChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-200 transition-all outline-none text-sm font-medium" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Origin Charges (₹)</label>
                    <input type="number" required disabled={!isAuctionActive} name="originCharges" value={bidForm.originCharges} onChange={handleBidChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-200 transition-all outline-none text-sm font-medium" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Destination Charges (₹)</label>
                    <input type="number" required disabled={!isAuctionActive} name="destinationCharges" value={bidForm.destinationCharges} onChange={handleBidChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-200 transition-all outline-none text-sm font-medium" placeholder="0.00" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-[#EDF2F7] rounded-xl">
                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Price Validity</label>
                  <input type="date" required disabled={!isAuctionActive} name="validityOfQuote" value={bidForm.validityOfQuote} onChange={handleBidChange} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-200 transition-all outline-none text-sm font-medium" />
                </div>
                <div className="flex-1 w-full border-l-2 border-slate-300 pl-6">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Bid Value</label>
                  <p className="text-3xl font-black text-slate-900">₹{calculateTotal().toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" disabled={!isAuctionActive} className={`flex-1 flex justify-center items-center gap-2 text-white font-bold py-4 rounded-xl transition-all ${isAuctionActive ? 'bg-slate-900 hover:bg-slate-800 shadow-md' : 'bg-gray-400 cursor-not-allowed'}`}>
                  <Send className="w-5 h-5" /> Submit Binding Quote
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: History & Intelligence */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-slate-900">Recent Bid History</h3>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">Live Updates</span>
            </div>
            
            {bids.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500 font-medium">No bids placed yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white border-b border-gray-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">Company</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bids.slice(0, 5).map((bid) => (
                    <tr key={bid._id} className="bg-white">
                      <td className="px-4 py-4">
                        <p className="font-bold text-slate-900">{bid.carrierName}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{format(new Date(bid.createdAt), 'h:mm a')}</p>
                      </td>
                      <td className="px-4 py-4 text-right font-black text-slate-900">
                        ₹{bid.totalCharges.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {rfq.isBritishAuction && (
            <div className="bg-[#EBF4FF] border border-blue-100 rounded-xl p-6">
              <h3 className="text-sm font-black text-blue-900 mb-4 uppercase tracking-widest flex items-center gap-2">
                <Info className="w-4 h-4"/> Auction Rules
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Dynamic Extension</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Any bid placed within the last {rfq.triggerWindowMinutes} minutes will extend the auction by {rfq.extensionDurationMinutes} minutes. Condition: {rfq.extensionTriggerType}.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Hard Close Time</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Forced closure at {format(new Date(rfq.forcedBidCloseDate), 'MMM d, h:mm a')} regardless of extension activity.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Link to="/" className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-slate-700 font-bold rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Auctions
        </Link>
      </div>

    </div>
  );
};

export default RFQDetails;
