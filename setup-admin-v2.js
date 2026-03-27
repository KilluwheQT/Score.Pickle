// Run this script once to create the first admin account
// Usage: node setup-admin-v2.js

const { createAdminAccount } = require('./lib/auth-v2.js');

async function setupAdmin() {
  const adminEmail = 'admin@pickleballpro.com';
  const adminPassword = 'admin123';
  const adminName = 'System Administrator';

  console.log('🏓 Creating Pickleball Pro admin account...');
  
  const result = await createAdminAccount(adminEmail, adminPassword, adminName);
  
  if (result.success) {
    console.log('✅ Admin account created successfully!');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(`🎯 Referee Code: ${result.user.refereeCode}`);
    console.log('\n🎮 You can now sign in and start managing courts!');
    console.log('💡 Remember to change the password after first login!');
  } else {
    console.error('❌ Failed to create admin account:', result.message);
  }
}

setupAdmin().catch(console.error);
