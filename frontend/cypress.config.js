import { defineConfig } from "cypress";
import codeCoverage from '@cypress/code-coverage/task.js';

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173/",
    setupNodeEvents(on, config) {
      codeCoverage(on, config);
      return config;
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
