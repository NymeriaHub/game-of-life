import { useGame } from '../context/GameContext';
import { Button } from '../../common/ui';

interface ControlsProps {
  isRunning: boolean;
  generation: number;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

export const Controls = ({ isRunning, generation, onStart, onStop, onReset }: ControlsProps) => {
  const { workerError } = useGame();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="text-2xl font-semibold text-gray-900 text-center">
        Generation: {generation}
      </div>

      {workerError && (
        <div className="text-center">
          <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
            ⚠️ Worker Error: {workerError.message}
          </div>
        </div>
      )}

      <div className="flex gap-4 justify-center flex-wrap">
        {isRunning ? (
          <Button onClick={onStop} variant="danger" size="lg">
            Stop
          </Button>
        ) : (
          <Button onClick={onStart} variant="success" size="lg">
            Start
          </Button>
        )}

        <Button onClick={onReset} disabled={isRunning} variant="primary" size="lg">
          Reset
        </Button>
      </div>
    </div>
  );
};
