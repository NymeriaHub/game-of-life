import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Controls } from '../../../presentation/components/Controls';
import { GameProvider } from '../../../presentation/context/GameContext';

// Mock useGameWorker directly in this file
vi.mock('../../../presentation/hooks/useGameWorker', () => ({
  useGameWorker: () => ({
    calculateNextGeneration: vi.fn().mockImplementation(async (grid) => {
      return Promise.resolve(grid);
    }),
    isCalculating: false,
    lastPerformance: null,
    error: null,
    workerSupported: true,
  }),
}));

describe('Controls Component', () => {
  const mockProps = {
    isRunning: false,
    generation: 0,
    onStart: vi.fn(),
    onStop: vi.fn(),
    onReset: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all buttons', () => {
    render(
      <GameProvider>
        <Controls {...mockProps} />
      </GameProvider>
    );

    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
    expect(screen.getByText('Generation: 0')).toBeInTheDocument();
  });

  it('should show Stop button when running', () => {
    render(
      <GameProvider>
        <Controls {...mockProps} isRunning={true} />
      </GameProvider>
    );

    expect(screen.getByText('Stop')).toBeInTheDocument();
    expect(screen.queryByText('Start')).not.toBeInTheDocument();
  });

  it('should call onStart when Start button is clicked', () => {
    render(
      <GameProvider>
        <Controls {...mockProps} />
      </GameProvider>
    );

    fireEvent.click(screen.getByText('Start'));
    expect(mockProps.onStart).toHaveBeenCalledTimes(1);
  });

  it('should call onStop when Stop button is clicked', () => {
    render(
      <GameProvider>
        <Controls {...mockProps} isRunning={true} />
      </GameProvider>
    );

    fireEvent.click(screen.getByText('Stop'));
    expect(mockProps.onStop).toHaveBeenCalledTimes(1);
  });

  it('should call onReset when Reset button is clicked', () => {
    render(
      <GameProvider>
        <Controls {...mockProps} />
      </GameProvider>
    );

    fireEvent.click(screen.getByText('Reset'));
    expect(mockProps.onReset).toHaveBeenCalledTimes(1);
  });

  it('should display correct generation number', () => {
    render(
      <GameProvider>
        <Controls {...mockProps} generation={42} />
      </GameProvider>
    );

    expect(screen.getByText('Generation: 42')).toBeInTheDocument();
  });

  it('should disable Reset button when running', () => {
    render(
      <GameProvider>
        <Controls {...mockProps} isRunning={true} />
      </GameProvider>
    );

    const resetButton = screen.getByText('Reset');
    expect(resetButton).toBeDisabled();
  });

  it('should enable Reset button when not running', () => {
    render(
      <GameProvider>
        <Controls {...mockProps} isRunning={false} />
      </GameProvider>
    );

    const resetButton = screen.getByText('Reset');
    expect(resetButton).not.toBeDisabled();
  });
});
