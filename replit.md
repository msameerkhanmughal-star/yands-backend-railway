# Yousif & Sons Rent A Car

## Overview
A vehicle rental management application built with React, TypeScript, and Firebase. Features include vehicle management, booking/rental tracking, client management, invoice generation, vehicle condition reports with image uploads, and user authentication via Firebase Auth with Firestore as the database.

## Project Architecture
- **Frontend**: React + Vite + TypeScript + Tailwind CSS + shadcn/ui (port 5000)
- **Primary Database/Auth**: Firebase (Firestore + Auth) — no separate backend needed for the main app
- **Supporting Backend**: Node.js/Express server (`server.js`) for Backblaze B2 file uploads (port 3001)

## Project Structure
```
frontend/          # React application (main app)
  src/
    components/    # UI components (including shadcn/ui)
    hooks/         # Custom React hooks (useAuth, use-toast)
    lib/           # Firebase config, Firestore service, PDF generator
    pages/         # Page components (Dashboard, Vehicles, Rentals, etc.)
    types/         # TypeScript type definitions
  public/          # Static assets (PWA icons, favicon)
server.js          # Node.js Express backend for Backblaze B2 file uploads
memory/            # Project documentation/notes
attached_assets/   # Project images and assets
```

## Development
- Frontend runs on port 5000 via Vite dev server (`cd frontend && npm run dev`)
- Backend server runs on port 3001 (`node server.js`) — requires B2_KEY_ID, B2_APP_KEY, B2_BUCKET_ID env vars
- Uses Firebase for authentication and data storage (requires Firebase config in environment)
- PWA-enabled app with offline support

## Environment Variables Required
- `B2_KEY_ID` — Backblaze B2 application key ID
- `B2_APP_KEY` — Backblaze B2 application key
- `B2_BUCKET_ID` — Backblaze B2 bucket ID
- Firebase config (likely in `frontend/src/lib/firebase.ts`)

## Deployment
- Configured as static site deployment
- Build: `cd frontend && npm run build`
- Public directory: `frontend/dist`

## Recent Changes
- 2026-03-02: Extracted and set up project in Replit environment. Installed Node.js 20, configured frontend workflow on port 5000, backend workflow on port 3001, and static deployment settings.
