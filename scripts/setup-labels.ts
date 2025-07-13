#!/usr/bin/env tsx

import { execSync } from 'child_process';

interface Label {
  name: string;
  color: string;
  description: string;
}

const requiredLabels: Label[] = [
  {
    name: 'enhancement',
    color: '0e8a16',
    description: 'New features and improvements'
  },
  {
    name: 'bug',
    color: 'd93f0b',
    description: 'Something is not working'
  },
  {
    name: 'documentation',
    color: '0075ca',
    description: 'Documentation improvements'
  },
  {
    name: 'testing',
    color: 'fef2c0',
    description: 'Adding or updating tests'
  },
  {
    name: 'refactoring',
    color: 'c2e0c6',
    description: 'Code refactoring and improvements'
  },
  {
    name: 'size: small',
    color: '0e8a16',
    description: 'Small changes (≤10 files)'
  },
  {
    name: 'size: medium',
    color: 'fbca04',
    description: 'Medium changes (11-50 files)'
  },
  {
    name: 'size: large',
    color: 'd93f0b',
    description: 'Large changes (>50 files)'
  },
  {
    name: 'urgent',
    color: 'd93f0b',
    description: 'Urgent fixes and hotfixes'
  },
  {
    name: 'breaking',
    color: 'd93f0b',
    description: 'Breaking changes'
  }
];

function checkIfLabelExists(labelName: string): boolean {
  try {
    const result = execSync(`gh label list --json name --jq '.[] | select(.name == "${labelName}") | .name'`, { encoding: 'utf8' });
    return result.trim() === labelName;
  } catch (error) {
    return false;
  }
}

function createLabel(label: Label): void {
  try {
    const command = `gh label create "${label.name}" --color "${label.color}" --description "${label.description}"`;
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ Created label: ${label.name}`);
  } catch (error) {
    console.log(`⚠️  Label "${label.name}" might already exist or there was an error`);
  }
}

function main(): void {
  console.log('🏷️  Setting up GitHub labels for PR workflow...\n');
  
  // Check if GitHub CLI is authenticated
  try {
    execSync('gh auth status', { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ GitHub CLI not authenticated. Please run:');
    console.log('   gh auth login');
    process.exit(1);
  }
  
  console.log('📋 Required labels:');
  requiredLabels.forEach(label => {
    console.log(`   - ${label.name}: ${label.description}`);
  });
  console.log('');
  
  // Create labels
  requiredLabels.forEach(label => {
    if (checkIfLabelExists(label.name)) {
      console.log(`✅ Label "${label.name}" already exists`);
    } else {
      createLabel(label);
    }
  });
  
  console.log('\n🎉 Label setup complete!');
  console.log('\nYou can now use the PR workflow:');
  console.log('   npm run pr:create');
}

if (require.main === module) {
  main();
} 