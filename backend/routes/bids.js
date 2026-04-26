// const express = require('express');
// const router = express.Router();
// const Bid = require('../models/Bid');
// const RFQ = require('../models/RFQ');
// const ActivityLog = require('../models/ActivityLog');

// router.post('/', async (req, res) => {
//   try {
//     const { rfqId, carrierName, freightCharges, originCharges, destinationCharges, transitTime, validityOfQuote } = req.body;
    
//     const rfq = await RFQ.findById(rfqId);
//     if (!rfq) return res.status(404).json({ message: 'RFQ not found' });
    
//     // Check if auction is active
//     const now = new Date();
//     if (rfq.status !== 'ACTIVE' || now >= new Date(rfq.bidCloseDate) || now >= new Date(rfq.forcedBidCloseDate)) {
//       // Auto-close if passed
//       if (rfq.status === 'ACTIVE') {
//           rfq.status = now >= new Date(rfq.forcedBidCloseDate) ? 'FORCE_CLOSED' : 'CLOSED';
//           await rfq.save();
//       }
//       return res.status(400).json({ message: 'Auction is closed' });
//     }
    
//     const totalCharges = Number(freightCharges) + Number(originCharges) + Number(destinationCharges);
    


//     const lowestBid = await Bid.findOne({ rfqId }).sort({ totalCharges: 1 });

// if (lowestBid && totalCharges >= lowestBid.totalCharges) {
//   return res.status(400).json({
//     message: 'Bid must be lower than current lowest bid'
//   });
// }  
//     // Get existing bids to calculate rank changes
//     const existingBids = await Bid.find({ rfqId }).sort({ totalCharges: 1 });
//     const oldLowestBid = existingBids.length > 0 ? existingBids[0] : null;
    
//     // Create new bid
//     const bid = new Bid({
//       rfqId, carrierName, freightCharges, originCharges, destinationCharges, totalCharges, transitTime, validityOfQuote, rank: 0
//     });
    
//     await bid.save();
    
//     // Re-rank all bids
//     const allBids = await Bid.find({ rfqId }).sort({ totalCharges: 1 });
//     let rankChanged = false;
//     let l1RankChanged = false;
    
//     for (let i = 0; i < allBids.length; i++) {
//       if (allBids[i].rank !== i + 1) {
//         rankChanged = true;
//         allBids[i].rank = i + 1;
//         await allBids[i].save();
//       }
//     }
    
//     const newLowestBid = allBids[0];
//     if (!oldLowestBid || oldLowestBid._id.toString() !== newLowestBid._id.toString()) {
//       l1RankChanged = true;
//     }
    
//     // Log bid submission
//     await ActivityLog.create({
//       rfqId,
//       type: 'BID_SUBMITTED',
//       description: `Bid of ${totalCharges} placed by ${carrierName}`
//     });
    
//     // Check for Auction Extension
//     if (rfq.isBritishAuction) {
//       const bidCloseTime = new Date(rfq.bidCloseDate).getTime();
//       const triggerWindowMs = (rfq.triggerWindowMinutes || 0) * 60 * 1000;
//       const extensionMs = (rfq.extensionDurationMinutes || 0) * 60 * 1000;
      
//       const timeRemaining = bidCloseTime - now.getTime();
      
//       if (timeRemaining > 0 && timeRemaining <= triggerWindowMs) {
//         let shouldExtend = false;
//         let reason = '';
        
//         switch (rfq.extensionTriggerType) {
//           case 'ANY_BID':
//             shouldExtend = true;
//             reason = 'A bid was placed in the trigger window';
//             break;
//           case 'ANY_RANK_CHANGE':
//             if (rankChanged) {
//               shouldExtend = true;
//               reason = 'A rank change occurred in the trigger window';
//             }
//             break;
//           case 'L1_RANK_CHANGE':
//             if (l1RankChanged) {
//               shouldExtend = true;
//               reason = 'L1 bidder changed in the trigger window';
//             }
//             break;
//         }
        
//         if (shouldExtend) {
//           const newCloseTime = new Date(bidCloseTime + extensionMs);
//           const forcedCloseTime = new Date(rfq.forcedBidCloseDate);
          
//           if (newCloseTime > forcedCloseTime) {
//              rfq.bidCloseDate = forcedCloseTime;
//              reason += ` (Extended to Forced Close Time)`;
//           } else {
//              rfq.bidCloseDate = newCloseTime;
//           }
          
//           await rfq.save();
          
//           await ActivityLog.create({
//             rfqId,
//             type: 'TIME_EXTENSION',
//             description: `Auction extended. Reason: ${reason}. New close time: ${rfq.bidCloseDate}`
//           });
//         }
//       }
//     }
    
//     res.status(201).json(bid);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');
const RFQ = require('../models/RFQ');
const ActivityLog = require('../models/ActivityLog');

