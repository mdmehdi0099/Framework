const CONSTANTS = require("./constants/FrameworkConstants");
module.exports = {
    default: {
        paths: [CONSTANTS.FEATURE_PATH],
        require: [
            CONSTANTS.STEP_DEFINITION_PATH,
            CONSTANTS.HOOK_PATH,
            CONSTANTS.SUPPORT_PATH
        ],
        format: [
            "progress-bar",
            `json:${CONSTANTS.JSON_REPORT}`,
            `html:${CONSTANTS.HTML_REPORT}`,
            "summary"
        ],
        publishQuiet: true,
        parallel: 1,
        retry: 0,
        timeout: 60000,
        formatOptions: {
            snippetInterface: "async-await"
        }
    }
};