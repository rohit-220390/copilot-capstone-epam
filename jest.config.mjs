/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
  transform: { '^.+\\.tsx?$': ['ts-jest', { useESM: true }] },
  testMatch: ['**/tests/**/*.test.ts'],
  // bookstore-app/ is a self-contained sub-project with its own Jest config/runner.
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/bookstore-app/'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
};
