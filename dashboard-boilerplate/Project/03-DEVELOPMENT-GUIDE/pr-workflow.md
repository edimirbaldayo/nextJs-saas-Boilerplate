# Pull Request Workflow Guide

This guide covers the complete pull request workflow for the Dashboard Boilerplate project, including automation and best practices.

## 🚀 Quick Start

### Prerequisites

Before using the PR workflow, ensure you have:

1. **GitHub CLI installed and authenticated**:
   ```bash
   # Install GitHub CLI
   brew install gh
   
   # Authenticate with GitHub
   gh auth login
   ```

2. **Project dependencies installed**:
   ```bash
   npm install
   ```

3. **Git hooks enabled**:
   ```bash
   npm run prepare
   ```

### Creating a Pull Request - Step by Step

#### Method 1: Automated PR Creation (Recommended)

1. **Start from develop branch**
   ```bash
   git checkout develop
   git pull origin develop
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes and commit**
   ```bash
   # Make your changes
   git add .
   git commit -m "feat: add user authentication system"
   ```

4. **Push to remote**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create PR automatically**
   ```bash
   npm run pr:create
   ```

#### Method 2: Manual PR Creation

If you prefer to create PRs manually:

1. **Follow steps 1-4 above**
2. **Go to GitHub repository**
3. **Click "Compare & pull request"**
4. **Fill in the PR template manually**

#### Method 3: GitHub CLI Direct

```bash
# Create PR with custom title and description
gh pr create --title "feat: add user authentication" --body "Adds complete user authentication system with login/logout functionality" --base develop

# Create PR with specific labels
gh pr create --title "fix: resolve login bug" --label "bug,urgent" --base develop
```

## 📋 Automated PR Creation

### Using the PR Creation Script

The project includes an automated PR creation script that:

- Analyzes commit messages
- Generates comprehensive descriptions
- Adds appropriate labels
- Creates the PR via GitHub CLI

#### Basic Usage

```bash
# Create PR against develop branch (default)
npm run pr:create

# Create PR against main branch
npm run pr:create:main
```

#### Advanced Usage

```bash
# Create PR with custom title
npm run pr:create -- --title="Custom PR Title"

# Create PR against custom base branch
npm run pr:create -- --base=main

# Create PR with both custom title and base
npm run pr:create -- --title="feat: add dashboard" --base=main

# Create PR and stay on feature branch (don't switch to develop)
npm run pr:create:stay
# or
npm run pr:create -- --stay-on-branch
```

#### What the Script Does

1. **Analyzes Commits**: Scans commit messages since the base branch
2. **Categorizes Changes**: Counts features, fixes, docs, etc.
3. **Generates Description**: Creates a comprehensive PR description
4. **Adds Labels**: Automatically adds relevant labels
5. **Creates PR**: Uses GitHub CLI to create the pull request
6. **Returns to Develop**: Automatically switches back to develop branch and pulls latest changes

#### Example Output

When you run `npm run pr:create`, you'll see:

```bash
🔍 Analyzing commits...
🚀 Creating Pull Request...

📋 Title: User Authentication System
🌿 Base Branch: develop
🏷️  Labels: enhancement, size: medium
👥 Assignees: None

Creating pull request for feature/user-auth into develop in your-repo/your-project

https://github.com/your-repo/your-project/pull/123
✅ Pull Request created successfully!

🔄 Returning to develop branch...
✅ Switched to develop branch
📥 Pulling latest changes...
✅ Develop branch updated

🎉 Workflow complete! You can now:
   - Review your PR on GitHub
   - Start working on a new feature
   - Or continue with other tasks
```

#### Generated PR Description

The script automatically generates a description like this:

```markdown
## 📋 Changes Summary

This PR includes the following changes:

- ✨ **Features**: 2
- 🐛 **Bug Fixes**: 1
- 📚 **Documentation**: 0
- 🎨 **Style Changes**: 0
- ♻️ **Refactoring**: 1
- ✅ **Tests**: 0
- 🔧 **Chores**: 0

