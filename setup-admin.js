// Run this script once to create the first admin account
// Usage: node setup-admin.js

const { createAdminAccount } = require('./lib/auth.js');

async function setupAdmin() {
  const adminEmail = 'admin@pickleball.com';
  const adminPassword = 'admin123';
  const adminName = 'System Administrator';

  console.log('Creating admin account...');
  
  const result = await createAdminAccount(adminEmail, adminPassword, adminName);
  
  if (result.success) {
    console.log('✅ Admin account created successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('\nYou can now sign in with these credentials.');
    console.log('Remember to change the password after first login!');
  } else {
    console.error('❌ Failed to create admin account:', result.message);
  }
}

setupAdmin().catch(console.error);
