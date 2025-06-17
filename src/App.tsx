import { Controls } from './presentation/components/Controls';
import { Grid } from './presentation/components/Grid';
import { Settings } from './presentation/components/Settings';
import { GameProvider, useGame } from './presentation/context/GameContext';

function GameContent() {
  const { grid, generation, isRunning, startSimulation, stopSimulation, reset, toggleCell } =
    useGame();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Game of Life</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Panneau de gauche */}
          <div className="lg:w-1/4 flex flex-col gap-8">
            <Settings />

            <Controls
              generation={generation}
              isRunning={isRunning}
              onStart={startSimulation}
              onStop={stopSimulation}
              onReset={reset}
            />
          </div>

          {/* Panneau de droite */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="max-h-[600px] overflow-auto flex items-start justify-center">
                <Grid grid={grid} onToggle={toggleCell} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;
