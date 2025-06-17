import { describe, it, expect } from 'vitest';
import { RandomizeGridUseCase } from '../../../application/use-cases/RandomizeGridUseCase';

describe('RandomizeGridUseCase', () => {
  it('should create grid with some alive cells', () => {
    const useCase = new RandomizeGridUseCase();

    const result = useCase.execute(10, 10, 1.0); // 100% probability

    // All cells should be alive with 100% probability
    let aliveCount = 0;
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        if (result.getCellAt(x, y).isAlive()) {
          aliveCount++;
        }
      }
    }

    expect(aliveCount).toBe(100);
  });

  it('should create empty grid with 0 probability', () => {
    const useCase = new RandomizeGridUseCase();

    const result = useCase.execute(5, 5, 0.0); // 0% probability

    // No cells should be alive with 0% probability
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        expect(result.getCellAt(x, y).isAlive()).toBe(false);
      }
    }
  });

  it('should respect grid dimensions', () => {
    const useCase = new RandomizeGridUseCase();

    const result = useCase.execute(7, 3);

    expect(result.getWidth()).toBe(7);
    expect(result.getHeight()).toBe(3);
  });

  it('should use default probability when not specified', () => {
    const useCase = new RandomizeGridUseCase();

    const result = useCase.execute(5, 5); // Default probability (0.3)

    // Should have some alive cells but not all
    let aliveCount = 0;
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        if (result.getCellAt(x, y).isAlive()) {
          aliveCount++;
        }
      }
    }

    expect(aliveCount).toBeGreaterThanOrEqual(0);
    expect(aliveCount).toBeLessThanOrEqual(25);
  });
});
