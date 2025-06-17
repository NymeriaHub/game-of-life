import { Cell } from './Cell';

export class Grid {
  private constructor(
    private readonly width: number,
    private readonly height: number,
    private readonly livingCells: Map<string, Cell>
  ) {}

  static create(width: number, height: number): Grid {
    return new Grid(width, height, new Map());
  }

  getCellAt(x: number, y: number): Cell {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return Cell.createDead();
    }

    const key = `${x},${y}`;
    return this.livingCells.get(key) || Cell.createDead();
  }

  setCellAt(x: number, y: number, cell: Cell): void {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return;
    }

    const key = `${x},${y}`;

    if (cell.isAlive()) {
      this.livingCells.set(key, cell);
    } else {
      this.livingCells.delete(key);
    }
  }

  toggleCellAt(x: number, y: number): void {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return;
    }

    const currentCell = this.getCellAt(x, y);
    currentCell.toggle();
    this.setCellAt(x, y, currentCell);
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }

  getCells(): Cell[][] {
    // Reconstruct 2D array on demand (for compatibility)
    const cells = Array(this.height)
      .fill(null)
      .map(() =>
        Array(this.width)
          .fill(null)
          .map(() => Cell.createDead())
      );

    this.livingCells.forEach((cell, key) => {
      const [x, y] = key.split(',').map(Number);
      cells[y][x] = cell;
    });

    return cells;
  }

  getLivingCells(): Map<string, Cell> {
    return new Map(this.livingCells);
  }

  getLiveNeighborsCount(x: number, y: number): number {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
          const key = `${nx},${ny}`;
          if (this.livingCells.has(key)) {
            count++;
          }
        }
      }
    }
    return count;
  }

  // Create a deep copy for immutable operations when needed
  clone(): Grid {
    const newLivingCells = new Map();
    this.livingCells.forEach((cell, key) => {
      // Create a new cell instance to avoid shared references
      newLivingCells.set(key, cell.isAlive() ? Cell.createAlive() : Cell.createDead());
    });
    return new Grid(this.width, this.height, newLivingCells);
  }

  // Clear all cells (reset)
  clear(): void {
    this.livingCells.clear();
  }

  equals(other: Grid): boolean {
    if (this.width !== other.width || this.height !== other.height) {
      return false;
    }

    // Compare living cells maps
    if (this.livingCells.size !== other.livingCells.size) {
      return false;
    }

    for (const [key, cell] of this.livingCells) {
      const otherCell = other.livingCells.get(key);
      if (!otherCell || !cell.equals(otherCell)) {
        return false;
      }
    }

    return true;
  }

  // Serialization for Web Worker communication
  serialize(): { width: number; height: number; livingCells: string[] } {
    const livingCellsArray: string[] = [];
    this.livingCells.forEach((_, key) => {
      livingCellsArray.push(key);
    });

    return {
      width: this.width,
      height: this.height,
      livingCells: livingCellsArray,
    };
  }

  // Deserialization from Web Worker communication
  static deserialize(data: { width: number; height: number; livingCells: string[] }): Grid {
    const grid = Grid.create(data.width, data.height);

    data.livingCells.forEach((key) => {
      const [x, y] = key.split(',').map(Number);
      grid.setCellAt(x, y, Cell.createAlive());
    });

    return grid;
  }
}
