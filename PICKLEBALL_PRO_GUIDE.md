# 🏓 Pickleball Pro - Real-Time Scoring System

## 🎯 Overview
Pickleball Pro is a comprehensive real-time scoring system with multi-court support, referee authentication, and professional dark-themed UI.

## 🚀 Quick Setup

### Step 1: Create Admin Account
```bash
cd pikolsystem
node setup-admin-v2.js
```

This creates:
- **Email**: admin@pickleballpro.com
- **Password**: admin123
- **Referee Code**: Auto-generated (shown in output)

### Step 2: Access the System
1. **Visit**: `http://localhost:3000/landing-v2`
2. **Sign In**: Use admin credentials
3. **Access**: Full admin dashboard

### Step 3: Add Users
1. **New users sign up** at `/signup-v2`
2. **Admin approves** users in `/admin-v2`
3. **Users get referee codes** and can score matches

## 🎮 System Features

### 🔐 Authentication System
- **User Registration**: Email signup with admin approval
- **Referee Codes**: Unique 6-digit codes for each user
- **Role-Based Access**: Admin vs User permissions
- **Session Management**: Persistent login sessions

### 🏟️ Multi-Court System
- **Dynamic Court Creation**: Admin can create unlimited courts
- **Real-Time Updates**: Live scores sync across all users
- **Court Status**: Active, Available, Inactive states
- **Match History**: Track all matches per court

### 🎮 Scoring System
- **Referee Authentication**: Only valid codes can update scores
- **Pickleball Rules**: First to 11, win by 2
- **Serving Indicators**: Visual serving team display
- **Score Controls**: +1, Undo, Reset functions
- **Live Scoreboard**: Large, readable score display

### 🌙 Dark Theme UI
- **Professional Design**: Black background with neon accents
- **Color Coding**: Green (success), Purple (admin), Yellow (warning), Red (error)
- **Responsive Design**: Works on all devices
- **Glow Effects**: Modern shadow and border effects

## 📱 User Roles & Permissions

### 👑 Administrator
- **User Management**: Approve/reject user accounts
- **Court Creation**: Create and manage courts
- **System Access**: Full dashboard and admin panel
- **Match Oversight**: View all active matches

### 🏓 Referee/User
- **Court Access**: Join any available court
- **Score Updates**: Use referee code to update scores
- **Match Creation**: Start new matches on courts
- **Live Viewing**: Watch all court scores

### 👁️ Viewer
- **Score Viewing**: Watch live scores (no code required)
- **Court Monitoring**: View court status and matches
- **Public Access**: No login required for viewing

## 🗂️ File Structure

```
/app
├── dashboard/page.js          # Main dashboard with court overview
├── court/[id]/page.js         # Individual court scoring page
├── admin-v2/page.js           # Admin user management
├── login-v2/page.js           # User login
├── signup-v2/page.js          # User registration
└── landing-v2/page.js         # Public landing page

/components
├── CourtCard.js               # Court display card
└── AuthWrapper.js             # Authentication protection

/lib
├── auth-v2.js                 # Authentication logic
├── courts.js                  # Court and match management
└── firebase.js                # Firebase configuration

/setup-admin-v2.js            # Admin account creation
```

## 🎯 Core Functionality

### User Registration Flow
1. **Signup** → User creates account (status: pending)
2. **Admin Approval** → Admin reviews and approves
3. **Referee Code** → User gets unique 6-digit code
4. **Active Access** → User can now score matches

### Court Management
1. **Create Court** → Admin adds new court with name
2. **Start Match** → Referee enters teams and referee code
3. **Live Scoring** → Real-time score updates with code validation
4. **Match End** → Winner determined, match archived

### Scoring Rules
- **Serving Team Only**: Only serving team can score points
- **First to 11**: Game ends when team reaches 11 points
- **Win by 2**: Must win by at least 2 points
- **Service Rotation**: Serving team switches after each point
- **Match Status**: Active, Completed, Reset options

## 🔧 Technical Implementation

### Firebase Realtime Database
```javascript
// Users Collection
users/
  {userId}/
    email: string
    name: string
    password: string
    status: "pending" | "approved" | "rejected"
    role: "user" | "admin"
    refereeCode: string
    createdAt: timestamp
    lastLogin: timestamp

// Courts Collection
courts/
  {courtId}/
    id: string
    name: string
    status: "active" | "inactive"
    createdBy: string
    createdAt: timestamp
    currentMatch: object
    matchHistory: array

// Matches Collection
matches/
  {matchId}/
    id: string
    courtId: string
    teamA: object
    teamB: object
    refereeCode: string
    status: "active" | "completed"
    startTime: timestamp
    endTime: timestamp
    winner: "A" | "B" | null
    gameHistory: array
```

