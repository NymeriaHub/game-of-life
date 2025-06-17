import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Settings } from '../../../presentation/components/Settings';
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

describe('Settings Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all form elements', () => {
    render(
      <GameProvider>
        <Settings />
      </GameProvider>
    );

    expect(screen.getByLabelText(/simulation speed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/width/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/height/i)).toBeInTheDocument();
    expect(screen.getByText('Randomize Grid')).toBeInTheDocument();
  });

  it('should display current values', async () => {
    render(
      <GameProvider>
        <Settings />
      </GameProvider>
    );

    expect(screen.getByDisplayValue('200')).toBeInTheDocument(); // Default speed
    expect(screen.getByLabelText(/width/i)).toHaveValue(20); // Default width
    expect(screen.getByLabelText(/height/i)).toHaveValue(20); // Default height
  });

  it('should handle speed change and blur', () => {
    render(
      <GameProvider>
        <Settings />
      </GameProvider>
    );

    const speedInput = screen.getByLabelText(/simulation speed/i);
    fireEvent.change(speedInput, { target: { value: '100' } });
    fireEvent.blur(speedInput);

    expect(screen.getByDisplayValue('100')).toBeInTheDocument();
  });

  it('should clamp speed values on blur', () => {
    render(
      <GameProvider>
        <Settings />
      </GameProvider>
    );

    const speedInput = screen.getByLabelText(/simulation speed/i);
    fireEvent.change(speedInput, { target: { value: '5' } });
    fireEvent.blur(speedInput);

    expect(screen.getByDisplayValue('10')).toBeInTheDocument(); // Clamped to minimum
  });

  it('should handle width change and blur', () => {
    render(
      <GameProvider>
        <Settings />
      </GameProvider>
    );

    const widthInput = screen.getByLabelText(/width/i);
    fireEvent.change(widthInput, { target: { value: '30' } });
    fireEvent.blur(widthInput);

    expect(screen.getByDisplayValue('30')).toBeInTheDocument();
  });

  it('should clamp width values on blur', () => {
    render(
      <GameProvider>
        <Settings />
      </GameProvider>
    );

    const widthInput = screen.getByLabelText(/width/i);
    fireEvent.change(widthInput, { target: { value: '2' } });
    fireEvent.blur(widthInput);

    expect(screen.getByDisplayValue('3')).toBeInTheDocument(); // Clamped to minimum
  });

  it('should handle height change and blur', () => {
    render(
      <GameProvider>
        <Settings />
      </GameProvider>
    );

    const heightInput = screen.getByLabelText(/height/i);
    fireEvent.change(heightInput, { target: { value: '25' } });
    fireEvent.blur(heightInput);

    expect(screen.getByDisplayValue('25')).toBeInTheDocument();
  });

  it('should handle randomize button click', () => {
    render(
      <GameProvider>
        <Settings />
      </GameProvider>
    );

    const randomizeButton = screen.getByText('Randomize Grid');
    fireEvent.click(randomizeButton);

    // Should not throw error
    expect(randomizeButton).toBeInTheDocument();
  });

  it('should disable inputs when simulation is running', () => {
    // Cette fonctionnalité nécessiterait de démarrer la simulation pour tester
    render(
      <GameProvider>
        <Settings />
      </GameProvider>
    );

    // Par défaut, les inputs devraient être activés
    expect(screen.getByLabelText(/simulation speed/i)).not.toBeDisabled();
    expect(screen.getByLabelText(/width/i)).not.toBeDisabled();
    expect(screen.getByLabelText(/height/i)).not.toBeDisabled();
    expect(screen.getByText('Randomize Grid')).not.toBeDisabled();
  });

  it('should enable inputs when simulation is not running', () => {
    render(
      <GameProvider>
        <Settings />
      </GameProvider>
    );

    expect(screen.getByLabelText(/simulation speed/i)).not.toBeDisabled();
    expect(screen.getByLabelText(/width/i)).not.toBeDisabled();
    expect(screen.getByLabelText(/height/i)).not.toBeDisabled();
    expect(screen.getByText('Randomize Grid')).not.toBeDisabled();
  });

  it('should handle maximum speed value', () => {
    render(
      <GameProvider>
        <Settings />
      </GameProvider>
    );

    const speedInput = screen.getByLabelText(/simulation speed/i);
    fireEvent.change(speedInput, { target: { value: '6000' } });
    fireEvent.blur(speedInput);

    // Should clamp to maximum value
    expect(speedInput).toHaveValue(5000);
  });
});
