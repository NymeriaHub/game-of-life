# Project Architecture

## Overview

This project implements **Conway's Game of Life** using **Clean Architecture** with **Domain-Driven Design (DDD)** principles.

## Project Structure

```
src/
├── domain/              # Domain Layer (Business Logic)
│   ├── entities/        # Business entities
│   ├── services/        # Business services
│   └── constants/       # Business constants
├── application/         # Application Layer (Use Cases)
│   └── use-cases/       # Use cases
├── presentation/        # Presentation Layer (UI)
│   ├── components/      # React components
│   ├── context/         # Context & State Management
│   └── hooks/           # Custom hooks
├── common/              # Reusable UI components
├── workers/             # Web Workers
└── test/                # Tests (mirror structure)
```

## Architecture Layers

### 🏗️ **Domain Layer**

- **Responsibility**: Pure business logic, independent of frameworks
- **Dependencies**: No external dependencies
- **Content**:
  - `Cell.ts`: Cell entity (alive/dead)
  - `Grid.ts`: Game grid entity
  - `Simulation.ts`: Simulation entity with state
  - `NextGeneration.ts`: Generation calculation service

### 🎯 **Application Layer**

- **Responsibility**: Use case orchestration
- **Dependencies**: Domain Layer only
- **Content**:
  - `ToggleCellUseCase.ts`: Toggle cell state
  - `RandomizeGridUseCase.ts`: Grid randomization
  - `ResizeGridUseCase.ts`: Resizing
  - `SetSpeedUseCase.ts`: Speed modification
  - `ResetSimulationUseCase.ts`: Simulation reset

### 🖥️ **Presentation Layer**

- **Responsibility**: User interface and interactions
- **Dependencies**: Application & Domain Layers
- **Content**:
  - React Components for UI
  - Context for state management
  - Hooks for UI logic

## Patterns Used

### 🎨 **Clean Architecture**

- Clear **separation of concerns**
- **Dependency inversion**: outer layers depend on inner ones
- **Framework independence**: business logic doesn't depend on React

### 📦 **Domain-Driven Design**

- Well-defined **business entities**
- **Domain services** for complex logic
- **Ubiquitous Language**: consistent business vocabulary

## State Management

### 🏪 **Context + Reducer Pattern**

```typescript
// Centralized state with useReducer
const [state, dispatch] = useReducer(gameReducer, initialState);

// Typed actions
dispatch({ type: 'TOGGLE_CELL', payload: { x, y } });
```

### ⚡ **Web Workers**

- **Intensive calculations** offloaded to Worker
- **Non-blocking UI** during calculations
- **Optimized performance** for large grids

## Data Flow

```
User Interaction → Component → Use Case → Domain Service → State Update → UI Re-render
```

### Example: Cell toggle

1. **User** clicks on a cell
2. **Component** calls the use case
3. **Use Case** uses domain service
4. **Domain Service** modifies entity
5. **State** is updated
6. **UI** re-renders automatically

## Advantages of this Architecture

### ✅ **Testability**

- Each layer can be tested independently
- Easy dependency mocking
- Unit, integration and e2e tests

### ✅ **Maintainability**

- Organized and predictable code
- Clear responsibilities
- Simplified evolution

### ✅ **Scalability**

- Simplified feature addition
- Extensible architecture
- Business code reusability

### ✅ **Performance**

- Web Workers for calculations
- React optimizations (useMemo, useCallback)
- Canvas rendering for large grids
