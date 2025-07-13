# Test Workflow

This file was created to test the updated PR workflow that automatically returns to the develop branch after creating a pull request.

## Features

- ✅ Automatic PR creation
- ✅ Comprehensive description generation
- ✅ Automatic labeling
- ✅ **NEW**: Automatic return to develop branch
- ✅ **NEW**: Pull latest changes from develop

## Usage

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: your feature"

# Push and create PR (will return to develop automatically)
git push origin feature/your-feature
npm run pr:create

# Or stay on feature branch
npm run pr:create:stay
```

## Expected Output

After running `npm run pr:create`, you should see:

```
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