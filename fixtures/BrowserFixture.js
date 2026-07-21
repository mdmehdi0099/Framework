const BrowserManager = require("../utils/BrowserManager");
class BrowserFixture {
    constructor() {
        console.log("BrowserManager =", BrowserManager);
        this.browserManager = new BrowserManager();
        console.log("Instance =", this.browserManager);
        console.log("initialize =", this.browserManager.initialize);
        console.log("typeof initialize =", typeof this.browserManager.initialize);
    }
    async initialize() {
        return await this.browserManager.initialize();
    }
    async close() {
        await this.browserManager.closeBrowser();
    }
}
module.exports = BrowserFixture;