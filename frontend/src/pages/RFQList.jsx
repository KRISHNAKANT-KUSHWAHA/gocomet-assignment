// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { format } from 'date-fns';
// import { Activity, Clock, AlertCircle, TrendingUp, Filter } from 'lucide-react';
// import api from '../api';

// const RFQList = () => {
//   const [rfqs, setRfqs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchRfqs = async () => {
//       try {
//         const res = await api.get('/rfqs');
//         setRfqs(res.data);
//       } catch (error) {
//         console.error("Error fetching RFQs:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRfqs();
//     const interval = setInterval(fetchRfqs, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   if (loading) return (
//     <div className="flex flex-col items-center justify-center py-20 space-y-4">
//       <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
//     </div>
//   );

//   const activeCount = rfqs.filter(r => r.status === 'ACTIVE').length;

//   return (
//     <div className="space-y-6">
//       {/* Top Stat Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-[#1C2536] rounded-xl p-6 text-white relative overflow-hidden shadow-sm">
//           <div className="relative z-10">
//             <h3 className="text-[11px] font-bold tracking-widest text-slate-400 mb-1 uppercase">Total Savings (Q3)</h3>
//             <p className="text-3xl font-black mb-2">₹42,85,000</p>
//             <p className="text-[12px] font-semibold text-emerald-400 flex items-center gap-1">
//               <TrendingUp className="w-3 h-3" /> 12.4% vs last quarter
//             </p>
//           </div>
//           <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
//              <TrendingUp className="w-40 h-40" />
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col justify-center">
//           <h3 className="text-[11px] font-bold tracking-widest text-slate-500 mb-1 uppercase">Active Auctions</h3>
//           <p className="text-3xl font-black text-slate-900 mb-2">{activeCount}</p>
//           <p className="text-[12px] font-medium text-slate-500">
//              {rfqs.filter(r => new Date(r.bidCloseDate) > new Date() && (new Date(r.bidCloseDate) - new Date()) < 7200000).length} closing within 2 hours
//           </p>
//         </div>

//         <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col justify-center">
//           <h3 className="text-[11px] font-bold tracking-widest text-slate-500 mb-1 uppercase">Avg. Bids Per Auction</h3>
//           <p className="text-3xl font-black text-slate-900 mb-2">14.2</p>
//           <p className="text-[12px] font-medium text-slate-500">Highly competitive segment</p>
//         </div>
//       </div>

//       {/* Tabs and Filters */}
//       <div className="bg-white rounded-xl p-2 border border-gray-200 flex items-center justify-between shadow-sm">
//         <div className="flex space-x-1">
//           <button className="px-6 py-2 bg-[#F4F5F7] text-slate-900 font-bold text-sm rounded-lg">All Auctions</button>
//           <button className="px-6 py-2 text-slate-500 font-medium text-sm hover:bg-gray-50 rounded-lg">My Routes</button>
//           <button className="px-6 py-2 text-slate-500 font-medium text-sm hover:bg-gray-50 rounded-lg">Watchlist</button>
//         </div>
//         <div className="flex items-center space-x-4 pr-4">
//           <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
//             <Filter className="w-4 h-4" /> More Filters
//           </button>
//           <div className="h-4 w-px bg-gray-300"></div>
//           <div className="text-sm font-semibold text-slate-600 flex items-center gap-2">
//             Sort by: <span className="text-slate-900">Time Remaining</span>
//           </div>
//         </div>
//       </div>

//       {/* List Layout */}
//       <div className="space-y-4">
//         {rfqs.map((rfq) => (
//           <div key={rfq._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
            
