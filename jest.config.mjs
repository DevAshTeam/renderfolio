export default {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  transform: {}, 
  collectCoverageFrom: ['src/**/*.js', 'renderer.js', 'bin/**/*.js'],
};