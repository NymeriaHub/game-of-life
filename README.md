# 🧬 Game of Life - React Implementation

A modern implementation of **Conway's Game of Life** using **React**, **TypeScript** and **Clean Architecture**.

## 🚀 Quick Start

```bash
# Installation
npm install

# Development
npm run dev

# Tests
npm run test

# Build
npm run build
```

## 🎮 About Conway's Game of Life

### 📜 **History**

**Conway's Game of Life** was created in **1970** by British mathematician **John Horton Conway**. It's a cellular automaton - a mathematical model where cells on a grid evolve according to simple rules, demonstrating how simple rules can generate complex and unpredictable behaviors.

### 🎯 **Game Rules**

The game takes place on a grid where each cell can be **alive** (●) or **dead** (○). Each cell has **8 neighbors**, and the evolution follows **4 simple rules**:

1. **Underpopulation**: A living cell with fewer than 2 neighbors dies
2. **Survival**: A living cell with 2 or 3 neighbors survives
3. **Overpopulation**: A living cell with more than 3 neighbors dies
4. **Reproduction**: A dead cell with exactly 3 neighbors becomes alive

### 🌟 **Famous Patterns**

#### **Still Lifes** (Stable)

- **Block**: 2×2 square that never changes
- **Beehive**: Hexagonal shape that remains static

#### **Oscillators** (Periodic)

- **Blinker**: 3 cells that flip between horizontal and vertical
- **Toad**: 6 cells that oscillate every 2 generations

#### **Spaceships** (Moving)

- **Glider**: 5 cells that move diagonally across the grid
- **Lightweight Spaceship**: Moves horizontally

#### **Methuselahs** (Long-lived)

- **R-pentomino**: Evolves for 1,103 generations before stabilizing!

### 🧮 **Mathematical Significance**

The Game of Life is **Turing-complete**, meaning it can simulate any computer program. Despite its simple rules, it exhibits:

- **Emergent complexity** from simple interactions
- **Unpredictable long-term behavior**
- **Self-organization** and pattern formation

This makes it a fascinating study in complexity theory, artificial life, and emergent systems.

## ✨ Features

- 🎮 **Interactive simulation** with play/pause/reset controls
- 🎛️ **Dynamic configuration** of grid size and speed
- 🖱️ **Manual cell editing** by clicking
- 🎲 **Random generation** of initial configurations
- ⚡ **Optimized performance** with Web Workers
- 🎨 **Modern interface** with Tailwind CSS

## 🏗️ Architecture

This project implements **Clean Architecture** with **Domain-Driven Design** principles:

```
📁 src/
├── 🏛️ domain/              # Pure business logic
├── 🎯 application/         # Use cases
├── 🖼️ presentation/        # User interface
├── 🔧 common/              # Reusable components
├── ⚙️ workers/             # Web Workers
└── 🧪 test/               # Tests (mirror structure)
```

## 📚 Documentation

### 📖 **Technical Guides**

- **[Architecture](docs/ARCHITECTURE.md)** - Project structure and patterns used
- **[Technical Choices](docs/TECHNICAL_CHOICES.md)** - Technology justification and decisions
- **[Testing](docs/TESTING.md)** - Testing strategy and coverage (76.39%)
- **[Deployment](docs/DEPLOYMENT.md)** - CI/CD and deployment strategies

## 🛠️ Tech Stack

### **Frontend**

- **React 18** - UI framework with modern hooks
- **TypeScript** - Static typing and safety
- **Tailwind CSS v4** - Utility-first styling
- **Vite** - Ultra-fast build tool

### **Quality & Testing**

- **Vitest** - Vite-compatible test framework
- **React Testing Library** - User-oriented testing
- **ESLint + Prettier** - Linting and formatting
- **Husky** - Git hooks for quality

### **DevOps**

- **GitHub Actions** - Automated CI/CD
- **Vercel/Netlify** - Continuous deployment
- **Coverage** - Test coverage reports

## 🧪 Testing and Quality

### 📊 **Metrics**

- **128 tests** passing ✅
- **76.39%** code coverage 📈
- **0 warnings** ESLint 🎯
- **Clean Architecture** respected 🏗️

### 🏆 **Coverage by Layer**

```
Domain Layer      ████████████████████ 96.88%
Application Layer ████████████████████ 100%
Presentation      ██████████████       70.25%
```

## 🎮 Usage

### **User Interface**

1. **Draw** cells by clicking on the grid
2. **Configure** size and speed in settings
3. **Start** simulation with Play button
4. **Observe** the evolution of generations
5. **Experiment** with different patterns!


## 🤝 Contributing

### **Development Setup**

```bash
git clone <repo>
cd game-of-life
npm install
npm run dev
```

## 🔮 Roadmap

### **Version 2.0**

- [ ] Integrated predefined patterns
- [ ] Configuration export/import

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for more details.

## 🙏 Acknowledgments

- **John Horton Conway** for inventing the Game of Life
- **React Community** for the fantastic ecosystem
- **Contributors** who improve this project

---

<div align="center">

**[🔗 Live Demo](https://your-demo-link.com)** • **[📖 Documentation](docs/)** • **[🐛 Issues](https://github.com/user/repo/issues)**

_Made with ❤️ and TypeScript_

</div>
