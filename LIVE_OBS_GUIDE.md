# 🎥 Live OBS Scoreboard - Quick Setup Guide

## Overview
The Live OBS Scoreboard is a simplified, clean interface designed specifically for live streaming. It provides a minimal, professional scoreboard perfect for broadcasting pickleball matches.

## 🚀 Quick Setup (2 Minutes)

### Step 1: Get Your Match ID
1. Create a match on the main page: `http://localhost:3001`
2. Note the match ID (e.g., "ABC123")

### Step 2: Add to OBS
1. In OBS: Right-click Sources → Add → Browser
2. Set URL: `http://localhost:3001/live/ABC123`
3. Set Width: 1920, Height: 1080
4. Click OK

### Step 3: Position & Resize
- Drag to position on screen
- Resize as needed
- Use full screen for main display or smaller for PiP

## 🎯 Key Features

### ✨ What It Has
- **Large, readable scores** - Perfect for streaming
- **Serving indicators** - Blue/Green highlighting
- **Real-time updates** - Instant sync with main scoreboard
- **Clean design** - No controls or settings clutter
- **Game info** - Current game number and match type
- **Games won** - Track match progress

### 🚫 What It Doesn't Have
- No settings panels
- No controls
- No configuration options
- No audio (clean for streaming)

## 🎬 OBS Configuration

### Basic Setup
```
Source Type: Browser
URL: http://localhost:3001/live/YOUR_MATCH_ID
Width: 1920 (or your resolution)
Height: 1080 (or your resolution)
Custom CSS: body { background: transparent; }
```

### Advanced Options
- **Shutdown when not visible**: ✅ Check for performance
- **Refresh browser when active**: ✅ Check for reliability
- **Custom CSS**: Add for transparency if needed

### Chroma Key Setup (Optional)
If you want transparency:
1. Add "Chroma Key" filter to Browser Source
2. Set Key Color to Black (#000000)
3. Adjust Similarity: 200-400
4. Adjust Smoothness: 50-100

## 📱 Display Options

### Full Screen Scoreboard
- **Size**: 1920x1080
- **Position**: Center/Full screen
- **Use**: Main scoreboard display

### Picture-in-Picture
- **Size**: 600x400
- **Position**: Bottom-right corner
- **Use**: Secondary display with game footage

### Top Bar Overlay
- **Size**: 1920x150
- **Position**: Top of screen
- **Use**: Compact score display

### Side Panel
- **Size**: 400x1080
- **Position**: Left/right side
- **Use**: Vertical score display

## 🔄 Real-time Updates

The live scoreboard automatically syncs with the main scoreboard:

- **Score changes** update instantly
- **Serving indicators** switch automatically
- **Game completion** shows winner immediately
- **Match status** updates in real-time

## 🎮 Control Flow

```
Main Scoreboard (Admin) → Firebase → Live OBS Scoreboard (Display)
     http://localhost:3001/match/ABC123    http://localhost:3001/live/ABC123
```

1. **Admin controls scoring** on main scoreboard
2. **Firebase stores and syncs** the data
3. **Live OBS displays** the current state

## 🎨 Visual Design

### Color Scheme
- **Background**: Black (clean for streaming)
- **Team Names**: White (high contrast)
- **Scores**: White (large, bold)
- **Serving Team**: Blue (Team A) or Green (Team B)
- **Game Info**: White with opacity

### Typography
- **Team Names**: 5rem, bold
- **Scores**: 8rem, black
- **Game Info**: 2rem, medium
- **Match ID**: 0.875rem, light

### Animations
- **Smooth transitions** for serving changes
- **Scale effects** for serving team
- **Pulse animation** for serving indicator

## 🚨 Troubleshooting

### Common Issues

#### Scoreboard Not Loading
- **Check URL**: Ensure match ID is correct
- **Verify match**: Make sure match exists and is active
- **Refresh OBS**: Right-click source → Refresh

#### Score Not Updating
- **Check connection**: Ensure internet is working
- **Verify main scoreboard**: Test scoring on main page
- **Restart OBS source**: Right-click → Restart media

#### Display Issues
- **Check resolution**: Ensure source size matches content
- **Verify CSS**: Make sure custom CSS is valid
- **Test transparency**: Use chroma key if needed

#### Performance Issues
- **Reduce refresh rate**: Set refresh interval in OBS
- **Lower resolution**: Use smaller source size
- **Close other tabs**: Free up browser resources

### Performance Tips

1. **Set refresh interval**: Don't refresh too frequently
2. **Use appropriate resolution**: Don't oversize the source
3. **Monitor CPU usage**: Browser sources can be intensive
4. **Test before stream**: Always test during rehearsal

## 🎯 Best Practices

### Before Going Live
1. **Test the URL**: Open in browser first
2. **Verify sync**: Test scoring updates
3. **Check OBS**: Add and configure source
4. **Test display**: Verify size and position

### During Stream
1. **Monitor updates**: Watch for real-time sync
2. **Have backup**: Keep main scoreboard open
3. **Check audio**: Ensure no interference
4. **Monitor performance**: Watch for lag

### After Stream
1. **Save scene**: OBS scenes for future use
2. **Review recording**: Check scoreboard visibility
3. **Update settings**: Adjust based on feedback

## 📞 Quick Reference

### URLs
- **Main Scoreboard**: `http://localhost:3001/match/[ID]`
- **Live OBS**: `http://localhost:3001/live/[ID]`
- **Setup Page**: `http://localhost:3001/live`

### Match Flow
1. Create match → Get ID
2. Add Live OBS to OBS
3. Score on main scoreboard
4. Live OBS updates automatically

### Emergency Fixes
- **Scoreboard blank**: Refresh OBS source
- **No updates**: Check main scoreboard
- **Display wrong**: Verify match ID
- **Performance lag**: Reduce source size

---

## 🎮 Ready to Stream!

Your Live OBS Scoreboard is now ready for professional streaming. The clean, minimal design ensures your audience can clearly see the scores while you focus on the game.

**Happy Streaming! 🏓🎥**
