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

Then("the dashboard should be displayed", async function () {

    await this.testContext.page.waitForURL(
        "**/home",
        {
            waitUntil: "networkidle"
        }
    );
throw new Error("Dashboard validation failed intentionally.");
});

