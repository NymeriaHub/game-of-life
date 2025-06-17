import { Cell } from '../entities/Cell';
import { Grid } from '../entities/Grid';

export class NextGeneration {
  static calculate(grid: Grid): Grid {
    // Create new grid for result
    const newGrid = Grid.create(grid.getWidth(), grid.getHeight());
    const cellsToUpdate = new Set<string>();

    const livingCells = grid.getLivingCells();

    // Find cells to update (living cells + neighbors)
    livingCells.forEach((_, key: string) => {
      const [x, y] = key.split(',').map(Number);

      // Add the cell and its neighbors
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < grid.getWidth() && ny >= 0 && ny < grid.getHeight()) {
            cellsToUpdate.add(`${nx},${ny}`);
          }
        }
      }
    });

    // Apply game rules with mutable operations
    cellsToUpdate.forEach((key) => {
      const [x, y] = key.split(',').map(Number);
      const currentCell = grid.getCellAt(x, y);
      const aliveNeighbors = grid.getLiveNeighborsCount(x, y);
      const nextCell = this.determineNextCellState(currentCell, aliveNeighbors);

      if (nextCell.isAlive()) {
        newGrid.setCellAt(x, y, nextCell); // Now mutable - no return value
      }
    });

    return newGrid;
  }

  private static determineNextCellState(currentCell: Cell, aliveNeighbors: number): Cell {
    if (currentCell.isAlive()) {
      return aliveNeighbors === 2 || aliveNeighbors === 3 ? Cell.createAlive() : Cell.createDead();
    } else {
      return aliveNeighbors === 3 ? Cell.createAlive() : Cell.createDead();
    }
  }
}
