const express = require('express');
const router = express.Router();
const RFQ = require('../models/RFQ');
const Bid = require('../models/Bid');
const ActivityLog = require('../models/ActivityLog');

// Create RFQ
router.post('/', async (req, res) => {
  try {
    const rfq = new RFQ({
      ...req.body,
      initialBidCloseDate: req.body.bidCloseDate
    });
    
    // Validate forced close > bid close
    if (new Date(rfq.forcedBidCloseDate) <= new Date(rfq.bidCloseDate)) {
      return res.status(400).json({ message: 'Forced Bid Close Time must be greater than Bid Close Time' });
    }
    
    await rfq.save();
    res.status(201).json(rfq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// List RFQs
router.get('/', async (req, res) => {
  try {
    const rfqs = await RFQ.find().sort({ createdAt: -1 });
    
    // Check and update status based on current time
    const now = new Date();
    
    const rfqsWithLowestBid = await Promise.all(rfqs.map(async (rfq) => {
      // Auto-update status if past time
      let updatedStatus = rfq.status;
      if (rfq.status === 'ACTIVE') {
        if (now >= new Date(rfq.forcedBidCloseDate)) {
          updatedStatus = 'FORCE_CLOSED';
          await RFQ.findByIdAndUpdate(rfq._id, { status: updatedStatus });
        } else if (now >= new Date(rfq.bidCloseDate)) {
          updatedStatus = 'CLOSED';
          await RFQ.findByIdAndUpdate(rfq._id, { status: updatedStatus });
        }
        rfq.status = updatedStatus;
      }

      const lowestBid = await Bid.findOne({ rfqId: rfq._id }).sort({ totalCharges: 1 });
      return {
        ...rfq.toObject(),
        lowestBid: lowestBid ? lowestBid.totalCharges : null
      };
    }));
    
    res.json(rfqsWithLowestBid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Single RFQ with Bids and Logs
router.get('/:id', async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.params.id);
    if (!rfq) return res.status(404).json({ message: 'RFQ not found' });
    
    // Update status dynamically if accessed
    const now = new Date();
    if (rfq.status === 'ACTIVE') {
        if (now >= new Date(rfq.forcedBidCloseDate)) {
            rfq.status = 'FORCE_CLOSED';
            await rfq.save();
        } else if (now >= new Date(rfq.bidCloseDate)) {
            rfq.status = 'CLOSED';
            await rfq.save();
        }
    }
    
    const bids = await Bid.find({ rfqId: rfq._id }).sort({ rank: 1 });
    const logs = await ActivityLog.find({ rfqId: rfq._id }).sort({ timestamp: -1 });
    
    res.json({ rfq, bids, logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
