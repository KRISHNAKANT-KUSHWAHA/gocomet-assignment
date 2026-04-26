const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  rfqId: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ', required: true },
  carrierName: { type: String, required: true },
  
  freightCharges: { type: Number, required: true },
  originCharges: { type: Number, required: true },
  destinationCharges: { type: Number, required: true },
  totalCharges: { type: Number, required: true },
  
  transitTime: { type: String, required: true },
  validityOfQuote: { type: Date, required: true },
  
  rank: { type: Number }
}, { timestamps: true });

bidSchema.index({ rfqId: 1, totalCharges: 1 });
module.exports = mongoose.model('Bid', bidSchema);
