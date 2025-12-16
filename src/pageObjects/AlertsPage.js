import BasicPage from './BasicPage.js';

export default class AlertsPage extends BasicPage {
  constructor(page) {
    super(page);

    // buttons
    this.alertBtn = page.locator('#alertButton');
    this.timerAlertBtn = page.locator('#timerAlertButton');
    this.confirmBtn = page.locator('#confirmButton');
    this.promptBtn = page.locator('#promtButton');

    // result fields
    this.promptResultField = page.locator('#promptResult');
    this.confirmResultField = page.locator('#confirmResult');
  }

  // trigger simple alert
  async triggerAlert() {
    await this.clickOnElementByLocator(this.alertBtn);
  }

  // trigger timer alert
  async triggerTimerAlert() {
    await this.clickOnElementByLocator(this.timerAlertBtn);
  }

  // trigger confirm alert
  async triggerConfirmAlert() {
    await this.clickOnElementByLocator(this.confirmBtn);
  }

  // trigger prompt alert
  async triggerPromptAlert() {
    await this.clickOnElementByLocator(this.promptBtn);
  }

  // get text from prompt result
  async readPromptResult() {
    await this.waitForElementVisible(this.promptResultField);
    return await this.getElementText(this.promptResultField);
  }

  // get text from confirm result
  async readConfirmResult() {
    await this.waitForElementVisible(this.confirmResultField);
    return await this.getElementText(this.confirmResultField);
  }
}
