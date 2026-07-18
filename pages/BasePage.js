const logger = require("../utils/Logger");
const { expect } = require("@playwright/test");
class BasePage {
    constructor(page) {
        this.page = page;
    }
    locator(selector) {
        return this.page.locator(selector);
    }
    async navigate(url) {
        logger.info(`Navigating to ${url}`);
        await this.page.goto(url);
    }
    async click(selector) {
        logger.info(`Click -> ${selector}`);
        await this.locator(selector).waitFor({
            state: "visible"
        });
        await this.locator(selector).click();
    }
    async fill(selector, value) {
        logger.info(`Fill -> ${selector} : ${value}`);
        await this.locator(selector).waitFor();
        await this.locator(selector).fill(value);
    }
    async type(selector, value) {
        logger.info(`Type -> ${selector}`);
        await this.locator(selector).pressSequentially(value);
    }
    async clear(selector) {
        logger.info(`Clear -> ${selector}`);
        await this.locator(selector).clear();
    }
    async getText(selector) {
        logger.info(`Reading Text -> ${selector}`);
        return await this.locator(selector).textContent();
    }
    async getValue(selector) {
        return await this.locator(selector).inputValue();
    }
    async isVisible(selector) {
        return await this.locator(selector).isVisible();
    }
    async waitForVisible(selector) {
        await this.locator(selector).waitFor({
            state: "visible"
        });
    }
    async waitForHidden(selector) {
        await this.locator(selector).waitFor({
            state: "hidden"
        });
    }
    async waitForURL(url) {
        await this.page.waitForURL(url);
    }
    async hover(selector) {
        logger.info(`Hover -> ${selector}`);
        await this.locator(selector).hover();
    }
    async doubleClick(selector) {
        logger.info(`Double Click -> ${selector}`);
        await this.locator(selector).dblclick();
    }
    async rightClick(selector) {
        logger.info(`Right Click -> ${selector}`);
        await this.locator(selector).click({
            button: "right"
        });
    }
    async dragAndDrop(source, target) {
        logger.info("Drag & Drop");
        await this.locator(source).dragTo(
            this.locator(target)
        );
    }
    async selectByLabel(selector, label) {
        logger.info(`Select -> ${label}`);
        await this.locator(selector).selectOption({
            label
        });
    }
    async check(selector) {
        await this.locator(selector).check();
    }
    async uncheck(selector) {
        await this.locator(selector).uncheck();
    }
    async uploadFile(selector, filePath) {
        logger.info("Uploading File");
        await this.locator(selector).setInputFiles(filePath);
    }
    async scrollIntoView(selector) {
        await this.locator(selector).scrollIntoViewIfNeeded();
    }
    async executeJavaScript(script, element = null) {
        if (element) {
            return await this.page.evaluate(script,element);
        }
        return await this.page.evaluate(script);
    }
    async switchFrame(frameLocator) {
        return this.page.frameLocator(frameLocator);
    }
    async takeScreenshot(name) {
        await this.page.screenshot({
            path: `screenshots/${name}.png`,
            fullPage: true
        });
    }
    async getTitle() {
        return await this.page.title();
    }
    async getCurrentURL() {
        return this.page.url();
    }
    async refresh() {
        await this.page.reload();
    }
    async goBack() {
        await this.page.goBack();
    }
    async goForward() {
        await this.page.goForward();
    }
    async pressKey(selector, key) {
        await this.locator(selector).press(key);
    }
    async wait(milliseconds) {
        await this.page.waitForTimeout(milliseconds);
    }
    // Assertions
    async verifyText(selector, expectedText) {
        await expect(
            this.locator(selector)
        ).toHaveText(expectedText);
    }
    async verifyVisible(selector) {
        await expect(
            this.locator(selector)
        ).toBeVisible();
    }
    async verifyHidden(selector) {
        await expect(
            this.locator(selector)
        ).toBeHidden();
    }
    async verifyURL(expectedURL) {
        await expect(this.page)
            .toHaveURL(expectedURL);
    }
    async verifyTitle(expectedTitle) {
        await expect(this.page)
            .toHaveTitle(expectedTitle);
    }
}
module.exports = BasePage;