## 📝 Commit Summary

```
feat: add user authentication system
feat: implement login form
fix(auth): resolve session persistence issue
refactor: improve error handling
```

## 🔍 Review Checklist

- [ ] Code follows project conventions
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No breaking changes (or breaking changes are documented)
- [ ] Performance impact considered
- [ ] Security implications reviewed

## 🚀 Next Steps

1. Review the changes
2. Run `npm run type-check` and `npm run lint`
3. Test the functionality locally
4. Approve and merge when ready
```

## 🔄 GitHub Actions Automation

### PR Automation Workflow

The `.github/workflows/pr-automation.yml` workflow automatically:

- **Runs on PR creation/update**
- **Performs quality checks**:
  - TypeScript type checking
  - ESLint linting
  - Code formatting validation
- **Generates PR descriptions** (if empty)
- **Adds automatic labels** based on commit types
- **Provides review checklists**

### Automatic Labeling

The workflow automatically adds labels based on:

- **Commit Types**:
  - `feat:` → `enhancement`
  - `fix:` → `bug`
  - `docs:` → `documentation`
  - `test:` → `testing`
  - `refactor:` → `refactoring`

- **PR Size**:
  - ≤10 changes → `size: small`
  - 11-50 changes → `size: medium`
  - >50 changes → `size: large`

## 📝 PR Templates

### Pull Request Template

Every new PR automatically includes the template from `.github/pull_request_template.md` with:

- **Change type checkboxes**
- **Testing checklist**
- **Review checklist**
- **Deployment notes**
- **Performance impact**
- **Security considerations**

### Issue Templates

The project includes templates for:

- **Feature Requests** (`.github/ISSUE_TEMPLATE/feature_request.md`)
- **Bug Reports** (`.github/ISSUE_TEMPLATE/bug_report.md`)

## 🔧 Git Hooks

### Pre-push Hook

The `.husky/pre-push` hook automatically runs before every push:

```bash
# What happens when you run: git push
🔍 Running pre-push checks...
📝 Running TypeScript type check...
✅ TypeScript type check passed
🔧 Running ESLint...
✅ ESLint check passed
🌿 Feature branch detected: feature/user-auth
📋 No PR found for this branch. Consider creating one with:
   npm run pr:create
✅ Pre-push checks passed!
```

**What it does:**
- Runs TypeScript type checking
- Runs ESLint linting
- Checks if PR exists for feature branches
- Suggests PR creation if needed
- **Blocks push if checks fail**

### Commit Message Hook

The `.husky/commit-msg` hook validates commit messages:

```bash
# If you try to commit with wrong format:
git commit -m "added new feature"

# You'll see:
❌ Commit message doesn't follow conventional commit format.

📝 Expected format:
   <type>(<scope>): <description>

🎯 Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert

📋 Examples:
   feat: add user authentication
   fix(auth): resolve login issue
   docs: update README
   style: format code with prettier

💡 You can amend your commit with:
   git commit --amend
```

**What it validates:**
- Conventional commit format
- Proper commit types
- Descriptive messages
- **Blocks commit if format is incorrect**

## 📊 PR Description Format

### Generated Description Structure

```markdown
## 📋 Changes Summary

This PR includes the following changes:

- ✨ **Features**: 2
- 🐛 **Bug Fixes**: 1
- 📚 **Documentation**: 0
- 🎨 **Style Changes**: 0
- ♻️ **Refactoring**: 1
- ✅ **Tests**: 0
- 🔧 **Chores**: 0

## 📝 Commit Summary

```
feat: add user authentication system
feat: implement login form
fix(auth): resolve session persistence issue
refactor: improve error handling
```

## 🔍 Review Checklist

