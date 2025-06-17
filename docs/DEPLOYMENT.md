# Deployment and CI/CD

## CI/CD Pipeline

### 🚀 **GitHub Actions Workflow**

The project uses **GitHub Actions** for continuous integration and deployment.

#### **Configuration File**

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Run tests with coverage
        run: npm run test:coverage
      - name: Build
        run: npm run build
      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        if: success()
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          directory: ./coverage
```

### 📋 **Pipeline Steps**

1. **📦 Checkout & Setup**

   - Source code retrieval
   - Node.js 20 installation
   - npm dependencies cache

2. **🔧 Installation**

   - `npm ci` for reproducible installation
   - Respect package-lock.json

3. **📋 Quality Gates**

   - **Linting**: ESLint with 0 warnings tolerated
   - **Tests**: 128 tests must pass
   - **Coverage**: Coverage report generation

4. **🏗️ Build**

   - TypeScript compilation
   - Bundling with Vite/Rollup
   - Asset optimization

5. **📊 Reporting**
   - Coverage upload to Codecov
   - Build artifacts available

## Git Hooks with Husky

### 🪝 **Pre-push Hook**

```bash
#!/usr/bin/env sh

# Run linting
npm run lint

# Run tests
npm run test
```

#### **Advantages**

- **Prevention** of bugs before push
- **Code consistency** in the branch
- **Quick feedback** to developers

### 🔧 **Configuration**

```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```
