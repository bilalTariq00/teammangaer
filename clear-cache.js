#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Clearing Next.js cache and build artifacts...');

// Remove .next directory
const nextDir = path.join(__dirname, '.next');
if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log('✅ Removed .next directory');
}

// Remove node_modules/.cache if it exists
const cacheDir = path.join(__dirname, 'node_modules', '.cache');
if (fs.existsSync(cacheDir)) {
  fs.rmSync(cacheDir, { recursive: true, force: true });
  console.log('✅ Removed node_modules/.cache directory');
}

// Clear npm cache
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ Cleared npm cache');
} catch (error) {
  console.log('⚠️  Could not clear npm cache:', error.message);
}

console.log('🎉 Cache clearing complete!');
console.log('💡 Now run: npm run dev');
