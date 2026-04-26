const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  rfqId: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ', required: true },
  type: { type: String, required: true }, // 'BID_SUBMITTED', 'TIME_EXTENSION'
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
