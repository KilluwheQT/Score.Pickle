# 🚀 Vercel Deployment Guide

## 📋 Prerequisites

1. **GitHub Repository**: Your code is already pushed to `https://github.com/KilluwheQT/Score.Pickle.git`
2. **Vercel Account**: Free account at https://vercel.com
3. **Firebase Project**: Already configured with your credentials

## 🔧 Step 1: Set Up Vercel Project

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New..." → "Project"**
3. **Import Git Repository**: 
   - Choose "Import Git Repository"
   - Select `KilluwheQT/Score.Pickle`
   - Click "Import"

## 🔐 Step 2: Configure Environment Variables

During Vercel setup, you'll need to add these environment variables:

### Firebase Configuration
Add these in the "Environment Variables" section:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB7G0v6-DWGuAJWyd5Vamc1A426Jf7Z6Pw
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=pickleball-906f7.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://pickleball-906f7-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=pickleball-906f7
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=pickleball-906f7.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=709026792895
NEXT_PUBLIC_FIREBASE_APP_ID=1:709026792895:web:fad4f5ab215db45c9c4d0a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-BS4YJHTZTZ
```

### How to Add:
1. **Name**: `NEXT_PUBLIC_FIREBASE_API_KEY`
2. **Value**: `AIzaSyB7G0v6-DWGuAJWyd5Vamc1A426Jf7Z6Pw`
3. **Environment**: `Production`, `Preview`, `Development`
4. **Click "Add"**

Repeat for all 8 environment variables.

## ⚙️ Step 3: Build Settings

Vercel will auto-detect Next.js settings. Verify these:

- **Framework Preset**: `Next.js`
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## 🚀 Step 4: Deploy

1. **Click "Deploy"**
2. **Wait for build** (usually 1-2 minutes)
3. **Get your URL**: Vercel will give you a `.vercel.app` URL

## 🧪 Step 5: Test Deployment

1. **Visit your Vercel URL**
2. **Test all features**:
   - Create a match
   - Add scores
   - Test OBS viewers
   - Check real-time updates

## 🔧 Step 6: Custom Domain (Optional)

1. **Go to Project Settings** in Vercel
2. **Click "Domains"**
3. **Add your custom domain**
4. **Update DNS records** as instructed

## 📱 Mobile Testing

Test on mobile devices:
- Responsive design
- Touch interactions
- OBS viewer functionality

## 🎥 OBS Setup for Production

Update your OBS sources to use the production URL:

```
# Instead of localhost:3001
https://your-app.vercel.app/league/YOUR_MATCH_ID
https://your-app.vercel.app/live/YOUR_MATCH_ID
https://your-app.vercel.app/viewer/YOUR_MATCH_ID
```

## 🔄 Continuous Deployment

Your app will auto-deploy when you push to GitHub:

```bash
git add .
git commit -m "Update features"
git push origin main
```

## 🐛 Troubleshooting

### Common Issues

#### "firebase-api-key does not exist"
- **Solution**: Add all 8 Firebase environment variables in Vercel dashboard
- **Location**: Project Settings → Environment Variables

#### Build Fails
- **Check**: All dependencies are in package.json
- **Solution**: Run `npm install` locally first

#### Real-time Updates Not Working
- **Check**: Firebase URLs are correct
- **Solution**: Verify `NEXT_PUBLIC_FIREBASE_DATABASE_URL`

#### OBS Viewers Not Loading
- **Check**: URLs are using production domain
- **Solution**: Update OBS Browser Source URLs

### Debug Mode

Add debug logging by temporarily adding to your code:
```javascript
console.log('Firebase URL:', process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL);
```

## 📊 Monitoring

Vercel provides:
- **Analytics**: Page views, visitors
- **Logs**: Build and runtime logs
- **Performance**: Response times
- **Errors**: Automatic error tracking

## 🔒 Security Notes

- ✅ Environment variables are secure in Vercel
- ✅ Firebase rules should be configured for production
- ✅ No sensitive data in client-side code
- ⚠️ Review Firebase security rules before going live

## 🎯 Production Checklist

Before going live:

- [ ] All environment variables set
- [ ] Firebase security rules configured
- [ ] Test complete match flow
- [ ] Test OBS viewers work
- [ ] Mobile responsive test
- [ ] Custom domain configured (optional)
- [ ] Error monitoring setup

## 🆘 Support

If you encounter issues:

1. **Check Vercel logs**: Dashboard → Your Project → Logs
2. **Verify environment variables**: Project Settings → Environment Variables
3. **Test locally**: `npm run build && npm start`
4. **Firebase console**: Check database rules and usage

---

## 🎉 You're Live!

Once deployed, your pickleball scoring system will be available at your Vercel URL with:
- Real-time scoring
- OBS integration
- Mobile support
- Automatic updates

**Happy scoring! 🏓**
