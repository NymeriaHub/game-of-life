import { describe, it, expect } from 'vitest';
import { Cell } from '../../../domain/entities/Cell';

describe('Cell Value Object', () => {
  it('should create alive cell', () => {
    const cell = Cell.createAlive();
    expect(cell.isAlive()).toBe(true);
  });

  it('should create dead cell', () => {
    const cell = Cell.createDead();
    expect(cell.isAlive()).toBe(false);
  });

  it('should create cell with state', () => {
    const aliveCell = Cell.create('alive');
    const deadCell = Cell.create('dead');

    expect(aliveCell.isAlive()).toBe(true);
    expect(deadCell.isAlive()).toBe(false);
  });

  it('should toggle cell state', () => {
    const aliveCell = Cell.createAlive();
    const deadCell = Cell.createDead();

    aliveCell.toggle();
    deadCell.toggle();

    expect(aliveCell.isAlive()).toBe(false);
    expect(deadCell.isAlive()).toBe(true);
  });

  it('should check equality', () => {
    const cell1 = Cell.createAlive();
    const cell2 = Cell.createAlive();
    const cell3 = Cell.createDead();

    expect(cell1.equals(cell2)).toBe(true);
    expect(cell1.equals(cell3)).toBe(false);
  });

  it('should check if cell is dead', () => {
    const aliveCell = Cell.createAlive();
    const deadCell = Cell.createDead();

    expect(aliveCell.isDead()).toBe(false);
    expect(deadCell.isDead()).toBe(true);
  });

  it('should kill cell', () => {
    const cell = Cell.createAlive();
    expect(cell.isAlive()).toBe(true);

    cell.kill();
    expect(cell.isAlive()).toBe(false);
    expect(cell.isDead()).toBe(true);
  });

  it('should revive cell', () => {
    const cell = Cell.createDead();
    expect(cell.isDead()).toBe(true);

    cell.revive();
    expect(cell.isAlive()).toBe(true);
    expect(cell.isDead()).toBe(false);
  });

  it('should set cell state', () => {
    const cell = Cell.createDead();

    cell.setState('alive');
    expect(cell.isAlive()).toBe(true);

    cell.setState('dead');
    expect(cell.isDead()).toBe(true);
  });

  it('should get cell state', () => {
    const aliveCell = Cell.createAlive();
    const deadCell = Cell.createDead();

    expect(aliveCell.getState()).toBe('alive');
    expect(deadCell.getState()).toBe('dead');
  });
});
