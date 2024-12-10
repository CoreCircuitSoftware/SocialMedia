module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    transform: {
      '^.+\\.jsx?$': 'esbuild-jest', // Transpile JavaScript and JSX files using babel-jest
    },
    moduleNameMapper: {
      // Handle static assets like CSS or images
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/src/__mocks__/fileMock.js",
    },
    collectCoverage: true,
    collectCoverageFrom: [
      'src/**/*.{js,jsx}',
      '!src/index.js',
      '!src/App.jsx',
      '!src/components/ProtectedRoute.jsx',
      '!src/main.jsx',
      '!src/components/Button/Button.jsx',
      '!src/components/Button/Button.styles.jsx',
      '!src/hooks',
      '!src/styles/theme.js',
      '!src/api.js',
      '!src/constants.js',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'json', 'html'],
    setupFilesAfterEnv: ['@testing-library/jest-dom/'],
  };