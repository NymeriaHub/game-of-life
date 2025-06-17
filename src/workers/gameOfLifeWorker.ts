import { Grid } from '../domain/entities/Grid';
import { NextGeneration } from '../domain/services/NextGeneration';

// Types for Worker communication
interface CalculateMessage {
  type: 'calculate';
  data: {
    grid: { width: number; height: number; livingCells: string[] };
    generation: number;
  };
}

interface ResultMessage {
  type: 'result';
  data: {
    grid: { width: number; height: number; livingCells: string[] };
    generation: number;
    performance: {
      totalTime: number;
      livingCells: number;
    };
  };
}

interface ErrorMessage {
  type: 'error';
  data: {
    message: string;
    stack?: string;
  };
}

interface PerformanceMessage {
  type: 'performance';
  data: {
    totalTime: number;
    livingCells: number;
    cellsProcessed: number;
  };
}

// Union type for all possible worker messages
// type WorkerMessage = CalculateMessage | ResultMessage | ErrorMessage | PerformanceMessage;

// Worker message handler
self.onmessage = function (e: MessageEvent<CalculateMessage>) {
  const { type, data } = e.data;

  switch (type) {
    case 'calculate':
      try {
        const startTime = performance.now();

        // Deserialize grid from main thread
        const grid = Grid.deserialize(data.grid);
        const originalLivingCells = grid.getLivingCells().size;

        // Calculate next generation using existing domain logic
        const newGrid = NextGeneration.calculate(grid);

        const endTime = performance.now();
        const totalTime = endTime - startTime;
        const newLivingCells = newGrid.getLivingCells().size;

        // Send performance data
        const performanceMessage: PerformanceMessage = {
          type: 'performance',
          data: {
            totalTime: Number(totalTime.toFixed(2)),
            livingCells: newLivingCells,
            cellsProcessed: originalLivingCells,
          },
        };
        self.postMessage(performanceMessage);

        // Send result back to main thread
        const resultMessage: ResultMessage = {
          type: 'result',
          data: {
            grid: newGrid.serialize(),
            generation: data.generation + 1,
            performance: {
              totalTime: Number(totalTime.toFixed(2)),
              livingCells: newLivingCells,
            },
          },
        };
        self.postMessage(resultMessage);
      } catch (error) {
        const errorMessage: ErrorMessage = {
          type: 'error',
          data: {
            message: error instanceof Error ? error.message : 'Unknown worker error',
            stack: error instanceof Error ? error.stack : undefined,
          },
        };
        self.postMessage(errorMessage);
      }
      break;

    default:
  }
};

export {}; // Make this a module
