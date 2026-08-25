import { jest } from '@jest/globals';

/** Creates a jest mock function typed as `unknown` args/return to avoid never-inference on global.fetch assignment. */
export function mockFetch(): jest.Mock<(...args: unknown[]) => Promise<unknown>> {
  return jest.fn() as unknown as jest.Mock<(...args: unknown[]) => Promise<unknown>>;
}
