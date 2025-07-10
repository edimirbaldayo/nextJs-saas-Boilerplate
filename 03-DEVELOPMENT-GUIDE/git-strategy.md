# Git Strategy Guide

A comprehensive guide for maintaining a clean and professional Git workflow in your Next.js projects.

## 🎯 Git Flow Strategy (Recommended)

### 1. Branch Naming Convention

Use a clear and consistent branch naming strategy:

```
main                    # Production-ready code
develop                 # Integration branch for features
feature/feature-name    # New features
hotfix/bug-description  # Critical bug fixes
release/version-number  # Release preparation
```

**Examples:**
- `feature/user-authentication`
- `feature/dashboard-ui`
- `hotfix/login-bug`
- `release/v1.2.0`

### 2. Workflow Process

#### For New Features:

```bash
# 1. Start from develop branch
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/your-feature-name

# 3. Work on your feature
# ... make changes ...

# 4. Commit with clear messages
git add .
git commit -m "feat: add user authentication system"

# 5. Push feature branch
git push origin feature/your-feature-name

# 6. Create Pull Request to develop
```

#### For Bug Fixes:

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix

# 2. Fix the bug
# ... make changes ...

# 3. Commit and push
git add .
git commit -m "fix: resolve login authentication issue"
git push origin hotfix/critical-bug-fix

# 4. Create Pull Request to both main and develop
```

### 3. Commit Message Convention

Use **Conventional Commits** format for clear and standardized commit messages:

```
type(scope): description

[optional body]

[optional footer(s)]
```

#### Commit Types:
- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation changes
- `style`: formatting, missing semicolons, etc.
- `refactor`: code refactoring
- `test`: adding tests
- `chore`: maintenance tasks
- `perf`: performance improvements
- `ci`: CI/CD changes
- `build`: build system changes

#### Examples:
```bash
git commit -m "feat(auth): implement user login functionality"
git commit -m "fix(ui): resolve button alignment issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(api): simplify user data fetching"
git commit -m "test(auth): add unit tests for login validation"
```

### 4. Clean Git Practices

#### Before Committing:
```bash
# Check what you're about to commit
git status
git diff --staged

# Run tests/linting
npm run test
npm run lint

# Check for any sensitive data
git diff --cached
```

#### Keep Commits Atomic:
- One logical change per commit
- Don't mix feature work with bug fixes
- Keep commits small and focused
- Each commit should be able to stand alone

#### Good Commit Examples:
```bash
# ✅ Good - Single focused change
git commit -m "feat: add user registration form"

# ❌ Bad - Multiple unrelated changes
git commit -m "feat: add user registration and fix navbar and update readme"
```

### 5. Recommended Setup for Your Project

#### Essential Files:

**`.gitignore`** - Keep your repository clean:
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Next.js
.next/
out/
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Coverage directory
coverage/
*.lcov

# Cache directories
.cache
.parcel-cache
.eslintcache
```

**`package.json`** - Add Git hooks:
```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "devDependencies": {
    "husky": "^8.0.3",
    "lint-staged": "^13.2.3"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

### 6. Git Hooks (Optional but Recommended)

Set up pre-commit hooks to ensure code quality:

```bash
# Install husky
npm install --save-dev husky lint-staged

# Initialize husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

This will automatically:
- Run ESLint on staged files
- Format code with Prettier
- Run tests before allowing commits

### 7. Daily Git Workflow

#### Morning Routine:
```bash
# Update main branch
git checkout main
git pull origin main

# Update develop branch
git checkout develop
git pull origin develop
```

#### Before Starting Work:
```bash
# Create new feature branch
git checkout develop
git pull origin develop
git checkout -b feature/your-task
```

#### During Development:
```bash
# Frequent commits
git add .
git commit -m "feat: implement user login form"

# Push regularly
git push origin feature/your-task
```

#### End of Day:
```bash
# Commit any remaining work
git add .
git commit -m "feat: complete user authentication UI"

# Push to remote
git push origin feature/your-task
```

### 8. Best Practices Summary

#### ✅ DO:
- Use descriptive branch names
- Write clear commit messages following conventional commits
- Keep commits atomic and focused
- Pull before pushing to avoid conflicts
- Use feature branches for all new work
- Review code before merging
- Keep your working directory clean
- Use meaningful commit messages
- Test your code before committing

#### ❌ DON'T:
- Commit directly to main or develop branches
- Mix different types of changes in one commit
- Commit broken or untested code
- Use vague commit messages like "fix" or "update"
- Force push to shared branches
- Commit large files or sensitive data
- Leave branches unmerged for too long
- Ignore merge conflicts

### 9. For Your Current Project

#### Clean Up Existing Branches:

If you have old feature branches that are no longer needed:

```bash
# Merge completed features
git checkout main
git merge feature/completed-feature
git push origin main

# Clean up local branches
git branch -d feature/completed-feature

# Clean up remote branches
git push origin --delete feature/completed-feature
```

#### Set Up Proper Branch Structure:

```bash
# Create develop branch if it doesn't exist
git checkout -b develop
git push origin develop

# Set up branch protection rules in your repository settings
# - Require pull request reviews
# - Require status checks to pass
# - Restrict direct pushes to main and develop
```

#### Recommended Branch Protection Rules:

1. **Main Branch:**
   - Require pull request reviews
   - Require status checks to pass
   - Restrict direct pushes
   - Require linear history

2. **Develop Branch:**
   - Require pull request reviews
   - Require status checks to pass
   - Allow force pushes (for cleanup)

3. **Feature Branches:**
   - Allow direct pushes
   - No restrictions (for rapid development)

---

