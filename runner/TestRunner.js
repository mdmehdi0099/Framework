const { execSync } = require("child_process");
const config = require("../config/ConfigManager");
const logger = require("../utils/Logger");
class TestRunner {
    static run() {
        // Parse command line arguments
        const args = process.argv.slice(2);
        const getArgument = (name, defaultValue = "") => {
            const arg = args.find(a => a.startsWith(`--${name}=`));
            return arg ? arg.split("=")[1] : defaultValue;
        };
        const env = getArgument("env", process.env.TEST_ENV || "qa");
        const browser = getArgument("browser", config.getBrowser());
        const parallel = getArgument("parallel", process.env.PARALLEL || "1");
        const tag = getArgument("tags");
        const feature = getArgument("feature");
        let command = "npx cucumber-js";
        // Execute feature file
        if (feature) {
            command += ` ${feature}`;
        }
        // Execute by tag
        if (tag) {
            command += ` --tags "${tag}"`;
        }
        // Parallel execution
        command += ` --parallel ${parallel}`;
        logger.info("======================================");
        logger.info(" Playwright Enterprise Test Runner");
        logger.info("======================================");
        logger.info(`Environment : ${env}`);
        logger.info(`Browser    : ${browser}`);
        logger.info(`Parallel   : ${parallel}`);
        if (feature)
            logger.info(`Feature    : ${feature}`);
        if (tag)
            logger.info(`Tag        : ${tag}`);
        logger.info("--------------------------------------");
        logger.info(`Command : ${command}`);
        logger.info("======================================");
        try {
            logger.info("===============In Test runner before ExecSync=======================");
            execSync(command, {
                stdio: "inherit",
                env: {
                    ...process.env,
                    TEST_ENV: env,
                    BROWSER: browser
                }
            });
        }
        catch (error) {
            logger.error("Execution Failed");
            logger.error(error.message);
            process.exit(1);
        }
    }
}
TestRunner.run();
//node runner/TestRunner.js --env=qa --browser=chromium --parallel=4 --tags=@Login