router.post('/', async (req, res) => {
  try {
    const {
      rfqId,
      carrierName,
      freightCharges,
      originCharges,
      destinationCharges,
      transitTime,
      validityOfQuote
    } = req.body;

    const rfq = await RFQ.findById(rfqId);
    if (!rfq) return res.status(404).json({ message: 'RFQ not found' });

    const now = new Date();
    const bidClose = new Date(rfq.bidCloseDate);
    const forcedClose = new Date(rfq.forcedBidCloseDate);

    // 🔴 1. FORCE CLOSE CHECK (highest priority)
    if (now >= forcedClose) {
      if (rfq.status !== 'FORCE_CLOSED') {
        rfq.status = 'FORCE_CLOSED';
        await rfq.save();
      }
      return res.status(400).json({ message: 'Auction force closed' });
    }

    // 🔴 2. NORMAL CLOSE CHECK
    if (now >= bidClose) {
      if (rfq.status !== 'CLOSED') {
        rfq.status = 'CLOSED';
        await rfq.save();
      }
      return res.status(400).json({ message: 'Auction closed' });
    }

    // 🔴 3. STATUS CHECK
    if (rfq.status !== 'ACTIVE') {
      return res.status(400).json({ message: 'Auction is not active' });
    }

    // 🟢 Calculate total charges
    const totalCharges =
      Number(freightCharges) +
      Number(originCharges) +
      Number(destinationCharges);

    // 🔴 4. LOWER BID VALIDATION (IMPORTANT)
    const lowestBid = await Bid.findOne({ rfqId }).sort({ totalCharges: 1 });

    if (lowestBid && totalCharges >= lowestBid.totalCharges) {
      return res.status(400).json({
        message: 'Bid must be lower than current lowest bid'
      });
    }

    // 🟢 Get existing bids for comparison
    const existingBids = await Bid.find({ rfqId }).sort({ totalCharges: 1 });
    const oldLowestBid = existingBids.length > 0 ? existingBids[0] : null;

    // 🟢 Create new bid
    const bid = new Bid({
      rfqId,
      carrierName,
      freightCharges,
      originCharges,
      destinationCharges,
      totalCharges,
      transitTime,
      validityOfQuote,
      rank: 0
    });

    await bid.save();

    // 🟢 Re-rank all bids
    const allBids = await Bid.find({ rfqId }).sort({ totalCharges: 1 });

    let rankChanged = false;
    let l1RankChanged = false;

    for (let i = 0; i < allBids.length; i++) {
      if (allBids[i].rank !== i + 1) {
        rankChanged = true;
        allBids[i].rank = i + 1;
        await allBids[i].save(); // OK for assignment
      }
    }

    const newLowestBid = allBids[0];

    if (
      !oldLowestBid ||
      oldLowestBid._id.toString() !== newLowestBid._id.toString()
    ) {
      l1RankChanged = true;
    }

    // 🟢 Log bid
    await ActivityLog.create({
      rfqId,
      type: 'BID_SUBMITTED',
      description: `Bid of ${totalCharges} placed by ${carrierName}`
    });

    // 🔥 5. EXTENSION LOGIC
    if (rfq.isBritishAuction) {
      const bidCloseTime = new Date(rfq.bidCloseDate).getTime();
      const triggerWindowMs =
        (rfq.triggerWindowMinutes || 0) * 60 * 1000;
      const extensionMs =
        (rfq.extensionDurationMinutes || 0) * 60 * 1000;

      const timeRemaining = bidCloseTime - now.getTime();

      if (timeRemaining > 0 && timeRemaining <= triggerWindowMs) {
        let shouldExtend = false;
        let reason = '';

        switch (rfq.extensionTriggerType) {
          case 'ANY_BID':
            shouldExtend = true;
            reason = 'A bid was placed in the trigger window';
            break;

          case 'ANY_RANK_CHANGE':
            if (rankChanged) {
              shouldExtend = true;
              reason = 'A rank change occurred in the trigger window';
            }
            break;

          case 'L1_RANK_CHANGE':
            if (l1RankChanged) {
              shouldExtend = true;
              reason = 'L1 bidder changed in the trigger window';
            }
            break;
        }

        if (shouldExtend) {
          const newCloseTime = new Date(bidCloseTime + extensionMs);
          const forcedCloseTime = new Date(rfq.forcedBidCloseDate);

          if (newCloseTime > forcedCloseTime) {
            rfq.bidCloseDate = forcedCloseTime;
            reason += ' (Extended to Forced Close Time)';
          } else {
            rfq.bidCloseDate = newCloseTime;
          }

          await rfq.save();

          await ActivityLog.create({
            rfqId,
            type: 'TIME_EXTENSION',
            description: `Auction extended. Reason: ${reason}. New close time: ${rfq.bidCloseDate}`
          });
        }
      }
    }

    res.status(201).json(bid);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;