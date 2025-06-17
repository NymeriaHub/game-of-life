import { Grid } from '../../domain/entities/Grid';
import { Cell } from '../../domain/entities/Cell';

export class RandomizeGridUseCase {
  execute(width: number, height: number, probability: number = 0.3): Grid {
    const grid = Grid.create(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (Math.random() < probability) {
          grid.setCellAt(x, y, Cell.createAlive()); // Direct mutation
        }
      }
    }

    return grid;
  }
}