- [ ] Code follows project conventions
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No breaking changes (or breaking changes are documented)
- [ ] Performance impact considered
- [ ] Security implications reviewed
```

## 🎯 Commit Message Guidelines

### Conventional Commits Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Commit Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system changes

### Examples

```bash
git commit -m "feat(auth): implement user login functionality"
git commit -m "fix(ui): resolve button alignment issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(api): simplify user data fetching"
git commit -m "test(auth): add unit tests for login validation"
```

## 🔍 Review Process

### Before Creating PR

1. **Run local checks**:
   ```bash
   npm run type-check
   npm run lint
   npm run test  # when tests are added
   ```

2. **Self-review**:
   - Review your own code
   - Check for obvious issues
   - Ensure documentation is updated

3. **Test functionality**:
   - Test the feature locally
   - Verify it works as expected
   - Check for edge cases

### Complete Workflow Example

Here's a complete example of creating a feature:

```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/user-dashboard

# 3. Make changes
# ... edit files ...

# 4. Stage and commit (hook will validate format)
git add .
git commit -m "feat: add user dashboard with analytics"

# 5. Push (hook will run checks)
git push origin feature/user-dashboard

# 6. Create PR automatically
npm run pr:create
```

**Expected output:**
```bash
🔍 Analyzing commits...
🚀 Creating Pull Request...

📋 Title: User Dashboard
🌿 Base Branch: develop
🏷️  Labels: enhancement, size: medium
👥 Assignees: None

Creating pull request for feature/user-dashboard into develop in your-repo/your-project

https://github.com/your-repo/your-project/pull/124
✅ Pull Request created successfully!
```

### PR Review Checklist

- [ ] **Code Quality**:
  - [ ] Follows project conventions
  - [ ] No linting errors
  - [ ] TypeScript types are correct
  - [ ] Code is readable and well-commented

- [ ] **Functionality**:
  - [ ] Feature works as expected
  - [ ] No breaking changes
  - [ ] Edge cases handled
  - [ ] Error handling implemented

- [ ] **Testing**:
  - [ ] Tests pass locally
  - [ ] New tests added for new functionality
  - [ ] Manual testing performed

- [ ] **Documentation**:
  - [ ] README updated if needed
  - [ ] Code comments added
  - [ ] API documentation updated

- [ ] **Security**:
  - [ ] No sensitive data exposed
  - [ ] Input validation implemented
  - [ ] Authentication/authorization considered

## 🚀 Best Practices

### Branch Naming

Use descriptive branch names:

```bash
feature/user-authentication
feature/dashboard-ui
fix/login-bug
hotfix/critical-security-issue
release/v1.2.0
```

### PR Size

Keep PRs focused and manageable:

- **Small PRs** (≤10 files): Quick to review, easy to merge
- **Medium PRs** (11-50 files): Good for features
- **Large PRs** (>50 files): Consider breaking into smaller PRs

### Commit Frequency

- Commit frequently with meaningful messages
- Use conventional commit format
- Keep commits atomic (one logical change per commit)

### Review Process

- Request reviews from team members
- Address review comments promptly
- Use PR comments for discussions
- Merge only after approval

## 💡 Pro Tips

### 1. **Use Descriptive Branch Names**

```bash
# ✅ Good
feature/user-authentication
fix/login-validation-error
docs/update-api-documentation

# ❌ Bad
feature/123
fix/bug
update
```

### 2. **Write Clear Commit Messages**

```bash
# ✅ Good
feat(auth): implement OAuth login with Google
fix(ui): resolve button alignment in mobile view
docs(api): update user endpoints documentation

# ❌ Bad
feat: add stuff
fix: bug fix
update readme
```

### 3. **Keep PRs Focused**

```bash
# ✅ Good - Single feature
feat: add user profile page
- Add profile component
- Add profile API endpoints
- Add profile tests

