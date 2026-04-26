import React, { useEffect, useState } from 'react';
import { TrendingUp, BarChart2 } from 'lucide-react';
import api from '../api';

const Analytics = () => {
  const [stats, setStats] = useState({
    totalRFQs: 0,
    activeRFQs: 0,
    totalBids: 0,
    avgBids: 0
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const rfqsRes = await api.get('/rfqs');
        const rfqs = rfqsRes.data;

        let totalBids = 0;

        for (let rfq of rfqs) {
          const res = await api.get(`/rfqs/${rfq._id}`);
          totalBids += res.data.bids.length;
        }

        const activeRFQs = rfqs.filter(r => r.status === 'ACTIVE').length;

        setStats({
          totalRFQs: rfqs.length,
          activeRFQs,
          totalBids,
          avgBids: rfqs.length ? (totalBids / rfqs.length).toFixed(1) : 0
        });

      } catch (err) {
        console.error(err);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Analytics</h1>

      <div className="grid md:grid-cols-4 gap-6">
        <Card title="Total RFQs" value={stats.totalRFQs} />
        <Card title="Active Auctions" value={stats.activeRFQs} />
        <Card title="Total Bids" value={stats.totalBids} />
        <Card title="Avg Bids/RFQ" value={stats.avgBids} />
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl border shadow-sm">
    <p className="text-xs uppercase text-gray-400">{title}</p>
    <p className="text-2xl font-black text-slate-900 mt-2">{value}</p>
  </div>
);

export default Analytics;