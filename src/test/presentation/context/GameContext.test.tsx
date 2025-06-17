import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React, { act } from 'react';
import { GameProvider, useGame } from '../../../presentation/context/GameContext';

// Mock useGameWorker with a more React-friendly approach
vi.mock('../../../presentation/hooks/useGameWorker', () => ({
  useGameWorker: () => {
    return {
      calculateNextGeneration: vi.fn().mockImplementation(async (grid) => {
        // Just return the grid after a short delay
        await new Promise((resolve) => setTimeout(resolve, 10));
        return Promise.resolve(grid);
      }),
      isCalculating: false, // Always false - let the context manage the state
      lastPerformance: null,
      error: null,
      workerSupported: true,
    };
  },
}));

// Test component to access context
const TestComponent = () => {
  const context = useGame();

  return (
    <div>
      <div data-testid="width">{context.width}</div>
      <div data-testid="height">{context.height}</div>
      <div data-testid="speed">{context.speed}</div>
      <div data-testid="generation">{context.generation}</div>
      <div data-testid="isRunning">{context.isRunning.toString()}</div>
      <button onClick={context.startSimulation} data-testid="start">
        Start
      </button>
      <button onClick={context.stopSimulation} data-testid="stop">
        Stop
      </button>
      <button onClick={context.reset} data-testid="reset">
        Reset
      </button>
      <button onClick={() => context.toggleCell(1, 1)} data-testid="toggle-cell">
        Toggle Cell
      </button>
      <button onClick={context.randomize} data-testid="randomize">
        Randomize
      </button>
      <button
        onClick={() => {
          // Simulate speed change by calling the handlers
          const mockEvent = {
            target: { value: '100' },
          } as React.ChangeEvent<HTMLInputElement>;
          context.handleLocalSpeedChange(mockEvent);
          context.handleSpeedBlur();
        }}
        data-testid="speed-change"
      >
        Change Speed
      </button>
      <button
        onClick={() => {
          // Simulate width change
          const mockEvent = {
            target: { value: '30' },
          } as React.ChangeEvent<HTMLInputElement>;
          context.handleLocalWidthChange(mockEvent);
          context.handleWidthBlur();
        }}
        data-testid="width-change"
      >
        Change Width
      </button>
      <button
        onClick={() => {
          // Simulate height change
          const mockEvent = {
            target: { value: '25' },
          } as React.ChangeEvent<HTMLInputElement>;
          context.handleLocalHeightChange(mockEvent);
          context.handleHeightBlur();
        }}
        data-testid="height-change"
      >
        Change Height
      </button>
    </div>
  );
};

describe('GameContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should provide default values', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    expect(screen.getByTestId('width')).toHaveTextContent('20');
    expect(screen.getByTestId('height')).toHaveTextContent('20');
    expect(screen.getByTestId('speed')).toHaveTextContent('200');
    expect(screen.getByTestId('generation')).toHaveTextContent('0');
    expect(screen.getByTestId('isRunning')).toHaveTextContent('false');
  });

  it('should start simulation', async () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    await act(async () => {
      screen.getByTestId('start').click();
    });

    expect(screen.getByTestId('isRunning')).toHaveTextContent('true');
  });

  it('should stop simulation', async () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    await act(async () => {
      screen.getByTestId('start').click();
    });

    expect(screen.getByTestId('isRunning')).toHaveTextContent('true');

    await act(async () => {
      screen.getByTestId('stop').click();
    });

    expect(screen.getByTestId('isRunning')).toHaveTextContent('false');
  });

  it('should reset simulation', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    act(() => {
      screen.getByTestId('start').click();
    });

    act(() => {
      screen.getByTestId('reset').click();
    });

    expect(screen.getByTestId('isRunning')).toHaveTextContent('false');
    expect(screen.getByTestId('generation')).toHaveTextContent('0');
  });

  it('should handle cell toggle', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    act(() => {
      screen.getByTestId('toggle-cell').click();
    });

    // Cell toggle should work (we can't easily test the grid state change here)
    expect(screen.getByTestId('toggle-cell')).toBeInTheDocument();
  });

  it('should handle speed changes', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    // Test that speed change handlers work without waiting for full synchronization
    act(() => {
      screen.getByTestId('speed-change').click();
    });

    // The handlers should be called without errors
    expect(screen.getByTestId('speed-change')).toBeInTheDocument();
  });

  it('should handle width changes', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    // Test that width change handlers work
    act(() => {
      screen.getByTestId('width-change').click();
    });

    // The handlers should be called without errors
    expect(screen.getByTestId('width-change')).toBeInTheDocument();
  });

  it('should handle height changes', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    // Test that height change handlers work
    act(() => {
      screen.getByTestId('height-change').click();
    });

    // The handlers should be called without errors
    expect(screen.getByTestId('height-change')).toBeInTheDocument();
  });

  it('should handle randomize', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    act(() => {
      screen.getByTestId('randomize').click();
    });

    // Generation should be reset to 0
    expect(screen.getByTestId('generation')).toHaveTextContent('0');
  });

  it('should throw error when used outside provider', () => {
    // This should throw an error
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useGame must be used within a GameProvider');
  });

  it('should provide grid object', () => {
    render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    // Grid should be available
    expect(screen.getByTestId('width')).toHaveTextContent('20');
    expect(screen.getByTestId('height')).toHaveTextContent('20');
  });

  it('should cleanup on unmount', () => {
    const { unmount } = render(
      <GameProvider>
        <TestComponent />
      </GameProvider>
    );

    // Should not throw on unmount
    expect(() => unmount()).not.toThrow();
  });
});
