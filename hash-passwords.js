// Script to hash passwords for MongoDB setup
// Run with: node hash-passwords.js

const bcrypt = require('bcryptjs');

async function hashPasswords() {
  const passwords = [
    'admin123',
    'manager123', 
    'qc123',
    'hr123',
    'user123',
    'locked123'
  ];

  console.log('Hashed passwords for MongoDB setup:');
  console.log('=====================================');

  for (const password of passwords) {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`${password}: ${hashedPassword}`);
  }
}

hashPasswords().catch(console.error);
