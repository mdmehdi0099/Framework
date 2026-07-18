const fs = require("fs");
const path = require("path");

class ConfigManager {

    constructor() {

        this.environment = process.env.TEST_ENV || "qa";

        const propertyFile = path.join(
            __dirname,
            `${this.environment}.properties`
        );

        const content = fs.readFileSync(propertyFile, "utf8");

        this.properties = {};

        content.split(/\r?\n/).forEach(line => {

            line = line.trim();

            if (!line || line.startsWith("#")) {
                return;
            }

            const index = line.indexOf("=");

            if (index === -1) {
                return;
            }

            const key = line.substring(0, index).trim();
            const value = line.substring(index + 1).trim();

            this.properties[key] = value;
        });

        console.log("Loaded Properties:");
        console.log(this.properties);
    }

    get(key) {
        return this.properties[key];
    }

    getBrowser() {
        return this.get("browser");
    }

    getBaseUrl() {
        return this.get("baseUrl");
    }

    getUsername() {
        return this.get("username");
    }

    getPassword() {
        return this.get("password");
    }

    getTimeout() {
        return Number(this.get("timeout"));
    }

    isHeadless() {
        return this.get("headless") === "true";
    }

    getSlowMo() {
        return Number(this.get("slowMo"));
    }

    isVideoEnabled() {
        return this.get("recordVideo") === "true";
    }

    isTraceEnabled() {
        return this.get("trace") === "true";
    }

    takeScreenshotOnFail() {
        return this.get("screenshotOnFail") === "true";
    }

    takeScreenshotOnPass() {
        return this.get("screenshotOnPass") === "true";
    }
}

module.exports = new ConfigManager();