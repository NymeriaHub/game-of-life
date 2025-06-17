import { Grid } from './Grid';
import { v4 as uuidv4 } from 'uuid';

export class Simulation {
  private constructor(
    private readonly id: string,
    private readonly grid: Grid,
    private readonly generation: number,
    private readonly createdAt: Date,
    private readonly updatedAt: Date
  ) {}

  static create(width: number, height: number): Simulation {
    const now = new Date();
    return new Simulation(uuidv4(), Grid.create(width, height), 0, now, now);
  }

  getId(): string {
    return this.id;
  }

  getGrid(): Grid {
    return this.grid;
  }

  getGeneration(): number {
    return this.generation;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  withNewGrid(grid: Grid): Simulation {
    return new Simulation(this.id, grid, this.generation + 1, this.createdAt, new Date());
  }

  resetGrid(grid: Grid): Simulation {
    return new Simulation(this.id, grid, 0, this.createdAt, new Date());
  }

  updateGrid(grid: Grid): Simulation {
    return new Simulation(this.id, grid, this.generation, this.createdAt, new Date());
  }

  equals(other: Simulation): boolean {
    return this.id === other.id;
  }
}
