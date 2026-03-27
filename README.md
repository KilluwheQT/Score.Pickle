# Pickleball Score System

A modern, real-time pickleball scoring system built with Next.js 16 and Firebase.

## Features

- 🏓 Real-time match scoring
- 📱 Multi-court monitoring
- 🎮 Live score updates
- 📊 Match history tracking
- 🔗 QR code sharing
- 🖥️ OBS studio integration

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Firebase Realtime Database
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Deployment

This project is optimized for Vercel deployment. Simply connect your GitHub repository to Vercel and deploy.

## Project Structure

```
├── app/                 # Next.js app router
├── components/          # Reusable components
├── lib/                # Utility functions and Firebase config
├── public/             # Static assets
└── vercel.json         # Vercel configuration
```
