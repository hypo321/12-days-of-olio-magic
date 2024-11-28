// src/utils/__tests__/doorUtils.test.ts
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from 'vitest';

let isDev = false;
let unlockAllDoors = 'false';

vi.mock('../env', () => {
  return {
    get isDev() {
      return isDev;
    },
    get unlockAllDoors() {
      return unlockAllDoors;
    },
  };
});

import {
  canOpenDoor,
  getOpeningDateMessage,
  isDevelopmentMode,
} from '../doorUtils';

describe('doorUtils', () => {
  beforeEach(() => {
    isDev = false;
    unlockAllDoors = 'false';

    vi.useFakeTimers();
    vi.setSystemTime(new Date(2023, 11, 5)); // December 5, 2023
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('isDevelopmentMode', () => {
    it('returns true when in development mode and VITE_UNLOCK_ALL_DOORS is true', () => {
      isDev = true;
      unlockAllDoors = 'true';
      expect(isDevelopmentMode()).toBe(true);
    });

    it('returns false when not in development mode', () => {
      isDev = false;
      unlockAllDoors = 'true';
      expect(isDevelopmentMode()).toBe(false);
    });

    it('returns false when VITE_UNLOCK_ALL_DOORS is not "true"', () => {
      isDev = true;
      unlockAllDoors = 'false';
      expect(isDevelopmentMode()).toBe(false);
    });
  });

  describe('canOpenDoor', () => {
    it('allows opening all doors in development mode', () => {
      isDev = true;
      unlockAllDoors = 'true';
      expect(canOpenDoor(1)).toBe(true);
      expect(canOpenDoor(12)).toBe(true);
    });

    it('allows opening doors from past days in production', () => {
      isDev = false;
      unlockAllDoors = 'false';
      expect(canOpenDoor(1)).toBe(true);
      expect(canOpenDoor(4)).toBe(true);
    });

    it('allows opening door from current day in production', () => {
      isDev = false;
      unlockAllDoors = 'false';
      expect(canOpenDoor(5)).toBe(true);
    });

    it('prevents opening future doors in production', () => {
      isDev = false;
      unlockAllDoors = 'false';
      expect(canOpenDoor(6)).toBe(false);
      expect(canOpenDoor(12)).toBe(false);
    });
  });

  describe('getOpeningDateMessage', () => {
    it('returns correct message format', () => {
      const message = getOpeningDateMessage(10);
      expect(message).toBe('This door will open on December 10.');
    });

    it('handles different days correctly', () => {
      expect(getOpeningDateMessage(1)).toBe(
        'This door will open on December 1.'
      );
      expect(getOpeningDateMessage(12)).toBe(
        'This door will open on December 12.'
      );
    });
  });
});
