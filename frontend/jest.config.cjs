module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    transform: {
      '^.+\\.jsx?$': 'esbuild-jest', // Transpile JavaScript and JSX files using babel-jest
    },
    moduleNameMapper: {
      // Handle static assets like CSS or images
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom/'],
  };