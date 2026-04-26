import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import api from '../api';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const rfqs = await api.get('/rfqs');
        let allBids = [];

        for (let rfq of rfqs.data) {
          const res = await api.get(`/rfqs/${rfq._id}`);
          allBids.push(...res.data.bids);
        }

        const vendorMap = {};

        allBids.forEach(bid => {
          if (!vendorMap[bid.carrierName]) {
            vendorMap[bid.carrierName] = {
              name: bid.carrierName,
              totalBids: 0,
              bestBid: bid.totalCharges
            };
          }

          vendorMap[bid.carrierName].totalBids++;
          vendorMap[bid.carrierName].bestBid = Math.min(
            vendorMap[bid.carrierName].bestBid,
            bid.totalCharges
          );
        });

        setVendors(Object.values(vendorMap));
      } catch (err) {
        console.error(err);
      }
    };

    fetchVendors();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Vendors</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {vendors.map((vendor, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-slate-900">{vendor.name}</h3>
                <p className="text-sm text-gray-500">
                  {vendor.totalBids} bids submitted
                </p>
              </div>
              <Users className="w-6 h-6 text-gray-400" />
            </div>

            <div className="mt-4">
              <p className="text-xs text-gray-400 uppercase">Best Bid</p>
              <p className="text-xl font-black text-slate-900">
                ₹{vendor.bestBid.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vendors;