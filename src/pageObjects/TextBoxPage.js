import BasicPage from './BasicPage.js';

export default class TextBoxPage extends BasicPage {
  constructor(page) {
    super(page);

    // form inputs
    this.nameField = page.locator('#userName');
    this.mailField = page.locator('#userEmail');
    this.addrCurrent = page.locator('#currentAddress');
    this.addrPermanent = page.locator('#permanentAddress');

    // error state
    this.mailFieldWithError = page.locator('#userEmail.field-error');

    // submit button
    this.btnSubmit = page.locator('#submit');

    // output section
    this.resultBox = page.locator('#output');
    this.resultName = page.locator('#output #name');
    this.resultMail = page.locator('#output #email');
    this.resultAddrCurrent = page.locator('#output #currentAddress');
    this.resultAddrPermanent = page.locator('#output #permanentAddress');
  }

  // type full name
  async typeName(name) {
    await this.waitForElementVisible(this.nameField);
    await this.nameField.fill(name);
  }

  // type email
  async typeMail(email) {
    await this.waitForElementVisible(this.mailField);
    await this.mailField.fill(email);
  }

  // type current address
  async typeCurrentAddr(address) {
    await this.waitForElementVisible(this.addrCurrent);
    await this.addrCurrent.fill(address);
  }

  // type permanent address
  async typePermanentAddr(address) {
    await this.waitForElementVisible(this.addrPermanent);
    await this.addrPermanent.fill(address);
  }

  // submit form
  async pressSubmit() {
    await this.clickOnElementByLocator(this.btnSubmit);
  }

  // fill all fields and submit
  async completeForm(fullName, email, currentAddress, permanentAddress) {
    await this.typeName(fullName);
    await this.typeMail(email);
    await this.typeCurrentAddr(currentAddress);
    await this.typePermanentAddr(permanentAddress);
    await this.pressSubmit();
  }

  // get output values
  async readResultName() {
    return await this.getElementText(this.resultName);
  }

  async readResultMail() {
    return await this.getElementText(this.resultMail);
  }

  async readResultCurrentAddr() {
    return await this.getElementText(this.resultAddrCurrent);
  }

  async readResultPermanentAddr() {
    return await this.getElementText(this.resultAddrPermanent);
  }

  // check if output section is visible
  async isResultVisible() {
    return await this.isElementVisible(this.resultBox);
  }

  // check if email has error class
  async hasMailError() {
    return await this.mailField.evaluate(el => el.classList.contains('field-error'));
  }
}
