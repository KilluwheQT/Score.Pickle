# 🏓 Multi-Court Monitoring System

## Overview
The Multi-Court system allows you to monitor and score up to 3 pickleball courts simultaneously. Perfect for tournaments, facilities with multiple courts, or complex events.

## 🎯 Features

### 📊 Multi-Court Monitor
- **Real-time monitoring** of up to 3 courts
- **Live score updates** across all courts
- **Status indicators** (In Progress, Completed, Waiting)
- **Quick actions** to score or view each court
- **Dark mode support** for extended monitoring

### 📺 OBS Multi-Court View
- **Compact 3-court display** for live streaming
- **Professional scoreboard layout** for broadcast
- **Real-time synchronization** across all courts
- **Clean design** optimized for streaming overlays

### 🎮 Multi-Court Scoring
- **Quick court switching** for scoring
- **Dedicated scoring interface** for each court
- **Serve switching** and score management
- **Game progress tracking** for all courts

## 🚀 Getting Started

### Step 1: Create Matches
Create individual matches for each court:
1. Go to the main page: `http://localhost:3001`
2. Create matches for Court 1, Court 2, Court 3
3. Note the Match IDs (e.g., ABC123, DEF456, GHI789)

### Step 2: Access Multi-Court Monitor
Navigate to: `http://localhost:3001/multi-court`

### Step 3: Assign Matches to Courts
1. **Enter Match ID** for each court
2. **Click "Add"** or press Enter
3. **Watch real-time updates** appear automatically

## 📱 URL Structure

### Multi-Court Monitor
```
http://localhost:3001/multi-court
```

### OBS Multi-Court View
```
http://localhost:3001/multi-court/obs/ABC123,DEF456,GHI789
```

### Multi-Court Scoring
```
http://localhost:3001/multi-court/score/ABC123,DEF456,GHI789
```

## 🎮 How to Use

### Monitoring Multiple Courts

1. **Open Multi-Court Monitor**
   - Enter Match IDs for each court
   - Watch live scores update in real-time
   - See serving indicators and game status

2. **Quick Actions**
   - **Score**: Open detailed scoring for a court
   - **League View**: Open tournament-style scoreboard
   - **Clear**: Remove match from monitoring

3. **Status Tracking**
   - 🟢 **In Progress**: Active match
   - 🔴 **No Match**: No match assigned
   - ⚫ **Completed**: Match finished

### OBS Streaming Setup

1. **Create OBS Browser Source**
2. **Set URL**: `http://localhost:3001/multi-court/obs/ABC123,DEF456,GHI789`
3. **Configure Settings**:
   ```
   Width: 1920
   Height: 1080
   Custom CSS: body { background: transparent; }
   ```

4. **Position and Resize** as needed

### Scoring Multiple Courts

1. **Open Multi-Court Scoring**
2. **Switch between courts** using court selector
3. **Score active court** with serving rules
4. **Monitor other courts** in overview section

## 🎨 OBS Integration

### Multi-Court OBS View Features

#### **Layout**
- **3-column grid** showing all courts
- **Compact design** optimized for streaming
- **Real-time updates** across all courts
- **Status indicators** for each court

#### **Visual Elements**
- **Court headers** with names and status
- **Team names** with serving indicators
- **Live scores** with serving team highlights
- **Match information** (game number, type)
- **Games progress** for completed sets

#### **Customization**
- **Dark theme** for professional look
- **Responsive design** works at any resolution
- **Clean typography** for broadcast quality

### OBS Setup Instructions

1. **Add Browser Source** in OBS
2. **Set URL** with comma-separated match IDs
3. **Configure dimensions** (1920x1080 recommended)
4. **Enable transparency** if needed
5. **Position on stream** as overlay or main view

## 🔧 Advanced Features

### Court Management

#### **Adding Courts**
- Enter Match ID in the input field
- Click "Add" or press Enter
- Court automatically starts monitoring

