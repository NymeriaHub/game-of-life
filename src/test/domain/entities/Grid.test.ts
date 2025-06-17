import { describe, it, expect } from 'vitest';
import { Grid } from '../../../domain/entities/Grid';
import { Cell } from '../../../domain/entities/Cell';

describe('Grid Value Object', () => {
  it('should create empty grid', () => {
    const grid = Grid.create(3, 3);

    expect(grid.getWidth()).toBe(3);
    expect(grid.getHeight()).toBe(3);

    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        expect(grid.getCellAt(x, y).isAlive()).toBe(false);
      }
    }
  });

  it('should set and get cells', () => {
    const grid = Grid.create(3, 3);
    const aliveCell = Cell.createAlive();

    grid.setCellAt(1, 1, aliveCell);

    expect(grid.getCellAt(1, 1).isAlive()).toBe(true);
    expect(grid.getCellAt(0, 0).isAlive()).toBe(false);
  });

  it('should handle out of bounds gracefully', () => {
    const grid = Grid.create(3, 3);

    const outOfBoundsCell = grid.getCellAt(-1, -1);
    expect(outOfBoundsCell.isAlive()).toBe(false);

    const outOfBoundsCell2 = grid.getCellAt(5, 5);
    expect(outOfBoundsCell2.isAlive()).toBe(false);
  });

  it('should track living cells in map', () => {
    const grid = Grid.create(3, 3);

    grid.setCellAt(0, 0, Cell.createAlive());
    grid.setCellAt(1, 1, Cell.createAlive());

    const livingCells = grid.getLivingCells();
    expect(livingCells.size).toBe(2);
    expect(livingCells.has('0,0')).toBe(true);
    expect(livingCells.has('1,1')).toBe(true);
  });

  it('should count live neighbors correctly', () => {
    const grid = Grid.create(3, 3);

    // Create a pattern where center cell has 3 neighbors
    grid.setCellAt(0, 0, Cell.createAlive());
    grid.setCellAt(1, 0, Cell.createAlive());
    grid.setCellAt(0, 1, Cell.createAlive());

    expect(grid.getLiveNeighborsCount(1, 1)).toBe(3);
    expect(grid.getLiveNeighborsCount(0, 0)).toBe(2);
  });

  it('should check grid equality', () => {
    const grid1 = Grid.create(2, 2);
    const grid2 = Grid.create(2, 2);

    expect(grid1.equals(grid2)).toBe(true);

    grid1.setCellAt(0, 0, Cell.createAlive());
    expect(grid1.equals(grid2)).toBe(false);

    grid2.setCellAt(0, 0, Cell.createAlive());
    expect(grid1.equals(grid2)).toBe(true);
  });

  it('should handle out of bounds setCellAt gracefully', () => {
    const grid = Grid.create(3, 3);
    const aliveCell = Cell.createAlive();

    // Should not crash when setting out of bounds
    grid.setCellAt(-1, -1, aliveCell);
    grid.setCellAt(5, 5, aliveCell);
    grid.setCellAt(-1, 1, aliveCell);
    grid.setCellAt(1, -1, aliveCell);

    // Grid should remain empty
    expect(grid.getLivingCells().size).toBe(0);
  });

  it('should toggle cells correctly', () => {
    const grid = Grid.create(3, 3);

    // Toggle dead cell to alive
    grid.toggleCellAt(1, 1);
    expect(grid.getCellAt(1, 1).isAlive()).toBe(true);

    // Toggle alive cell to dead
    grid.toggleCellAt(1, 1);
    expect(grid.getCellAt(1, 1).isAlive()).toBe(false);
  });

  it('should handle out of bounds toggleCellAt gracefully', () => {
    const grid = Grid.create(3, 3);

    // Should not crash when toggling out of bounds
    grid.toggleCellAt(-1, -1);
    grid.toggleCellAt(5, 5);

    // Grid should remain empty
    expect(grid.getLivingCells().size).toBe(0);
  });

  it('should get 2D cells array', () => {
    const grid = Grid.create(2, 2);
    grid.setCellAt(0, 0, Cell.createAlive());
    grid.setCellAt(1, 1, Cell.createAlive());

    const cells = grid.getCells();

    expect(cells.length).toBe(2); // height
    expect(cells[0].length).toBe(2); // width
    expect(cells[0][0].isAlive()).toBe(true);
    expect(cells[0][1].isAlive()).toBe(false);
    expect(cells[1][0].isAlive()).toBe(false);
    expect(cells[1][1].isAlive()).toBe(true);
  });

  it('should clone grid correctly', () => {
    const original = Grid.create(2, 2);
    original.setCellAt(0, 0, Cell.createAlive());
    original.setCellAt(1, 1, Cell.createAlive());

    const cloned = original.clone();

    // Should have same content
    expect(cloned.equals(original)).toBe(true);
    expect(cloned.getCellAt(0, 0).isAlive()).toBe(true);
    expect(cloned.getCellAt(1, 1).isAlive()).toBe(true);

    // Should be independent instances
    cloned.setCellAt(0, 1, Cell.createAlive());
    expect(original.getCellAt(0, 1).isAlive()).toBe(false);
  });

  it('should clear all cells', () => {
    const grid = Grid.create(3, 3);
    grid.setCellAt(0, 0, Cell.createAlive());
    grid.setCellAt(1, 1, Cell.createAlive());
    grid.setCellAt(2, 2, Cell.createAlive());

    expect(grid.getLivingCells().size).toBe(3);

    grid.clear();

    expect(grid.getLivingCells().size).toBe(0);
    expect(grid.getCellAt(0, 0).isAlive()).toBe(false);
    expect(grid.getCellAt(1, 1).isAlive()).toBe(false);
    expect(grid.getCellAt(2, 2).isAlive()).toBe(false);
  });

  it('should check equality with different dimensions', () => {
    const grid1 = Grid.create(2, 3);
    const grid2 = Grid.create(3, 2);

    expect(grid1.equals(grid2)).toBe(false);
  });

  it('should check equality with different living cells count', () => {
    const grid1 = Grid.create(2, 2);
    const grid2 = Grid.create(2, 2);

    grid1.setCellAt(0, 0, Cell.createAlive());
    grid2.setCellAt(0, 0, Cell.createAlive());
    grid2.setCellAt(1, 1, Cell.createAlive());

    expect(grid1.equals(grid2)).toBe(false);
  });

  it('should serialize grid correctly', () => {
    const grid = Grid.create(3, 3);
    grid.setCellAt(0, 0, Cell.createAlive());
    grid.setCellAt(2, 1, Cell.createAlive());

    const serialized = grid.serialize();

    expect(serialized.width).toBe(3);
    expect(serialized.height).toBe(3);
    expect(serialized.livingCells).toContain('0,0');
    expect(serialized.livingCells).toContain('2,1');
    expect(serialized.livingCells.length).toBe(2);
  });

  it('should deserialize grid correctly', () => {
    const data = {
      width: 3,
      height: 3,
      livingCells: ['0,0', '2,1', '1,2'],
    };

    const grid = Grid.deserialize(data);

    expect(grid.getWidth()).toBe(3);
    expect(grid.getHeight()).toBe(3);
    expect(grid.getCellAt(0, 0).isAlive()).toBe(true);
    expect(grid.getCellAt(2, 1).isAlive()).toBe(true);
    expect(grid.getCellAt(1, 2).isAlive()).toBe(true);
    expect(grid.getCellAt(1, 1).isAlive()).toBe(false);
    expect(grid.getLivingCells().size).toBe(3);
  });

  it('should remove dead cells from living cells map', () => {
    const grid = Grid.create(3, 3);

    // Set alive cell
    grid.setCellAt(1, 1, Cell.createAlive());
    expect(grid.getLivingCells().size).toBe(1);

    // Set same position to dead cell
    grid.setCellAt(1, 1, Cell.createDead());
    expect(grid.getLivingCells().size).toBe(0);
  });
});