### Authentication Flow
```javascript
// 1. User Registration
signUp(email, password, name) → Creates user with "pending" status

// 2. Admin Approval
updateUserStatus(userId, "approved") → User gets referee code

// 3. Login with Status Check
signIn(email, password) → Checks status, returns error if pending

// 4. Referee Code Validation
validateRefereeCode(code) → Verifies code and user status
```

### Real-Time Updates
```javascript
// Subscribe to court updates
subscribeToCourts(callback) → Real-time court data

// Subscribe to match updates
subscribeToMatch(matchId, callback) → Live score updates

// Update match score
updateMatchScore(matchId, refereeCode, team) → Validated score update
```

## 🎨 UI Design System

### Color Palette
- **Background**: Black (#000000)
- **Primary**: Green (#10b981)
- **Secondary**: Purple (#a855f7)
- **Accent**: Yellow (#eab308)
- **Error**: Red (#ef4444)
- **Info**: Blue (#3b82f6)
- **Neutral**: Gray (#374151, #1f2937)

### Component Styling
```javascript
// Cards
bg-gray-900 border-2 border-green-500 shadow-lg shadow-green-500/20

// Buttons
bg-green-500 text-black hover:bg-green-400 transform hover:scale-105

// Inputs
bg-gray-800 border-gray-700 text-white placeholder-gray-500

// Text
text-white (primary)
text-gray-400 (secondary)
text-green-400 (accent)
```

## 🚀 Deployment

### Environment Variables
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

### Vercel Deployment
1. **Push to GitHub**: `git push origin main`
2. **Connect Vercel**: Link repository
3. **Set Environment Variables**: Add Firebase config
4. **Deploy**: Automatic deployment on push

## 🎮 Usage Examples

### Admin Workflow
1. **Sign in** as admin
2. **Go to Admin Panel** → Review pending users
3. **Approve Users** → Users get referee codes
4. **Create Courts** → Add tournament courts
5. **Monitor Activity** → View live matches

### Referee Workflow
1. **Sign in** with approved account
2. **View Dashboard** → See all courts
3. **Select Court** → Join available court
4. **Start Match** → Enter teams and referee code
5. **Score Match** → Use referee code to update scores
6. **End Match** → Winner determined automatically

### Viewer Workflow
1. **Visit Dashboard** → No login required
2. **View Courts** → See all court statuses
3. **Watch Scores** → Live score updates
4. **Monitor Tournament** → Real-time match progress

## 🌟 Advanced Features

### Match History
- **Point-by-Point**: Complete game history
- **Timestamp Tracking**: When each point was scored
- **Referee Tracking**: Who scored each point
- **Match Statistics**: Total points, duration, winner

### Security Features
- **Code Validation**: Only valid referee codes can score
- **Session Management**: Secure user sessions
- **Role-Based Access**: Admin vs user permissions
- **Input Validation**: Form validation and sanitization

### Performance Optimizations
- **Real-Time Subscriptions**: Efficient Firebase listeners
- **Component Caching**: Optimized re-rendering
- **Responsive Design**: Mobile-first approach
- **Loading States**: Professional loading indicators

## 🔍 Troubleshooting

### Common Issues
1. **User Can't Login**: Check if account is approved
2. **Score Update Failed**: Verify referee code is correct
3. **Court Not Showing**: Ensure court is marked as active
4. **Real-Time Not Working**: Check Firebase connection

### Debug Steps
1. **Check Browser Console** for JavaScript errors
2. **Verify Firebase Rules** allow database access
3. **Test Admin Account** with setup script
4. **Check Network Tab** for API calls

## 🎯 Future Enhancements

### Planned Features
- **QR Code Generation**: Quick court access
- **Sound Effects**: Score update notifications
- **Match Timer**: Automatic time tracking
- **Tournament Mode**: Bracket management
- **Mobile App**: Native iOS/Android apps
- **Live Streaming**: OBS integration
- **Statistics Dashboard**: Advanced analytics
- **Multi-Language Support**: Internationalization

### Technical Improvements
- **Password Hashing**: bcrypt implementation
- **JWT Tokens**: Secure authentication
- **Rate Limiting**: API protection
- **Database Indexing**: Performance optimization
- **Error Logging**: Comprehensive monitoring
- **Unit Tests**: Code coverage
- **CI/CD Pipeline**: Automated deployment

---

## 🎉 Ready to Use!

Your Pickleball Pro scoring system is now fully configured:

1. **Admin Account**: Created with setup script
2. **User Registration**: Ready for new users
3. **Court Management**: Admin can create courts
4. **Scoring System**: Referee code validation active
5. **Real-Time Updates**: Live score synchronization
6. **Dark Theme**: Professional UI ready

**The system is now ready for tournament use!** 🏓🔐🌙

## 📞 Support

For issues or questions:
1. **Check this guide** for common solutions
2. **Review error messages** in browser console
3. **Verify Firebase configuration** in environment variables
4. **Test admin account** with setup script

**Happy scoring!** 🎮🏆
