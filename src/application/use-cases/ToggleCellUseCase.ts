import { Grid } from '../../domain/entities/Grid';

export class ToggleCellUseCase {
  execute(grid: Grid, x: number, y: number): void {
    grid.toggleCellAt(x, y);
  }
}
