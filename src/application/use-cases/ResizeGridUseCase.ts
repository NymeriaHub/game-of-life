import { Simulation } from '../../domain/entities/Simulation';
import { GAME_LIMITS } from '../../domain/constants/GameConstants';

export class ResizeGridUseCase {
  execute(width: number, height: number): Simulation {
    // Business logic: validate dimensions
    const { MIN_SIZE, MAX_SIZE } = GAME_LIMITS.GRID;

    const validWidth = Math.min(MAX_SIZE, Math.max(MIN_SIZE, width));
    const validHeight = Math.min(MAX_SIZE, Math.max(MIN_SIZE, height));

    // Create new simulation with validated dimensions
    return Simulation.create(validWidth, validHeight);
  }
}
