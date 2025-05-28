const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    defaultCommandTimeout: 10000, 
    env: {
      agodaUrl: 'https://www.agoda.com/',
      amazonUrl: 'https://www.amazon.com/',
      youtubeUrl: 'https://www.youtube.com/'
    }, 
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
