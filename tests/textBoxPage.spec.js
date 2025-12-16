import { test, expect } from '@playwright/test';
import { AdBlocker } from '../src/utils';
import { TextBoxPage } from '../src/pageObjects';
import Fakerator from 'fakerator';

const fakerator = Fakerator('lt-LT');

test.describe('Text Box Page Suite', () => {
  let textBoxPage;

  test.beforeEach(async ({ page }) => {
    await AdBlocker.blockAds(page);
    textBoxPage = new TextBoxPage(page);
    await textBoxPage.navigateTo('https://demoqa.com/text-box');

    // гарантируем, что поля доступны
    await page.locator('#userName').waitFor({ state: 'visible' });
    await page.locator('#userEmail').waitFor({ state: 'visible' });
  });

  test('Verify all form fields are visible', async () => {
    expect(await textBoxPage.isElementVisible(textBoxPage.nameField)).toBe(true);
    expect(await textBoxPage.isElementVisible(textBoxPage.mailField)).toBe(true);
    expect(await textBoxPage.isElementVisible(textBoxPage.addrCurrent)).toBe(true);
    expect(await textBoxPage.isElementVisible(textBoxPage.addrPermanent)).toBe(true);
    expect(await textBoxPage.isElementVisible(textBoxPage.btnSubmit)).toBe(true);
  });

  test('Fill form with random data and validate output', async () => {
    const fullName = fakerator.names.name();
    const email = fakerator.internet.email();
    const currentAddress = fakerator.address.street();
    const permanentAddress = fakerator.address.street();

    await textBoxPage.completeForm(fullName, email, currentAddress, permanentAddress);

    await textBoxPage.waitForElementVisible(textBoxPage.resultBox);
    expect(await textBoxPage.isResultVisible()).toBe(true);

    const outputName = await textBoxPage.readResultName();
    const outputEmail = await textBoxPage.readResultMail();
    const outputCurrentAddr = await textBoxPage.readResultCurrentAddr();
    const outputPermanentAddr = await textBoxPage.readResultPermanentAddr();

    expect(outputName).toContain(fullName);
    expect(outputEmail).toContain(email);
    expect(outputCurrentAddr).toContain(currentAddress);
    expect(outputPermanentAddr).toContain(permanentAddress);
  });

  test('Fill only required fields and submit', async () => {
    const fullName = fakerator.names.name();
    const email = fakerator.internet.email();

    await textBoxPage.typeName(fullName);
    await textBoxPage.typeMail(email);
    await textBoxPage.pressSubmit();

    await textBoxPage.waitForElementVisible(textBoxPage.resultBox);

    const outputName = await textBoxPage.readResultName();
    const outputEmail = await textBoxPage.readResultMail();

    expect(outputName).toContain(fullName);
    expect(outputEmail).toContain(email);
  });

  test('Submit button should be clickable', async () => {
    const fullName = fakerator.names.name();

    await textBoxPage.typeName(fullName);
    await textBoxPage.pressSubmit();

    expect(await textBoxPage.isResultVisible()).toBe(true);
  });

  test('Form should handle special characters in address', async () => {
    const fullName = fakerator.names.name();
    const email = fakerator.internet.email();
    const specialAddress = '123 LONG St., SRWQG #456, NEW-YORK, State 123456789';

    await textBoxPage.completeForm(fullName, email, specialAddress, specialAddress);

    await textBoxPage.waitForElementVisible(textBoxPage.resultBox);

    const outputCurrentAddr = await textBoxPage.readResultCurrentAddr();
    expect(outputCurrentAddr).toContain(specialAddress);
  });

  test('Invalid email should show error state', async () => {
    const invalidEmail = 's@';

    await textBoxPage.typeMail(invalidEmail);
    await textBoxPage.pressSubmit();

    const hasErrorClass = await textBoxPage.hasMailError();
    expect(hasErrorClass).toBe(true);

    await expect(textBoxPage.mailFieldWithError).toBeVisible();
    await expect(textBoxPage.mailFieldWithError).toHaveCSS('border-color', 'rgb(255, 0, 0)');
  });

  test('Incomplete email without domain should show error', async () => {
    const invalidEmails = ['s@', 'test@', 'user@', '@'];

    for (const invalidEmail of invalidEmails) {
      await textBoxPage.mailField.fill(''); // вместо clear()
      await textBoxPage.typeMail(invalidEmail);
      await textBoxPage.pressSubmit();

      const hasErrorClass = await textBoxPage.hasMailError();
      expect(hasErrorClass).toBe(true);
    }
  });

  test('Valid email should remove error state', async () => {
    const invalidEmail = 's@';
    const validEmail = 's@gmail.com';

    await textBoxPage.typeMail(invalidEmail);
    await textBoxPage.pressSubmit();

    let hasErrorClass = await textBoxPage.hasMailError();
    expect(hasErrorClass).toBe(true);

    await textBoxPage.mailField.fill(''); // очистка
    await textBoxPage.typeMail(validEmail);
    await textBoxPage.pressSubmit();

    hasErrorClass = await textBoxPage.hasMailError();
    expect(hasErrorClass).toBe(false);

    await textBoxPage.waitForElementVisible(textBoxPage.resultBox);
    const outputEmail = await textBoxPage.readResultMail();
    expect(outputEmail).toContain(validEmail);
  });

  test('Valid email formats should not show error', async () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.lt',
      'test12345@test-domain.com',
      's@mail.co'
    ];

    for (const validEmail of validEmails) {
      await textBoxPage.mailField.fill('');
      await textBoxPage.typeMail(validEmail);
      await textBoxPage.pressSubmit();

      const hasErrorClass = await textBoxPage.hasMailError();
      expect(hasErrorClass).toBe(false);
    }
  });

  test('Empty form submission should not show output', async () => {
    await textBoxPage.pressSubmit();

    const isOutputVisible = await textBoxPage.isResultVisible();
    expect(isOutputVisible).toBe(false);
  });

  test('Submit form with only full name filled', async () => {
    const fullName = fakerator.names.name();

    await textBoxPage.typeName(fullName);
    await textBoxPage.pressSubmit();

    await textBoxPage.waitForElementVisible(textBoxPage.resultBox);

    const outputName = await textBoxPage.readResultName();
    expect(outputName).toContain(fullName);

    expect(await textBoxPage.isElementVisible(textBoxPage.resultMail)).toBe(false);
    expect(await textBoxPage.isElementVisible(textBoxPage.resultAddrCurrent)).toBe(false);
    expect(await textBoxPage.isElementVisible(textBoxPage.resultAddrPermanent)).toBe(false);
  });
});
