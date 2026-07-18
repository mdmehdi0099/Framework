const fs = require("fs");
const path = require("path");
const https = require("https");
const config = require("../../config/ConfigManager");
const APIClient = require("../testrail/APIClient");
const logger = require("../../utils/Logger");

class TestRailManager {

    //==============================
    // Status IDs
    //==============================

    static TEST_CASE_PASS_STATUS = 1;
    static TEST_CASE_FAIL_STATUS = 5;

    static client = null;
    static testCaseMap = new Map();
    //this.testContext.config = config;
    //==============================
    // Load Credentials
    //==============================

/*
    static loadCredentials() {

        if (this.client) {
            return;
        }

        const configPath = path.join(
            process.cwd(),
            "config",
            "global.properties"
        );

        const properties = {};

        fs.readFileSync(configPath, "utf8")
            .split(/\r?\n/)
            .forEach(line => {

                line = line.trim();

                if (!line || line.startsWith("#"))
                    return;

                const index = line.indexOf("=");

                if (index === -1)
                    return;

                properties[
                    line.substring(0, index).trim()
                ] = line.substring(index + 1).trim();

            });

        this.TEST_RAIL_ENGINE_URL =config.get("TestRailEngineURL");
            //properties.TestRailEngineURL;

        this.TEST_RAIL_USERNAME =config.get("TestRailUsername");
            //properties.TestRailUsername;

        this.TEST_RAIL_PASSWORD =config.get("TestRailPassword");
           //properties.TestRailPassword;

        this.TEST_PLAN_ID =config.get("TESTPLANID");
            //properties.TestPlanID;

        this.disableSSLVerification();

        this.client = new APIClient(
            this.TEST_RAIL_ENGINE_URL
        );

        this.client.setUser(
            this.TEST_RAIL_USERNAME
        );

        this.client.setPassword(
            this.TEST_RAIL_PASSWORD
        );

        logger.info("TestRail credentials loaded.");

    }
    */
    static loadCredentials() {

        if (this.client) return;

        this.TEST_RAIL_ENGINE_URL = config.get("TestRailEngineURL");
        this.TEST_RAIL_USERNAME   = config.get("TestRailUsername");
        this.TEST_RAIL_PASSWORD   = config.get("TestRailPassword");
        this.TEST_PLAN_ID         = config.get("TestPlanID");
        this.disableSSLVerification();
        this.client = new APIClient(this.TEST_RAIL_ENGINE_URL);
        this.client.setUser(this.TEST_RAIL_USERNAME);
        this.client.setPassword(this.TEST_RAIL_PASSWORD);

        logger.info("TestRail credentials loaded.");
    }

    //==============================
    // Disable SSL
    //==============================

    static disableSSLVerification() {

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        https.globalAgent.options.rejectUnauthorized = false;

    }

