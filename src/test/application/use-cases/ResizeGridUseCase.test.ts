import { describe, it, expect } from 'vitest';
import { ResizeGridUseCase } from '../../../application/use-cases/ResizeGridUseCase';
import { GAME_LIMITS } from '../../../domain/constants/GameConstants';

describe('ResizeGridUseCase', () => {
  it('should create simulation with valid dimensions within limits', () => {
    const useCase = new ResizeGridUseCase();

    const result = useCase.execute(20, 15);

    expect(result.getGrid().getWidth()).toBe(20);
    expect(result.getGrid().getHeight()).toBe(15);

    // Should be a clean simulation
    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 20; x++) {
        expect(result.getGrid().getCellAt(x, y).isAlive()).toBe(false);
      }
    }
  });

  it('should clamp width to minimum limit', () => {
    const useCase = new ResizeGridUseCase();
    const { MIN_SIZE } = GAME_LIMITS.GRID;

    const result = useCase.execute(MIN_SIZE - 5, 10);

    expect(result.getGrid().getWidth()).toBe(MIN_SIZE);
    expect(result.getGrid().getHeight()).toBe(10);
  });

  it('should clamp height to minimum limit', () => {
    const useCase = new ResizeGridUseCase();
    const { MIN_SIZE } = GAME_LIMITS.GRID;

    const result = useCase.execute(10, MIN_SIZE - 3);

    expect(result.getGrid().getWidth()).toBe(10);
    expect(result.getGrid().getHeight()).toBe(MIN_SIZE);
  });

  it('should clamp width to maximum limit', () => {
    const useCase = new ResizeGridUseCase();
    const { MAX_SIZE } = GAME_LIMITS.GRID;

    const result = useCase.execute(MAX_SIZE + 10, 15);

    expect(result.getGrid().getWidth()).toBe(MAX_SIZE);
    expect(result.getGrid().getHeight()).toBe(15);
  });

  it('should clamp height to maximum limit', () => {
    const useCase = new ResizeGridUseCase();
    const { MAX_SIZE } = GAME_LIMITS.GRID;

    const result = useCase.execute(20, MAX_SIZE + 5);

    expect(result.getGrid().getWidth()).toBe(20);
    expect(result.getGrid().getHeight()).toBe(MAX_SIZE);
  });

  it('should clamp both dimensions when out of bounds', () => {
    const useCase = new ResizeGridUseCase();
    const { MIN_SIZE, MAX_SIZE } = GAME_LIMITS.GRID;

    const result1 = useCase.execute(MIN_SIZE - 10, MAX_SIZE + 10);
    expect(result1.getGrid().getWidth()).toBe(MIN_SIZE);
    expect(result1.getGrid().getHeight()).toBe(MAX_SIZE);

    const result2 = useCase.execute(MAX_SIZE + 20, MIN_SIZE - 5);
    expect(result2.getGrid().getWidth()).toBe(MAX_SIZE);
    expect(result2.getGrid().getHeight()).toBe(MIN_SIZE);
  });
});
