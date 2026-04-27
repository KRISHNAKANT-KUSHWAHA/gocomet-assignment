# 🏆 British Auction RFQ System
<img width="1897" height="785" alt="Screenshot 2026-04-25 235626" src="https://github.com/user-attachments/assets/3f8270e4-131e-4397-b558-09da191b0087" />
<img width="1580" height="682" alt="image" src="https://github.com/user-attachments/assets/0c6509ed-1bb3-405f-a588-27de6460004b" />

## 👨‍💻 Developed By

**Pushpendra Kumar Rathour**

---

## 🚀 Project Overview

This project implements a **British Auction system within an RFQ (Request for Quotation) platform**.
Suppliers compete by submitting progressively lower bids, while the system dynamically extends auction time based on activity and enforces a strict forced-close rule.

---

## 🎯 Key Features

### 🧾 RFQ Management

* Create RFQs with auction configuration
* Define bid start, close, and forced close times

### 🔥 British Auction Engine

* Trigger Window (X minutes)
* Extension Duration (Y minutes)
* Extension Triggers:

  * Any Bid
  * Any Rank Change
  * L1 Rank Change
* Automatic time extension logic
* Forced close enforcement (hard stop)

### 💰 Bidding System

* Suppliers submit bids with cost breakdown
* Bid must be **lower than current lowest bid**
* Automatic **ranking (L1, L2, L3...)**

### 📊 Auction Visibility

* Auction Listing Page
* RFQ Details / Bid Room
* Real-time remaining time (based on system time)
* Status:

  * ACTIVE
  * CLOSED
  * FORCE CLOSED

### 🏆 Winner Determination

* Lowest bid (L1) is considered the winner
* Winner shown only after auction closes
* Handles edge case: **No bids → No winner**

### 📝 Activity Logs

* Tracks:

  * Bid submissions
  * Time extensions
  * Reasons for extension

### 🔍 Extra Features

* Search & filter auctions
* Sort by remaining time
* Vendors & Analytics dashboard (bonus)

---

## 🧱 Tech Stack

| Layer    | Technology                 |
| -------- | -------------------------- |
| Frontend | React (Vite), Tailwind CSS |
| Backend  | Node.js, Express           |
| Database | MongoDB (Mongoose)         |
| Auth     | JWT                        |
| API      | REST APIs                  |

---

## 🏗️ Architecture (HLD Summary)

```text
Frontend (React)
      ↓ REST API
Backend (Node.js + Express)
      ↓
MongoDB Database

Core Modules:
- Auction Engine
- Ranking Engine
- Activity Logger
```

---

## 🧩 Database Schema (Summary)

### RFQ

* name, referenceId
* bidStartDate, bidCloseDate, forcedBidCloseDate
* triggerWindowMinutes, extensionDurationMinutes
* extensionTriggerType
* status

### Bid

* rfqId
* carrierName
* charges (freight, origin, destination)
* totalCharges
* rank

### ActivityLog

* rfqId
* type (BID_SUBMITTED, TIME_EXTENSION)
* description
* timestamp

### User

* name, email, password

---

## ⚙️ How to Run the Project

### 1️⃣ Clone Repository

```bash
git clone <your-repo-link>
cd rfq-british-auction
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

### 4️⃣ Environment Variables (.env)

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
PORT=5000
```

---

## 🔄 System Flow

1. User creates RFQ
2. Suppliers place bids
3. Backend validates bid & updates ranking
4. Auction may extend based on rules
5. Auction closes (normal or forced)
6. Winner = Lowest bid (L1)

---

## 📌 Important Rules Implemented

* Bid must be lower than current lowest bid
* Auction extends only within trigger window
* Auction never exceeds forced close time
* No bids allowed after close
* Winner shown only after auction ends

---

## 🚧 Future Improvements

* WebSocket-based real-time updates (instead of polling)
* Role-based access control (Admin vs Vendor)
* Notifications for bid updates
* Graph-based analytics

---

## 🎯 Conclusion

This project demonstrates a complete implementation of a **British Auction system**, including dynamic extensions, fair bidding logic, and real-time auction tracking.

---

## 📎 Submission Includes

* ✔ Frontend Code
* ✔ Backend Code
* ✔ HLD Diagram
* ✔ Database Schema
* ✔ README

---

⭐ *Thank you!*
