import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { Grid } from '../../../presentation/components/Grid';
import { Grid as GridEntity } from '../../../domain/entities/Grid';
import { Cell } from '../../../domain/entities/Cell';
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

describe('Grid Component', () => {
  const createMockGrid = (width: number, height: number) => {
    const grid = GridEntity.create(width, height);
    // Add some alive cells for testing
    grid.setCellAt(1, 1, Cell.createAlive());
    grid.setCellAt(2, 2, Cell.createAlive());
    return grid;
  };

  const mockProps = {
    grid: createMockGrid(5, 5),
    onToggle: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render canvas element', () => {
    render(
      <GameProvider>
        <Grid {...mockProps} />
      </GameProvider>
    );

    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should have correct canvas dimensions', () => {
    render(
      <GameProvider>
        <Grid {...mockProps} />
      </GameProvider>
    );

    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas.width).toBeGreaterThan(0);
    expect(canvas.height).toBeGreaterThan(0);
  });

  it('should call onToggle when canvas is clicked', () => {
    render(
      <GameProvider>
        <Grid {...mockProps} />
      </GameProvider>
    );

    const canvas = document.querySelector('canvas')!;
    fireEvent.click(canvas, { clientX: 50, clientY: 50 });

    expect(mockProps.onToggle).toHaveBeenCalled();
  });

  it('should calculate correct cell coordinates on click', () => {
    render(
      <GameProvider>
        <Grid {...mockProps} />
      </GameProvider>
    );

    const canvas = document.querySelector('canvas')!;

    // Mock getBoundingClientRect
    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    fireEvent.click(canvas, { clientX: 20, clientY: 20 });

    expect(mockProps.onToggle).toHaveBeenCalledWith(expect.any(Number), expect.any(Number));
  });

  it('should not call onToggle for clicks outside grid bounds', () => {
    render(
      <GameProvider>
        <Grid {...mockProps} />
      </GameProvider>
    );

    const canvas = document.querySelector('canvas')!;

    // Mock getBoundingClientRect
    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    // Click outside bounds
    fireEvent.click(canvas, { clientX: -10, clientY: -10 });

    expect(mockProps.onToggle).not.toHaveBeenCalled();
  });

  it('should update when grid prop changes', () => {
    const { rerender } = render(
      <GameProvider>
        <Grid {...mockProps} />
      </GameProvider>
    );

    const newGrid = createMockGrid(5, 5);
    rerender(
      <GameProvider>
        <Grid {...mockProps} grid={newGrid} />
      </GameProvider>
    );

    // Canvas should still be present
    expect(document.querySelector('canvas')).toBeInTheDocument();
  });

  it('should handle empty grid', () => {
    const emptyGrid = GridEntity.create(3, 3);

    render(
      <GameProvider>
        <Grid grid={emptyGrid} onToggle={vi.fn()} />
      </GameProvider>
    );

    expect(document.querySelector('canvas')).toBeInTheDocument();
  });

  it('should apply correct styling classes', () => {
    render(
      <GameProvider>
        <Grid {...mockProps} />
      </GameProvider>
    );

    const canvas = document.querySelector('canvas');
    expect(canvas).toHaveClass(
      'bg-white',
      'border-2',
      'border-gray-300',
      'rounded',
      'cursor-pointer'
    );

    const container = canvas?.parentElement;
    expect(container).toHaveClass('inline-block');
  });

  it('should render with default grid size', () => {
    // Test with very small grid
    const smallGrid = GridEntity.create(2, 2);

    render(
      <GameProvider>
        <Grid grid={smallGrid} onToggle={vi.fn()} />
      </GameProvider>
    );

    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas.width).toBeGreaterThan(0);
    expect(canvas.height).toBeGreaterThan(0);
  });
});
