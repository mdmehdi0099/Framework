const {
    Before,
    After,
    BeforeAll,
    AfterAll,
    Status
} = require("@cucumber/cucumber");
const logger = require("../../utils/Logger");
const config = require("../../config/ConfigManager");
const BrowserFixture = require("../../fixtures/BrowserFixture");
const PageFixture = require("../../fixtures/PageFixture");
BeforeAll(async function () {
    logger.info("======================================");
    logger.info("Starting Test Execution");
    logger.info(`Environment : ${process.env.TEST_ENV || "qa"}`);
    logger.info("======================================");
});
const BrowserManager = require("../../utils/BrowserManager");
/*
Before(async function (scenario) {
    this.testContext.config = config;
    this.browserManager = new BrowserManager();
    const browserObjects = await this.browserManager.initialize();
    this.testContext.browser = browserObjects.browser;
    this.testContext.context = browserObjects.context;
    this.testContext.page = browserObjects.page;
    // Start tracing
    if (config.isTraceEnabled()) {
        await this.testContext.context.tracing.start({
            screenshots: true,
            snapshots: true,
            sources: true
        });

        logger.info("Trace Started");
    }
    const pageFixture = new PageFixture(browserObjects.page);
    this.testContext.pageManager = pageFixture.getPages();
    logger.info("======================================");
    logger.info(`Scenario Started : ${scenario.pickle.name}`);
    logger.info("======================================");
});
  */
  const TestRailManager = require("../../com.gurock/qa.testrailManager/TestRailManager");

  Before(async function (scenario) {
      //=====================================================
      // Configuration
      //=====================================================
      this.testContext.config = config;
      //=====================================================
      // TestRail Configuration
      //=====================================================
      const isTestRail =
          config.get("TestrailReadTestCase") === "true";
      const updateTestRail =
          config.get("UpdateTestRail") === "true";
      const updateLambda =
          config.get("UpdateLambda") === "true";
      this.testContext.isTestRail = isTestRail;
      this.testContext.updateTestRail = updateTestRail;
      this.testContext.updateLambda = updateLambda;
      //=====================================================
      // Initialize TestRail
      //=====================================================
      if (isTestRail) {
          logger.info("Initializing TestRail...");
          await TestRailManager.initializeTestCasesFromPlan();
      }
      //=====================================================
      // Extract Test Case Id
      //=====================================================
      let testCaseId = null;
      for (const tag of scenario.pickle.tags) {
          if (tag.name.startsWith("@C")) {
              testCaseId = tag.name.replace("@C", "");
              break;
          }
      }
      this.testContext.testCaseId = testCaseId;
      logger.info(`Test Case Id : ${testCaseId}`);
      //=====================================================
      // Scenario Name
      //=====================================================
      this.testContext.testName = scenario.pickle.name;
      logger.info(`Scenario : ${scenario.pickle.name}`);
      //=====================================================
      // Project Name
      //=====================================================
      if (isTestRail) {
          const projectId = config.get("projectID");
          const project =
              await TestRailManager.getProject(projectId);
          this.testContext.projectName = project.name;
          logger.info(`Project : ${project.name}`);
      } else {
          this.testContext.projectName =
              config.get("projectName");
      }
      //=====================================================
      // Build Name
      //=====================================================
      this.testContext.buildName =
          config.get("BuildName");
      logger.info(
          `Build : ${this.testContext.buildName}`
      );
      //=====================================================
      // Browser
      //=====================================================
      let browser = config.getBrowser();
      if (
          isTestRail &&
          testCaseId
      ) {
          const cases =
              TestRailManager.getTestCasesFromPlan();
          if (
              cases &&
              cases[testCaseId]
          ) {
              browser =
                  cases[testCaseId].browser ||
                  browser;
          }
      }
      this.testContext.browserName = browser;
      logger.info(`Browser : ${browser}`);
      //=====================================================
      // Launch Browser
      //=====================================================
      this.browserManager = new BrowserManager(browser);
      const browserObjects =
          await this.browserManager.initialize();
      this.testContext.browser =
          browserObjects.browser;
      this.testContext.context =
          browserObjects.context;
      this.testContext.page =
          browserObjects.page;
      //=====================================================
      // Start Trace
      //=====================================================
      if (config.isTraceEnabled()) {
          await this.testContext.context.tracing.start({
              screenshots: true,
              snapshots: true,
              sources: true
          });
          logger.info("Trace Started");
      }
      //=====================================================
      // Page Object Manager
      //=====================================================
      const pageFixture =
          new PageFixture(browserObjects.page);
      this.testContext.pageManager =
          pageFixture.getPages();
      //=====================================================
      // Logging
      //=====================================================
      logger.info("======================================");
      logger.info(
          `Scenario Started : ${scenario.pickle.name}`
      );
      logger.info("======================================");
  });
    After(async function (scenario) {
    logger.info(`Scenario Finished : ${scenario.pickle.name}`);
    logger.info(`Status : ${scenario.result.status}`);
    // Screenshot on Failure
    if (
        scenario.result.status === Status.FAILED &&
        config.takeScreenshotOnFail()
    ) {
        const screenshotName = scenario.pickle.name
            .replace(/\s+/g, "_");
        await this.testContext.page.screenshot({
            path: `screenshots/${screenshotName}.png`,
            fullPage: true
        });
        logger.error(`Screenshot Captured : ${screenshotName}.png`);
    }
    // Stop Trace
    if (config.isTraceEnabled()) {
    try {
        await this.testContext.context.tracing.stop({
            path: `traces/${Date.now()}.zip`
        });

        logger.info("Trace Saved");
    } catch (err) {
        logger.warn("Trace was not started. Skipping trace save.");
    }
    }
    // Close Browser
    await this.browserManager.closeBrowser();
    logger.info("Browser Closed");
});

AfterAll(async function () {
    logger.info("======================================");
    logger.info("Execution Completed");
    logger.info("======================================");
});