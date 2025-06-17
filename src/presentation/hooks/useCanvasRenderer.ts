import { useRef, useEffect, useCallback } from 'react';
import { Grid as GridEntity } from '../../domain/entities/Grid';

interface UseCanvasRendererOptions {
  width: number;
  height: number;
  cellSize: number;
}

interface UseCanvasRendererReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  renderGrid: (grid: GridEntity) => void;
  drawSingleCell: (x: number, y: number, isAlive: boolean) => void;
  handleCanvasClick: (
    event: React.MouseEvent<HTMLCanvasElement>,
    onToggle: (x: number, y: number) => void
  ) => void;
}

export const useCanvasRenderer = ({
  width,
  height,
  cellSize,
}: UseCanvasRendererOptions): UseCanvasRendererReturn => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const previousGridRef = useRef<Map<string, boolean>>(new Map());

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctxRef.current = ctx;

    // Set canvas dimensions
    const totalWidth = cellSize * width;
    const totalHeight = cellSize * height;

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // Optimize rendering
    ctx.imageSmoothingEnabled = false;

    // Clear previous grid state when dimensions change
    previousGridRef.current.clear();
  }, [width, height, cellSize]);

  // Draw a single cell
  const drawCell = useCallback(
    (x: number, y: number, isAlive: boolean) => {
      const ctx = ctxRef.current;
      if (!ctx) return;

      const pixelX = x * cellSize;
      const pixelY = y * cellSize;

      // Fill cell
      ctx.fillStyle = isAlive ? '#000000' : '#ffffff';
      ctx.fillRect(pixelX, pixelY, cellSize, cellSize);

      // Draw border
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.strokeRect(pixelX, pixelY, cellSize, cellSize);
    },
    [cellSize]
  );

  // Render grid with differential updates
  const renderGrid = useCallback(
    (grid: GridEntity) => {
      const ctx = ctxRef.current;
      if (!ctx) return;

      const currentGridState = new Map<string, boolean>();
      const changedCells: Array<{ x: number; y: number; isAlive: boolean }> = [];

      // Build current state and detect changes
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const cell = grid.getCellAt(x, y);
          const isAlive = cell?.isAlive() ?? false;
          const key = `${x},${y}`;

          currentGridState.set(key, isAlive);

          // Check if cell changed
          const previousState = previousGridRef.current.get(key);
          if (previousState !== isAlive) {
            changedCells.push({ x, y, isAlive });
          }
        }
      }

      // If it's the first render, draw everything
      if (previousGridRef.current.size === 0) {
        // Clear canvas - check if canvas exists first
        if (ctx.canvas) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }

        // Draw all cells
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const cell = grid.getCellAt(x, y);
            drawCell(x, y, cell.isAlive());
          }
        }
      } else {
        // Only redraw changed cells (OPTIMIZATION!)
        changedCells.forEach(({ x, y, isAlive }) => {
          drawCell(x, y, isAlive);
        });
      }

      // Update previous state
      previousGridRef.current = currentGridState;
    },
    [width, height, drawCell]
  );

  // Handle canvas clicks
  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>, onToggle: (x: number, y: number) => void) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((event.clientX - rect.left) / cellSize);
      const y = Math.floor((event.clientY - rect.top) / cellSize);

      if (x >= 0 && x < width && y >= 0 && y < height) {
        onToggle(x, y);
      }
    },
    [width, height, cellSize]
  );

  return {
    canvasRef,
    renderGrid,
    drawSingleCell: drawCell,
    handleCanvasClick,
  };
};
