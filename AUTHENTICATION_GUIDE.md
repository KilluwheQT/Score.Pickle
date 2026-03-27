# 🔐 Authentication System Setup Guide

## Overview
The Pickleball Scoring System now includes a complete authentication system with user registration, admin approval workflows, and role-based access control.

## 🎯 Features

### User Authentication
- **Sign Up**: User registration with admin approval
- **Sign In**: Secure login with session management
- **Roles**: User and Admin roles with different permissions
- **Session Management**: Persistent login sessions

### Admin Dashboard
- **User Management**: Approve/reject user accounts
- **User Statistics**: View total, approved, pending users
- **Account Control**: Delete or deactivate user accounts
- **Role Management**: Assign admin privileges

### Security Features
- **Protected Routes**: Authentication required for all features
- **Admin-only Areas**: Admin dashboard protected by role
- **Session Storage**: Secure client-side session management
- **Approval Workflow**: Admin must approve new users

## 🚀 Quick Setup

### Step 1: Create First Admin Account

#### Method 1: Setup Script (Recommended)
```bash
cd pikolsystem
node setup-admin.js
```

This creates:
- **Email**: admin@pickleball.com
- **Password**: admin123
- **Role**: Admin (pre-approved)

#### Method 2: Manual Firebase Setup
1. Go to Firebase Console → Realtime Database
2. Navigate to `users/`
3. Create a new entry with key: `admin_at_pickleball_com`
4. Add this data:
```json
{
  "email": "admin@pickleball.com",
  "name": "System Administrator",
  "password": "admin123",
  "status": "approved",
  "role": "admin",
  "createdAt": 1234567890,
  "lastLogin": null
}
```

### Step 2: Test Admin Access

1. **Go to**: `http://localhost:3001/login`
2. **Sign in** with admin credentials
3. **Verify** you can access the Admin Dashboard
4. **Test** user management features

### Step 3: Create Regular Users

1. **Go to**: `http://localhost:3001/signup`
2. **Fill out** the registration form
3. **Submit** - account created with "pending" status
4. **Approve** users in Admin Dashboard

## 📱 User Registration Flow

### Registration Process
1. **User signs up** → Account created with "pending" status
2. **Admin approval** → Admin reviews and approves/rejects
3. **User notified** → User can now sign in if approved

### Account Statuses
- **pending**: Awaiting admin approval
- **approved**: Can access all features
- **rejected**: Cannot sign in

### User Roles
- **user**: Standard access to scoring features
- **admin**: Full access + user management

## 🎮 Access Control

### Protected Routes
All main features now require authentication:
- `/` - Home page (requires login)
- `/history` - Match history
- `/multi-court` - Multi-court monitoring
- `/league/*` - League boards
- `/live/*` - OBS viewers
- `/match/*` - Match scoring

### Admin-only Routes
- `/admin` - User management dashboard

### Public Routes
- `/landing` - Landing page (no auth required)
- `/login` - Sign in page
- `/signup` - Registration page

## 🔧 Configuration

### Firebase Database Structure
```
users/
  {userId}/
    email: string
    name: string
    password: string
    status: "pending" | "approved" | "rejected"
    role: "user" | "admin"
    createdAt: timestamp
    lastLogin: timestamp
```

### Session Management
- **Storage**: Browser localStorage
- **Key**: `pickleball_user`
- **Data**: User object with authentication info
- **Expiry**: Manual logout required

## 🛡️ Security Considerations

### Current Implementation
- **Password Storage**: Plain text (development only)
- **Session Storage**: Client-side localStorage
- **No Encryption**: Basic authentication for demo

### Production Recommendations
1. **Password Hashing**: Implement bcrypt or similar
2. **JWT Tokens**: Use secure token-based sessions
3. **HTTPS**: Enable SSL for production
4. **Rate Limiting**: Prevent brute force attacks
5. **Password Policies**: Enforce strong passwords

## 📊 Admin Dashboard Features

