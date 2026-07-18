const path = require("path");
const ROOT = process.cwd();
module.exports = {
    // Project Root
    ROOT,
    // ==========================
    // Cucumber Configuration
    // ==========================
    // Feature Files
    FEATURE_PATH: "features/**/*.feature",
    // Step Definitions
    STEP_DEFINITION_PATH: "features/stepdefinitions/**/*.js",
    // Hooks
    HOOK_PATH: "features/hooks/**/*.js",
    // Support Files
    SUPPORT_PATH: "features/support/**/*.js",
    // ==========================
    // Reports (Keep Relative)
    // ==========================
    JSON_REPORT: "reports/json/cucumber-report.json",
    HTML_REPORT: "reports/html/cucumber-report.html",
    // ==========================
    // Absolute File System Paths
    // ==========================
    SCREENSHOT_PATH: path.join(ROOT, "screenshots"),
    VIDEO_PATH: path.join(ROOT, "videos"),
    TRACE_PATH: path.join(ROOT, "traces"),
    DOWNLOAD_PATH: path.join(ROOT, "downloads"),
    LOG_PATH: path.join(ROOT, "logs")
};