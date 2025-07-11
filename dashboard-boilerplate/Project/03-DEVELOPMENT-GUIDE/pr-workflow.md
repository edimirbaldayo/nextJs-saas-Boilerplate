# Pull Request Workflow Guide

This guide covers the complete pull request workflow for the Dashboard Boilerplate project, including automation and best practices.

## 🚀 Quick Start

### Creating a Pull Request

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

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   npm run pr:create
   ```

## 📋 Automated PR Creation

### Using the PR Creation Script

The project includes an automated PR creation script that:

- Analyzes commit messages
- Generates comprehensive descriptions
- Adds appropriate labels
- Creates the PR via GitHub CLI

```bash
# Create PR against develop branch (default)
npm run pr:create

# Create PR against main branch
npm run pr:create:main

# Create PR with custom title
npm run pr:create -- --title="Custom PR Title"

# Create PR against custom base branch
npm run pr:create -- --base=main
```

### What the Script Does

1. **Analyzes Commits**: Scans commit messages since the base branch
2. **Categorizes Changes**: Counts features, fixes, docs, etc.
3. **Generates Description**: Creates a comprehensive PR description
4. **Adds Labels**: Automatically adds relevant labels
5. **Creates PR**: Uses GitHub CLI to create the pull request

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

The `.husky/pre-push` hook automatically:

- Runs TypeScript type checking
- Runs ESLint linting
- Checks if PR exists for feature branches
- Suggests PR creation if needed

### Commit Message Hook

The `.husky/commit-msg` hook validates:

- Conventional commit format
- Proper commit types
- Descriptive messages

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

## 🔧 Troubleshooting

### Common Issues

1. **PR Creation Fails**
   ```bash
   # Install GitHub CLI
   brew install gh
   gh auth login
   ```

2. **Git Hooks Not Working**
   ```bash
   # Reinstall husky
   npm run prepare
   ```

3. **TypeScript Errors**
   ```bash
   npm run type-check
   npm run db:generate  # if Prisma related
   ```

4. **Linting Errors**
   ```bash
   npm run lint:fix
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