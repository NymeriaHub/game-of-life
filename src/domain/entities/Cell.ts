export type CellState = 'alive' | 'dead';

export class Cell {
  private constructor(private state: CellState) {}

  static create(state: CellState): Cell {
    return new Cell(state);
  }

  static createAlive(): Cell {
    return new Cell('alive');
  }

  static createDead(): Cell {
    return new Cell('dead');
  }

  isAlive(): boolean {
    return this.state === 'alive';
  }

  isDead(): boolean {
    return this.state === 'dead';
  }

  toggle(): void {
    this.state = this.state === 'alive' ? 'dead' : 'alive';
  }

  kill(): void {
    this.state = 'dead';
  }

  revive(): void {
    this.state = 'alive';
  }

  setState(state: CellState): void {
    this.state = state;
  }

  getState(): CellState {
    return this.state;
  }

  equals(other: Cell): boolean {
    return this.state === other.state;
  }
}
