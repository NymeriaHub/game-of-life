import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Grid } from '../../domain/entities/Grid';
import GameWorker from '../../workers/gameOfLifeWorker.ts?worker';

interface WorkerResult {
  grid: { width: number; height: number; livingCells: string[] };
  generation: number;
  performance: {
    totalTime: number;
    livingCells: number;
  };
}

interface WorkerError {
  message: string;
  stack?: string;
}

interface WorkerPerformance {
  totalTime: number;
  livingCells: number;
  cellsProcessed: number;
}

interface UseGameWorkerReturn {
  calculateNextGeneration: (grid: Grid, generation: number) => Promise<Grid>;
  cancelCalculation: () => void;
  isCalculating: boolean;
  lastPerformance: WorkerPerformance | null;
  error: WorkerError | null;
  workerSupported: boolean;
}

interface WorkerMessageHandlers {
  setIsCalculating: (calculating: boolean) => void;
  setError: (error: WorkerError | null) => void;
  setLastPerformance: (performance: WorkerPerformance) => void;
  pendingResolveRef: React.MutableRefObject<((grid: Grid) => void) | null>;
  pendingRejectRef: React.MutableRefObject<((error: Error) => void) | null>;
}

const handleWorkerMessage = (e: MessageEvent, handlers: WorkerMessageHandlers) => {
  const { type, data } = e.data;
  const { setIsCalculating, setError, setLastPerformance, pendingResolveRef, pendingRejectRef } =
    handlers;

  switch (type) {
    case 'result':
      try {
        const resultData = data as WorkerResult;
        const newGrid = Grid.deserialize(resultData.grid);

        setIsCalculating(false);
        setError(null);

        if (pendingResolveRef.current) {
          pendingResolveRef.current(newGrid);
          pendingResolveRef.current = null;
          pendingRejectRef.current = null;
        }
      } catch (deserializeError) {
        setError({
          message: 'Failed to deserialize worker result',
          stack: deserializeError instanceof Error ? deserializeError.stack : undefined,
        });
        setIsCalculating(false);

        if (pendingRejectRef.current) {
          pendingRejectRef.current(new Error('Deserialization failed'));
          pendingResolveRef.current = null;
          pendingRejectRef.current = null;
        }
      }
      break;

    case 'performance': {
      const perfData = data as WorkerPerformance;
      setLastPerformance(perfData);
      break;
    }

    case 'error': {
      const errorData = data as WorkerError;
      setError(errorData);
      setIsCalculating(false);

      if (pendingRejectRef.current) {
        pendingRejectRef.current(new Error(errorData.message));
        pendingResolveRef.current = null;
        pendingRejectRef.current = null;
      }
      break;
    }

    default:
      break;
  }
};

const handleWorkerError = (
  error: ErrorEvent,
  handlers: Pick<
    WorkerMessageHandlers,
    'setError' | 'setIsCalculating' | 'pendingResolveRef' | 'pendingRejectRef'
  >
) => {
  const { setError, setIsCalculating, pendingResolveRef, pendingRejectRef } = handlers;

  setError({
    message: 'Worker error',
    stack: error.error?.stack,
  });
  setIsCalculating(false);

  if (pendingRejectRef.current) {
    pendingRejectRef.current(new Error('Worker error'));
    pendingResolveRef.current = null;
    pendingRejectRef.current = null;
  }
};

export const useGameWorker = (): UseGameWorkerReturn => {
  const workerRef = useRef<Worker | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [lastPerformance, setLastPerformance] = useState<WorkerPerformance | null>(null);
  const [error, setError] = useState<WorkerError | null>(null);
  const [workerSupported] = useState(() => typeof Worker !== 'undefined');
  const pendingResolveRef = useRef<((grid: Grid) => void) | null>(null);
  const pendingRejectRef = useRef<((error: Error) => void) | null>(null);

  // Initialize worker
  useEffect(() => {
    if (!workerSupported) return;

    try {
      const worker = new GameWorker();
      workerRef.current = worker;

      const messageHandlers: WorkerMessageHandlers = {
        setIsCalculating,
        setError,
        setLastPerformance,
        pendingResolveRef,
        pendingRejectRef,
      };

      // Handle worker messages
      worker.onmessage = (e) => handleWorkerMessage(e, messageHandlers);

      // Handle worker errors
      worker.onerror = (error) => handleWorkerError(error, messageHandlers);
    } catch (initError) {
      setError({
        message: 'Failed to initialize worker',
        stack: initError instanceof Error ? initError.stack : undefined,
      });
    }

    // Cleanup
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [workerSupported]);

  const calculateNextGeneration = useCallback(
    (grid: Grid, generation: number): Promise<Grid> => {
      return new Promise((resolve, reject) => {
        if (!workerSupported) {
          reject(new Error('Web Workers not supported'));
          return;
        }

        if (!workerRef.current) {
          reject(new Error('Worker not initialized'));
          return;
        }

        if (isCalculating) {
          reject(new Error('Calculation already in progress'));
          return;
        }

        try {
          setIsCalculating(true);
          setError(null);

          // Store promise callbacks
          pendingResolveRef.current = resolve;
          pendingRejectRef.current = reject;

          // Send calculation request to worker
          workerRef.current.postMessage({
            type: 'calculate',
            data: {
              grid: grid.serialize(),
              generation,
            },
          });
        } catch (sendError) {
          setIsCalculating(false);
          setError({
            message: 'Failed to send message to worker',
            stack: sendError instanceof Error ? sendError.stack : undefined,
          });
          reject(sendError);
        }
      });
    },
    [workerSupported, isCalculating]
  );

  const cancelCalculation = useCallback(() => {
    if (!workerSupported || !workerRef.current) return;

    if (isCalculating) {
      setIsCalculating(false);
      setError(null);

      if (pendingRejectRef.current) {
        pendingRejectRef.current(new Error('Calculation cancelled'));
        pendingResolveRef.current = null;
        pendingRejectRef.current = null;
      }
    }
  }, [workerSupported, isCalculating]);

  return {
    calculateNextGeneration,
    cancelCalculation,
    isCalculating,
    lastPerformance,
    error,
    workerSupported,
  };
};
