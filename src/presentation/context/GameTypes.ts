import { Grid } from '../../domain/entities/Grid';
import { Simulation } from '../../domain/entities/Simulation';

export type GameAction =
  | { type: 'TOGGLE_CELL'; payload: { x: number; y: number } }
  | { type: 'NEXT_GENERATION'; payload: { newGrid: Grid } }
  | { type: 'START_SIMULATION' }
  | { type: 'STOP_SIMULATION' }
  | { type: 'RESET' }
  | { type: 'RANDOMIZE' }
  | { type: 'SET_SPEED'; payload: { speed: number } }
  | { type: 'RESIZE_GRID'; payload: { width: number; height: number } };

export type GameState = {
  simulation: Simulation;
  isRunning: boolean;
  speed: number;
  width: number;
  height: number;
};
