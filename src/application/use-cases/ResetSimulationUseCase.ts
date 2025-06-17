import { Simulation } from '../../domain/entities/Simulation';

export class ResetSimulationUseCase {
  execute(width: number, height: number): Simulation {
    // Business logic: create clean simulation
    return Simulation.create(width, height);
  }
}
