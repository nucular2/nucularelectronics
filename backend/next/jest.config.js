export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testMatch: ['**/tests/**/*.test.ts']
};
