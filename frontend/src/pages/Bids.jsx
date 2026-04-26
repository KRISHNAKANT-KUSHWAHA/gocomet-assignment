import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import api from '../api';

const Bids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const rfqsRes = await api.get('/rfqs');

        let allBids = [];

        for (let rfq of rfqsRes.data) {
          const res = await api.get(`/rfqs/${rfq._id}`);
          const bidsWithRFQ = res.data.bids.map(bid => ({
            ...bid,
            rfqName: res.data.rfq.name,
            referenceId: res.data.rfq.referenceId
          }));
          allBids.push(...bidsWithRFQ);
        }

        allBids.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBids(allBids);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">All Bids</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {bids.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No bids found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-[11px] font-bold text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-3 text-left">RFQ</th>
                <th className="px-6 py-3 text-left">Carrier</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3 text-center">Rank</th>
                <th className="px-6 py-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bids.map((bid) => (
                <tr key={bid._id}>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{bid.rfqName}</p>
                    <p className="text-xs text-gray-400">{bid.referenceId}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">{bid.carrierName}</td>
                  <td className="px-6 py-4 text-right font-black">
                    ₹{bid.totalCharges.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center font-bold">
                    L{bid.rank}
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-gray-500">
                    {format(new Date(bid.createdAt), 'MMM d, HH:mm')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Bids;