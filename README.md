# 📱 Auction App

A React Native mobile application for real-time auctions, powered by Convex
 as the backend database and API layer. The app allows users to browse auctions, place bids in real-time, and manage their listings seamlessly.

## 🚀 Features

- 🔐 User Authentication (with Convex Auth or third-party providers)
- 🕒 Real-time Auctions with live bidding updates
- 📦 Create & Manage Listings (title, description, images, starting price)
- 💸 Secure Bidding System with bid history tracking
- 🔔 Notifications when outbid or when an auction ends
- 📊 Auction History for both sellers and bidders

## 🛠️ Tech Stack
- Frontend: React Native Expo
- Backend: Convex (real-time database + functions)
- Auth: Convex Auth / OAuth providers (Google, GitHub and Password)

## ⚙️ Installation & Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/auction-app.git
cd auction-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure Convex.
For more information on setting up convex. Check the full documentation [here](https://www.convex.dev/)
```bash
Install the Convex CLI:
npm install convex
```
Initialize Convex inside the project:
```bash
npx convex dev
```

This will set up a local Convex instance and generate client code.

4. Run the app

If using Expo:
```bash
npm run start
```

## 🤝 Contributing
Contributions are welcome! Please fork this repo, open an issue, or submit a pull request.