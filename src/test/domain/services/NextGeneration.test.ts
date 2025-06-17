import { describe, it, expect } from 'vitest';
import { NextGeneration } from '../../../domain/services/NextGeneration';
import { Grid } from '../../../domain/entities/Grid';
import { Cell } from '../../../domain/entities/Cell';

describe('NextGeneration Service', () => {
  describe('Rule 1: Underpopulation (< 2 neighbors)', () => {
    it('should kill cell with 0 neighbors', () => {
      const grid = Grid.create(3, 3);
      grid.setCellAt(1, 1, Cell.createAlive());

      const nextGrid = NextGeneration.calculate(grid);
      expect(nextGrid.getCellAt(1, 1).isAlive()).toBe(false);
    });

    it('should kill cell with 1 neighbor', () => {
      const grid = Grid.create(3, 3);
      grid.setCellAt(1, 1, Cell.createAlive()); // Center cell
      grid.setCellAt(0, 0, Cell.createAlive()); // 1 neighbor

      const nextGrid = NextGeneration.calculate(grid);
      expect(nextGrid.getCellAt(1, 1).isAlive()).toBe(false);
    });
  });

  describe('Rule 2: Survival (2 or 3 neighbors)', () => {
    it('should keep alive cell with 2 neighbors', () => {
      const grid = Grid.create(3, 3);
      grid.setCellAt(1, 1, Cell.createAlive()); // Center cell
      grid.setCellAt(0, 0, Cell.createAlive()); // Neighbor 1
      grid.setCellAt(0, 1, Cell.createAlive()); // Neighbor 2

      const nextGrid = NextGeneration.calculate(grid);
      expect(nextGrid.getCellAt(1, 1).isAlive()).toBe(true);
    });

    it('should keep alive cell with 3 neighbors', () => {
      const grid = Grid.create(3, 3);
      grid.setCellAt(1, 1, Cell.createAlive()); // Center cell
      grid.setCellAt(0, 0, Cell.createAlive()); // Neighbor 1
      grid.setCellAt(0, 1, Cell.createAlive()); // Neighbor 2
      grid.setCellAt(1, 0, Cell.createAlive()); // Neighbor 3

      const nextGrid = NextGeneration.calculate(grid);
      expect(nextGrid.getCellAt(1, 1).isAlive()).toBe(true);
    });
  });

  describe('Rule 3: Overpopulation (> 3 neighbors)', () => {
    it('should kill cell with 4 neighbors', () => {
      const grid = Grid.create(3, 3);
      grid.setCellAt(1, 1, Cell.createAlive()); // Center cell
      grid.setCellAt(0, 0, Cell.createAlive()); // Neighbor 1
      grid.setCellAt(0, 1, Cell.createAlive()); // Neighbor 2
      grid.setCellAt(1, 0, Cell.createAlive()); // Neighbor 3
      grid.setCellAt(2, 0, Cell.createAlive()); // Neighbor 4

      const nextGrid = NextGeneration.calculate(grid);
      expect(nextGrid.getCellAt(1, 1).isAlive()).toBe(false);
    });

    it('should kill cell with 8 neighbors (maximum)', () => {
      const grid = Grid.create(3, 3);
      // Fill entire 3x3 grid
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          grid.setCellAt(x, y, Cell.createAlive());
        }
      }

      const nextGrid = NextGeneration.calculate(grid);
      expect(nextGrid.getCellAt(1, 1).isAlive()).toBe(false); // Center should die
    });
  });

  describe('Rule 4: Birth (exactly 3 neighbors)', () => {
    it('should birth cell with exactly 3 neighbors', () => {
      const grid = Grid.create(3, 3);
      grid.setCellAt(0, 0, Cell.createAlive()); // Neighbor 1
      grid.setCellAt(0, 1, Cell.createAlive()); // Neighbor 2
      grid.setCellAt(1, 0, Cell.createAlive()); // Neighbor 3
      // Cell (1,1) is dead but has 3 neighbors

      const nextGrid = NextGeneration.calculate(grid);
      expect(nextGrid.getCellAt(1, 1).isAlive()).toBe(true);
    });

    it('should NOT birth cell with 2 neighbors', () => {
      const grid = Grid.create(3, 3);
      grid.setCellAt(0, 0, Cell.createAlive()); // Neighbor 1
      grid.setCellAt(0, 1, Cell.createAlive()); // Neighbor 2
      // Cell (1,1) is dead and has only 2 neighbors

      const nextGrid = NextGeneration.calculate(grid);
      expect(nextGrid.getCellAt(1, 1).isAlive()).toBe(false);
    });

    it('should NOT birth cell with 4 neighbors', () => {
      const grid = Grid.create(3, 3);
      grid.setCellAt(0, 0, Cell.createAlive()); // Neighbor 1
      grid.setCellAt(0, 1, Cell.createAlive()); // Neighbor 2
      grid.setCellAt(1, 0, Cell.createAlive()); // Neighbor 3
      grid.setCellAt(2, 0, Cell.createAlive()); // Neighbor 4
      // Cell (1,1) is dead and has 4 neighbors

      const nextGrid = NextGeneration.calculate(grid);
      expect(nextGrid.getCellAt(1, 1).isAlive()).toBe(false);
    });
  });

  describe('Classic Patterns', () => {
    it('should handle blinker pattern correctly (period 2 oscillator)', () => {
      // Create vertical blinker (3 cells in line)
      const grid = Grid.create(5, 5);
      grid.setCellAt(2, 1, Cell.createAlive()); // ●
      grid.setCellAt(2, 2, Cell.createAlive()); // ●
      grid.setCellAt(2, 3, Cell.createAlive()); // ●

      // After one generation, should become horizontal
      const nextGrid = NextGeneration.calculate(grid);

      // Check it's now horizontal
      expect(nextGrid.getCellAt(1, 2).isAlive()).toBe(true); // ●
      expect(nextGrid.getCellAt(2, 2).isAlive()).toBe(true); // ●
      expect(nextGrid.getCellAt(3, 2).isAlive()).toBe(true); // ●

      // Check old positions are dead
      expect(nextGrid.getCellAt(2, 1).isAlive()).toBe(false);
      expect(nextGrid.getCellAt(2, 3).isAlive()).toBe(false);

      // After another generation, should become vertical again
      const thirdGrid = NextGeneration.calculate(nextGrid);
      expect(thirdGrid.getCellAt(2, 1).isAlive()).toBe(true);
      expect(thirdGrid.getCellAt(2, 2).isAlive()).toBe(true);
      expect(thirdGrid.getCellAt(2, 3).isAlive()).toBe(true);
    });

    it('should handle block pattern (still life)', () => {
      // Create block (2x2)
      const grid = Grid.create(4, 4);
      grid.setCellAt(1, 1, Cell.createAlive()); // ●●
      grid.setCellAt(2, 1, Cell.createAlive()); // ●●
      grid.setCellAt(1, 2, Cell.createAlive());
      grid.setCellAt(2, 2, Cell.createAlive());

      // After one generation, should remain identical
      const nextGrid = NextGeneration.calculate(grid);

      expect(nextGrid.getCellAt(1, 1).isAlive()).toBe(true);
      expect(nextGrid.getCellAt(2, 1).isAlive()).toBe(true);
      expect(nextGrid.getCellAt(1, 2).isAlive()).toBe(true);
      expect(nextGrid.getCellAt(2, 2).isAlive()).toBe(true);

      // Check no other cells are alive
      expect(nextGrid.getCellAt(0, 0).isAlive()).toBe(false);
      expect(nextGrid.getCellAt(3, 3).isAlive()).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty grid', () => {
      const grid = Grid.create(3, 3);
      const nextGrid = NextGeneration.calculate(grid);

      // All cells should remain dead
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
          expect(nextGrid.getCellAt(x, y).isAlive()).toBe(false);
        }
      }
    });

    it('should handle grid borders correctly', () => {
      // Cell in corner
      const grid = Grid.create(3, 3);
      grid.setCellAt(0, 0, Cell.createAlive());
      grid.setCellAt(1, 0, Cell.createAlive());
      grid.setCellAt(0, 1, Cell.createAlive());

      const nextGrid = NextGeneration.calculate(grid);

      // Cell (0,0) has 2 neighbors, should survive
      expect(nextGrid.getCellAt(0, 0).isAlive()).toBe(true);
      // Cell (1,1) has 3 neighbors, should be born
      expect(nextGrid.getCellAt(1, 1).isAlive()).toBe(true);
    });
  });
});
