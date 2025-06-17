import { describe, it, expect } from 'vitest';
import { ToggleCellUseCase } from '../../../application/use-cases/ToggleCellUseCase';
import { Grid } from '../../../domain/entities/Grid';
import { Cell } from '../../../domain/entities/Cell';

describe('ToggleCellUseCase', () => {
  it('should toggle dead cell to alive', () => {
    const useCase = new ToggleCellUseCase();
    const grid = Grid.create(3, 3);

    useCase.execute(grid, 1, 1);

    expect(grid.getCellAt(1, 1).isAlive()).toBe(true);
  });

  it('should toggle alive cell to dead', () => {
    const useCase = new ToggleCellUseCase();
    const grid = Grid.create(3, 3);
    grid.setCellAt(1, 1, Cell.createAlive());

    useCase.execute(grid, 1, 1);

    expect(grid.getCellAt(1, 1).isAlive()).toBe(false);
  });

  it('should handle out of bounds gracefully', () => {
    const useCase = new ToggleCellUseCase();
    const grid = Grid.create(3, 3);
    const originalLivingCells = grid.getLivingCells().size;

    useCase.execute(grid, -1, -1);

    // Should not change the grid
    expect(grid.getLivingCells().size).toBe(originalLivingCells);
  });

  it('should only affect target cell', () => {
    const useCase = new ToggleCellUseCase();
    const grid = Grid.create(3, 3);
    grid.setCellAt(0, 0, Cell.createAlive());
    grid.setCellAt(2, 2, Cell.createAlive());

    useCase.execute(grid, 1, 1);

    // Target cell should be toggled
    expect(grid.getCellAt(1, 1).isAlive()).toBe(true);
    // Other cells should remain unchanged
    expect(grid.getCellAt(0, 0).isAlive()).toBe(true);
    expect(grid.getCellAt(2, 2).isAlive()).toBe(true);
  });
});
