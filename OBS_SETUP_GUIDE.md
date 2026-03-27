# 🎥 OBS Scoreboard Viewer Setup Guide

## Overview
The Pickleball Scoreboard includes a dedicated OBS-compatible viewer designed specifically for live streaming. This viewer provides a clean, minimal scoreboard overlay perfect for broadcasting matches.

## 🚀 Quick Start

### 1. Access the Viewer
Navigate to: `http://localhost:3001/viewer/[MATCH_ID]`
Replace `[MATCH_ID]` with your actual match ID (e.g., `ABC123`)

### 2. OBS Browser Source Setup

1. **Add Browser Source**:
   - In OBS, right-click in your "Sources" panel
   - Select "Add" → "Browser"
   - Name it "Pickleball Scoreboard"

2. **Configure Browser Source**:
   ```
   URL: http://localhost:3001/viewer/ABC123
   Width: 1920 (or your stream resolution)
   Height: 1080 (or your stream resolution)
   Custom CSS: (optional, see below)
   ```

3. **Enable Transparency**:
   - Check "Shutdown source when not visible"
   - Set "Refresh browser when scene becomes active"

## 🎨 Customization Options

### Settings Panel
Click the ⚙️ button in the top-right corner to access settings:

- **Team Colors**: Customize team highlight colors
- **Background**: Choose background color (transparent for overlay)
- **Text Color**: Adjust text visibility
- **Font Size**: Small, Medium, Large, Extra Large
- **Display Options**: 
  - Show/Hide Match ID
  - Show/Hide Game Number
  - Compact Mode for space-saving

### Recommended OBS Settings

#### For Overlay Mode (Recommended)
```
Background Color: #000000 (Black)
Text Color: #FFFFFF (White)
Team A Color: #3B82F6 (Blue)
Team B Color: #10B981 (Green)
Font Size: Large
Compact Mode: Off (for full display)
```

#### For Picture-in-Picture
```
Background Color: #000000 (Black)
Text Color: #FFFFFF (White)
Font Size: Medium
Compact Mode: On
Show Match ID: On
Show Game Number: Off
```

## 🎯 OBS Scene Configurations

### 1. Full Screen Scoreboard
- **Source Size**: 1920x1080
- **Position**: Fill entire screen
- **Use Case**: Main scoreboard display

### 2. Picture-in-Picture
- **Source Size**: 600x400
- **Position**: Bottom-right corner
- **Use Case**: Secondary scoreboard with game footage

### 3. Top Bar Overlay
- **Source Size**: 1920x150
- **Position**: Top of screen
- **Use Case**: Compact score display with commentary

## 🔧 Advanced Configuration

### Custom CSS for Browser Source
Add this CSS to your OBS Browser Source for enhanced transparency:

```css
body {
    background-color: transparent !important;
    margin: 0;
    padding: 0;
    overflow: hidden;
}

/* Remove scrollbars */
::-webkit-scrollbar {
    display: none;
}
```

### Chroma Key Setup (Optional)
If using a colored background:

1. Add "Chroma Key" filter to the Browser Source
2. Set **Key Color Type** to "Custom Color"
3. Choose your background color
4. Adjust **Similarity** and **Smoothness** as needed

### Audio Considerations
- The viewer is silent (no sound effects)
- All audio handling is done in the main scoreboard
- Perfect for clean broadcast audio

## 📱 Mobile Compatibility

The viewer also works on mobile devices for:
- Second screen displays
- Tablet scoreboards
- Mobile streaming setups

## 🔄 Real-time Updates

The viewer automatically syncs with the main scoreboard:
- **Instant score updates** when points are scored
- **Serving indicators** update in real-time
- **Game completion** displays winner immediately
- **Match status** changes reflect instantly

## 🎮 Control Flow

1. **Main Scoreboard** (Admin controls scoring)
   - Located at: `/match/[MATCH_ID]`
   - Full control interface
   - Admin/Viewer modes

2. **OBS Viewer** (Display only)
   - Located at: `/viewer/[MATCH_ID]`
   - Display-optimized interface
   - Settings for customization

## 🚨 Troubleshooting

### Common Issues

#### Viewer Not Loading
- **Check match ID**: Ensure the match exists and is active
- **Verify URL**: Make sure you're using the correct `/viewer/` path
- **Refresh browser**: Try refreshing the OBS Browser Source

#### Score Not Updating
- **Check connection**: Ensure both devices have internet
- **Verify Firebase**: Check if main scoreboard is working
- **Refresh OBS**: Restart the Browser Source

#### Display Issues
- **Check resolution**: Ensure OBS source size matches content
- **Verify transparency**: Make sure background is set correctly
- **Adjust fonts**: Use settings panel to resize text

#### Performance Issues
- **Reduce refresh rate**: Set Browser Source to refresh every 1-2 seconds
- **Lower resolution**: Use smaller source size if needed
- **Close other tabs**: Ensure browser isn't overloaded

### Performance Optimization

For smooth streaming:

1. **Set refresh interval**: In OBS Browser Source, set "Refresh browser when scene becomes active"
2. **Use appropriate resolution**: Don't use oversized sources
3. **Monitor CPU usage**: Browser sources can be resource-intensive
4. **Test before stream**: Always test during rehearsal

## 🎯 Best Practices

### Before Going Live
1. **Test the viewer**: Open the URL in regular browser first
2. **Check settings**: Configure colors and fonts for your stream
3. **Verify sync**: Ensure updates work with main scoreboard
4. **Test OBS**: Add and configure Browser Source in OBS

### During Stream
1. **Monitor updates**: Watch for real-time sync
2. **Have backup**: Keep main scoreboard open on separate device
3. **Communicate**: Let commentators know about scoreboard delays
4. **Check audio**: Ensure scoreboard doesn't interfere with audio

### After Stream
1. **Save settings**: OBS scenes can be saved for future use
2. **Review recording**: Check scoreboard visibility in VOD
3. **Update settings**: Adjust based on stream feedback

## 🎨 Design Tips

### Color Schemes
- **High Contrast**: Black background, white text
- **Team Colors**: Use team jerseys or brand colors
- **Consistent**: Match your stream's color scheme

### Typography
- **Large fonts**: Ensure readability on all devices
- **Bold text**: Use bold for scores and team names
- **Contrast**: Ensure text stands out from background

### Layout
- **Centered**: Keep scoreboard balanced
- **Spacing**: Don't overcrowd information
- **Hierarchy**: Make scores most prominent

## 🔗 Integration Examples

### Multi-Camera Setup
```
Scene 1: Main Game + Full Scoreboard
Scene 2: Close-up + PiP Scoreboard  
Scene 3: Commentary + Top Bar Scoreboard
```

### Tournament Stream
```
Scene 1: Current Match + Scoreboard
Scene 2: Tournament Bracket + Mini Scoreboard
Scene 3: Player Interviews + No Scoreboard
```

---

## 📞 Support

For issues with the OBS viewer:
1. Check this guide first
2. Test with different OBS settings
3. Verify match functionality in main scoreboard
4. Report issues with match ID and OBS version

**Happy Streaming! 🎮🏓**
