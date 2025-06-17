import React, {
  createContext,
  useContext,
  ReactNode,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import { Grid } from '../../domain/entities/Grid';
import { Simulation } from '../../domain/entities/Simulation';
import { gameReducer } from './GameReducer';
import { GameState } from './GameTypes';
import { useGameWorker } from '../hooks/useGameWorker';
import { GAME_LIMITS } from '../../domain/constants/GameConstants';

interface GameContextType {
  grid: Grid;
  generation: number;
  isRunning: boolean;
  speed: number;
  width: number;
  height: number;
  cellSize: number;
  // Local settings values (for controlled inputs)
  localSpeed: number | '';
  localWidth: number | '';
  localHeight: number | '';
  startSimulation: () => void;
  stopSimulation: () => void;
  reset: () => void;
  toggleCell: (x: number, y: number) => void;
  randomize: () => void;
  // Settings handlers
  handleLocalSpeedChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLocalWidthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLocalHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSpeedBlur: () => void;
  handleWidthBlur: () => void;
  handleHeightBlur: () => void;
  workerSupported: boolean;
  workerError?: { message: string; stack?: string } | null;
  workerPerformance?: {
    totalTime: number;
    cellsProcessed: number;
  } | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
  initialWidth?: number;
  initialHeight?: number;
}

export const GameProvider: React.FC<GameProviderProps> = ({
  children,
  initialWidth = GAME_LIMITS.GRID.DEFAULT_WIDTH,
  initialHeight = GAME_LIMITS.GRID.DEFAULT_HEIGHT,
}) => {
  // Initial state
  const initialState: GameState = {
    simulation: Simulation.create(initialWidth, initialHeight),
    isRunning: false,
    speed: GAME_LIMITS.SPEED.DEFAULT,
    width: initialWidth,
    height: initialHeight,
  };

  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Local state for controlled inputs
  const [localSpeed, setLocalSpeed] = React.useState<number | ''>(state.speed);
  const [localWidth, setLocalWidth] = React.useState<number | ''>(state.width);
  const [localHeight, setLocalHeight] = React.useState<number | ''>(state.height);

  // Sync local state when global state changes
  React.useEffect(() => {
    setLocalSpeed(state.speed);
    setLocalWidth(state.width);
    setLocalHeight(state.height);
  }, [state.speed, state.width, state.height]);

  // Web Worker for calculations
  const {
    calculateNextGeneration: workerCalculate,
    isCalculating: workerIsCalculating,
    lastPerformance: workerPerformance,
    error: workerError,
    workerSupported,
  } = useGameWorker();

  // Game loop with worker
  useEffect(() => {
    if (!state.isRunning || workerIsCalculating) return;

    const runGeneration = async () => {
      try {
        const currentGrid = state.simulation.getGrid();
        const newGrid = await workerCalculate(currentGrid, state.simulation.getGeneration());
        dispatch({ type: 'NEXT_GENERATION', payload: { newGrid } });
      } catch {
        dispatch({ type: 'STOP_SIMULATION' });
      }
    };

    const timeoutId = setTimeout(runGeneration, state.speed);
    return () => clearTimeout(timeoutId);
  }, [state.isRunning, state.simulation, state.speed, workerCalculate, workerIsCalculating]);

  // Action creators
  const toggleCell = useCallback(
    (x: number, y: number) => {
      if (state.isRunning || workerIsCalculating) return;

      dispatch({ type: 'TOGGLE_CELL', payload: { x, y } });
    },
    [state.isRunning, workerIsCalculating]
  );

  const startSimulation = useCallback(() => {
    if (!workerSupported || workerIsCalculating) return;
    dispatch({ type: 'START_SIMULATION' });
  }, [workerSupported, workerIsCalculating]);

  const stopSimulation = useCallback(() => {
    dispatch({ type: 'STOP_SIMULATION' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const randomize = useCallback(() => {
    if (state.isRunning || workerIsCalculating) return;
    dispatch({ type: 'RANDOMIZE' });
  }, [state.isRunning, workerIsCalculating]);

  // Settings input handlers
  const handleLocalSpeedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? '' : parseInt(e.target.value);
    if (!isNaN(value as number)) {
      setLocalSpeed(value as number);
    }
  }, []);

  const handleLocalWidthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? '' : parseInt(e.target.value);
    if (!isNaN(value as number)) {
      setLocalWidth(value as number);
    }
  }, []);

  const handleLocalHeightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? '' : parseInt(e.target.value);
    if (!isNaN(value as number)) {
      setLocalHeight(value as number);
    }
  }, []);

  // Settings blur handlers with validation
  const handleSpeedBlur = useCallback(() => {
    const value = localSpeed === '' ? GAME_LIMITS.SPEED.DEFAULT : localSpeed;
    const clampedValue = Math.max(GAME_LIMITS.SPEED.MIN, Math.min(GAME_LIMITS.SPEED.MAX, value));
    dispatch({ type: 'SET_SPEED', payload: { speed: clampedValue } });
  }, [localSpeed]);

  const handleWidthBlur = useCallback(() => {
    const value = localWidth === '' ? GAME_LIMITS.GRID.MIN_SIZE : localWidth;
    const clampedValue = Math.max(
      GAME_LIMITS.GRID.MIN_SIZE,
      Math.min(GAME_LIMITS.GRID.MAX_SIZE, value)
    );
    dispatch({ type: 'RESIZE_GRID', payload: { width: clampedValue, height: state.height } });
  }, [localWidth, state.height]);

  const handleHeightBlur = useCallback(() => {
    const value = localHeight === '' ? GAME_LIMITS.GRID.MIN_SIZE : localHeight;
    const clampedValue = Math.max(
      GAME_LIMITS.GRID.MIN_SIZE,
      Math.min(GAME_LIMITS.GRID.MAX_SIZE, value)
    );
    dispatch({ type: 'RESIZE_GRID', payload: { width: state.width, height: clampedValue } });
  }, [localHeight, state.width]);

  // Calculate optimal cell size based on grid dimensions
  const calculateCellSize = useCallback((width: number, height: number): number => {
    const minCellSize = 8;
    const maxCellSize = 20;

    if (width <= 20 && height <= 20) {
      return maxCellSize;
    } else if (width <= 50 && height <= 50) {
      return 15;
    } else if (width <= 100 && height <= 100) {
      return 10;
    } else {
      return minCellSize;
    }
  }, []);

  const cellSize = calculateCellSize(state.width, state.height);

  const value: GameContextType = {
    grid: state.simulation.getGrid(),
    generation: state.simulation.getGeneration(),
    isRunning: state.isRunning || workerIsCalculating,
    speed: state.speed,
    width: state.width,
    height: state.height,
    cellSize,
    localSpeed,
    localWidth,
    localHeight,
    startSimulation,
    stopSimulation,
    reset,
    toggleCell,
    randomize,
    handleLocalSpeedChange,
    handleLocalWidthChange,
    handleLocalHeightChange,
    handleSpeedBlur,
    handleWidthBlur,
    handleHeightBlur,
    workerSupported,
    workerError,
    workerPerformance,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
