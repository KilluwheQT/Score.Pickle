# 🏓 Pickleball Scoring System

A modern, real-time web application for scoring pickleball matches using Next.js and Firebase Realtime Database.

## 🚀 Features

### Core Features
- **Match Setup**: Configure teams, singles/doubles, and match format (1, 3, or 5 games)
- **Live Scoring**: Real-time score updates with serving indicators
- **Pickleball Rules**: 
  - Only serving team can score
  - First to 11 points wins (must win by 2)
  - Side switching for doubles
  - Server rotation for doubles
- **Real-time Sync**: Multiple devices can view and update the same match
- **Match History**: Store and view completed matches
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

### Advanced Features
- **Sound Effects**: Audio feedback on score updates
- **Dark Mode**: Toggle between light and dark themes
- **QR Code Sharing**: Easy way for others to join matches
- **Admin/Viewer Modes**: Control who can update scores
- **Undo Functionality**: Reverse the last score change
- **Match Duration Tracking**: Track how long matches take
- **OBS Viewer**: Dedicated scoreboard for live streaming

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (JavaScript only)
- **Styling**: Tailwind CSS 4
- **Real-time Database**: Firebase Realtime Database
- **State Management**: React Hooks (useState, useEffect)
- **Additional Libraries**: QRCode, use-sound

## 📋 Project Structure

```
pikolsystem/
├── app/
│   ├── layout.js              # Root layout with metadata
│   ├── page.js                # Home page with match setup
│   ├── match/[id]/page.js     # Live scoring dashboard
│   ├── viewer/[id]/page.js    # OBS-compatible scoreboard viewer
│   ├── viewer/demo/page.js    # OBS viewer demo and setup guide
│   └── history/page.js        # Match history
├── components/
│   ├── MatchSetup.js          # Match configuration component
│   └── Scoreboard.js          # Live scoring component
├── lib/
│   ├── firebase.js            # Firebase configuration
│   └── realtime.js            # Real-time database operations
├── public/
│   └── score-sound.mp3        # Sound effect (optional)
├── README_PICKLEBALL.md       # Main documentation
└── OBS_SETUP_GUIDE.md         # OBS viewer setup guide
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Firebase account (already configured)

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Firebase Configuration

The project is already configured with Firebase. The configuration is in `lib/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB7G0v6-DWGuAJWyd5Vamc1A426Jf7Z6Pw",
  authDomain: "pickleball-906f7.firebaseapp.com",
  databaseURL: "https://pickleball-906f7-default-rtdb.firebaseio.com",
  projectId: "pickleball-906f7",
  storageBucket: "pickleball-906f7.firebasestorage.app",
  messagingSenderId: "709026792895",
  appId: "1:709026792895:web:fad4f5ab215db45c9c4d0a",
  measurementId: "G-BS4YJHTZTZ"
};
```

## 🎮 How to Use

### Creating a Match
1. Navigate to the home page
2. Enter Team A and Team B names
3. Select Singles or Doubles
4. Choose match format (Best of 1, 3, or 5)
5. Click "Start Match"

### Live Scoring
1. The serving team is highlighted with a colored background
2. Only the serving team can add points (Pickleball rule)
3. Click "+1 Point" to increment the serving team's score
4. Use "Switch Serve" to change serving team
5. "Undo" to reverse the last action
6. "Reset" to restart the match

### Sharing Matches
1. Each match has a unique ID (e.g., "ABC123")
2. Share the match URL or QR code
3. Others can join as "Admin" (can score) or "Viewer" (watch only)

### Viewing History
1. Click "History" in the navigation
2. View all completed matches
3. Search by team name
4. See match duration and final scores

## � OBS Viewer for Live Streaming

### Overview
The system includes a dedicated OBS-compatible viewer designed specifically for live streaming and broadcasting pickleball matches.

### Access the Viewer
- **Demo Page**: `/viewer/demo` - Interactive demo with setup instructions
- **Live Viewer**: `/viewer/[MATCH_ID]` - Replace with actual match ID
- **Direct Link**: Available in navigation as "OBS Viewer"

### Key Features
- **Clean Interface**: Minimal design perfect for overlays
- **Real-time Sync**: Instant score updates from main scoreboard
- **Customizable**: Colors, fonts, and display options
- **Responsive**: Works at any resolution
- **Settings Panel**: Click ⚙️ to customize appearance
- **Compact Mode**: Space-saving option for PiP displays

### OBS Setup
1. Add Browser Source in OBS
2. Set URL to `http://localhost:3001/viewer/[MATCH_ID]`
3. Configure width/height (1920x1080 recommended)
4. Enable transparency if needed
5. Customize colors using the settings panel