# ❌ Bad - Multiple unrelated changes
feat: add profile page and fix login bug and update docs
```

### 4. **Use PR Templates Effectively**

- Fill out all relevant sections
- Add screenshots for UI changes
- Link related issues
- Mention breaking changes

### 5. **Automate Everything**

```bash
# Let the automation handle:
npm run pr:create  # PR creation and description
git push           # Pre-push checks
git commit         # Message validation
```

### 6. **Review Your Own PR First**

Before requesting reviews:
- [ ] Test the functionality locally
- [ ] Check that all tests pass
- [ ] Review the generated description
- [ ] Ensure documentation is updated
- [ ] Verify no sensitive data is exposed

## 🔧 Troubleshooting

### Common Issues

#### 1. **PR Creation Fails**

**Error**: `gh: command not found` or `Failed to create Pull Request`

**Solution**:
```bash
# Install GitHub CLI
brew install gh

# Authenticate with GitHub
gh auth login

# Verify installation
gh --version
```

#### 2. **Git Hooks Not Working**

**Error**: Hooks don't run or give permission errors

**Solution**:
```bash
# Reinstall husky
npm run prepare

# Make hooks executable
chmod +x .husky/pre-push
chmod +x .husky/commit-msg

# Verify hooks are working
git commit -m "test: this should fail"
# Should show validation error
```

#### 3. **TypeScript Errors**

**Error**: TypeScript compilation fails

**Solution**:
```bash
# Run type check to see errors
npm run type-check

# Generate Prisma client if needed
npm run db:generate

# Fix type errors and try again
```

#### 4. **Linting Errors**

**Error**: ESLint finds issues

**Solution**:
```bash
# Auto-fix linting errors
npm run lint:fix

# Check what can't be auto-fixed
npm run lint
```

#### 5. **Labels Not Found**

**Error**: `could not add label: 'size: small' not found`

**Solution**:
```bash
# Create missing labels in GitHub repository
gh label create "size: small" --color "0e8a16" --description "Small changes"
gh label create "size: medium" --color "fbca04" --description "Medium changes"
gh label create "size: large" --color "d93f0b" --description "Large changes"
```

#### 6. **Commit Message Validation Fails**

**Error**: Commit message doesn't follow conventional format

**Solution**:
```bash
# Amend the last commit with correct format
git commit --amend -m "feat: add user authentication"

# Or for multiple commits, use interactive rebase
git rebase -i HEAD~3
```

### Debugging Commands

```bash
# Check if GitHub CLI is authenticated
gh auth status

# List available labels
gh label list

# Check PR status
gh pr status

# View PR details
gh pr view

# Check git hooks status
ls -la .husky/
```

### Getting Help

- Check the [Git Strategy Guide](./git-strategy.md)
- Review [Project Documentation](../01-PROJECT-OVERVIEW/)
- See [Technical Specifications](../02-TECHNICAL-SPECIFICATIONS/)

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub CLI Documentation](https://cli.github.com/)
- [Husky Git Hooks](https://typicode.github.io/husky/)
- [GitHub Actions](https://docs.github.com/en/actions)

## 🎯 Summary

### What You've Learned

1. **Automated PR Creation**: Use `npm run pr:create` for instant, well-formatted PRs
2. **Git Hooks**: Automatic validation and checks on commit and push
3. **GitHub Actions**: Automated quality checks and labeling
4. **Best Practices**: How to write good commits and create focused PRs

### Quick Reference

```bash
# Complete workflow
git checkout develop && git pull
git checkout -b feature/your-feature
# ... make changes ...
git add . && git commit -m "feat: your feature"
git push origin feature/your-feature
npm run pr:create
```

### Key Commands

| Command | Purpose |
|---------|---------|
| `npm run pr:create` | Create PR and return to develop branch |
| `npm run pr:create:stay` | Create PR and stay on feature branch |
| `npm run pr:create:main` | Create PR against main branch |
| `npm run type-check` | Check TypeScript types |
| `npm run lint:fix` | Fix linting errors |
| `gh pr status` | Check PR status |
| `gh pr view` | View current PR details |

### Next Steps

1. **Practice**: Create a few test PRs to get familiar with the workflow
2. **Customize**: Adjust labels and templates to match your team's needs
3. **Extend**: Add more automation as your project grows
4. **Share**: Teach your team members how to use this workflow

Happy coding! 🚀 