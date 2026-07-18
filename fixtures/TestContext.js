const SharedContext = require("./SharedContext");
class TestContext {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
        this.config = null;
        this.pageManager = null;
        this.sharedContext = new SharedContext();
    }
}
module.exports = TestContext;