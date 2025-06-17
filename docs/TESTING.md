# Testing Strategy

## Overview

This project has **76.39%** coverage with **128 tests** distributed across **15 test files** in 2 main categories:

- **70% Unit Tests**: Domain entities, services, and use cases
- **30% Integration Tests**: Components with context and complete workflows

## Testing Stack

### 🧪 **Vitest**

- Compatible with Vite configuration
- Superior performance with parallelization
- Jest-compatible API
- Built-in coverage with V8

### 🎭 **React Testing Library**

- "Test like a user" philosophy
- Semantic queries for accessibility
- Less fragile tests than implementation-focused approaches

### 📊 **Coverage with V8**

- **Current coverage**: 76.39%
- **Target threshold**: 80%

## Test Types

### 🔬 **Unit Tests (70%)**

#### **Domain Layer**

Tests for business entities (Cell, Grid, Simulation) and core logic without external dependencies.

#### **Use Cases**

Tests for application layer use cases that orchestrate domain operations.

#### **Services**

Tests for domain services like NextGeneration computation.

### 🔗 **Integration Tests (30%)**

#### **Components + Context**

Tests that verify React components work correctly with the game context and state management.

#### **Components + Hooks**

Tests for components using custom hooks for canvas rendering and game worker integration.

#### **Complete Workflows**

End-to-end integration tests that verify complete user workflows from UI interaction to state updates.

## Test Organization

### 📁 **Mirror Structure**

Tests follow the same directory structure as the source code, making it easy to find corresponding tests for any component or module.

### 🔧 **Configuration**

- **Vitest** configured with jsdom environment for React testing
- **Setup file** (`setup.ts`) provides Canvas API mocks and other test utilities
- **Coverage** configured to exclude test files and configuration files

## Mocking Strategies

### 🔄 **Canvas API Mock**

Comprehensive Canvas API mocking in setup.ts for testing components that use canvas rendering.

### 🔄 **Web Workers Mock**

Web Workers are mocked in individual test files when needed to avoid actual worker execution during tests.

## Quality Metrics

### 📊 **Current Coverage**

```
All files         | 76.39% | 87.43% | 88.52% | 76.39%
Domain Layer      | 96.88% | 97.46% | 92.10% | 96.88%
Application Layer | 100%   | 100%   | 100%   | 100%
Presentation      | 70.25% | 80.15% | 85.60% | 70.25%
```

### 🎯 **Objectives**

- **Domain Layer**: ✅ 95%+ (Achieved: 96.88%)
- **Application Layer**: ✅ 100% (Achieved: 100%)
- **Presentation Layer**: 🔄 80% (Current: 70.25%, In progress)

### 📈 **Areas for Improvement**

1. **Web Workers**: 0% coverage (not tested)
2. **Canvas Hooks**: 41.22% coverage (useCanvasRenderer: 98.66%, useGameWorker: 0%)
3. **Error Boundaries**: Missing tests
4. **Main entry point**: 0% coverage (main.tsx)

## Best Practices

### ✅ **Do**

- Use descriptive test names
- Follow Arrange-Act-Assert pattern
- Test one concept per test
- Keep tests isolated
- Use minimal and targeted mocking

### ❌ **Don't**

- Couple tests to implementation details
- Use excessive mocking
- Write long or complex tests
- Add multiple unrelated assertions
- Create dependencies between tests

## Useful Commands

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test src/test/domain/entities/Cell.test.ts

# Run tests in watch mode (Vitest default)
npx vitest

# Run tests with UI
npx vitest --ui
```

## Improvement Strategy

### 🎯 **Next Steps**

1. Increase Web Workers coverage
2. Add accessibility tests
3. Add performance tests
4. Add visual regression tests

### 📋 **Quality Checklist**

- [ ] All use cases tested
- [ ] Critical components covered
- [ ] Error cases tested
- [ ] Accessibility tests
- [ ] Performance tests
