import BasicPage from './BasicPage.js';

export default class FormPage extends BasicPage {
  constructor(page) {
    super(page);

    // inputs
    this.inputFirstName = page.locator('#firstName');
    this.inputLastName = page.locator('#lastName');
    this.inputEmail = page.locator('#userEmail');
    this.inputPhone = page.locator('#userNumber');
    this.inputSubjects = page.locator('#subjectsInput');
    this.textAreaAddress = page.locator('#currentAddress');
    this.fileUpload = page.locator('#uploadPicture');

    // gender options
    this.genderMale = page.locator('label[for="gender-radio-1"]');
    this.genderFemale = page.locator('label[for="gender-radio-2"]');
    this.genderOther = page.locator('label[for="gender-radio-3"]');

    // hobbies
    this.hobbySports = page.locator('label[for="hobbies-checkbox-1"]');
    this.hobbyReading = page.locator('label[for="hobbies-checkbox-2"]');
    this.hobbyMusic = page.locator('label[for="hobbies-checkbox-3"]');

    // dropdowns
    this.dropdownState = page.locator('#state');
    this.dropdownCity = page.locator('#city');

    // submit + modal
    this.btnSubmit = page.locator('button:has-text("Submit")');
    this.modalBox = page.locator('.modal-content');
    this.modalHeader = page.locator('#example-modal-sizes-title-lg');
  }

  // helper to get state option dynamically
  optionState(stateName) {
    return this.page.locator(`div[id^="react-select-3-option"]:has-text("${stateName}")`);
  }

  // helper to get city option dynamically
  optionCity(cityName) {
    return this.page.locator(`div[id^="react-select-4-option"]:has-text("${cityName}")`);
  }

  // fill first name field
  async typeFirstName(name) {
    await this.waitForElementVisible(this.inputFirstName);
    await this.inputFirstName.fill(name);
  }

  // fill last name field
  async typeLastName(name) {
    await this.waitForElementVisible(this.inputLastName);
    await this.inputLastName.fill(name);
  }

  // fill email field
  async typeEmail(email) {
    await this.inputEmail.fill(email);
  }

  // choose gender by label
  async chooseGender(gender) {
    const genders = {
      Male: this.genderMale,
      Female: this.genderFemale,
      Other: this.genderOther,
    };
    await this.clickOnElementByLocator(genders[gender]);
  }

  // fill phone number
  async typePhone(phone) {
    await this.inputPhone.fill(phone);
  }

  // add subjects one by one
  async addSubjects(subjectList) {
    for (const subject of subjectList) {
      try {
        await this.inputSubjects.click();
        await this.inputSubjects.type(subject, { delay: 50 });
        await this.page.waitForTimeout(300);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(200);
      } catch (err) {
        console.log(`Could not add subject: ${subject}`, err.message);
      }
    }
  }

  // select hobbies
  async chooseHobbies(hobbyList) {
    const hobbies = {
      Sports: this.hobbySports,
      Reading: this.hobbyReading,
      Music: this.hobbyMusic,
    };
    for (const hobby of hobbyList) {
      await this.clickOnElementByLocator(hobbies[hobby]);
    }
  }

  // upload picture file
  async uploadFile(path) {
    await this.fileUpload.setInputFiles(path);
  }

  // fill address textarea
  async typeAddress(address) {
    await this.textAreaAddress.scrollIntoViewIfNeeded();
    await this.textAreaAddress.fill(address);
  }

  // select state
  async pickState(stateName) {
    await this.dropdownState.click();
    await this.optionState(stateName).click();
  }

  // select city
  async pickCity(cityName) {
    await this.dropdownCity.click();
    await this.optionCity(cityName).click();
  }

  // select both state and city
  async pickStateAndCity(stateName, cityName) {
    await this.pickState(stateName);
    await this.dropdownCity.click();
    const cityOption = this.optionCity(cityName);
    await cityOption.waitFor({ state: 'visible' });
    await cityOption.click();
  }

  // click submit button
  async submitForm() {
    await this.page.keyboard.press('Escape'); // close any open dropdowns
    await this.page.waitForTimeout(200);
    await this.btnSubmit.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);
    await this.clickOnElementByLocator(this.btnSubmit);
  }

  // check if modal is visible
  async isModalShown() {
    return await this.isElementVisible(this.modalBox);
  }

  // get modal header text
  async getModalHeaderText() {
    return await this.getElementText(this.modalHeader);
  }

  // get value from result table by label
  async getResult(label) {
    const row = this.page.locator(`tr:has(td:text-is("${label}"))`);
    const valueCell = row.locator('td').nth(1);
    return await valueCell.textContent();
  }

  // fill only mandatory fields
  async fillRequired(data) {
    await this.typeFirstName(data.firstName);
    await this.typeLastName(data.lastName);
    await this.chooseGender(data.gender);
    await this.typePhone(data.mobile);
  }

  // fill the whole form with optional fields
  async fillAll(data) {
    await this.fillRequired(data);

    if (data.email) await this.typeEmail(data.email);
    if (data.subjects) await this.addSubjects(data.subjects);
    if (data.hobbies) await this.chooseHobbies(data.hobbies);
    if (data.picture) await this.uploadFile(data.picture);
    if (data.address) await this.typeAddress(data.address);

    if (data.state && data.city) {
      await this.pickStateAndCity(data.state, data.city);
    } else if (data.state) {
      await this.pickState(data.state);
    }
  }
}
