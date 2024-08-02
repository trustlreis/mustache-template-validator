const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Implement node event listeners here if needed
    },
    baseUrl: 'http://localhost:3000', // Make sure your app runs on this URL
    specPattern: 'cypress/e2e/**/*.cy.js', // Update spec pattern
    viewportWidth: 1000,
    viewportHeight: 660,
    video: false, // Disable video recording if not needed
    retries: {
      runMode: 2, // Retry failed tests in run mode
      openMode: 0, // Do not retry tests in open mode
    },
  },
  viewportWidth: 1000,
  viewportHeight: 660,
})