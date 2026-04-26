const mongoose = require('mongoose');

const rfqSchema = new mongoose.Schema({
  referenceId: { type: String, required: true },
  name: { type: String, required: true },
  pickupDate: { type: Date, required: true },
  
  bidStartDate: { type: Date, required: true },
  bidCloseDate: { type: Date, required: true },
  initialBidCloseDate: { type: Date, required: true },
  forcedBidCloseDate: { type: Date, required: true },
  
  isBritishAuction: { type: Boolean, default: false },
  triggerWindowMinutes: { type: Number },
  extensionDurationMinutes: { type: Number },
  extensionTriggerType: { type: String, enum: ['ANY_BID', 'ANY_RANK_CHANGE', 'L1_RANK_CHANGE'] },
  
  status: { type: String, enum: ['ACTIVE', 'CLOSED', 'FORCE_CLOSED'], default: 'ACTIVE' }
}, { timestamps: true });

module.exports = mongoose.model('RFQ', rfqSchema);
