const PageObjectManager = require("../pages/PageObjectManager");
class PageFixture {
    constructor(page) {
        this.pageManager = new PageObjectManager(page);
    }
    getPages() {
        return this.pageManager;
    }
}
module.exports = PageFixture;