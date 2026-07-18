const LoginPage = require("./LoginPage");

class PageObjectManager {
    constructor(page) {
        this.page = page;
        this.pages = new Map();
    }
    getPage(PageClass) {
        if (!this.pages.has(PageClass)) {
            this.pages.set(PageClass, new PageClass(this.page));
        }
        return this.pages.get(PageClass);
    }
    getLoginPage() {
        return this.getPage(LoginPage);
    }
    getDashboardPage() {
        return this.getPage(DashboardPage);
    }
    getHomePage() {
        return this.getPage(HomePage);
    }
}
module.exports = PageObjectManager;