import { describe, it, expect } from 'vitest';
import { Simulation } from '../../../domain/entities/Simulation';
import { Grid } from '../../../domain/entities/Grid';

describe('Simulation Entity', () => {
  it('should create simulation with initial state', () => {
    const simulation = Simulation.create(10, 10);

    expect(simulation.getGeneration()).toBe(0);
    expect(simulation.getGrid().getWidth()).toBe(10);
    expect(simulation.getGrid().getHeight()).toBe(10);
  });

  it('should increment generation with new grid', () => {
    const simulation = Simulation.create(3, 3);
    const newGrid = Grid.create(3, 3);

    const nextSimulation = simulation.withNewGrid(newGrid);

    expect(nextSimulation.getGeneration()).toBe(1);
    expect(simulation.getGeneration()).toBe(0); // Original unchanged
  });

  it('should reset grid without changing generation', () => {
    const simulation = Simulation.create(3, 3);
    const newGrid = Grid.create(3, 3);

    const resetSimulation = simulation.resetGrid(newGrid);

    expect(resetSimulation.getGeneration()).toBe(0);
  });

  it('should update grid without changing generation', () => {
    const simulation = Simulation.create(3, 3);
    const newGrid = Grid.create(3, 3);

    const updatedSimulation = simulation.updateGrid(newGrid);

    expect(updatedSimulation.getGeneration()).toBe(0);
  });

  it('should check simulation equality', () => {
    const sim1 = Simulation.create(3, 3);
    const sim2 = Simulation.create(3, 3);

    // Different IDs, so not equal
    expect(sim1.equals(sim2)).toBe(false);

    // Same simulation should equal itself
    expect(sim1.equals(sim1)).toBe(true);
  });
}); 