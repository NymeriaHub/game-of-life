import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../../App';

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

describe('App Component', () => {
  it('should render title', () => {
    render(<App />);

    expect(screen.getByText('Game of Life')).toBeInTheDocument();
  });

  it('should render all main sections', () => {
    render(<App />);

    // Should have controls section
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();

    // Should have settings section
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Randomize Grid')).toBeInTheDocument();

    // Should have generation counter
    expect(screen.getByText(/Generation:/)).toBeInTheDocument();
  });

  it('should have proper layout structure', () => {
    render(<App />);

    // Check for main container with proper classes
    const container = document.querySelector('.min-h-screen.bg-gray-100');
    expect(container).toBeInTheDocument();
  });

  it('should render grid component', () => {
    render(<App />);

    // Grid should be rendered (canvas element)
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('should have responsive layout classes', () => {
    render(<App />);

    const container = document.querySelector('.min-h-screen');
    expect(container).toBeInTheDocument();

    // Check for responsive flex layout
    const flexContainer = document.querySelector('.flex.flex-col.lg\\:flex-row');
    expect(flexContainer).toBeInTheDocument();
  });

  it('should integrate all components properly', () => {
    render(<App />);

    // All major components should be present
    expect(screen.getByText('Start')).toBeInTheDocument(); // Controls
    expect(screen.getByText('Settings')).toBeInTheDocument(); // Settings
    expect(screen.getByText(/Generation:/)).toBeInTheDocument(); // Generation counter
    expect(document.querySelector('canvas')).toBeInTheDocument(); // Grid
  });

  it('should have proper styling', () => {
    render(<App />);

    const container = document.querySelector('.min-h-screen.bg-gray-100');
    expect(container).toBeInTheDocument();

    const innerContainer = document.querySelector('.container.mx-auto');
    expect(innerContainer).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it('should have accessible structure', () => {
    render(<App />);

    // Should have proper heading structure
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Game of Life')).toBeInTheDocument();
  });

  it('should handle component interactions', () => {
    render(<App />);

    // Should be able to interact with controls
    const startButton = screen.getByText('Start');
    expect(startButton).not.toBeDisabled();

    // Should be able to interact with settings
    const randomizeButton = screen.getByText('Randomize Grid');
    expect(randomizeButton).not.toBeDisabled();
  });
});