### User Statistics
- **Total Users**: Overall user count
- **Approved Users**: Active users
- **Pending Users**: Awaiting approval
- **Admin Count**: Admin users

### User Management
- **Approve Users**: Grant access to pending accounts
- **Reject Users**: Deny access to pending accounts
- **Delete Users**: Remove user accounts permanently
- **View Details**: See user information and status

### User Table Columns
- **Name**: User's full name
- **Email**: Email address (unique identifier)
- **Role**: User or Admin
- **Status**: pending/approved/rejected
- **Created**: Registration date
- **Actions**: Approve/reject/delete buttons

## 🔄 User Workflow

### For New Users
1. **Visit**: `/signup`
2. **Register**: Fill name, email, password
3. **Wait**: Account pending admin approval
4. **Get Approved**: Admin approves account
5. **Sign In**: Use credentials to access system

### For Admins
1. **Sign In**: Use admin credentials
2. **Go to Admin**: Click "Admin" in navigation
3. **Review Users**: See pending registrations
4. **Approve/Reject**: Manage user access
5. **Monitor**: Track user statistics

## 🎯 Use Cases

### Tournament Directors
- **Account**: Admin role
- **Access**: Full system control + user management
- **Purpose**: Manage tournament scoring and user accounts

### Facility Managers
- **Account**: User role (approved by admin)
- **Access**: Scoring, multi-court monitoring, OBS
- **Purpose**: Daily facility operations

### Scorekeepers
- **Account**: User role (approved by admin)
- **Access**: Match scoring only
- **Purpose**: Score specific matches

### Broadcasters
- **Account**: User role (approved by admin)
- **Access**: OBS viewers and league boards
- **Purpose: Live streaming overlays

## 🐛 Troubleshooting

### Common Issues

#### Can't Sign In
- **Check**: Account is approved (not pending/rejected)
- **Verify**: Correct email and password
- **Contact**: Admin if account issues

#### Admin Access Denied
- **Check**: User role is "admin" (not "user")
- **Verify**: Account status is "approved"
- **Contact**: System administrator

#### Users Not Showing
- **Check**: Firebase database connection
- **Verify**: Users node exists in database
- **Refresh**: Admin dashboard page

#### Session Issues
- **Clear**: Browser localStorage
- **Sign Out**: Current session
- **Sign In**: Fresh session

### Debug Steps

1. **Check Browser Console** for JavaScript errors
2. **Verify Firebase Rules** allow database access
3. **Check Network Tab** for API calls
4. **Review Firebase Console** for data structure

## 📱 Mobile Support

### Responsive Design
- **Login/Signup**: Mobile-optimized forms
- **Admin Dashboard**: Responsive tables
- **Navigation**: Mobile-friendly menu
- **Features**: Touch-optimized interfaces

### Mobile Considerations
- **Session Persistence**: Works across app restarts
- **Auto-logout**: Manual logout required
- **Touch Targets**: Appropriately sized buttons
- **Orientation**: Works in portrait/landscape

## 🔄 Maintenance

### Regular Tasks
- **Review Pending Users**: Approve legitimate registrations
- **Monitor User Activity**: Check for suspicious accounts
- **Update Admin Access**: Add/remove admin privileges
- **Clean Up**: Remove inactive/deleted accounts

### Security Maintenance
- **Password Policies**: Enforce strong passwords
- **Account Reviews**: Periodic user audits
- **Access Logs**: Monitor admin activities
- **Backup Data**: Regular database backups

---

## 🎉 Ready to Use!

Your authentication system is now fully configured:

1. **Admin Account**: Created with setup script
2. **User Registration**: Ready for new users
3. **Admin Dashboard**: Manage user access
4. **Protected Routes**: All features secured
5. **Role-Based Access**: Admin vs user permissions

**The system now requires authentication for all scoring features!** 🔐

Users must:
1. **Sign up** → Wait for approval
2. **Get approved** → Admin confirms account
3. **Sign in** → Access all scoring features

**Happy secure scoring! 🏓🔐**
