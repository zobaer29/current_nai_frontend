# ⚡ CurrentNai (কারেন্টনাই) - Frontend

A crowdsourced electricity outage monitoring and reporting platform for Bangladesh.

## 🚀 Tech Stack
- **Framework**: Vite + React 19 (TypeScript)
- **Styling**: Tailwind CSS (v4) with Dark Mode Tech Aesthetic
- **State Management**: Redux Toolkit (`@reduxjs/toolkit` + `react-redux`)
- **Map & Geolocation**: Leaflet & React-Leaflet with custom animated pins
- **Icons**: Lucide React (`lucide-react`)

## 🔑 Key Features
- **Header Navbar**: App branding, location picker dropdown (Home, Office, University), and instant area search with autocomplete.
- **My Area Status Card**: Displays real-time crowdsourced outage confidence score, active minutes, and interactive reporting buttons (`🔴 আমার কারেন্ট নেই`, `🟢 আমার কারেন্ট আছে`).
- **Interactive Leaflet Map**: Re-centers dynamically with user selection, features pulsing red/amber markers for outages, restored green pins, privacy-focused approximate user location radius, and heatmap filter overlays.
- **Saved Places & Nearby Stats**: Quick switch cards for saved locations and nearby community report summary metrics.

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```
