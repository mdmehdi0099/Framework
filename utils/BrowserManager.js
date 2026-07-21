const { chromium, firefox, webkit } = require("playwright");
const config = require("../config/ConfigManager");
const cp = require("child_process");

console.log("========================================");
console.log("Loading BrowserManager...");
console.log("Resolved Path :", __filename);
console.log("========================================");

const playwrightVersion = cp
    .execSync("npx playwright --version")
    .toString()
    .trim()
    .split(" ")[1];

class BrowserManager {

    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
    }

    /**
     * Initialize Browser
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
        const executionType = config.get("ExecutionType");
        const browserName = (config.getBrowser() || "chromium").toLowerCase();
        console.log(`Execution Type : ${executionType}`);
        console.log(`Browser : ${browserName}`);
        //------------------------------------------------------
        // LOCAL EXECUTION
        //------------------------------------------------------
        if (executionType === "Local") {
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
            return;
        }

        //------------------------------------------------------
        // LAMBDATEST EXECUTION
        //------------------------------------------------------
        const capabilities = {
            browserName: "Chrome",
            browserVersion: "latest",
            "LT:Options": {
                platform: "Windows 11",
                build:config.get("BuildName") || "Playwright Build",
                name: "Playwright Test",
                user: config.get("LambdaTestUsername"),
                accessKey: config.get("LambdaTestAccessKey"),
                network: true,
                video: true,
                console: true,
                tunnel: false,
                playwrightClientVersion: playwrightVersion
            }
        };
        //------------------------------------------------------
        // Browser Mapping
        //------------------------------------------------------
        switch (browserName) {
            case "firefox":
                capabilities.browserName = "pw-firefox";
                break;
            case "webkit":
                capabilities.browserName = "pw-webkit";
                break;
            case "edge":
                capabilities.browserName = "MicrosoftEdge";
                break;
            case "chrome":
                capabilities.browserName = "Chrome";
                break;
            default:
                capabilities.browserName = "pw-chromium";
        }
        const wsEndpoint =`wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
                JSON.stringify(capabilities)
            )}`;
        console.log("Connecting to LambdaTest...");
        console.log(wsEndpoint);
        this.browser = await chromium.connect({
            wsEndpoint
        });
    }
    /**
     * Create Context
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
     * Create Page
     */
    async createPage() {
        this.page = await this.context.newPage();
        this.page.setDefaultTimeout(config.getTimeout());
        return this.page;
    }

    /**
     * Update LambdaTest Status
     */
    async updateLambdaStatus(status, remark = "") {
        const executionType =config.get("ExecutionType");
        if (executionType.toLowerCase() !== "remote") {
            return;
        }
        const payload = {
            action: "setTestStatus",
            arguments: {
                status,
                remark
            }
        };
        await this.page.evaluate(() => {},`lambdatest_action: ${JSON.stringify(payload)}`);
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
console.log("BrowserManager Methods:",Object.getOwnPropertyNames(BrowserManager.prototype));
module.exports = BrowserManager;