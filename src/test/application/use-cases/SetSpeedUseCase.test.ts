import { describe, it, expect } from 'vitest';
import { SetSpeedUseCase } from '../../../application/use-cases/SetSpeedUseCase';
import { GAME_LIMITS } from '../../../domain/constants/GameConstants';

describe('SetSpeedUseCase', () => {
  it('should return valid speed within limits', () => {
    const useCase = new SetSpeedUseCase();
    const { MIN, MAX } = GAME_LIMITS.SPEED;

    const validSpeed = Math.floor((MIN + MAX) / 2);
    const result = useCase.execute(validSpeed);

    expect(result).toBe(validSpeed);
  });

  it('should clamp speed to minimum when below limit', () => {
    const useCase = new SetSpeedUseCase();
    const { MIN } = GAME_LIMITS.SPEED;

    const result = useCase.execute(MIN - 100);

    expect(result).toBe(MIN);
  });

  it('should clamp speed to maximum when above limit', () => {
    const useCase = new SetSpeedUseCase();
    const { MAX } = GAME_LIMITS.SPEED;

    const result = useCase.execute(MAX + 500);

    expect(result).toBe(MAX);
  });

  it('should return minimum speed when at lower boundary', () => {
    const useCase = new SetSpeedUseCase();
    const { MIN } = GAME_LIMITS.SPEED;

    const result = useCase.execute(MIN);

    expect(result).toBe(MIN);
  });

  it('should return maximum speed when at upper boundary', () => {
    const useCase = new SetSpeedUseCase();
    const { MAX } = GAME_LIMITS.SPEED;

    const result = useCase.execute(MAX);

    expect(result).toBe(MAX);
  });

  it('should handle edge case speeds', () => {
    const useCase = new SetSpeedUseCase();
    const { MIN, MAX } = GAME_LIMITS.SPEED;

    // Test extreme values
    expect(useCase.execute(0)).toBe(MIN);
    expect(useCase.execute(-1000)).toBe(MIN);
    expect(useCase.execute(999999)).toBe(MAX);

    // Test decimal values (should work as is)
    const decimalSpeed = MIN + 0.5;
    if (decimalSpeed < MAX) {
      expect(useCase.execute(decimalSpeed)).toBe(decimalSpeed);
    }
  });
});
