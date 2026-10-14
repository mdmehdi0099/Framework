const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

/**
 * ============================================================
 *                 LOGIN FEATURE
 * ============================================================
 */

Given("the user launches the application", async function () {

    await this.testContext.pageManager
    .getLoginPage()
    .navigateToLoginPage();

});

When('the user logs in with valid username {string} and password {string} credentials', async function (username, password) {
  // Write code here that turns the phrase above into concrete actions
  
    await this.testContext.pageManager
        .getLoginPage()
        .login(username, password);

    this.testContext.sharedContext.set(
        "LoggedInUser",
        username
    );
});

//Starts here
Given('the user launches the application {string}', async function (URL) {
  // Write code here that turns the phrase above into concrete actions
  
});

Given('the user enters the valid username {string} and password {string}', async function (username, password) {
  // Write code here that turns the phrase above into concrete actions
  
});

When('the user clicks on login button', async function () {
  // Write code here that turns the phrase above into concrete actions
  
});

Then('the user should be redirected to the HomePage {string}', async function (dashboardPage) {
  // Write code here that turns the phrase above into concrete actions
  
});


