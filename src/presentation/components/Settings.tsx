import { useGame } from '../context/GameContext';
import { Input, Button } from '../../common/ui';

export const Settings = () => {
  const {
    localSpeed,
    localWidth,
    localHeight,
    handleLocalSpeedChange,
    handleLocalWidthChange,
    handleLocalHeightChange,
    handleSpeedBlur,
    handleWidthBlur,
    handleHeightBlur,
    randomize,
    isRunning,
  } = useGame();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Settings</h2>

        <div className="space-y-4">
          <Input
            id="speed"
            label="Simulation Speed (10-5000ms)"
            type="number"
            value={localSpeed}
            onChange={handleLocalSpeedChange}
            onBlur={handleSpeedBlur}
            disabled={isRunning}
            min="10"
            max="5000"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="width"
              label="Width (3-1000)"
              type="number"
              value={localWidth}
              onChange={handleLocalWidthChange}
              onBlur={handleWidthBlur}
              disabled={isRunning}
              min="3"
              max="1000"
            />

            <Input
              id="height"
              label="Height (3-1000)"
              type="number"
              value={localHeight}
              onChange={handleLocalHeightChange}
              onBlur={handleHeightBlur}
              disabled={isRunning}
              min="3"
              max="1000"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <Button onClick={randomize} disabled={isRunning} variant="success" className="w-full">
          Randomize Grid
        </Button>
      </div>
    </div>
  );
};