## 🔄 Merge vs Rebase: The Cleanest Approach

### Understanding the Difference

#### **Merge Strategy:**
```bash
# Creates a merge commit
git checkout main
git merge feature/branch
```

**Result:**
```
A---B---C---G (main)
     \     /
      D---E---F (feature/branch)
```

#### **Rebase Strategy:**
```bash
# Replays commits on top of main
git checkout feature/branch
git rebase main
git checkout main
git merge feature/branch
```

**Result:**
```
A---B---C---D'---E'---F' (main)
```

### 🏆 **Recommended Strategy: Rebase for Clean History**

#### **Why Rebase is Cleaner:**

1. **Linear History**: Creates a straight, easy-to-follow timeline
2. **No Merge Commits**: Eliminates unnecessary merge commits
3. **Cleaner Logs**: `git log` shows a clear progression
4. **Easier Debugging**: Simpler to trace when bugs were introduced
5. **Professional Appearance**: Industry standard for clean repositories

#### **When to Use Rebase:**

✅ **Perfect for:**
- Feature branches
- Personal development branches
- Before merging to main/develop
- Keeping history clean and linear

#### **When to Use Merge:**

✅ **Use merge for:**
- Hotfix branches (time-critical)
- Public/shared feature branches
- When you want to preserve branch history
- Release branches

### 🎯 **Recommended Workflow: Rebase-First**

#### **For Feature Development:**

```bash
# 1. Start your feature
git checkout develop
git pull origin develop
git checkout -b feature/new-feature

# 2. Work and commit
git add .
git commit -m "feat: implement user dashboard"
git push origin feature/new-feature

# 3. Keep feature branch updated with develop
git fetch origin
git rebase origin/develop

# 4. If conflicts occur, resolve them
# ... resolve conflicts ...
git add .
git rebase --continue

# 5. Force push (only for your own branches!)
git push --force-with-lease origin feature/new-feature

# 6. When ready to merge
git checkout develop
git pull origin develop
git merge feature/new-feature
git push origin develop
```

#### **Interactive Rebase for Clean Commits:**

```bash
# Clean up your commits before merging
git rebase -i HEAD~3  # Rebase last 3 commits

# Options in interactive rebase:
# pick   - use commit as-is
# reword - use commit, but edit the commit message
# edit   - use commit, but stop for amending
# squash - use commit, but meld into previous commit
# fixup  - like "squash", but discard this commit's log message
# drop   - remove commit
```

### 🚨 **Important Rules for Rebase:**

#### **Golden Rule: Never Rebase Public History**

```bash
# ❌ NEVER do this on shared branches
git rebase main  # If main is shared with others

# ✅ Safe to do on your own feature branches
git rebase main  # If you're the only one working on this branch
```

#### **Safe Rebase Workflow:**

```bash
# 1. Always work on your own feature branch
git checkout -b feature/my-feature

# 2. Rebase frequently to stay up-to-date
git fetch origin
git rebase origin/develop

# 3. Use --force-with-lease for safety
git push --force-with-lease origin feature/my-feature

# 4. Merge with --no-ff to preserve feature history
git checkout develop
git merge --no-ff feature/my-feature
```

### 🔧 **Handling Rebase Conflicts:**

```bash
# 1. Start rebase
git rebase main

# 2. If conflicts occur, Git will pause
# Edit files to resolve conflicts

# 3. Stage resolved files
git add .

# 4. Continue rebase
git rebase --continue

# 5. If you need to abort
git rebase --abort
```

### 📊 **Visual Comparison:**

#### **Before Rebase (Messy):**
```
main:     A---B---C---D
feature:      \---E---F---G
```

#### **After Rebase (Clean):**
```
main:     A---B---C---D
feature:              \---E'---F'---G'
```

#### **After Merge (Clean):**
```
main:     A---B---C---D---H
feature:              \---E'---F'---G'/
```

### 🎯 **Best Practices Summary:**

#### **For Maximum Cleanliness:**

1. **Use Rebase for Feature Branches**
   ```bash
   git rebase main
   git push --force-with-lease origin feature/branch
   ```

2. **Use Merge for Integration**
   ```bash
   git checkout main
   git merge --no-ff feature/branch
   ```

3. **Keep Commits Atomic**
   ```bash
   git rebase -i HEAD~5  # Clean up commits before merging
   ```

4. **Always Pull Before Rebase**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

5. **Use --force-with-lease for Safety**
   ```bash
   git push --force-with-lease origin feature/branch
   ```

### 🚀 **Quick Commands Reference:**

```bash
# Rebase workflow
git fetch origin
git rebase origin/main
git push --force-with-lease origin feature/branch

# Interactive rebase
git rebase -i HEAD~3

# Abort rebase if needed
git rebase --abort

# Continue rebase after resolving conflicts
git add .
git rebase --continue

# Merge with no fast-forward
git merge --no-ff feature/branch
```

---

## Quick Reference Commands

```bash
# Branch Management
git branch -a                    # List all branches
git branch -d branch-name        # Delete local branch
git push origin --delete branch  # Delete remote branch

# Status and History
git status                       # Check working directory status
git log --oneline               # View commit history
git log --graph --oneline       # View branch history

# Stashing
git stash                       # Stash changes temporarily
git stash pop                   # Apply and remove last stash
git stash list                  # List all stashes

# Merging
git merge branch-name           # Merge branch into current
git rebase branch-name          # Rebase current branch onto another

# Remote Management
git remote -v                   # List remote repositories
git fetch origin               # Fetch latest changes
git pull origin branch-name    # Pull and merge changes
```

This Git strategy will help maintain a clean, organized, and professional repository while making collaboration much easier and more efficient. 