import { GameState, GameAction } from './GameTypes';
import { ToggleCellUseCase } from '../../application/use-cases/ToggleCellUseCase';
import { RandomizeGridUseCase } from '../../application/use-cases/RandomizeGridUseCase';
import { SetSpeedUseCase } from '../../application/use-cases/SetSpeedUseCase';
import { ResizeGridUseCase } from '../../application/use-cases/ResizeGridUseCase';
import { ResetSimulationUseCase } from '../../application/use-cases/ResetSimulationUseCase';

// Use cases instances
const toggleCellUseCase = new ToggleCellUseCase();
const randomizeGridUseCase = new RandomizeGridUseCase();
const setSpeedUseCase = new SetSpeedUseCase();
const resizeGridUseCase = new ResizeGridUseCase();
const resetSimulationUseCase = new ResetSimulationUseCase();

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'TOGGLE_CELL': {
      const { x, y } = action.payload;

      // Clone FIRST to get a new grid reference
      const newGrid = state.simulation.getGrid().clone();

      // Use case handles business logic on the NEW grid
      toggleCellUseCase.execute(newGrid, x, y);

      // Create new simulation with the new grid
      const newSimulation = state.simulation.updateGrid(newGrid);

      return {
        ...state,
        simulation: newSimulation,
      };
    }

    case 'NEXT_GENERATION': {
      const { newGrid } = action.payload;
      return {
        ...state,
        simulation: state.simulation.withNewGrid(newGrid),
      };
    }

    case 'START_SIMULATION': {
      return {
        ...state,
        isRunning: true,
      };
    }

    case 'STOP_SIMULATION': {
      return {
        ...state,
        isRunning: false,
      };
    }

    case 'RESET': {
      const newSimulation = resetSimulationUseCase.execute(state.width, state.height);
      return {
        ...state,
        simulation: newSimulation,
        isRunning: false,
      };
    }

    case 'RANDOMIZE': {
      const newGrid = randomizeGridUseCase.execute(state.width, state.height);
      return {
        ...state,
        simulation: state.simulation.resetGrid(newGrid),
        isRunning: false,
      };
    }

    case 'SET_SPEED': {
      const validSpeed = setSpeedUseCase.execute(action.payload.speed);
      return {
        ...state,
        speed: validSpeed,
      };
    }

    case 'RESIZE_GRID': {
      const { width, height } = action.payload;
      const newSimulation = resizeGridUseCase.execute(width, height);
      return {
        ...state,
        width: newSimulation.getGrid().getWidth(),
        height: newSimulation.getGrid().getHeight(),
        simulation: newSimulation,
        isRunning: false,
      };
    }

    default:
      return state;
  }
}
