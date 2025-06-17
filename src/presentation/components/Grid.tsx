import { useEffect } from 'react';
import { Grid as GridEntity } from '../../domain/entities/Grid';
import { useGame } from '../context/GameContext';
import { useCanvasRenderer } from '../hooks/useCanvasRenderer';

interface GridProps {
  grid: GridEntity;
  onToggle: (x: number, y: number) => void;
}

export const Grid = ({ grid, onToggle }: GridProps) => {
  const { width, height, cellSize } = useGame();

  const totalWidth = cellSize * width;
  const totalHeight = cellSize * height;

  // Use optimized canvas renderer
  const { canvasRef, renderGrid, handleCanvasClick } = useCanvasRenderer({
    width,
    height,
    cellSize,
  });

  // Render grid when it changes
  useEffect(() => {
    renderGrid(grid);
  }, [grid, renderGrid]);

  return (
    <div className="inline-block">
      <canvas
        ref={canvasRef}
        onClick={(e) => handleCanvasClick(e, onToggle)}
        className="bg-white border-2 border-gray-300 rounded cursor-pointer"
        style={{
          width: `${totalWidth}px`,
          height: `${totalHeight}px`,
        }}
      />
    </div>
  );
};
