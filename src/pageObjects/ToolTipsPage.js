import BasicPage from './BasicPage.js';

export default class ToolTipsPage extends BasicPage {
  constructor(page) {
    super(page);

    // elements to hover over
    this.btnHover = page.locator('#toolTipButton');
    this.inputHover = page.locator('#toolTipTextField');
    this.linkContrary = page.locator('a:has-text("Contrary")').first();
    this.linkSection = page.locator('xpath=//a[contains(text(), "1.10.32")]');

    // tooltip locators
    this.tipButton = page.locator('#buttonToolTip');
    this.tipInput = page.locator('#textFieldToolTip');
    this.tipContrary = page.locator('#contraryTexToolTip');
    this.tipSection = page.locator('#sectionToolTip');
  }

  // hover actions
  async moveToButton() {
    await this.hoverOnElement(this.btnHover);
  }

  async moveToInputField() {
    await this.hoverOnElement(this.inputHover);
  }

  async moveToContraryLink() {
    await this.hoverOnElement(this.linkContrary);
  }

  async moveToSectionLink() {
    await this.hoverOnElement(this.linkSection);
  }

  // read tooltip text
  async readTooltipText(locator) {
    await this.waitForElementVisible(locator);
    return await this.getElementText(locator);
  }

  // check tooltip visibility
  async checkTooltipVisible(locator) {
    await this.waitForElementVisible(locator);
    return await this.isElementVisible(locator);
  }
}
