const {
    Before,
    After,
    Status,
    setDefaultTimeout
} = require("@cucumber/cucumber");
setDefaultTimeout(120000); // 2 minutes
const logger = require("../../utils/Logger");
logger.info("logger...");
const config = require("../../config/ConfigManager");
logger.info("config...");
const BrowserFixture = require("../../fixtures/BrowserFixture");
logger.info("BrowserFixture...");
const PageFixture = require("../../fixtures/PageFixture");
logger.info("PageFixture...");
const BrowserManager = require("../../utils/BrowserManager");
logger.info("BrowserManager...");
const TestRailManager = require("../../com.gurock/qa.testrailManager/TestRailManager");
logger.info("TestRailManager...");

Before(async function (scenario) {
    logger.info("=================================================");
    logger.info("Before Scenario Started");
    logger.info(`Scenario : ${scenario.pickle.name}`);
    logger.info("=================================================");
    //---------------------------------------------------------
    // Initialize Test Context
    //---------------------------------------------------------
    this.testContext = this.testContext || {};
    this.lastError = null;
    this.consoleOutput = "";
    this.testContext.config = config;
    //---------------------------------------------------------
    // Read Configuration
    //---------------------------------------------------------
    const isTestRail = config.get("TestrailReadTestCase") === "true";
    const updateTestRail = config.get("UpdateTestRail") === "true";
    const updateLambda = config.get("UpdateLambda") === "true";
    const executionType = config.get("ExecutionType");
    this.testContext.isTestRail = isTestRail;
    this.testContext.updateTestRail = updateTestRail;
    this.testContext.updateLambda = updateLambda;
    this.testContext.executionType = executionType;
    logger.info(`Execution Type : ${executionType}`);
    logger.info(`Read TestRail : ${isTestRail}`);
    logger.info(`Update TestRail : ${updateTestRail}`);
    logger.info(`Update Lambda : ${updateLambda}`);
    //---------------------------------------------------------
    // Initialize TestRail only once
    //---------------------------------------------------------
    if (
        isTestRail &&
        TestRailManager.getTestCasesFromPlan().size === 0
    ) {
        logger.info("Loading TestRail Test Plan...");
        await TestRailManager.initializeTestCasesFromPlan();
    }
    //---------------------------------------------------------
    // Read Test Case Id
    //---------------------------------------------------------
    let testCaseId = null;
    for (const tag of scenario.pickle.tags) {
        if (tag.name.startsWith("@C")) {
            testCaseId = tag.name.substring(2);
            break;
        }
    }
    this.testContext.testCaseId = testCaseId;
    logger.info(`Test Case Id : ${testCaseId}`);
    //---------------------------------------------------------
    // Scenario
    //---------------------------------------------------------
    this.testContext.testName =
        scenario.pickle.name;
    //---------------------------------------------------------
    // Project Name
    //---------------------------------------------------------
    if (isTestRail) {
        try {
            const project = await TestRailManager.getProject(
                    config.get("projectID")
                );
            this.testContext.projectName = project?.name || "UNKNOWN_PROJECT";
        }
        catch (e) {
            logger.warn("Unable to read Project Name from TestRail.");
            this.testContext.projectName = config.get("projectName");
        }
    }else {
        this.testContext.projectName = config.get("projectName");
    }
    //---------------------------------------------------------
    // Build Name
    //---------------------------------------------------------
    this.testContext.buildName = config.get("BuildName");
    //---------------------------------------------------------
    // Browser
    //---------------------------------------------------------
    let browserName = config.getBrowser();
    if (isTestRail && testCaseId) {
        const testCase = TestRailManager
                .getTestCasesFromPlan()
                .get(testCaseId);
        if (testCase?.browser) {
            browserName = testCase.browser;
        }
    }
    this.testContext.browserName = browserName;
    logger.info(`Browser : ${browserName}`);
    //---------------------------------------------------------
    // Launch Browser
    //---------------------------------------------------------
    try {
        this.browserManager = new BrowserManager();
        const browserObjects = await this.browserManager.initialize();
        this.testContext.browser = browserObjects.browser;
        this.testContext.context = browserObjects.context;
        this.testContext.page = browserObjects.page;
        if (!this.testContext.page) {
            throw new Error("Page initialization failed.");
        }
        logger.info("Browser launched successfully.");
    }catch (e) {
        logger.error(`Unable to launch browser : ${e.message}`);
        throw e;
    }
    //---------------------------------------------------------
    // Start Playwright Trace
    //---------------------------------------------------------
    if (config.isTraceEnabled() && this.testContext.context) {
        try {
            await this.testContext.context.tracing.start({
                screenshots: true,
                snapshots: true,
                sources: true
            });
            logger.info("Tracing Started");
        }catch (e) {
            logger.warn(`Unable to start trace : ${e.message}`);
        }
    }
    //---------------------------------------------------------
    // Initialize Page Objects
    //---------------------------------------------------------
    if (this.testContext.page) {
        const pageFixture = new PageFixture(
                this.testContext.page
            );
        this.testContext.pageManager = pageFixture.getPages();
    }
    logger.info("=================================================");
    logger.info("Before Scenario Completed");
    logger.info("=================================================");
});
After(async function (scenario) {
    logger.info("=================================================");
    logger.info("After Scenario Started");
    logger.info(`Scenario Name : ${scenario.pickle.name}`);
    logger.info("=================================================");
    const testCaseId = this.testContext.testCaseId;
    const status =
        scenario.result.status === Status.FAILED
            ? "failed"
            : "passed";
    const consoleLogs =
        this.consoleOutput || "";
    let comment =
        `${status.toUpperCase()}\n` +
        `Scenario : ${scenario.pickle.name}\n` +
        `Tags : ${scenario.pickle.tags
            .map(tag => tag.name)
            .join(", ")}`;
    if (this.lastError) {
        comment +=`\n\nException:\n${this.lastError.stack || this.lastError}`;
    }
    if (consoleLogs) {
        comment +=`\n\nConsole Output:\n${consoleLogs}`;
    }
    try {
        //-------------------------------------------------
        // Screenshot on Failure
        //-------------------------------------------------
         // Screenshot on Failure
            if (scenario.result.status === Status.FAILED && config.takeScreenshotOnFail()) {
                const screenshotName = scenario.pickle.name.replace(/\s+/g, "_");
                await this.testContext.page.screenshot({
                    path: `screenshots/${screenshotName}.png`,
                    fullPage: true
                });
                logger.error(`Screenshot Captured : ${screenshotName}.png`);
            }
        //-------------------------------------------------
        // LambdaTest Status
        //-------------------------------------------------
        if (config.get("ExecutionType") === "Remote" && this.testContext.updateLambda) {
            try {
                await this.testContext.page.evaluate(
                    status => {
                        // LambdaTest JS Executor
                        window.lambdatest_action = {
                            action: "setTestStatus",
                            arguments: {
                                status:
                                    status === "passed"
                                        ? "passed"
                                        : "failed",
                                remark: "Updated from Playwright"
                            }
                        };
                    },
                    status
                );
                logger.info(`LambdaTest status updated : ${status}`);
            } catch (e) {
                logger.error(`Failed to update LambdaTest : ${e.message}`);
            }
        }
        //-------------------------------------------------
        // TestRail Update
        //-------------------------------------------------
        if (this.testContext.isTestRail && this.testContext.updateTestRail &&testCaseId) {
            try {
                if (status === "passed") {
                    logger.info("Updating TestRail PASS");
                    await testRailPassUpdate(testCaseId,comment);
                } else {
                    logger.info("Updating TestRail FAIL");
                    await testRailFailUpdate(testCaseId,comment);
                }
            } catch (e) {
                logger.error(`Failed to update TestRail : ${e.message}`);
            }
        }
        //-------------------------------------------------
        // Stop Trace
        //-------------------------------------------------
        if (config.isTraceEnabled()) {
            try {
                await this.testContext.context.tracing.stop({
                    path: `traces/${Date.now()}.zip`
                });
                logger.info("Trace Saved");
            } catch (e) {
                logger.warn("Trace was not started. Skipping.");
            }
        }
    } catch (e) {
        logger.error(`Unexpected Error in After Hook : ${e.stack || e}`);
    } finally {
        //-------------------------------------------------
        // Close Browser
        //-------------------------------------------------
        try {
            const executionType = config.get("ExecutionType");
            if (executionType.toLowerCase() === "remote") {
                const status =scenario.result.status === Status.PASSED? "passed": "failed";
                await this.browserManager.updateLambdaStatus(status,scenario.result?.message || "");
            }
            await this.browserManager.closeBrowser();
            logger.info("Browser Closed");
        } catch (e) {
            logger.error(`Error closing browser : ${e.message}`);
        }
        //-------------------------------------------------
        // Clear Stored Error
        //-------------------------------------------------
        this.lastError = null;
        logger.info("=================================================");
        logger.info("After Scenario Completed");
        logger.info("=================================================");
    }
});
//======================================
// Update TestRail - PASS
//======================================
async function testRailPassUpdate(testCaseId, message) {
    try {
        const status = TestRailManager.TEST_CASE_PASS_STATUS;
        await TestRailManager.postResultToTestRail(
            testCaseId,
            status,
            message
        );
        logger.info(`TestRail updated successfully for Case ID ${testCaseId} (PASS)`);
    } catch (error) {
        logger.error(`Error updating TestRail (PASS): ${error.message}`);
    }
}
//======================================
// Update TestRail - FAIL
//======================================
async function testRailFailUpdate(testCaseId, message) {
    try {
        const status = TestRailManager.TEST_CASE_FAIL_STATUS;
        await TestRailManager.postResultToTestRail(
            testCaseId,
            status,
            message
        );
        logger.info(`TestRail updated successfully for Case ID ${testCaseId} (FAIL)`);
    } catch (error) {
        logger.error(`Error updating TestRail (FAIL): ${error.message}`);
    }
}