import { GAME_LIMITS } from '../../domain/constants/GameConstants';

export class SetSpeedUseCase {
  execute(speed: number): number {
    // Business logic: validate speed range
    const { MIN, MAX } = GAME_LIMITS.SPEED;

    if (speed < MIN) return MIN;
    if (speed > MAX) return MAX;

    return speed;
  }
}
