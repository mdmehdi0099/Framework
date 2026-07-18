const BasePage = require("./BasePage");
const LoginLocator = require("../locators/LoginLocator");
const config = require("../config/ConfigManager");

class LoginPage extends BasePage {

    constructor(page) {
        super(page);
    }

    async navigateToLoginPage() {
    const url = config.getBaseUrl();
    console.log("Base URL:", url);
    await this.page.goto(url, {
        waitUntil: "networkidle"
    });
    }

    async login(username, password) {
        await this.fill(LoginLocator.username, username);
        await this.fill(LoginLocator.password, password);
        await this.click(LoginLocator.loginButton);
    }
}

module.exports = LoginPage;