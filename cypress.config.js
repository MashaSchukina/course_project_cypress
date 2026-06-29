require('dotenv').config();
const { defineConfig } = require("cypress");
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = defineConfig({

  e2e: {
    setupNodeEvents(on, config) {
      allureWriter(on, config);
      return config;
    },
    baseUrl: 'https://api.clickup.com/api/v2',
    env: {
      token: process.env.CLICKUP_TOKEN,
      folderID: process.env.CLICKUP_FOLDER_ID,
      assigneeID: process.env.CLICKUP_ASSIGNEE_ID,
      invalidToken: process.env.CLICKUP_INVALID_TOKEN
    }

  },
});
