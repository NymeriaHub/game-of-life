# Technical Choices

## Technology Stack

### 🚀 **Frontend Framework**

#### **React 18 + TypeScript**

- **Why React** :

  - Mature and stable ecosystem
  - Performance with Virtual DOM
  - Modern hooks for state management
  - Large community and documentation

- **Why TypeScript** :
  - **Type safety** at compile-time
  - **Enhanced IntelliSense** in IDE
  - **Safer refactoring**
  - **Living documentation** of code

### ⚡ **Build Tool**

#### **Vite**

- **Advantages** :

  - **Ultra-fast dev server** with HMR
  - **Optimized build** with Rollup
  - **Native ESM** for development
  - **Minimal configuration**

- **Alternative considered** : Create React App
- **Why Vite** : Superior development performance

### 🎨 **Styling**

#### **Tailwind CSS v4**

- **Advantages** :

  - **Utility-first** approach
  - **Performance** : Automatically optimized CSS
  - **Consistency** : Integrated design system

### 🧪 **Testing**

#### **Vitest + React Testing Library**

- **Vitest** :

  - **Vite compatible** : Same configuration
  - **Performance** : Parallel and fast tests
  - **Jest-like API** : Reduced learning curve
  - **Built-in coverage** with V8

- **React Testing Library** :
  - **Philosophy** : "Test like a user"
  - **Semantic queries** for accessibility
  - **Less fragile tests** than Enzyme

### 📋 **Code Quality**

#### **ESLint + Prettier**

- **ESLint** :

  - **TypeScript support** with @typescript-eslint
  - **React hooks rules** to avoid bugs
  - **Standard rules** with custom adjustments

- **Prettier** :
  - **Consistent automatic formatting**
  - **Transparent IDE integration**

#### **Husky + Lint-staged**

- **Pre-commit hooks** :
  - Automatic linting
  - Code formatting
  - Commit message validation

### 🚀 **CI/CD**

#### **GitHub Actions**

- **Pipeline** :
  ```yaml
  Checkout → Install → Lint → Test + Coverage → Build → Deploy
  ```
- **Advantages** :
  - **Native GitHub integration**
  - **Free runners** for open source
  - **Matrix builds** to test multiple versions

## Architecture Choices

### 🏗️ **Clean Architecture**

#### **Why Clean Architecture** :

- Clear **separation of concerns**
- Maximum **testability**
- **Framework independence**
- Long-term **evolutivity**

#### **Implementation** :

- **Domain Layer** : Entities + Pure Services
- **Application Layer** : Use Cases
- **Presentation Layer** : React Components

### 🎯 **State Management**

#### **React Context + useReducer**

- **Choice vs Redux** :

  - ✅ **Simplicity** : No boilerplate
  - ✅ **TypeScript friendly** native
  - ✅ **Sufficient performance** for the app
  - ❌ **Less advanced DevTools**

- **Pattern used** :
  ```typescript
  // Typed actions
  type GameAction =
    | { type: 'TOGGLE_CELL'; payload: { x: number; y: number } }
    | { type: 'START_SIMULATION' }
    | { type: 'PAUSE_SIMULATION' };
  ```

### ⚡ **Performance**

#### **Web Workers**

- **Problem** : Intensive calculations block UI
- **Solution** : Dedicated worker for generations
- **Advantages** :
  - **Responsive UI** during calculations
  - **Multi-core CPU usage**
  - **Scalability** for large grids

#### **Canvas Rendering**

- **Why Canvas vs DOM** :
  - **Performance** : Direct GPU rendering
  - **Scalability** : Thousands of elements
  - **Pixel-perfect control**

#### **React Optimizations**

```typescript
// Memoization of expensive calculations
const expensiveValue = useMemo(() => heavyComputation(data), [data]);

// Stable callbacks to avoid re-renders
const handleClick = useCallback(
  (x, y) => {
    dispatch({ type: 'TOGGLE_CELL', payload: { x, y } });
  },
  [dispatch]
);
```

## Considered Alternatives

### 🤔 **State Management**

- **Redux Toolkit** : Too complex for this app
- **Zustand** : Good choice, but Context suffices
- **Recoil** : Experimental, not stable

### 🎨 **Styling**

- **Styled Components** : Runtime overhead
- **CSS Modules** : Complex configuration
- **Emotion** : Larger bundle size

### 🧪 **Testing**

- **Jest** : More complex configuration with Vite
- **Cypress** : E2E overkill for this app
- **Playwright** : Heavier than necessary

## Specific Architecture Decisions

### 🎯 **Game of Life Logic**

#### **Value Objects**

```typescript
// Cell as Value Object
class Cell {
  constructor(private readonly _isAlive: boolean) {}

  toggle(): Cell {
    return new Cell(!this._isAlive); // New instance
  }
}
```

### 📱 **Responsive Design**

- **Layout responsive** with Tailwind (mobile-first)
- **Adaptive sidebar** (vertical on mobile, horizontal on desktop)
- **Fixed grid size** (not yet adaptive to screen size)
