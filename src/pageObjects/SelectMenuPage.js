import BasicPage from './BasicPage.js';

export default class SelectMenuPage extends BasicPage {
  constructor(page) {
    super(page);

    // value dropdown
    this.valueDropdown = page.locator('#withOptGroup');
    this.valueOptions = page.locator('div[id*="react-select-2-option"]');

    // single select dropdown
    this.singleDropdown = page.locator('#selectOne');
    this.singleOptions = page.locator('div[id*="react-select-3-option"]');

    // old style select
    this.oldSelect = page.locator('#oldSelectMenu');
    this.oldSelectedOption = this.oldSelect.locator('option:checked');

    // standard multi select
    this.multiSelect = page.locator('#cars');
    this.multiSelectOptions = this.multiSelect.locator('option');
    this.multiSelectChecked = this.multiSelect.locator('option:checked');

    // react multi select
    this.reactMultiContainer = page.locator('p:has(b:has-text("Multiselect drop down")) + div');
    this.reactMultiControl = this.reactMultiContainer.locator('.css-1hwfws3').first();
    this.reactMultiOptions = page.locator('div[id*="react-select-4-option"]');
    this.reactMultiTags = page.locator('.css-1rhbuit-multiValue');
    this.reactMultiTagLabels = page.locator('.css-1rhbuit-multiValue .css-12jo7m5');
    this.reactMultiRemoveBtns = page.locator('.css-xb97g8');
  }

  // find option in value dropdown
  findValueOption(text) {
    return this.valueOptions.filter({ hasText: text }).first();
  }

  // find option in single dropdown
  findSingleOption(text) {
    return this.singleOptions.filter({ hasText: text }).first();
  }

  // find option in react multi select
  findReactMultiOption(text) {
    return this.reactMultiOptions.filter({ hasText: text.trim() }).first();
  }

  // find tag in react multi select
  findReactMultiTag(text) {
    return this.reactMultiTagLabels.filter({ hasText: text.trim() });
  }

  // choose option in value dropdown
  async chooseValue(optionText) {
    await this.clickOnElementByLocator(this.valueDropdown);
    const option = this.findValueOption(optionText);
    await this.waitForElementVisible(option);
    await this.clickOnElementByLocator(option);
  }

  // choose option in single dropdown
  async chooseSingle(optionText) {
    await this.clickOnElementByLocator(this.singleDropdown);
    const option = this.findSingleOption(optionText);
    await this.waitForElementVisible(option);
    await this.clickOnElementByLocator(option);
  }

  // choose option in old style select
  async chooseOldStyle(labelText) {
    await this.waitForElementVisible(this.oldSelect);
    await this.oldSelect.selectOption({ label: labelText });
  }

  // choose multiple options in standard multi select
  async chooseMultiOptions(optionTexts) {
    const values = [];
    const options = await this.multiSelectOptions.all();

    for (const opt of options) {
      const text = await opt.textContent();
      const value = await opt.getAttribute('value');
      if (optionTexts.includes(text)) {
        values.push(value);
      }
    }

    await this.multiSelect.selectOption(values);
  }

  // choose multiple options in react multi select
  async chooseReactMultiOptions(optionTexts) {
    await this.clickOnElementByLocator(this.reactMultiControl);
    await this.waitForElementVisible(this.reactMultiOptions.first());

    for (const text of optionTexts) {
      const option = this.findReactMultiOption(text);
      await this.waitForElementVisible(option);
      await this.clickOnElementByLocator(option);

      const tag = this.findReactMultiTag(text);
      await this.waitForElementVisible(tag);
    }
  }

  // get selected value text
  async readSelectedValue(dropdown) {
    return await this.getElementText(dropdown);
  }

  // get selected text from old style select
  async readOldStyleSelected() {
    return await this.oldSelectedOption.textContent();
  }
}
