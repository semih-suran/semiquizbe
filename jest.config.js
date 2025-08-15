// test.config.js
/**
 * Jest configuration for TypeScript project (ts-jest).
 * - Uses ts-jest transform (config passed inline)
 * - Looks for tests under src/
 * - Helps surface leaked handles and sets reasonable timeouts for CI
 */

module.exports = {
  testEnvironment: 'node',

  roots: ['<rootDir>/src'],

  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],

  transform: {
    // Use ts-jest for .ts/.tsx files and pass tsconfig explicitly
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },

  // Common file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Ignore build output and node_modules
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // Helpful for debugging leaked handles (will add some overhead)
  detectOpenHandles: true,

  // Make tests a bit more tolerant on slow CI machines
  testTimeout: 20000,

  globalSetup: '<rootDir>/src/__test/jest.global-setup.ts',

  // Ensure global teardown runs to close DB/Redis/etc (adjust path if needed)
  globalTeardown: '<rootDir>/src/__test/jest.global-teardown.ts',

  // Optional: produce clearer output in CI; comment out locally if noisy
  // verbose: true,
};