//             {/* Left Section: Route & Details */}
//             <div className="flex-1">
//               <div className="flex items-center gap-3 mb-2">
//                 <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded ${
//                   rfq.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
//                   rfq.status === 'FORCE_CLOSED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
//                 }`}>
//                   {rfq.status.replace('_', ' ')}
//                 </span>
//                 <span className="text-[11px] font-bold text-gray-400">AUC-ID: {rfq.referenceId}</span>
//               </div>
//               <h3 className="text-lg font-black text-slate-900 mb-1">{rfq.name}</h3>
//               <p className="text-[13px] font-medium text-slate-500 flex items-center gap-2">
//                 {format(new Date(rfq.pickupDate), 'MMM d, yyyy')} • {rfq.isBritishAuction ? 'British Auction' : 'Standard'}
//               </p>
//             </div>

//             {/* Middle Section: Bid & Time */}
//             <div className="flex gap-10 border-l border-r border-gray-100 px-10">
//               <div>
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Current Low Bid</p>
//                 <p className="text-2xl font-black text-slate-900">
//                   {rfq.lowestBid ? `₹${rfq.lowestBid.toLocaleString()}` : 'No bids'}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Time Remaining</p>
//                 <p className={`text-xl font-black ${rfq.status === 'ACTIVE' ? 'text-red-600' : 'text-slate-900'}`}>
//                   {rfq.status === 'ACTIVE' ? format(new Date(rfq.bidCloseDate), 'h:mm:ss a') : 'Ended'}
//                 </p>
//               </div>
//             </div>

//             {/* Right Section: Actions */}
//             <div className="flex flex-col gap-2 w-40">
//               {rfq.status === 'ACTIVE' ? (
//                 <>
//                   <Link to={`/rfq/${rfq._id}`} className="w-full bg-slate-900 text-white text-[13px] font-bold py-2.5 rounded-lg text-center hover:bg-slate-800 transition-colors">
//                     Enter Bid Room
//                   </Link>
//                   <Link to={`/rfq/${rfq._id}`} className="w-full bg-white border border-gray-300 text-slate-700 text-[13px] font-bold py-2.5 rounded-lg text-center hover:bg-gray-50 transition-colors">
//                     View Details
//                   </Link>
//                 </>
//               ) : (
//                 <Link to={`/rfq/${rfq._id}`} className="w-full bg-white border border-gray-300 text-slate-700 text-[13px] font-bold py-2.5 rounded-lg text-center hover:bg-gray-50 transition-colors">
//                   Review Results
//                 </Link>
//               )}
//             </div>
            
//           </div>
//         ))}

//         {rfqs.length === 0 && (
//           <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
//             <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//             <h3 className="text-lg font-bold text-gray-900">No Auctions Found</h3>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RFQList;




// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { format } from 'date-fns';
// import { Activity, Clock, AlertCircle, TrendingUp, Filter } from 'lucide-react';
// import api from '../api';

