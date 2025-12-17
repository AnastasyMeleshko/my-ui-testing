import { test, expect } from '@playwright/test';
import { AdBlocker } from '../src/utils';
import { TextBoxPage } from '../src/pageObjects';
import Fakerator from 'fakerator';

// Initialize Fakerator with Lithuanian locale
const fakerator = Fakerator('lt-LT');

test.describe('Text Box Page Suite', () => {
  let textBoxPage;

  test.beforeEach(async ({ page }) => {
    await test.step('Block ads on the page', async () => {
      await AdBlocker.blockAds(page);
    });

    await test.step('Initialize TextBox page object', async () => {
      textBoxPage = new TextBoxPage(page);
    });

    await test.step('Navigate to Text Box page', async () => {
      await textBoxPage.navigateTo('https://demoqa.com/text-box');
    });

    await test.step('Wait for required form fields to be visible', async () => {
      await page.locator('#userName').waitFor({ state: 'visible' });
      await page.locator('#userEmail').waitFor({ state: 'visible' });
    });
  });

  test('Verify all form fields are visible', async () => {
    await test.step('Verify visibility of all input fields and submit button', async () => {
      expect(await textBoxPage.isElementVisible(textBoxPage.nameField)).toBe(true);
      expect(await textBoxPage.isElementVisible(textBoxPage.mailField)).toBe(true);
      expect(await textBoxPage.isElementVisible(textBoxPage.addrCurrent)).toBe(true);
      expect(await textBoxPage.isElementVisible(textBoxPage.addrPermanent)).toBe(true);
      expect(await textBoxPage.isElementVisible(textBoxPage.btnSubmit)).toBe(true);
    });
  });

  test('Fill form with random data and validate output', async () => {
    const fullName = fakerator.names.name();
    const email = fakerator.internet.email();
    const currentAddress = fakerator.address.street();
    const permanentAddress = fakerator.address.street();

    await test.step('Fill all form fields with random data', async () => {
      await textBoxPage.completeForm(fullName, email, currentAddress, permanentAddress);
    });

    await test.step('Wait for result box to be displayed', async () => {
      await textBoxPage.waitForElementVisible(textBoxPage.resultBox);
      expect(await textBoxPage.isResultVisible()).toBe(true);
    });

    await test.step('Validate submitted data in output section', async () => {
      expect(await textBoxPage.readResultName()).toContain(fullName);
      expect(await textBoxPage.readResultMail()).toContain(email);
      expect(await textBoxPage.readResultCurrentAddr()).toContain(currentAddress);
      expect(await textBoxPage.readResultPermanentAddr()).toContain(permanentAddress);
    });
  });

  test('Fill only required fields and submit', async () => {
    const fullName = fakerator.names.name();
    const email = fakerator.internet.email();

    await test.step('Fill only required fields (name and email)', async () => {
      await textBoxPage.typeName(fullName);
      await textBoxPage.typeMail(email);
    });

    await test.step('Submit the form', async () => {
      await textBoxPage.pressSubmit();
      await textBoxPage.waitForElementVisible(textBoxPage.resultBox);
    });

    await test.step('Verify output contains only required fields', async () => {
      expect(await textBoxPage.readResultName()).toContain(fullName);
      expect(await textBoxPage.readResultMail()).toContain(email);
    });
  });

  test('Submit button should be clickable', async () => {
    const fullName = fakerator.names.name();

    await test.step('Fill name field only', async () => {
      await textBoxPage.typeName(fullName);
    });

    await test.step('Click submit button', async () => {
      await textBoxPage.pressSubmit();
    });

    await test.step('Verify result box is displayed', async () => {
      expect(await textBoxPage.isResultVisible()).toBe(true);
    });
  });

  test('Form should handle special characters in address', async () => {
    const fullName = fakerator.names.name();
    const email = fakerator.internet.email();
    const specialAddress = '123 LONG St., SRWQG #456, NEW-YORK, State 123456789';

    await test.step('Fill form with special characters in address fields', async () => {
      await textBoxPage.completeForm(fullName, email, specialAddress, specialAddress);
    });

    await test.step('Verify special characters are preserved in output', async () => {
      await textBoxPage.waitForElementVisible(textBoxPage.resultBox);
      expect(await textBoxPage.readResultCurrentAddr()).toContain(specialAddress);
    });
  });

  test('Invalid email should show error state', async () => {
    await test.step('Enter invalid email and submit form', async () => {
      await textBoxPage.typeMail('s@');
      await textBoxPage.pressSubmit();
    });

    await test.step('Verify email field is highlighted as error', async () => {
      expect(await textBoxPage.hasMailError()).toBe(true);
      await expect(textBoxPage.mailFieldWithError).toBeVisible();
      await expect(textBoxPage.mailFieldWithError).toHaveCSS(
          'border-color',
          'rgb(255, 0, 0)'
      );
    });
  });

  test('Valid email should remove error state', async () => {
    await test.step('Submit invalid email first', async () => {
      await textBoxPage.typeMail('s@');
      await textBoxPage.pressSubmit();
      expect(await textBoxPage.hasMailError()).toBe(true);
    });

    await test.step('Replace invalid email with valid one', async () => {
      await textBoxPage.mailField.fill('');
      await textBoxPage.typeMail('s@gmail.com');
      await textBoxPage.pressSubmit();
    });

    await test.step('Verify error state is removed and output is correct', async () => {
      expect(await textBoxPage.hasMailError()).toBe(false);
      await textBoxPage.waitForElementVisible(textBoxPage.resultBox);
      expect(await textBoxPage.readResultMail()).toContain('s@gmail.com');
    });
  });

  test('Empty form submission should not show output', async () => {
    await test.step('Submit empty form', async () => {
      await textBoxPage.pressSubmit();
    });

    await test.step('Verify no result output is displayed', async () => {
      expect(await textBoxPage.isResultVisible()).toBe(false);
    });
  });

  test('Submit form with only full name filled', async () => {
    const fullName = fakerator.names.name();

    await test.step('Fill only full name field', async () => {
      await textBoxPage.typeName(fullName);
      await textBoxPage.pressSubmit();
    });

    await test.step('Verify only name appears in result output', async () => {
      await textBoxPage.waitForElementVisible(textBoxPage.resultBox);
      expect(await textBoxPage.readResultName()).toContain(fullName);
      expect(await textBoxPage.isElementVisible(textBoxPage.resultMail)).toBe(false);
      expect(await textBoxPage.isElementVisible(textBoxPage.resultAddrCurrent)).toBe(false);
      expect(await textBoxPage.isElementVisible(textBoxPage.resultAddrPermanent)).toBe(false);
    });
  });
});
