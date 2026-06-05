/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: [
    'src/utils/**/*.js',
    'src/errors/**/*.js',
    'src/services/**/*.js',
    '!src/services/LLMService.*',
    '!src/services/DeepseekProvider.*',
    '!src/services/OpenAIProvider.*',
  ],
};