### Display Options
- **Full Screen**: Complete scoreboard overlay
- **Picture-in-Picture**: Compact corner display
- **Top Bar**: Horizontal score strip
- **Transparent Background**: Clean overlay option

For detailed OBS setup instructions, see `OBS_SETUP_GUIDE.md`.

## �🎯 Pickleball Rules Implementation

### Scoring Rules
- **Only serving team scores**: The non-serving team cannot gain points
- **Win by 2**: Must reach 11 points and lead by at least 2
- **Side switching**: In doubles, teams switch sides every 4 points total
- **Server rotation**: In doubles, servers rotate positions when gaining serve

### Match Formats
- **Best of 1**: First team to win 1 game
- **Best of 3**: First team to win 2 games  
- **Best of 5**: First team to win 3 games

## 🔧 Customization

### Adding Sound Effects
1. Replace `public/score-sound.mp3` with your preferred sound file
2. The sound plays automatically when points are scored

### Firebase Rules
The Firebase database is configured for public read/write access. For production, consider implementing security rules:

```javascript
{
  "rules": {
    "matches": {
      ".read": "true",
      ".write": "true"
    },
    "history": {
      ".read": "true", 
      ".write": "true"
    }
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Match not found**: Ensure the match ID is correct and the match hasn't expired
2. **Real-time updates not working**: Check Firebase configuration and internet connection
3. **Sound not playing**: Ensure the sound file exists in the public folder
4. **QR code not generating**: Check that the qrcode library is properly installed

### Development Tips

- Use browser dev tools to monitor Firebase real-time updates
- Test with multiple browser tabs to verify real-time functionality
- Check the Firebase console for database activity

## 📱 Mobile Usage

The application is fully responsive and works great on mobile devices:
- Large, touch-friendly buttons
- Readable score displays
- Optimized layout for small screens
- QR code scanning for easy match joining

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Environment Variables
For production, you may want to use environment variables for Firebase config:

```javascript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  // ... other config
};
```

## 🎨 UI Features

- **Color-coded teams**: Blue for Team A, Green for Team B
- **Serving indicators**: Animated paddle icon for serving team
- **Smooth transitions**: CSS animations for state changes
- **Dark mode**: Toggle between light and dark themes
- **Responsive design**: Works on all screen sizes

## 📊 Data Structure

### Match Object
```javascript
{
  id: "ABC123",
  teamA: { name: "Team A", score: 5, serving: true },
  teamB: { name: "Team B", score: 3, serving: false },
  matchType: "singles",
  gameFormat: "3",
  currentGame: 1,
  games: [],
  server: { team: "A", player: 1 },
  status: "active",
  createdAt: 1640995200000
}
```

### History Object
```javascript
{
  id: "ABC123",
  teamA: { name: "Team A", score: 11 },
  teamB: { name: "Team B", score: 9 },
  winner: "A",
  games: [...],
  completedAt: 1640995800000
}
```

## 🤝 Contributing

Feel free to contribute improvements:
- Add new features
- Fix bugs
- Improve UI/UX
- Add tests

## 📄 License

This project is open source and available under the MIT License.

---

**Enjoy your pickleball matches! 🏓**
