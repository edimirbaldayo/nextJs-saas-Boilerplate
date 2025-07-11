#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface PRConfig {
  title: string;
  description?: string;
  baseBranch?: string;
  labels?: string[];
  assignees?: string[];
}

function getCurrentBranch(): string {
  return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
}

function getBaseBranch(): string {
  const baseBranch = process.argv.find(arg => arg.startsWith('--base='))?.split('=')[1];
  return baseBranch || 'develop';
}

function getCommitMessages(baseBranch: string): string[] {
  try {
    const commits = execSync(`git log --oneline --no-merges ${baseBranch}..HEAD`, { encoding: 'utf8' });
    return commits.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.log('No commits found or branch not found');
    return [];
  }
}

function analyzeCommits(commits: string[]): {
  features: number;
  fixes: number;
  docs: number;
  style: number;
  refactor: number;
  tests: number;
  chore: number;
} {
  const analysis = {
    features: 0,
    fixes: 0,
    docs: 0,
    style: 0,
    refactor: 0,
    tests: 0,
    chore: 0
  };

  commits.forEach(commit => {
    if (commit.includes('feat:')) analysis.features++;
    else if (commit.includes('fix:')) analysis.fixes++;
    else if (commit.includes('docs:')) analysis.docs++;
    else if (commit.includes('style:')) analysis.style++;
    else if (commit.includes('refactor:')) analysis.refactor++;
    else if (commit.includes('test:')) analysis.tests++;
    else if (commit.includes('chore:')) analysis.chore++;
  });

  return analysis;
}

function generatePRDescription(commits: string[], analysis: ReturnType<typeof analyzeCommits>): string {
  const commitList = commits.length > 0 ? commits.join('\n') : 'No commits found';
  
  return `## 📋 Changes Summary

This PR includes the following changes:

- ✨ **Features**: ${analysis.features}
- 🐛 **Bug Fixes**: ${analysis.fixes}
- 📚 **Documentation**: ${analysis.docs}
- 🎨 **Style Changes**: ${analysis.style}
- ♻️ **Refactoring**: ${analysis.refactor}
- ✅ **Tests**: ${analysis.tests}
- 🔧 **Chores**: ${analysis.chore}

## 📝 Commit Summary

\`\`\`
${commitList}
\`\`\`

## 🔍 Review Checklist

- [ ] Code follows project conventions
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No breaking changes (or breaking changes are documented)
- [ ] Performance impact considered
- [ ] Security implications reviewed

## 🚀 Next Steps

1. Review the changes
2. Run \`npm run type-check\` and \`npm run lint\`
3. Test the functionality locally
4. Approve and merge when ready`;
}

function getPRTitle(): string {
  const titleArg = process.argv.find(arg => arg.startsWith('--title='))?.split('=')[1];
  if (titleArg) return titleArg;

  const currentBranch = getCurrentBranch();
  const branchName = currentBranch.replace(/^(feature|fix|hotfix|release)\//, '');
  
  // Convert branch name to title case
  const title = branchName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
    
  return title;
}

function createPR(config: PRConfig): void {
  const { title, description, baseBranch = 'develop', labels = [], assignees = [] } = config;
  
  console.log('🚀 Creating Pull Request...\n');
  console.log(`📋 Title: ${title}`);
  console.log(`🌿 Base Branch: ${baseBranch}`);
  console.log(`🏷️  Labels: ${labels.join(', ') || 'None'}`);
  console.log(`👥 Assignees: ${assignees.join(', ') || 'None'}`);
  
  // Create PR using GitHub CLI
  const labelsArg = labels.length > 0 ? `--label ${labels.join(',')}` : '';
  const assigneesArg = assignees.length > 0 ? `--assignee ${assignees.join(',')}` : '';
  
  const command = `gh pr create --title "${title}" --body "${description?.replace(/"/g, '\\"')}" --base ${baseBranch} ${labelsArg} ${assigneesArg}`;
  
  try {
    execSync(command, { stdio: 'inherit' });
    console.log('\n✅ Pull Request created successfully!');
  } catch (error) {
    console.error('\n❌ Failed to create Pull Request:', error);
    
    // Check if it's a label issue
    if (labels.length > 0) {
      console.log('\n🔍 This might be a label issue. Available labels:');
      try {
        execSync('gh label list', { stdio: 'inherit' });
      } catch (labelError) {
        console.log('Could not fetch labels. You may need to create them:');
        console.log('gh label create "enhancement" --color "0e8a16"');
        console.log('gh label create "bug" --color "d93f0b"');
        console.log('gh label create "size: small" --color "0e8a16"');
      }
    }
    
    console.log('\n💡 Make sure you have GitHub CLI installed and authenticated:');
    console.log('   brew install gh');
    console.log('   gh auth login');
  }
}

function main(): void {
  const currentBranch = getCurrentBranch();
  const baseBranch = getBaseBranch();
  const title = getPRTitle();
  
  console.log('🔍 Analyzing commits...');
  const commits = getCommitMessages(baseBranch);
  const analysis = analyzeCommits(commits);
  const description = generatePRDescription(commits, analysis);
  
  // Determine labels based on commit analysis
  const labels: string[] = [];
  if (analysis.features > 0) labels.push('enhancement');
  if (analysis.fixes > 0) labels.push('bug');
  if (analysis.docs > 0) labels.push('documentation');
  if (analysis.tests > 0) labels.push('testing');
  if (analysis.refactor > 0) labels.push('refactoring');
  
  // Add size label
  const totalChanges = analysis.features + analysis.fixes + analysis.docs + analysis.style + analysis.refactor + analysis.tests + analysis.chore;
  if (totalChanges <= 3) labels.push('size: small');
  else if (totalChanges <= 10) labels.push('size: medium');
  else labels.push('size: large');
  
  const config: PRConfig = {
    title,
    description,
    baseBranch,
    labels
  };
  
  createPR(config);
}

if (require.main === module) {
  main();
} 