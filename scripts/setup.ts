#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { existsSync, copyFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 Setting up Dashboard Boilerplate...\n');

// Check if .env.local exists, if not create from template
const envLocalPath = join(process.cwd(), '.env.local');
const envTemplatePath = join(process.cwd(), 'env.template');

if (!existsSync(envLocalPath) && existsSync(envTemplatePath)) {
  console.log('📝 Creating .env.local from template...');
  copyFileSync(envTemplatePath, envLocalPath);
  console.log('✅ .env.local created successfully');
} else if (existsSync(envLocalPath)) {
  console.log('✅ .env.local already exists');
} else {
  console.log('⚠️  No env.template found, please create .env.local manually');
}

// Generate Prisma client
console.log('\n🗄️  Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully');
} catch (error) {
  console.error('❌ Failed to generate Prisma client:', error);
}

// Install dependencies if needed
console.log('\n📦 Checking dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error);
}

// Type check
console.log('\n🔍 Running type check...');
try {
  execSync('npm run type-check', { stdio: 'inherit' });
  console.log('✅ Type check passed');
} catch (error) {
  console.error('❌ Type check failed:', error);
}

console.log('\n🎉 Setup complete!');
console.log('\nNext steps:');
console.log('1. Update .env.local with your database URL and secrets');
console.log('2. Run "npm run db:push" to sync your database schema');
console.log('3. Run "npm run dev" to start the development server');
console.log('\nHappy coding! 🚀'); 