#### **Switching Courts**
- Click on different court tabs
- Real-time switching without page reload
- Each court maintains its own state

#### **Clearing Courts**
- Click "Clear" to remove a court
- Court stops monitoring that match
- Can re-add with different Match ID

### Real-time Synchronization

#### **Score Updates**
- **Instant updates** across all interfaces
- **Firebase-powered** real-time database
- **No refresh needed** - updates automatically

#### **Status Changes**
- **Game completion** detected automatically
- **Match status** updates in real-time
- **Serving indicators** update instantly

### Scoring Rules

#### **Pickleball Rules Enforced**
- **Only serving team can score**
- **First to 11 points wins**
- **Must win by 2 points**
- **Automatic game progression**

#### **Multi-Court Scoring**
- **Independent scoring** for each court
- **Court switching** without losing progress
- **Serve switching** when needed
- **Game completion** handling

## 📱 Use Cases

### Tournament Directors
- **Monitor all courts** from one screen
- **Quick scoring** for any court
- **Real-time status** of all matches
- **Professional broadcasting** setup

### Facility Managers
- **Track court usage** and availability
- **Monitor match progress** across facility
- **Display live scores** in common areas
- **Manage multiple events** simultaneously

### Broadcasters
- **Multi-court streaming** for tournaments
- **Professional overlays** for production
- **Real-time score updates** for viewers
- **Clean broadcast** presentation

## 🎯 Best Practices

### For Tournaments
1. **Create all matches** before starting
2. **Note Match IDs** for quick setup
3. **Test OBS setup** before going live
4. **Have backup scoring** methods ready

### For Facilities
1. **Standardize Match ID format** (e.g., COURT1-001)
2. **Train staff** on multi-court system
3. **Set up displays** in common areas
4. **Monitor system performance**

### For Streaming
1. **Test OBS sources** beforehand
2. **Use appropriate dimensions** for your stream
3. **Have backup URLs** ready
4. **Monitor audio levels** separately

## 🔍 Troubleshooting

### Common Issues

#### Court Not Updating
- **Check Match ID** is correct
- **Verify match exists** and is active
- **Refresh browser** if needed
- **Check internet connection**

#### OBS Display Issues
- **Verify URL format** is correct
- **Check dimensions** in OBS settings
- **Test with different resolutions**
- **Refresh browser source** in OBS

#### Scoring Problems
- **Verify serving team** is correct
- **Check match rules** are being followed
- **Refresh scoring page** if needed
- **Verify Firebase connection**

### Performance Tips

1. **Close unused tabs** to improve performance
2. **Use stable internet** connection
3. **Monitor system resources** during tournaments
4. **Have backup devices** ready

## 📊 URL Examples

### Basic Setup
```
Monitor: http://localhost:3001/multi-court
OBS View: http://localhost:3001/multi-court/obs/ABC123,DEF456,GHI789
Scoring: http://localhost:3001/multi-court/score/ABC123,DEF456,GHI789
```

### Production URLs
```
Monitor: https://your-app.vercel.app/multi-court
OBS View: https://your-app.vercel.app/multi-court/obs/ABC123,DEF456,GHI789
Scoring: https://your-app.vercel.app/multi-court/score/ABC123,DEF456,GHI789
```

## 🎮 Quick Start Checklist

- [ ] Create matches for all courts
- [ ] Note all Match IDs
- [ ] Open Multi-Court Monitor
- [ ] Add Match IDs to courts
- [ ] Test real-time updates
- [ ] Set up OBS sources (if streaming)
- [ ] Test scoring interface
- [ ] Verify all features working

---

## 🎉 Ready for Multi-Court Action!

Your multi-court monitoring system is now ready! You can:
- **Monitor 3 courts simultaneously**
- **Score matches in real-time**
- **Stream professional overlays**
- **Manage complex tournaments**

**Happy multi-court scoring! 🏓🏓🏓**
