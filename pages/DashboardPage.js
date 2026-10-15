const BasePage = require("./BasePage");
const config = require("../config/ConfigManager");
const DashboardPageLocator = require("../locators/DashboardPageLocator");

class DashboardPage extends BasePage {

    constructor(page) {
        super(page);
    }

   async capturePopupMessage(){
     await this.waitForVisible(DashboardPageLocator.popupCapture);
   }
    
   async capturePageTitle(){
     return await this.getTitle();
   }

}

module.exports = DashboardPage;