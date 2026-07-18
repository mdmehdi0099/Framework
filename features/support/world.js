const { setWorldConstructor } = require("@cucumber/cucumber");
const TestContext = require("../../fixtures/TestContext");
class CustomWorld {
    constructor() {
        this.testContext = new TestContext();
    }
}
setWorldConstructor(CustomWorld);