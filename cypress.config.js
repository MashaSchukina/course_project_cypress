require('dotenv').config();
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Cypress Test Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    html: false,
    json: true,
  },
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
    baseUrl: 'https://api.clickup.com/api/v2',
    env: {
      token: process.env.CLICKUP_TOKEN,
      folderID: process.env.CLICKUP_FOLDER_ID,
      invalidToken: process.env.CLICKUP_INVALID_TOKEN,
      assigneeID: process.env.CLICKUP_ASSIGNEE_USER_ID
    }

  },
});
