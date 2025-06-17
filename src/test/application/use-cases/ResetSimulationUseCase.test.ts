import { describe, it, expect } from 'vitest';
import { ResetSimulationUseCase } from '../../../application/use-cases/ResetSimulationUseCase';

describe('ResetSimulationUseCase', () => {
  it('should create empty simulation with specified dimensions', () => {
    const useCase = new ResetSimulationUseCase();

    const result = useCase.execute(10, 8);

    expect(result.getGrid().getWidth()).toBe(10);
    expect(result.getGrid().getHeight()).toBe(8);

    // All cells should be dead in a reset simulation
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 10; x++) {
        expect(result.getGrid().getCellAt(x, y).isAlive()).toBe(false);
      }
    }
  });

  it('should create simulation with minimum dimensions', () => {
    const useCase = new ResetSimulationUseCase();

    const result = useCase.execute(1, 1);

    expect(result.getGrid().getWidth()).toBe(1);
    expect(result.getGrid().getHeight()).toBe(1);
    expect(result.getGrid().getCellAt(0, 0).isAlive()).toBe(false);
  });

  it('should create simulation with different dimensions', () => {
    const useCase = new ResetSimulationUseCase();

    const result = useCase.execute(5, 15);

    expect(result.getGrid().getWidth()).toBe(5);
    expect(result.getGrid().getHeight()).toBe(15);

    // Verify it's a clean grid
    let aliveCount = 0;
    for (let y = 0; y < 15; y++) {
      for (let x = 0; x < 5; x++) {
        if (result.getGrid().getCellAt(x, y).isAlive()) {
          aliveCount++;
        }
      }
    }

    expect(aliveCount).toBe(0);
  });
});