// const RFQList = () => {
//   const [rfqs, setRfqs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ NEW STATE (search)
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchRfqs = async () => {
//       try {
//         const res = await api.get('/rfqs');
//         setRfqs(res.data);
//       } catch (error) {
//         console.error("Error fetching RFQs:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRfqs();
//     const interval = setInterval(fetchRfqs, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   // ✅ FILTER LOGIC
//   const filteredRfqs = rfqs.filter((rfq) => {
//     const search = searchTerm.toLowerCase();
//     return (
//       rfq.name?.toLowerCase().includes(search) ||
//       rfq.referenceId?.toLowerCase().includes(search)
//     );
//   });

//   if (loading) return (
//     <div className="flex flex-col items-center justify-center py-20 space-y-4">
//       <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
//     </div>
//   );

//   const activeCount = rfqs.filter(r => r.status === 'ACTIVE').length;

//   return (
//     <div className="space-y-6">

//       {/* 🔍 SEARCH BAR (added logic only, UI same) */}
//       <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
//         <input
//           type="text"
//           placeholder="Search auctions, vendors, or routes..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full outline-none text-sm"
//         />
//       </div>

//       {/* Top Stat Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-[#1C2536] rounded-xl p-6 text-white relative overflow-hidden shadow-sm">
//           <div className="relative z-10">
//             <h3 className="text-[11px] font-bold tracking-widest text-slate-400 mb-1 uppercase">Total Savings (Q3)</h3>
//             <p className="text-3xl font-black mb-2">₹42,85,000</p>
//             <p className="text-[12px] font-semibold text-emerald-400 flex items-center gap-1">
//               <TrendingUp className="w-3 h-3" /> 12.4% vs last quarter
//             </p>
//           </div>
//           <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
//              <TrendingUp className="w-40 h-40" />
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col justify-center">
//           <h3 className="text-[11px] font-bold tracking-widest text-slate-500 mb-1 uppercase">Active Auctions</h3>
//           <p className="text-3xl font-black text-slate-900 mb-2">{activeCount}</p>
//           <p className="text-[12px] font-medium text-slate-500">
//              {rfqs.filter(r => new Date(r.bidCloseDate) > new Date() && (new Date(r.bidCloseDate) - new Date()) < 7200000).length} closing within 2 hours
//           </p>
//         </div>

//         <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col justify-center">
//           <h3 className="text-[11px] font-bold tracking-widest text-slate-500 mb-1 uppercase">Avg. Bids Per Auction</h3>
//           <p className="text-3xl font-black text-slate-900 mb-2">14.2</p>
//           <p className="text-[12px] font-medium text-slate-500">Highly competitive segment</p>
//         </div>
//       </div>

//       {/* Tabs and Filters */}
//       <div className="bg-white rounded-xl p-2 border border-gray-200 flex items-center justify-between shadow-sm">
//         <div className="flex space-x-1">
//           <button className="px-6 py-2 bg-[#F4F5F7] text-slate-900 font-bold text-sm rounded-lg">All Auctions</button>
//           <button className="px-6 py-2 text-slate-500 font-medium text-sm hover:bg-gray-50 rounded-lg">My Routes</button>
//           <button className="px-6 py-2 text-slate-500 font-medium text-sm hover:bg-gray-50 rounded-lg">Watchlist</button>
//         </div>
//         <div className="flex items-center space-x-4 pr-4">
//           <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
//             <Filter className="w-4 h-4" /> More Filters
//           </button>
//           <div className="h-4 w-px bg-gray-300"></div>
//           <div className="text-sm font-semibold text-slate-600 flex items-center gap-2">
//             Sort by: <span className="text-slate-900">Time Remaining</span>
//           </div>
//         </div>
//       </div>

//       {/* List */}
//       <div className="space-y-4">
//         {filteredRfqs.map((rfq) => (
//           <div key={rfq._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">

//             <div className="flex-1">
//               <div className="flex items-center gap-3 mb-2">
//                 <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded ${
//                   rfq.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
//                   rfq.status === 'FORCE_CLOSED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
//                 }`}>
//                   {rfq.status.replace('_', ' ')}
//                 </span>
//                 <span className="text-[11px] font-bold text-gray-400">AUC-ID: {rfq.referenceId}</span>
//               </div>
//               <h3 className="text-lg font-black text-slate-900 mb-1">{rfq.name || "No Name"}</h3>
//               <p className="text-[13px] font-medium text-slate-500">
//                 {format(new Date(rfq.pickupDate), 'MMM d, yyyy')} • {rfq.isBritishAuction ? 'British Auction' : 'Standard'}
//               </p>
//             </div>

//             <div className="flex gap-10 border-l border-r border-gray-100 px-10">
//               <div>
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Current Low Bid</p>
//                 <p className="text-2xl font-black text-slate-900">
//                   {rfq.lowestBid ? `₹${rfq.lowestBid.toLocaleString()}` : 'No bids'}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Time Remaining</p>
//                 <p className={`text-xl font-black ${rfq.status === 'ACTIVE' ? 'text-red-600' : 'text-slate-900'}`}>
//                   {rfq.status === 'ACTIVE'
//                     ? format(new Date(rfq.bidCloseDate), 'MMM d, h:mm:ss a')
//                     : 'Ended'}
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-col gap-2 w-40">
//               <Link to={`/rfq/${rfq._id}`} className="w-full bg-slate-900 text-white text-[13px] font-bold py-2.5 rounded-lg text-center">
//                 Enter Bid Room
//               </Link>
//               <Link to={`/rfq/${rfq._id}`} className="w-full bg-white border border-gray-300 text-slate-700 text-[13px] font-bold py-2.5 rounded-lg text-center">
//                 View Details
//               </Link>
//             </div>

//           </div>
//         ))}

//         {filteredRfqs.length === 0 && (
//           <div className="text-center py-20">
//             <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//             <p>No Auctions Found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RFQList;




// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { format } from 'date-fns';
// import { Activity, TrendingUp, Filter } from 'lucide-react';
// import api from '../api';

// const RFQList = () => {
//   const [rfqs, setRfqs] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // ✅ Search state (THIS is the only search now)
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchRfqs = async () => {
//       try {
//         const res = await api.get('/rfqs');
//         setRfqs(res.data);
//       } catch (error) {
//         console.error("Error fetching RFQs:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRfqs();
//     const interval = setInterval(fetchRfqs, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   // ✅ Filter logic
//   const filteredRfqs = rfqs.filter((rfq) => {
//     const search = searchTerm.toLowerCase();
//     return (
//       rfq.name?.toLowerCase().includes(search) ||
//       rfq.referenceId?.toLowerCase().includes(search)
//     );
//   });

//   if (loading) return (
//     <div className="flex flex-col items-center justify-center py-20 space-y-4">
//       <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
//     </div>
//   );

//   const activeCount = rfqs.filter(r => r.status === 'ACTIVE').length;

//   return (
//     <div className="space-y-6">

//       {/* ✅ KEEP THIS SEARCH (ONLY ONE SEARCH IN APP NOW) */}
//       <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
//         <input
//           type="text"
//           placeholder="Search auctions, vendors, or routes..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full outline-none text-sm"
//         />
//       </div>

//       {/* Top Stat Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-[#1C2536] rounded-xl p-6 text-white shadow-sm">
//           <h3 className="text-[11px] font-bold text-slate-400 uppercase">Total Savings (Q3)</h3>
//           <p className="text-3xl font-black mt-2">₹42,85,000</p>
//           <p className="text-sm text-emerald-400">+12.4%</p>
//         </div>

//         <div className="bg-white rounded-xl p-6 border shadow-sm">
//           <h3 className="text-[11px] font-bold text-slate-500 uppercase">Active Auctions</h3>
//           <p className="text-3xl font-black mt-2">{activeCount}</p>
//         </div>

//         <div className="bg-white rounded-xl p-6 border shadow-sm">
//           <h3 className="text-[11px] font-bold text-slate-500 uppercase">Avg Bids</h3>
//           <p className="text-3xl font-black mt-2">14.2</p>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="bg-white rounded-xl p-2 border flex justify-between">
//         <span className="font-bold">All Auctions</span>
//         <div className="flex gap-4 items-center text-sm text-gray-600">
//           <Filter className="w-4 h-4" /> Sort by Time
//         </div>
//       </div>

//       {/* List */}
//       <div className="space-y-4">
//         {filteredRfqs.map((rfq) => (
//           <div key={rfq._id} className="bg-white rounded-xl border p-6 flex justify-between items-center">

//             <div>
//               <span className="text-xs font-bold text-green-600">{rfq.status}</span>
//               <h3 className="text-lg font-black">{rfq.name || "No Name"}</h3>
//               <p className="text-sm text-gray-500">
//                 {format(new Date(rfq.pickupDate), 'MMM d, yyyy')}
//               </p>
//             </div>

//             <div className="text-center">
//               <p className="text-xs text-gray-400">Lowest Bid</p>
//               <p className="text-xl font-black">
//                 {rfq.lowestBid ? `₹${rfq.lowestBid}` : 'No bids'}
//               </p>
//             </div>

//             <div className="text-center">
//               <p className="text-xs text-gray-400">Time Remaining</p>
//               <p className="text-xl font-black text-red-600">
//                 {rfq.status === 'ACTIVE'
//                   ? format(new Date(rfq.bidCloseDate), 'MMM d, h:mm:ss a')
//                   : 'Ended'}
//               </p>
//             </div>

//             <div className="flex flex-col gap-2">
//               <Link to={`/rfq/${rfq._id}`} className="bg-black text-white px-4 py-2 rounded">
//                 Enter
//               </Link>
//               <Link to={`/rfq/${rfq._id}`} className="border px-4 py-2 rounded">
//                 Details
//               </Link>
//             </div>

//           </div>
//         ))}

//         {filteredRfqs.length === 0 && (
//           <div className="text-center py-20 text-gray-500">
//             No auctions found
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RFQList;


// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { format } from 'date-fns';
// import { Activity, TrendingUp, Filter } from 'lucide-react';
// import api from '../api';

// const RFQList = () => {
//   const [rfqs, setRfqs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   // ✅ NEW: sort state
//   const [sortOrder, setSortOrder] = useState('asc');

//   useEffect(() => {
//     const fetchRfqs = async () => {
//       try {
//         const res = await api.get('/rfqs');
//         setRfqs(res.data);
//       } catch (error) {
//         console.error("Error fetching RFQs:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchRfqs();
//     const interval = setInterval(fetchRfqs, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   // ✅ FILTER
//   const filteredRfqs = rfqs.filter((rfq) => {
//     const search = searchTerm.toLowerCase();
//     return (
//       rfq.name?.toLowerCase().includes(search) ||
//       rfq.referenceId?.toLowerCase().includes(search)
//     );
//   });

//   // ✅ SORT (ACTIVE first + toggle asc/desc)
//   const sortedRfqs = [...filteredRfqs].sort((a, b) => {
//     if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1;
//     if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') return 1;

//     if (a.status === 'ACTIVE' && b.status === 'ACTIVE') {
//       return sortOrder === 'asc'
//         ? new Date(a.bidCloseDate) - new Date(b.bidCloseDate)
//         : new Date(b.bidCloseDate) - new Date(a.bidCloseDate);
//     }

//     return 0;
//   });

//   if (loading) return (
//     <div className="flex flex-col items-center justify-center py-20 space-y-4">
//       <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
//     </div>
//   );

//   const activeCount = rfqs.filter(r => r.status === 'ACTIVE').length;

//   return (
//     <div className="space-y-6">

//       {/* SEARCH */}
//       <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
//         <input
//           type="text"
//           placeholder="Search auctions, vendors, or routes..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full outline-none text-sm"
//         />
//       </div>

//       {/* Top Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-[#1C2536] rounded-xl p-6 text-white shadow-sm">
//           <h3 className="text-[11px] font-bold text-slate-400 uppercase">Total Savings (Q3)</h3>
//           <p className="text-3xl font-black mt-2">₹42,85,000</p>
//           <p className="text-sm text-emerald-400">+12.4%</p>
//         </div>

//         <div className="bg-white rounded-xl p-6 border shadow-sm">
//           <h3 className="text-[11px] font-bold text-slate-500 uppercase">Active Auctions</h3>
//           <p className="text-3xl font-black mt-2">{activeCount}</p>
//         </div>

//         <div className="bg-white rounded-xl p-6 border shadow-sm">
//           <h3 className="text-[11px] font-bold text-slate-500 uppercase">Avg Bids</h3>
//           <p className="text-3xl font-black mt-2">14.2</p>
//         </div>
//       </div>

//       {/* Tabs + Sort */}
//       <div className="bg-white rounded-xl p-2 border border-gray-200 flex items-center justify-between shadow-sm">
//         <div className="flex space-x-1">
//           <button className="px-6 py-2 bg-[#F4F5F7] text-slate-900 font-bold text-sm rounded-lg">All Auctions</button>
//           <button className="px-6 py-2 text-slate-500 font-medium text-sm hover:bg-gray-50 rounded-lg">My Routes</button>
//           <button className="px-6 py-2 text-slate-500 font-medium text-sm hover:bg-gray-50 rounded-lg">Watchlist</button>
//         </div>

//         <div className="flex items-center space-x-4 pr-4">
//           <button className="flex items-center gap-2 text-sm font-semibold text-slate-600">
//             <Filter className="w-4 h-4" /> More Filters
//           </button>

//           <div className="h-4 w-px bg-gray-300"></div>

//           {/* ✅ CLICKABLE SORT (UI SAME) */}
//          <button
//   onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
//   className="text-sm font-semibold text-slate-600 flex items-center gap-2 cursor-pointer hover:text-slate-900 hover:scale-105 transition-all duration-200"
// >
//             Sort by:
//             <span className="text-slate-900">
//               Time Remaining {sortOrder === 'asc' ? '↑' : '↓'}
//             </span>
//           </button>
//         </div>
//       </div>

//       {/* LIST */}
//       <div className="space-y-4">
//         {sortedRfqs.map((rfq) => (
//           <div key={rfq._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">

//             <div className="flex-1">
//               <div className="flex items-center gap-3 mb-2">
//                 <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded ${
//                   rfq.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
//                   rfq.status === 'FORCE_CLOSED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
//                 }`}>
//                   {rfq.status.replace('_', ' ')}
//                 </span>
//                 <span className="text-[11px] font-bold text-gray-400">AUC-ID: {rfq.referenceId}</span>
//               </div>

//               <h3 className="text-lg font-black text-slate-900">{rfq.name || "No Name"}</h3>

//               <p className="text-[13px] font-medium text-slate-500">
//                 {format(new Date(rfq.pickupDate), 'MMM d, yyyy')} • {rfq.isBritishAuction ? 'British Auction' : 'Standard'}
//               </p>
//             </div>

//             <div className="flex gap-10 border-l border-r border-gray-100 px-10">
//               <div>
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Current Low Bid</p>
//                 <p className="text-2xl font-black text-slate-900">
//                   {rfq.lowestBid ? `₹${rfq.lowestBid.toLocaleString()}` : 'No bids'}
//                 </p>
//               </div>

//               <div>
//                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Time Remaining</p>
//                 <p className={`text-xl font-black ${rfq.status === 'ACTIVE' ? 'text-red-600' : 'text-slate-900'}`}>
//                   {rfq.status === 'ACTIVE'
//                     ? format(new Date(rfq.bidCloseDate), 'MMM d, h:mm:ss a')
//                     : 'Ended'}
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-col gap-2 w-40">
//               <Link to={`/rfq/${rfq._id}`} className="w-full bg-slate-900 text-white text-[13px] font-bold py-2.5 rounded-lg text-center">
//                 Enter Bid Room
//               </Link>
//               <Link to={`/rfq/${rfq._id}`} className="w-full bg-white border border-gray-300 text-slate-700 text-[13px] font-bold py-2.5 rounded-lg text-center">
//                 View Details
//               </Link>
//             </div>

//           </div>
//         ))}

//         {sortedRfqs.length === 0 && (
//           <div className="text-center py-20">
//             <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//             <p>No Auctions Found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RFQList;





import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Activity, TrendingUp, Filter } from 'lucide-react';
import api from '../api';

const RFQList = () => {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchRfqs = async () => {
      try {
        const res = await api.get('/rfqs');
        setRfqs(res.data);
      } catch (error) {
        console.error("Error fetching RFQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRfqs();
    const interval = setInterval(fetchRfqs, 10000);
    return () => clearInterval(interval);
  }, []);

  // ✅ FILTER
  const filteredRfqs = rfqs.filter((rfq) => {
    const search = searchTerm.toLowerCase();
    return (
      rfq.name?.toLowerCase().includes(search) ||
      rfq.referenceId?.toLowerCase().includes(search)
    );
  });

  // ✅ SORT (ACTIVE first + toggle)
  const sortedRfqs = [...filteredRfqs].sort((a, b) => {
    if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1;
    if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') return 1;

    return sortOrder === 'asc'
      ? new Date(a.bidCloseDate) - new Date(b.bidCloseDate)
      : new Date(b.bidCloseDate) - new Date(a.bidCloseDate);
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
    </div>
  );

  const activeCount = rfqs.filter(r => r.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">

      {/* SEARCH */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <input
          type="text"
          placeholder="Search auctions, vendors, or routes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full outline-none text-sm"
        />
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1C2536] rounded-xl p-6 text-white shadow-sm">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase">Total Savings (Q3)</h3>
          <p className="text-3xl font-black mt-2">₹42,85,000</p>
          <p className="text-sm text-emerald-400">+12.4%</p>
        </div>

        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase">Active Auctions</h3>
          <p className="text-3xl font-black mt-2">{activeCount}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase">Avg Bids</h3>
          <p className="text-3xl font-black mt-2">14.2</p>
        </div>
      </div>

      {/* Tabs + Sort */}
      <div className="bg-white rounded-xl p-2 border border-gray-200 flex items-center justify-between shadow-sm">
        <div className="flex space-x-1">
          <button className="px-6 py-2 bg-[#F4F5F7] text-slate-900 font-bold text-sm rounded-lg">All Auctions</button>
          <button className="px-6 py-2 text-slate-500 font-medium text-sm hover:bg-gray-50 rounded-lg">My Routes</button>
          <button className="px-6 py-2 text-slate-500 font-medium text-sm hover:bg-gray-50 rounded-lg">Watchlist</button>
        </div>

        <div className="flex items-center space-x-4 pr-4">
          <button className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Filter className="w-4 h-4" /> More Filters
          </button>

          <div className="h-4 w-px bg-gray-300"></div>

          {/* ✅ CLICKABLE SORT */}
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="text-sm font-semibold text-slate-600 flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-all duration-200"
          >
            Sort by:
            <span className="text-slate-900">
              Time Remaining {sortOrder === 'asc' ? '↑' : '↓'}
            </span>
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-4">
        {sortedRfqs.map((rfq) => {

          // ✅ IMPORTANT FIX (AUTO CLOSE)
          const isExpired = new Date() >= new Date(rfq.bidCloseDate);
          const displayStatus = isExpired ? 'CLOSED' : rfq.status;

          return (
            <div key={rfq._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded ${
                    displayStatus === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {displayStatus}
                  </span>

                  <span className="text-[11px] font-bold text-gray-400">
                    AUC-ID: {rfq.referenceId}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900">
                  {rfq.name || "No Name"}
                </h3>

                <p className="text-[13px] font-medium text-slate-500">
                  {format(new Date(rfq.pickupDate), 'MMM d, yyyy')} • {rfq.isBritishAuction ? 'British Auction' : 'Standard'}
                </p>
              </div>

              <div className="flex gap-10 border-l border-r border-gray-100 px-10">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Current Low Bid
                  </p>
                  <p className="text-2xl font-black text-slate-900">
                    {rfq.lowestBid ? `₹${rfq.lowestBid.toLocaleString()}` : 'No bids'}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Time Remaining
                  </p>

                  <p className={`text-xl font-black ${!isExpired ? 'text-red-600' : 'text-slate-900'}`}>
                    {!isExpired
                      ? format(new Date(rfq.bidCloseDate), 'MMM d, h:mm:ss a')
                      : 'Ended'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-40">
                <Link to={`/rfq/${rfq._id}`} className="w-full bg-slate-900 text-white text-[13px] font-bold py-2.5 rounded-lg text-center">
                  Enter Bid Room
                </Link>
                <Link to={`/rfq/${rfq._id}`} className="w-full bg-white border border-gray-300 text-slate-700 text-[13px] font-bold py-2.5 rounded-lg text-center">
                  View Details
                </Link>
              </div>

            </div>
          );
        })}

        {sortedRfqs.length === 0 && (
          <div className="text-center py-20">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>No Auctions Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RFQList;