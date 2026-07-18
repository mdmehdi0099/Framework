const { chromium, firefox, webkit } = require("playwright");
const config = require("../config/ConfigManager");

console.log("========================================");
console.log("Loading BrowserManager...");
console.log("Resolved Path :", __filename);
console.log("========================================");

class BrowserManager {

    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
    }

    /**
     * Initialize Browser, Context and Page
     */
    async initialize() {

        console.log("BrowserManager.initialize() called");

        await this.launchBrowser();
        await this.createContext();
        await this.createPage();

        return {
            browser: this.browser,
            context: this.context,
            page: this.page
        };
    }

    /**
     * Launch Browser
     */
    async launchBrowser() {

        let browserName = config.getBrowser() || "chromium";

        browserName = browserName.toLowerCase();

        console.log(`Launching Browser : ${browserName}`);

        switch (browserName) {

            case "firefox":

                this.browser = await firefox.launch({
                    headless: config.isHeadless(),
                    slowMo: config.getSlowMo()
                });

                break;

            case "webkit":

                this.browser = await webkit.launch({
                    headless: config.isHeadless(),
                    slowMo: config.getSlowMo()
                });

                break;

            default:

                this.browser = await chromium.launch({
                    headless: config.isHeadless(),
                    slowMo: config.getSlowMo()
                });

        }

        return this.browser;
    }

    /**
     * Create Browser Context
     */
    async createContext() {

        this.context = await this.browser.newContext({

            viewport: {
                width: 1920,
                height: 1080
            },

            acceptDownloads: true,

            recordVideo: config.isVideoEnabled()
                ? {
                    dir: "videos"
                }
                : undefined

        });

        return this.context;
    }

    /**
     * Create New Page
     */
    async createPage() {

        this.page = await this.context.newPage();

        this.page.setDefaultTimeout(config.getTimeout());

        return this.page;
    }

    /**
     * Close Browser
     */
    async closeBrowser() {

        if (this.browser) {
            await this.browser.close();
            console.log("Browser Closed");
        }

    }

}

console.log(
    "BrowserManager Methods:",
    Object.getOwnPropertyNames(BrowserManager.prototype)
);

module.exports = BrowserManager;