    //==============================
    // Initialize Plan
    //==============================
    static async initializeTestCasesFromPlan() {

        try {

            this.loadCredentials();

            logger.info("initializeTestCasesFromPlan is called");

            const testPlanId = this.TEST_PLAN_ID;

            const plan = await this.client.sendGet(
                `api/v2/get_plan/${testPlanId}`
            );

            logger.info(`Plan JSON : ${JSON.stringify(plan, null, 2)}`);

            if (!plan) {
                throw new Error(
                    `TestRail plan response is null for plan ID: ${testPlanId}`
                );
            }

            //=========================================
            // Build Name
            //=========================================

            const build = plan.name
                ? String(plan.name)
                : "UNKNOWN_BUILD";

            logger.info(`Build Name : ${build}`);

            //=========================================
            // Project
            //=========================================

            const projectId = plan.project_id;

            if (!projectId) {
                throw new Error(
                    `project_id is missing in TestRail plan : ${testPlanId}`
                );
            }

            const project = await this.client.sendGet(
                `api/v2/get_project/${projectId}`
            );

            logger.info(
                `Project : ${JSON.stringify(project)}`
            );

            const projectName =
                project && project.name
                    ? String(project.name)
                    : "UNKNOWN_PROJECT";

            logger.info(`Project Name : ${projectName}`);

            //=========================================
            // Entries
            //=========================================

            const entries = plan.entries;

            if (!entries) {

                logger.warn(
                    `No entries found in TestRail Plan : ${testPlanId}`
                );

                return;

            }

            //=========================================
            // Runs
            //=========================================

            for (const entry of entries) {

                const runs = entry.runs;

                if (!runs) {

                    logger.warn("No runs found in entry");

                    continue;

                }

                for (const run of runs) {

                    if (!run.id) {

                        logger.warn(
                            "Run ID missing. Skipping..."
                        );

                        continue;

                    }

                    const runId = String(run.id);

                    const browser =
                        run.config
                            ? String(run.config)
                            : "chrome";

                    const testResponse =
                        await this.client.sendGet(
                            `api/v2/get_tests/${runId}`
                        );

                    if (
                        !testResponse ||
                        !Array.isArray(testResponse.tests)
                    ) {

                        logger.warn(
                            `Unexpected response for Run ID : ${runId}`
                        );

                        continue;

                    }

                    const tests = testResponse.tests;

                    if (tests.length === 0) {

                        logger.warn(
                            `No tests found for Run ID : ${runId}`
                        );

                        continue;

                    }

                    //=====================================
                    // Store every Case
                    //=====================================

                    for (const test of tests) {

                        if (!test.case_id) {

                            logger.warn(
                                "Test without Case ID found. Skipping..."
                            );

                            continue;

                        }

                        const caseId = String(test.case_id);

                        const title =
                            test.title
                                ? String(test.title)
                                : "NO_TITLE";

                        this.testCaseMap.set(caseId, {

                            runId,

                            title,

                            browser,

                            planId: testPlanId,

                            projectName,

                            build

                        });

                    }

                }

            }

            logger.info(
                `Test Case Map Loaded with ${this.testCaseMap.size} cases.`
            );

        } catch (error) {

            logger.error(
                "Error initializing TestRail Plan"
            );

            logger.error(error.stack || error);

        }

    }
    /*
    static async initializeTestCasesFromPlan() {

        try {

            this.loadCredentials();

            logger.info(
                "Initializing TestRail Plan..."
            );

            const plan =
                await this.client.sendGet(
                    `api/v2/get_plan/${this.TEST_PLAN_ID}`
                );

            if (!plan)
                throw new Error(
                    "Plan not found."
                );

            const build =
                plan.name || "UNKNOWN_BUILD";

            const project =
                await this.client.sendGet(
                    `api/v2/get_project/${plan.project_id}`
                );

            const projectName =
                project.name || "UNKNOWN_PROJECT";

            if (!plan.entries)
                return;

            for (const entry of plan.entries) {

                if (!entry.runs)
                    continue;

                for (const run of entry.runs) {

                    const runId = run.id;

                    const browser =
                        run.config || "chromium";

                    const response =
                        await this.client.sendGet(
                            `api/v2/get_tests/${runId}`
                        );

                    const tests =
                        response.tests || [];

                    for (const test of tests) {

                        this.testCaseMap.set(
                            String(test.case_id),
                            {
                                runId: String(runId),
                                title: test.title,
                                browser,
                                projectName,
                                build,
                                planId:
                                    this.TEST_PLAN_ID
                            }
                        );

                    }

                }

            }

            logger.info(
                `Loaded ${this.testCaseMap.size} TestRail test cases.`
            );

        }
        catch (e) {

            logger.error(
                "Error loading TestRail Plan"
            );

            logger.error(e);

        }

    }
    */

    //==============================
    // Get All Cases
    //==============================

    static getTestCasesFromPlan() {

        return this.testCaseMap;

    }

    //==============================
    // Get Browser/Build/Project
    //==============================

    static getProjectAndBuildForCase(caseId) {

        return this.testCaseMap.get(
            String(caseId)
        );

    }

    //==============================
    // Post Result
    //==============================

    static async postResultToTestRail(
        caseId,
        status,
        comment
    ) {

        try {

            this.loadCredentials();

            const test =
                this.testCaseMap.get(
                    String(caseId)
                );

            if (!test) {

                logger.warn(
                    `Unknown Case ID ${caseId}`
                );

                return;

            }

            await this.client.sendPost(

                `api/v2/add_result_for_case/${test.runId}/${caseId}`,

                {

                    status_id: status,

                    comment

                }

            );

            logger.info(
                `Updated TestRail Case ${caseId}`
            );

        }
        catch (e) {

            logger.error(
                "Unable to update TestRail"
            );

            logger.error(e);

        }

    }

    //==============================
    // Wrapper APIs
    //==============================

    static async getProject(projectId) {

        this.loadCredentials();

        return await this.client.sendGet(
            `api/v2/get_project/${projectId}`
        );

    }

    static async getSuite(suiteId) {

        this.loadCredentials();

        return await this.client.sendGet(
            `api/v2/get_suite/${suiteId}`
        );

    }

    static async getRun(runId) {

        this.loadCredentials();

        return await this.client.sendGet(
            `api/v2/get_run/${runId}`
        );

    }

    static async getTests(runId) {

        this.loadCredentials();

        return await this.client.sendGet(
            `api/v2/get_tests/${runId}`
        );

    }

    static async createRun(projectId, data) {

        this.loadCredentials();

        return await this.client.sendPost(
            `api/v2/add_run/${projectId}`,
            data
        );

    }

    static async closeRun(runId) {

        this.loadCredentials();

        return await this.client.sendPost(
            `api/v2/close_run/${runId}`
        );

    }

    static async deleteRun(runId) {

        this.loadCredentials();

        return await this.client.sendPost(
            `api/v2/delete_run/${runId}`
        );

    }

}
module.exports = TestRailManager;