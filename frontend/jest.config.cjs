module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    transform: {
      '^.+\\.jsx?$': 'esbuild-jest', // Transpile JavaScript and JSX files using babel-jest
    },
    moduleNameMapper: {
      // Handle static assets like CSS or images
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    collectCoverage: true,
    collectCoverageFrom: [
      'src/**/*.{js,jsx}',
      '!src/index.js',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'json', 'html'],
    setupFilesAfterEnv: ['@testing-library/jest-dom/'],
  };