export default class BasicPage {
  constructor(page) {
    this.page = page;
  }

  async navigateTo(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
  }

  async clickOnElementByLocator(locator) {
    await locator.waitFor({ state: 'visible' });
    const isEnabled = await locator.isEnabled();
    if (!isEnabled) {
      throw new Error('Element is not enabled for clicking');
    }
    await locator.click();
  }

  async hoverOnElement(element) {
    await this.waitForElementVisible(element);
    await element.hover();
  }

  async getElementText(locator) {
    return await locator.textContent();
  }

  async waitForElementVisible(locator) {
    await locator.waitFor({ state: 'visible' });
  }

  async isElementVisible(locator, timeout = 5000) {
    try {
      return await locator.isVisible({ timeout });
    } catch {
      return false;
    }
  }
}
